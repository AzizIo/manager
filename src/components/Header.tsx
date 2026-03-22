import styles from './Header.module.css'
import nisa from '../assets/icons8-человек-64.png'
import { s } from 'motion/react-client'
import { Link } from 'react-router-dom';

export default function Header() {
    return (
        <div className={styles.header}>
            <div className={styles.container}>
                <Link to="/" >
                    <div className="text">
                        <h1 className={styles.h1} >Telegram Project Manager</h1>
                        <p>Упровление ботами, каналами и скриптами</p>

                    </div>
                </Link>
                <div className={styles.icon}>
                    <Link to="/welcome" >
                        <img src={nisa} alt="" />
                    </Link>

                </div>
            </div>
        </div>
    )
}