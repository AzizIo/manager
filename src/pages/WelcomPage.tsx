import styles from './WelcomePage.module.css'
import Header from "../components/Header";
import { Link } from 'react-router-dom';
import { useState } from 'react'
import { jwtDecode } from "jwt-decode"
import { useNavigate } from "react-router-dom"
import API from "../utils/api";
import { AxiosError } from 'axios';

// Типизация ошибок формы
interface FormErrors {
    email?: string;
    password?: string;
    general?: string;
}

// Типизация ответа API при ошибке
interface ApiErrorResponse {
    detail?: string;
    message?: string;
}

export default function Welcome() {
    const navigate = useNavigate()

    const [email, setEmail] = useState("")
    const [pass, setPass] = useState("")
    const [errors, setErrors] = useState<FormErrors>({})
    const [isLoading, setIsLoading] = useState(false)

    // Клиентская валидация
    const validate = (): boolean => {
        const newErrors: FormErrors = {}

        if (!email) {
            newErrors.email = "Email обязателен"
        } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
            newErrors.email = "Введите корректный email"
        }

        if (!pass) {
            newErrors.password = "Пароль обязателен"
        } else if (pass.length < 6) {
            newErrors.password = "Пароль должен быть не менее 6 символов"
        }

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const log = async () => {
        if (!validate()) return

        setIsLoading(true)
        setErrors({})

        try {
            const res = await API.post("/login", {
                Email: email,
                Password: pass
            })
            localStorage.setItem("token", res.data.access_token)
            const decoded: any = jwtDecode(res.data.access_token)
            localStorage.setItem("firstName", decoded.firstName)
            localStorage.setItem("lastName", decoded.lastName)
            navigate("/")
        } catch (err) {
            const error = err as AxiosError<ApiErrorResponse>
            const status = error.response?.status

            if (status === 401) {
                setErrors({ general: "Неверный email или пароль" })
            } else if (status === 404) {
                setErrors({ email: "Пользователь с таким email не найден" })
            } else if (status === 422) {
                setErrors({ general: "Проверьте правильность введённых данных" })
            } else if (!error.response) {
                setErrors({ general: "Нет соединения с сервером. Проверьте интернет" })
            } else {
                setErrors({ general: error.response?.data?.detail || "Что-то пошло не так" })
            }
        } finally {
            setIsLoading(false)
        }
    }

    return (
        <>
            <Header />
            <form onSubmit={(e) => { e.preventDefault(); log() }}>
                <div className={styles.main}>
                    <div className={styles.h1_text}>
                        <h1>Добро пожаловать</h1>
                        <p>Войдите в Telegram Project Manager</p>
                    </div>
                    <div className={styles.mai}>
                        <div className={styles.inpu}>

                            {/* Общая ошибка */}
                            {errors.general && (
                                <div className={styles.errorBanner}>
                                    <span className={styles.errorIcon}>⚠</span>
                                    {errors.general}
                                </div>
                            )}

                            <div className={`${styles.email_input} ${errors.email ? styles.fieldError : ''}`}>
                                <label className={styles.label} htmlFor="email">Email</label>
                                <input
                                    onChange={(e) => {
                                        setEmail(e.target.value)
                                        if (errors.email) setErrors(prev => ({ ...prev, email: undefined }))
                                    }}
                                    value={email}
                                    id="email"
                                    type="email"
                                    placeholder='your@email.com'
                                    className={errors.email ? styles.inputError : ''}
                                />
                                {errors.email && <span className={styles.fieldErrorMsg}>{errors.email}</span>}
                            </div>

                            <div className={`${styles.pass_input} ${errors.password ? styles.fieldError : ''}`}>
                                <label className={styles.label} htmlFor="password">Пароль</label>
                                <input
                                    onChange={(e) => {
                                        setPass(e.target.value)
                                        if (errors.password) setErrors(prev => ({ ...prev, password: undefined }))
                                    }}
                                    value={pass}
                                    id='password'
                                    type="password"
                                    placeholder="*******"
                                    className={errors.password ? styles.inputError : ''}
                                />
                                {errors.password && <span className={styles.fieldErrorMsg}>{errors.password}</span>}
                            </div>

                            <div className="button">
                                <button className={styles.bth} disabled={isLoading}>
                                    {isLoading ? "Вход..." : "Войти"}
                                </button>
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