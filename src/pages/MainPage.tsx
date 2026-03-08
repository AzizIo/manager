import styles from './/MainPage.module.css'
import Header from '../components/Header'
import React from 'react'
import { useState } from 'react'
export default function MainPage() {

    const [projects, setProjects] = useState([])

    const [newProject, setNewProject] = useState("")
    const [type, setType] = useState("")
    const [status, setStatus] = useState("")
    const [searchTerm, setSearchTerm] = useState("")
    const addProject = () => {
        if (newProject.trim().length > 0) {
            const newProjectObj = {
                name: newProject,
                type: type,
                status: status
            }
            setType("")
            setStatus("")
            setProjects([...projects, newProjectObj])
            setNewProject("")

        }
    }
    const onSubmit = (event) => {
        event.preventDefault();
        addProject();
    }

    const filterProjects = projects.filter((project) => project.name.toLowerCase().includes(searchTerm.toLowerCase()))

    const complete = projects.filter((project) => project.status === "Completed").length
    const active = projects.filter((project) => project.status === "Active").length


    return (
        <>
            <Header />
            <div className={styles.main}>
                <div className={styles.container}>
                    <div className={styles.new_project}>
                        <h1 className={styles.new} >Добавить новый проект</h1>
                        <form onSubmit={onSubmit} className={styles.input_sec}>
                            <div className={styles.sex}>
                                <div className="name_inpu">
                                    <label className={styles.label} htmlFor="int">Название проекта</label>
                                    <input onChange={(event) => setNewProject(event.target.value)} value={newProject} id="int" required type="text" placeholder='Мой Telegram бот' />
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
                            <div className={styles.add_button}>
                                <button type="submit" className={styles.bth} >+ Добавить проект</button>
                            </div>
                        </form>

                    </div>
                    <div className={styles.search}>
                        <div className={styles.search_input}>
                            <label htmlFor="search">Поиск по названию</label>
                            <input onChange={(event) => setSearchTerm(event.target.value)} id="search" value={searchTerm} className={styles.input_search} placeholder='🔍Искать проект...' type="text" />
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
                                    <p className={styles.project_type}>{project.type}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

            </div>
        </>
    )
}