import { GetStaticProps } from 'next'
import Head from 'next/head'
import { stripe } from '../services/stripe'
import SubscribeButton from '../components/SubscribeButton'
import styles from './home.module.scss'

interface HomeProps {
  product: {
    priceId: string;
    amount: number;
  }
}

export default function Home({ product }: HomeProps) {


  return (
    <>
      <Head>
        <title>Inicio | Ig.News</title>
      </Head>

      <main className={styles.contentContainer}>
        <section className={styles.hero}>
          <span>👏 Olá, Bem-vindo</span>
          <h1>Noticias sobre <span>React</span> e seu ecossitema</h1>
          <p>
            Tenha acesso a todas as publicações <br />
            <span>por {product.amount} por mês</span>
          </p>
          <SubscribeButton priceId={product.priceId} />
        </section>
        <img src="/assets/mulher.svg" alt="garota codando" />
      </main>
    </>
  )
}

export const getStaticProps: GetStaticProps = async () => {
  const price = await stripe.prices.retrieve('price_1JFpDED9mEzQ2tppldqJdvNp')

  const product = {
    priceId: price.id,
    amount: new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(price.unit_amount / 100),
  }
  return {
    props: {
      product,
    },
    revalidate: 60 * 60 * 24 //24 horas (o tempo ali é colocado em segundo)
  }

}