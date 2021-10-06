import { SingInButton } from '../SingInButton'
import styles from './styles.module.scss'


export function Header() {
    return (
        <header className={styles.headerContainer}>
            <div className={styles.headerContent}>
                <img src="/assets/ig.news.svg" alt="Logo Ig.news" />
                <nav>
                    <a href="/" className={styles.active}>Home</a>
                    <a href="/posts">Posts</a>
                </nav>
                <SingInButton />
            </div>
        </header>
    )
}