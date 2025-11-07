# 🧥 SE_project_react

A **full-stack weather-based wardrobe app** that helps users decide what to wear depending on the day’s forecast.  
Built with a **React frontend** and a **Node.js/Express + MongoDB backend**.  
Perfect for anyone who wants to manage their wardrobe and see suggestions based on the current weather.

---

## 🚀 Demo

[🌐 Live Demo](https://github.com/ledyc-se/se_project_react)

_(Frontend + Backend can both run locally — see setup instructions below.)_

---

## 📸 Screenshots

| Feature       | Preview                                        |
| ------------- | ---------------------------------------------- |
| 🌤 Main UI     | ![Screenshot](/src/images/Screenshot.jpg)      |
| 🧾 Item Modal | ![Screenshot](/src/images/modalScreenshot.jpg) |

---

## 🛠 Features

- 👕 **Add, View, and Delete Clothing Items** — Users can upload items with images, name, and suitable weather type.
- 🌡 **Weather Integration** — Displays real-time weather to suggest appropriate clothes.
- 🧍‍♂️ **User Authentication** — Sign up, log in, and manage your personal wardrobe.
- 💬 **Interactive Modals** — Clean modals for previewing, confirming deletion, and editing profile info.
- ❤️ **Like System** — Logged-in users can like or unlike items.
- 📱 **Responsive Design** — Works seamlessly across devices.
- 🔐 **Full CRUD Backend** — Built with Express.js, Mongoose, and JWT for secure data handling.

---

## ⚙️ Tech Stack

**Frontend:**

- React (with Context API & Hooks)
- React Router
- CSS (custom modular styles)

**Backend:**

- Node.js + Express
- MongoDB + Mongoose
- JWT Authentication
- bcrypt for password hashing
- RESTful API

---Link to backend: https://github.com/ledyc-se/se_project_express.git

## Project Domain: https://wtwrledyy.bot.nu

## Link to Project Pitch

https://drive.google.com/file/d/19pMmVPQZZVepEKAyuhS0M-0PLIuoClWi/view?usp=sharing

## 🧩 Project Structure

se_project_react/
├── frontend/
│ ├── src/
│ │ ├── components/
│ │ ├── contexts/
│ │ ├── images/
│ │ ├── utils/
│ │ └── App.jsx
│ └── package.json
│
├── backend/
│ ├── models/
│ ├── routes/
│ ├── controllers/
│ ├── utils/
│ └── server.js
│
└── README.md
