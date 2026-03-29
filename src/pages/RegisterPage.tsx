import styles from './RegisterPage.module.css'
import Header from "../components/Header";
import { Link } from 'react-router-dom';
import { useState } from 'react'
import axios from "axios";
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"
import API from "../utils/api";
export default function Register() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [fitstName, setFirstName] = useState("")
    const [lastName, setLasttName] = useState("")

    const reg = async () => {
        const res = await API.post("/register", {
            Email: email,
            Password: pass,
            FirstName: fitstName,
            LastName: lastName
        });
        localStorage.setItem("token", res.data.access_token);
        const decoded: any = jwtDecode(res.data.access_token)
        localStorage.setItem("firstName", decoded.firstName)
        localStorage.setItem("lastName", decoded.lastName)

        navigate("/")

    }

    return (
        <>

            <Header />
            <div className={styles.main}>
                <div className={styles.h1_text}>
                    <h1>Добро пожаловать</h1>
                    <p>Зарегестрируйтесь  в Telegram Project Manager</p>
                </div>

                <form onSubmit={(e) => { e.preventDefault(); reg() }}>
                    <div className={styles.mai}>
                        <div className={styles.inpu}>
                            <div className={styles.email_input}>
                                <label className={styles.label} htmlFor="int">Email</label>
                                <input onChange={(event) => setEmail(event.target.value)} value={email} id="int" type="email" placeholder='your@email.com' />
                            </div>
                            <div className={styles.fn_input}>
                                <label className={styles.label} htmlFor="int">Имя</label>
                                <input onChange={(event) => setFirstName(event.target.value)} value={fitstName} id="int" type="text" placeholder='Иван' />
                            </div>
                            <div className={styles.ln_input}>
                                <label className={styles.label} htmlFor="int">Фамилия</label>
                                <input onChange={(event) => setLasttName(event.target.value)} value={lastName} id="int" type="text" placeholder='Иванов' />
                            </div>
                            <div className={styles.pass_input}>
                                <label className={styles.label} htmlFor="int2">Пароль</label>
                                <input onChange={(event) => setPass(event.target.value)} value={pass} id='int2' type="password" placeholder="*******" />
                            </div>
                            <div className="button">
                                <button className={styles.bth} >Регистрация</button>
                            </div>
                            <div className="noacc">
                                <Link to="/welcome">
                                    <p>УЖе есть аккаунт? <a href="">Вход</a></p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </form>

            </div>

        </>
    )
}