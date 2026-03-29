export type ProjectStatus = 'New' | 'Active' | 'Completed'
export type ProjectType = 'Bot' | 'Web' | 'Mobile'

export interface Project {
  id: number
  name: string
  abbout: string
  title: ProjectType
  status: ProjectStatus
  created_at: string
}