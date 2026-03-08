import styles from './Header.module.css'

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                
                <h1>Telegram Project Manager</h1>
                <p>Упровление ботами, каналами и скриптами</p>
            </div>
        </div>
    )
}