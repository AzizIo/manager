import styles from './Header.module.css'
import nisa from '../assets/icons8-человек-64.png'
import { div, s } from 'motion/react-client'
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"

export default function Header() {
    const token = localStorage.getItem("token")
    let userName = ""
    if (token) {
        try {
            const decoded: any = jwtDecode(token)
            userName = `${decoded.firstName} ${decoded.lastName}`
        } catch {
            // токен невалидный
        }
    }
    const logout = () => {
        localStorage.removeItem("token")
        localStorage.removeItem("firstName")
        localStorage.removeItem("lastName")
        window.location.href = "/welcome"
    }
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
                    <div className="name">
                        {
                            userName && (
                                <div className={styles.user_info}>
                                    <span>👤 {userName}</span>
                                    <button onClick={logout}>Выйти</button>
                                </div>
                            )
                        }
                    </div>

                </div>
            </div>
        </div>
    )
}