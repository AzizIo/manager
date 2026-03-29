import styles from './WelcomePage.module.css'
import Header from "../components/Header";
import { Link } from 'react-router-dom';
import { useState } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import API from "../utils/api";
export default function Welcome() {
    const navigate = useNavigate()
    

    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")

    const log = async () => {
        const res = await API.post("/login", {
            Email: email,
            Password: pass
        })
        localStorage.setItem("token", res.data.access_token);
        const decoded: any = jwtDecode(res.data.access_token)
        localStorage.setItem("firstName", decoded.firstName)
        localStorage.setItem("lastName", decoded.lastName)

        navigate("/") 
    }

    return (
        <>

            <Header />
            <form onSubmit={(e) => { e.preventDefault(); log() }}>

                <div className={styles.main}>
                    <div className={styles.h1_text}>
                        <h1>Добро пожаловать</h1>
                        <p>Войдите  в Telegram Project Manager</p>
                    </div>
                    <div className={styles.mai}>
                        <div className={styles.inpu}>
                            <div className={styles.email_input}>
                                <label className={styles.label} htmlFor="int">Email</label>
                                <input onChange={(event) => setEmail(event.target.value)} value={email} id="int" type="email" placeholder='your@email.com' />
                            </div>
                            <div className={styles.pass_input}>
                                <label className={styles.label} htmlFor="int2">Пароль</label>
                                <input onChange={(event) => setPass(event.target.value)} value={pass} id='int2' type="password" placeholder="*******" />
                            </div>
                            <div className="button">
                                <button className={styles.bth} >Войти</button>
                            </div>
                            <div className="noacc">
                                <Link to="/register">
                                    <p>Нет аккаунта? <a href="">зарегистрируйтесь</a></p>
                                </Link>
                            </div>
                        </div>
                    </div>

                </div>
            </form>
        </>
    )
}