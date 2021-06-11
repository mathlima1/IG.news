import Head from 'next/head'
export default function Home() {
  return (
    <>
      <Head>
        <title>Inicio | Ig.News</title>
      </Head>
      <h1>hello <span>
        world
      </span>
      </h1>
      <img src='../../public/ig.news.svg' alt="" />
    </>
  )
}
