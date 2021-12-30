import { query as q } from 'faunadb'

import NextAuth from 'next-auth'
import { session } from 'next-auth/client';
import Providers from 'next-auth/providers'

import { fauna } from '../../../services/fauna';

export default NextAuth({
    // Configure one or more authentication providers
    providers: [
        Providers.GitHub({
            clientId: process.env.GITHUB_CLIENT_ID,
            clientSecret: process.env.GITHUB_CLIENT_SECRET,
            scope: 'read:user'
        }),
    ],
    callbacks: {
        async session(session) {

            try {
                const userActiveSubscription = await fauna.query(
                    q.Get(
                        q.Intersection([
                            q.Match(
                                q.Index('subscription_by_user_ref'),
                                q.Select(
                                    "ref",
                                    q.Get(
                                        q.Match(
                                            q.Index('user_by_email'),
                                            q.Casefold(session.user.email)
                                        )
                                    )
                                )
                            ),
                            q.Match(
                                q.Index('subscription_by_status'),
                                "active"
                            )
                        ])
                    )
                )
                return {
                    ...session,
                    activeSubscription: userActiveSubscription
                }
            } catch {
                return {
                    ...session,
                    activeSubscription: null
                }
            }
        },
        async signIn(user, account, profile) {
            const { email } = user

            try {
                await fauna.query(//vamos entrar no fauna
                    q.If(//se
                        q.Not(//não
                            q.Exists(//existir
                                q.Match(//um match(combinação) entre)
                                    q.Index('user_by_email'),//o index user_by_email (criado la no faunadb)
                                    q.Casefold(user.email)//e o email que o usuario está tentando logar
                                )
                            )
                        ),
                        q.Create(//se não existir um match entre aqueles dois, ele vai criar um novo usuario 
                            q.Collection('user'),
                            { data: { email } }
                        ),
                        q.Get(// caso exista ele so vai dar Get (pegar) as informações desse mesmo match
                            q.Match(
                                q.Index('user_by_email'),
                                q.Casefold(user.email)
                            )
                        )
                    )
                )
                return true
            } catch {
                return false
            }

        },
    }
})