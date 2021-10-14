import { GetStaticProps } from 'next'
import Prismic from '@prismicio/client'
import Head from 'next/head'
import { getPrismicClient } from '../../services/prismic'
import styles from './styles.module.scss'

export default function Posts() {
    return (
        <>
            <Head>
                <title>Posts | Ig.News</title>
            </Head>
            <main className={styles.container}>
                <div className={styles.posts}>
                    <a href="#">
                        <time>13 de agosto 2021</time>
                        <h2>lorem ipsum dolor sit amet</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, quaerat laborum nisi maiores deserunt numquam temporibus? Maxime libero ipsam, ea possimus fuga deserunt. Fugit excepturi dolores, eaque est nam inventore?</p>
                    </a>
                    <a href="#">
                        <time>13 de agosto 2021</time>
                        <h2>lorem ipsum dolor sit amet</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, quaerat laborum nisi maiores deserunt numquam temporibus? Maxime libero ipsam, ea possimus fuga deserunt. Fugit excepturi dolores, eaque est nam inventore?</p>
                    </a>
                    <a href="#">
                        <time>13 de agosto 2021</time>
                        <h2>lorem ipsum dolor sit amet</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, quaerat laborum nisi maiores deserunt numquam temporibus? Maxime libero ipsam, ea possimus fuga deserunt. Fugit excepturi dolores, eaque est nam inventore?</p>
                    </a>
                    <a href="#">
                        <time>13 de agosto 2021</time>
                        <h2>lorem ipsum dolor sit amet</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, quaerat laborum nisi maiores deserunt numquam temporibus? Maxime libero ipsam, ea possimus fuga deserunt. Fugit excepturi dolores, eaque est nam inventore?</p>
                    </a>
                    <a href="#">
                        <time>13 de agosto 2021</time>
                        <h2>lorem ipsum dolor sit amet</h2>
                        <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Non, quaerat laborum nisi maiores deserunt numquam temporibus? Maxime libero ipsam, ea possimus fuga deserunt. Fugit excepturi dolores, eaque est nam inventore?</p>
                    </a>
                </div>
            </main>
        </>
    )
}
export const getStaticProps: GetStaticProps = async () => {

    const prismic = getPrismicClient()

    const response = await prismic.query([
        Prismic.predicates.at('document.type', 'post')
    ], {
        fetch: ['post.title', 'post.content'],
        pageSize: 100,
    })

    console.log(response)
    return {
        props: {}
    }
}