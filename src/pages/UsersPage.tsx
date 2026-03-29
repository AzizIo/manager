import API from '../utils/api'
import { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom"
import styles from './UsersPage.module.css'
import pep from '../assets/ddasdasd.svg'
import { style } from 'motion/react-client'

import Header from '../components/Header'
export default function Users() {
    const navigate = useNavigate()
    const [projects, setProjects] = useState([])
    useEffect(() => {
        const token = localStorage.getItem("token")
        if (!token) {
            navigate("/welcome")
        }
    }, [])
    useEffect(() => {
        API.get("/projects/all").then(res => setProjects(res.data))
    }, [])

    return (
        <div>
            <Header />
            <main className={styles.main} >
                <div className={styles.container}>
                    <div className={styles.comm}>
                        <div className={styles.cont}>
                            <div className={styles.peopels}>
                                <img className={styles.pimg} src={pep} alt="" />
                            </div>
                            <div className="h1">
                                <h1 className={styles.headcoom} >Сообщество проектов</h1>
                                <p className={styles.headp}>Исследуйте публичные проекты других пользователей</p>
                            </div>
                        </div>
                    </div>
                    <div className={styles.project_list}>

                        {projects.map(project => (
                            <div className={styles.project_item} key={project.id}>
                                <h2 className={styles.project_name} >{project.name}</h2>
                                <p className={styles.project_status} >{project.status}</p>
                                <p className={styles.project_type}> {project.title}</p>
                                <p className={styles.project_abbout} >{project.abbout}</p>

                            </div>
                        ))}
                    </div>
                </div>
            </main>
        </div>
    )
}