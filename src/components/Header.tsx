import styles from './Header.module.css'
import nisa from '../assets/icons8-человек-64.png'
import { div, s } from 'motion/react-client'
import { Link } from 'react-router-dom';
import { jwtDecode } from "jwt-decode"
import logimg from '../assets/icons8-выйти-48.png'
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
                        <p className={styles.p} >Упровление ботами, каналами и скриптами</p>

                    </div>
                </Link>
                <div className={styles.acc}>
                    <div className={styles.icon}>
                        <Link to="/users" >
                            <span>сообщество</span>
                        </Link>
                    </div>
                    <div className="sp">
                        |
                    </div>
                        <div className="alsdlasdlas">
                            <div className="name">
                                {
                                    userName && (
                                        <div className={styles.user_info}>
                                            <span  >👤 {userName}</span>
                                            <button className={styles.logout} onClick={logout}><img src={logimg} alt="" /></button>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                </div>
            </div>
        </div>
    )
}