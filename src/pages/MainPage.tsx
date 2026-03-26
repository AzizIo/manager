import styles from './MainPage.module.css'
import Header from '../components/Header'
import { motion, AnimatePresence } from "motion/react"
import image from '../assets/icons8-полная-корзина-24.png'
import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from "react-router-dom"
import { jwtDecode } from "jwt-decode"

/* ─── Анимированный счётчик ──────────────────────────────────────── */
function AnimatedCounter({ value }) {
    const [display, setDisplay] = useState(0)
    const prevRef = useRef(0)

    useEffect(() => {
        const start = prevRef.current
        const end = value
        if (start === end) return
        const duration = 700
        const startTime = performance.now()

        const tick = (now) => {
            const t = Math.min((now - startTime) / duration, 1)
            const eased = 1 - Math.pow(1 - t, 3)
            setDisplay(Math.round(start + (end - start) * eased))
            if (t < 1) requestAnimationFrame(tick)
            else prevRef.current = end
        }
        requestAnimationFrame(tick)
    }, [value])

    return <span>{display}</span>
}

/* ─── Варианты анимаций ──────────────────────────────────────────── */
const fadeUp = {
    hidden: { opacity: 0, y: 28 },
    visible: (delay = 0) => ({
        opacity: 1,
        y: 0,
        transition: { duration: 0.55, delay, ease: [0.22, 1, 0.36, 1] },
    }),
}

const fadeLeft = {
    hidden: { opacity: 0, x: -24 },
    visible: {
        opacity: 1, x: 0,
        transition: { duration: 0.55, ease: [0.22, 1, 0.36, 1] },
    },
}

const cardVariant = {
    hidden: { opacity: 0, y: 24, scale: 0.97 },
    visible: (i) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.45, delay: i * 0.07, ease: [0.22, 1, 0.36, 1] },
    }),
    exit: {
        opacity: 0, scale: 0.92, y: -12,
        transition: { duration: 0.3, ease: [0.4, 0, 1, 1] },
    },
}

const statVariant = {
    hidden: { opacity: 0, y: 20, scale: 0.95 },
    visible: (i) => ({
        opacity: 1, y: 0, scale: 1,
        transition: { duration: 0.5, delay: 0.15 + i * 0.1, ease: [0.22, 1, 0.36, 1] },
    }),
}

/* ─── Компонент ──────────────────────────────────────────────────── */
export default function MainPage() {
    const [projects, setProjects] = useState([])
    const [newProject, setNewProject] = useState("")
    const [abbout, setAbbout] = useState("")
    const [type, setType] = useState("Bot")
    const [status, setStatus] = useState("New")
    const [searchTerm, setSearchTerm] = useState("")

    const formatDate = (date) =>
        new Date(date)
            .toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" })
            .replace(" г.", "") + " года"

    /* ── API ── */
    const addProject = async (event) => {
        event.preventDefault()
        await fetch("http://localhost:8000/tasks", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ name: newProject, title: type, status, abbout }),
        })
        const data = await fetch("http://localhost:8000/tasks").then(r => r.json())
        setProjects(data)
        setAbbout(""); setNewProject(""); setType("Bot"); setStatus("New")
    }

    const deleteProject = async (id) => {
        await fetch(`http://localhost:8000/tasks/${id}`, { method: "DELETE" })
        setProjects(prev => prev.filter(p => p.id !== id))
    }

    const delete_all = async (e) => {
        e.preventDefault()
        await fetch("http://localhost:8000/tasks", {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
        })
        setProjects([])
    }
    const navigate = useNavigate()
    useEffect(() => {
        fetch("http://localhost:8000/tasks").then(r => r.json()).then(setProjects)
    }, [])
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/welcome")
        }
    }, [])

    /* ── Вычисления ── */
    const filterProjects = projects.filter(p =>
        p.name.toLowerCase().includes(searchTerm.toLowerCase())
    )
    const complete = projects.filter(p => p.status === "Completed").length
    const active = projects.filter(p => p.status === "Active").length

    /* ─────────────── RENDER ─────────────── */
    return (
        <>
            <Header />

            <div className={styles.main}>
                <div className={styles.container}>

                    {/* ── Форма добавления ── */}
                    <motion.div
                        className={styles.new_project}
                        variants={fadeLeft}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className={styles.new}>Добавить новый проект</h1>

                        <form onSubmit={addProject} className={styles.input_sec}>
                            <div className={styles.sex}>
                                <div className={styles.row}>
                                    {/* Название */}
                                    <motion.div
                                        className={styles.field}
                                        variants={fadeUp}
                                        custom={0.1}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <label className={styles.label_desk}>Название проекта</label>
                                        <label className={styles.label_mob}>Название</label>
                                        <motion.input
                                            className={styles.input}
                                            onChange={e => setNewProject(e.target.value)}
                                            value={newProject}
                                            required
                                            type="text"
                                            placeholder="Мой Telegram бот"
                                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px #8100db55" }}
                                            transition={{ duration: 0.2 }}
                                        />
                                    </motion.div>

                                    {/* Тип */}
                                    <motion.div
                                        className={styles.field}
                                        variants={fadeUp}
                                        custom={0.18}
                                        initial="hidden"
                                        animate="visible"
                                    >
                                        <label>Тип проекта</label>
                                        <motion.select
                                            className={styles.input}
                                            onChange={e => setType(e.target.value)}
                                            value={type}
                                            whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px #8100db55" }}
                                            transition={{ duration: 0.2 }}
                                        >
                                            <option value="Bot">Бот</option>
                                            <option value="Web">Веб-сайт</option>
                                            <option value="Mobile">Мобильное приложение</option>
                                        </motion.select>
                                    </motion.div>
                                </div>

                                {/* Описание */}
                                <motion.div
                                    className={styles.field}
                                    variants={fadeUp}
                                    custom={0.26}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <label>Описание проекта</label>
                                    <motion.textarea
                                        onChange={e => setAbbout(e.target.value)}
                                        value={abbout}
                                        placeholder="Опишите ваш проект"
                                        whileFocus={{ scale: 1.005, boxShadow: "0 0 0 2px #8100db55" }}
                                        transition={{ duration: 0.2 }}
                                    />
                                </motion.div>

                                {/* Статус */}
                                <motion.div
                                    className={styles.field}
                                    variants={fadeUp}
                                    custom={0.34}
                                    initial="hidden"
                                    animate="visible"
                                >
                                    <label>Статус</label>
                                    <motion.select
                                        className={styles.input}
                                        onChange={e => setStatus(e.target.value)}
                                        value={status}
                                        whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px #8100db55" }}
                                        transition={{ duration: 0.2 }}
                                    >
                                        <option value="New">Новый</option>
                                        <option value="Active">Активный</option>
                                        <option value="Completed">Завершен</option>
                                    </motion.select>
                                </motion.div>
                            </div>

                            {/* Кнопки */}
                            <motion.div
                                className={styles.buttons}
                                variants={fadeUp}
                                custom={0.42}
                                initial="hidden"
                                animate="visible"
                            >
                                <div className={styles.add_button}>
                                    <motion.button
                                        type="submit"
                                        className={styles.bth}
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: "0 8px 24px rgba(129,0,219,0.38)",
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                    >
                                        + Добавить проект
                                    </motion.button>
                                </div>

                                <div className={styles.delete_all}>
                                    <motion.button
                                        type="button"
                                        onClick={delete_all}
                                        className={styles.delete}
                                        whileHover={{
                                            scale: 1.03,
                                            boxShadow: "0 8px 24px rgba(220,38,38,0.32)",
                                        }}
                                        whileTap={{ scale: 0.97 }}
                                        transition={{ type: "spring", stiffness: 350, damping: 20 }}
                                    >
                                        Удалить все проекты
                                    </motion.button>
                                </div>
                            </motion.div>
                        </form>
                    </motion.div>

                    {/* ── Поиск ── */}
                    <motion.div
                        className={styles.search}
                        variants={fadeUp}
                        custom={0.1}
                        initial="hidden"
                        animate="visible"
                    >
                        <h1 className={styles.new}>Поиск по названию</h1>
                        <div id={styles.sinput} className={styles.field}>
                            <motion.input
                                onChange={e => setSearchTerm(e.target.value)}
                                className={styles.input}
                                id="search"
                                value={searchTerm}
                                placeholder="🔍 Искать проект..."
                                type="text"
                                whileFocus={{ scale: 1.01, boxShadow: "0 0 0 2px #8100db55" }}
                                transition={{ duration: 0.2 }}
                            />
                        </div>
                    </motion.div>

                    {/* ── Статистика ── */}
                    <div className="static">
                        <div className={styles.static_list}>
                            <div className={styles.static_item}>
                                {[
                                    {
                                        label: "Всего проектов",
                                        value: projects.length,
                                        textClass: styles.static_text1,
                                        countId: styles.all_color,
                                        wrapClass: `${styles.all_project} ${styles.st_project}`,
                                    },
                                    {
                                        label: "Активных",
                                        value: active,
                                        textClass: styles.static_text,
                                        countId: styles.active_color,
                                        wrapClass: `${styles.acrive_project} ${styles.st_project}`,
                                    },
                                    {
                                        label: "Завершенных",
                                        value: complete,
                                        textClass: styles.static_text,
                                        countId: styles.complete_color,
                                        wrapClass: `${styles.completed_project} ${styles.st_project}`,
                                    },
                                ].map((stat, i) => (
                                    <motion.div
                                        key={stat.label}
                                        className={stat.wrapClass}
                                        variants={statVariant}
                                        custom={i}
                                        initial="hidden"
                                        animate="visible"
                                        whileHover={{
                                            y: -5,
                                            boxShadow: "0 14px 30px rgba(0,0,0,0.15)",
                                            transition: { duration: 0.22 },
                                        }}
                                    >
                                        <p className={stat.textClass}>{stat.label}</p>
                                        <p id={stat.countId} className={styles.static_count}>
                                            <AnimatedCounter value={stat.value} />
                                        </p>
                                    </motion.div>
                                ))}
                            </div>
                        </div>
                    </div>

                    {/* ── Список проектов ── */}
                    <div className={styles.projects}>
                        <motion.h1
                            className={styles.my}
                            variants={fadeUp}
                            custom={0}
                            initial="hidden"
                            animate="visible"
                        >
                            Мои проекты
                        </motion.h1>

                        <AnimatePresence>
                            {filterProjects.length === 0 && (
                                <motion.p
                                    key="empty"
                                    className={styles.no_projects}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: -10 }}
                                    transition={{ duration: 0.3 }}
                                >
                                    Проекты не найдены
                                </motion.p>
                            )}
                        </AnimatePresence>

                        <motion.div className={styles.project_list} layout>
                            <AnimatePresence mode="popLayout">
                                {filterProjects.map((project, index) => (
                                    <motion.div
                                        key={project.id}
                                        className={styles.project_item}
                                        variants={cardVariant}
                                        custom={index}
                                        initial="hidden"
                                        animate="visible"
                                        exit="exit"
                                        layout
                                        whileHover={{
                                            y: -5,
                                            boxShadow: "0 16px 32px rgba(0,0,0,0.12)",
                                            transition: { duration: 0.25 },
                                        }}
                                    >
                                        <h2 className={styles.project_name}>{project.name}</h2>
                                        <p className={styles.project_status}>{project.status}</p>
                                        <p className={styles.project_type}>{project.title}</p>
                                        <p className={styles.project_abbout}>{project.abbout}</p>
                                        <hr className={styles.project_hr} />
                                        <p className={styles.project_date}>{formatDate(project.created_at)}</p>

                                        <motion.button
                                            onClick={() => deleteProject(project.id)}
                                            className={styles.r_bth}
                                            whileHover={{ scale: 1.15, rotate: 8 }}
                                            whileTap={{ scale: 0.9 }}
                                            transition={{ type: "spring", stiffness: 400, damping: 18 }}
                                        >
                                            <div className={styles.r_button}>
                                                <img src={image} alt="Удалить" />
                                            </div>
                                        </motion.button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </motion.div>
                    </div>

                </div>
            </div>
        </>
    )
}