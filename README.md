# ERMS - Engineering Resource Management System

A full-stack web application for managing engineering team capacity, project assignments, and skill tracking. The platform supports two user roles — **Manager** and **Engineer** — and is optimized for usability, maintainability, and responsive design.

---
## Approach

--- Started with Backend ---

-- Basic architecture of the application 
-- Started with Schema design 
-- Routes selection
-- wrote API's for endpoints 
-- Tested api's on Postman

-- Frontend ---
-- Routing setup
-- Pages for different screens
-- Integrated backend 
-- Displayed data
-- Styled the components later

## 🚀 Features

### 👤 Authentication
- JWT-based secure login
- Role-based dashboard routing (`Manager`, `Engineer`)
- Logout support with token clearing

### 👩‍💼 Manager Dashboard
- **Team Overview**: View engineers with capacity bars
- **Create Assignments**: Assign engineers to projects with percentage allocation
- **Project Management**: Create, edit, and delete projects with required skills
- **Assignment Timeline**: View all assignments with dates

### 👨‍🔧 Engineer Dashboard
- **My Assignments**: View all current and future assignments
- **Profile**: Update skills, seniority, department, and max capacity

### 🌐 Responsive Design
- Fully responsive UI using Tailwind CSS and ShadCN components
- Sidebar navigation adapts to mobile and desktop
- Light/dark mode compatible layout

---

## 🛠️ Tech Stack

### 🧩 Frontend
- **React** + **TypeScript**
- **React Router DOM** – routing & nested layouts
- **Zustand** – lightweight global state for auth
- **Tailwind CSS** – utility-first styling
- **ShadCN UI** – prebuilt, accessible UI components
- **React Hook Form + Zod** – form management and validation
- **Axios** – API communication

### 🔧 Backend
- **Node.js + Express**
- **MongoDB + Mongoose**
- RESTful API architecture
- Role-based route handling
- Assignment, User, and Project models with validations

---


---

## 🤖 AI Tools Used

### ✅ ChatGPT (by OpenAI)
- Code generation, refactoring, and bug fixes
- Component logic and backend controller structuring
- UX design suggestions and form validation schemas

### ✅ Windsurf (Base model)
- Autocompletion and inline suggestion for repetitive code
- React component boilerplate assistance

These tools helped significantly speed up development while maintaining quality and consistency.

---






