import { NextApiRequest, NextApiResponse } from 'next'
import { stripe } from '../../services/stripe'
import { getSession } from 'next-auth/client'

export default async (req: NextApiRequest, res: NextApiResponse) => {
    //Aqui verificamos se o metodo da requisição é POST, pois a requisição de criação eve ser unica e exclusivamente essa
    if (req.method === 'POST') {
        //Alem de criar uma nova seção tambem vamos cirar um novo cliente la no dashboard do stripe, epra isso precisamos das informações do usuario
        const session = await getSession({ req })
        const stripeCostumer = await stripe.customers.create({
            email: session.user.email,
            //metadata
        })

        //E aqui executamos o metodo de criação do proprio stripe
        const stripeCheckoutSession = stripe.checkout.sessions.create({
            customer: stripeCostumer.id,
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