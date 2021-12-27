import Link from 'next/link'

import { SingInButton } from '../SingInButton'
import styles from './styles.module.scss'


export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/assets/ig.news.svg" alt="Logo Ig.news" />
                <nav>
                    <Link href="/">
                        <a className={styles.active}>Home</a>
                    </Link>
                    <Link href="/posts" prefetch>
                        <a >Posts</a>
                    </Link>
                </nav>
                <SingInButton />
            </div>
        </header>
    )
}