import { Priority, Status } from "./Types";

export interface Ticket {
    title: string,
    description: string,
    status: Status,
    priority: Priority,
    createdAt?: Date,
    dueAt?: Date,
    id?: string
    owner?: User,
    assignee?: User,
    messages?: Message[]
  }

  
export interface User {
  id?: string
  userName: string,
  email: string
}

export interface UserWithRole {
  id?: string
  email: string
  roles: string
}

export interface UserRoleUpdate {
  id: string
  role: string
}

export interface Message {
  id: string,
  content: string,
  createdAt: Date,
  owner: User,
  adminOnly: boolean
}
