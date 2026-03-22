import styles from './/MainPage.module.css'
import Header from '../components/Header'
import { motion } from "motion/react"
import image from '../assets/icons8-полная-корзина-24.png'
import getCurrentDateInRussian from '../utils/dateUtils'
import React from 'react'
import { useState, useEffect } from 'react'
export default function MainPage() {
    const [projects, setProjects] = useState([])
    const [newProject, setNewProject] = useState("")
    const [type, setType] = useState("Bot")
    const [status, setStatus] = useState("New")
    const [searchTerm, setSearchTerm] = useState("")
    const addProject = async (event) => {
        event.preventDefault()
        await fetch("http://localhost:8000/tasks", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                name: newProject,
                title: type,
                status: status
            })
        })

        const res = await fetch("http://localhost:8000/tasks")
        const data = await res.json()

        setProjects(data)

        setNewProject("")
        setType("Bot")
        setStatus("New")


    }
    const opdata = () => {
        return getCurrentDateInRussian()
    }

    const deleteProject = async (id) => {
        await fetch(`http://localhost:8000/tasks/${id}`, {
            method: "DELETE",
        })
        setProjects(prev => prev.filter(project => project.id !== id))
        
    }

    const delete_all = async (e) => {
        e.preventDefault()

        await fetch("http://localhost:8000/tasks", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            }
        })

        setProjects([])
        const res = await fetch("http://localhost:8000/tasks")
        const data = await res.json()
        setProjects(data)
    }


    const filterProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const complete = projects.filter((project) => project.status === "Completed").length
    const active = projects.filter((project) => project.status === "Active").length
    useEffect(() => {
        fetch("http://localhost:8000/tasks")  // ← заменил 127.0.0.1 на localhost
            .then(res => res.json())
            .then(data => {
                setProjects(data)

            })
    }, [])
    return (
        <>
            <Header />
            <div className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.new_project}>
                        <h1 className={styles.new} >Добавить новый проект</h1>
                        <form onSubmit={addProject} className={styles.input_sec}>
                            <div className={styles.sex}>
                                <div className="name_inpu">
                                    <label className={styles.label} htmlFor="int">Название проекта</label>
                                    <input className={styles.input} onChange={(event) => setNewProject(event.target.value)} value={newProject} id="int" required type="text" placeholder='Мой Telegram бот' />
                                </div>
                                <div className="type_input">
                                    <label className={styles.label} htmlFor="int">Тип проекта</label>
                                    <select className={styles.input} onChange={(event) => setType(event.target.value)} value={type} id="int" placeholder='Bot'>
                                        <option value="Bot">Бот</option>
                                        <option value="Web">Веб-сайт</option>
                                        <option value="Mobile">Мобильное приложение</option>
                                    </select>
                                </div>


                                <div className="status_input">
                                    <label className={styles.label} htmlFor="int">Статус</label>
                                    <select className={styles.input} onChange={(event) => setStatus(event.target.value)} value={status} id="int">
                                        <option value="New">Новый</option>
                                        <option value="Active">Активный</option>
                                        <option value="Completed">Завершен</option>
                                    </select>
                                </div>
                            </div>
                            <div className={styles.buttons}>

                                <div className={styles.add_button}>
                                    <button type="submit" className={styles.bth} >+ Добавить проект</button>
                                </div>
                                <div className="delete_all">

                                    <div className={styles.delete_all}>
                                        <button type='submit' onClick={delete_all} id={styles.bth2} className={styles.bth} >Удалить все проекты</button>
                                    </div>
                                </div>
                            </div>
                        </form>


                    </div>
                    
                    <div className={styles.search}>
                        <h1 className={styles.new} >Поиск по названию</h1>
                        <div id={styles.sinput} className={styles.input_sec}>
                            <input onChange={(event) => setSearchTerm(event.target.value)} id="search" value={searchTerm} className={styles.input} placeholder='🔍Искать проект...' type="text" />
                        </div>
                    </div>
                    <div className="static">
                        <div className={styles.static_list}>
                            <div className={styles.static_item}>
                                <div className={`${styles.all_project} ${styles.st_project}`}>
                                    <p className={styles.static_text}>Всего проектов</p>
                                    <p id={styles.all_color} className={styles.static_count}>{projects.length} </p>
                                </div>
                                <div className={`${styles.acrive_project} ${styles.st_project}`}>
                                    <p className={styles.static_text} >Активных</p>
                                    <p id={styles.active_color} className={styles.static_count} >{active}</p>
                                </div>
                                <div className={`${styles.completed_project} ${styles.st_project}`}>
                                    <p className={styles.static_text} >Завершенных</p>
                                    <p id={styles.complete_color} className={styles.static_count} >{complete}</p>
                                </div>

                            </div>
                        </div>

                    </div>
                    <div className={styles.projects}>
                        <h1 className={styles.my}>Мои проекты</h1>
                        {filterProjects.length === 0 ? (
                            <p className={styles.no_projects}>Проекты не найдены</p>
                        ) : (
                            ""
                        )}
                        <div className={styles.project_list}>
                            {filterProjects.map((project, index) => (
                                <div key={index} className={styles.project_item}>
                                    <h2 className={styles.project_name}>{project.name}</h2>
                                    <p className={styles.project_status}>{project.status}</p>
                                    <p className={styles.project_type}>{project.title}</p>
                                    <hr className={styles.project_hr} />
                                    <p className={styles.project_date}>{opdata}</p>
                                    <button onClick={() => deleteProject(project.id)} className={styles.r_bth}><div className={styles.r_button} >
                                        <img src={image} alt="" />
                                    </div>
                                    </button>
                                </div>

                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}