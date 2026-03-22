import { h1, s } from "motion/react-client";
import styles from './WelcomePage.module.css'
import Header from "../components/Header";
export default function Welcome() {
    return (
        <> 

        <Header />
        <div className={styles.main}>
            <div className={styles.h1_text}>
                <h1>Добро пожаловать</h1>
                <p>Войдите  в Telegram Project Manager</p>
            </div>
            <div className={styles.mai}>
                <div className={styles.inpu}>
                    <div className={styles.email_input}>
                        <label className={styles.label} htmlFor="int">Email</label>
                        <input id="int" type="email" placeholder='your@email.com' />
                    </div>
                    <div className={styles.pass_input}>
                        <label className={styles.label}  htmlFor="int2">Пароль</label>
                        <input id='int2'type="password" placeholder="*******" />
                    </div>
                    <div className="button">
                        <button className={styles.bth} >Войти</button>
                    </div>
                    <div className="noacc">
                        <p>Нет аккаунта? <a href="">зарегистрируйтесь</a></p>
                    </div>
                </div>
            </div>

        </div>
         </>
    )
}