import { NextApiRequest, NextApiResponse } from 'next'
import { query as q } from 'faunadb'
import { stripe } from '../../services/stripe'
import { fauna } from '../../services/fauna'
import { getSession } from 'next-auth/client'

type User = {
    ref: {
        id: string,
    }
    data: {
        stripe_customer_id: string,
    }
}

export default async (req: NextApiRequest, res: NextApiResponse) => {

    //Aqui verificamos se o metodo da requisição é POST, pois a requisição de criação eve ser unica e exclusivamente essa
    if (req.method === 'POST') {

        //Alem de criar uma nova seção tambem vamos cirar um novo cliente la no dashboard do stripe, epra isso precisamos das informações do usuario
        const session = await getSession({ req })

        //Pegando o usuario lá no fauna que bate com o email logado na sessão
        const user = await fauna.query<User>(
            q.Get(
                q.Match(
                    q.Index('user_by_email'),
                    q.Casefold(session.user.email)
                )
            )
        )

        let customerID = user.data.stripe_customer_id;

        if (!customerID) {
            //Criando um novo customer la no Stripe
            const stripeCostumer = await stripe.customers.create({
                email: session.user.email,
                //metadata
            })

            //Atualizando o Usuario no stripe conforme o usuario que a gnt pegou no fauna
            await fauna.query(
                q.Update(
                    q.Ref(q.Collection('user'), user.ref.id),
                    {
                        data: {
                            stripe_customer_id: stripeCostumer.id,
                        }
                    }
                )
            )
            customerID = stripeCostumer.id
        }

        //E aqui executamos o metodo de criação do proprio stripe
        const stripeCheckoutSession = stripe.checkout.sessions.create({
            customer: customerID,
            payment_method_types: ['card'],
            billing_address_collection: 'required',
            line_items: [
                { price: 'price_1JFpDED9mEzQ2tppldqJdvNp', quantity: 1 }
            ],
            mode: 'subscription',
            allow_promotion_codes: true,
            success_url: process.env.STRIPE_SUCCESS_URL,
            cancel_url: process.env.STRIPE_CANCEL_URL
        })

        return res.status(200).json({ sessionId: (await stripeCheckoutSession).id })
    }
    //Caso não seja POST devolveremos essa resposta ao front, com erro 405 e informando que a rota permitida deve ser POST
    else {
        res.setHeader('Allow', 'POST')
        res.status(405).end('Method not allowed')
    }
}