 # CereLoX

AI-Powered Central Intelligence for logs

A modern, secure, on-device Windows log analysis tool built for students and beginners.

![Platform](https://img.shields.io/badge/Platform-Windows-0078D6?style=for-the-badge)
![License](https://img.shields.io/badge/License-MIT-blue?style=for-the-badge)
![Languages](https://img.shields.io/github/languages/top/YOUR_USERNAME/CereLoX?style=for-the-badge)
![Repo Size](https://img.shields.io/github/repo-size/YOUR_USERNAME/CereLoX?style=for-the-badge)

![Dashboard](my-cyber-dashboard/public/dashboard.png)

**[Explore the Download Page ↗](https://cerelox-download-page.YOUR-USERNAME.replit.dev)**

---

## Introduction

**CereLoX** is a user-friendly log analysis tool designed for everyone. Its mission is to provide security insights and peace of mind by making high-grade log analysis simple, without requiring technical expertise.

The core of CereLoX is its **on-device security model**. Unlike other services that require you to upload your sensitive system logs to the cloud, all analysis happens locally on your computer. Your files are never transmitted, never stored, and never seen by us. You hold the keys, you hold the data, and you have total control.

---

## ✨ Key Features

* **🤖 AI-Powered Explanations:** Integrated with the **Gemini API** to provide simple explanations of complex security concepts and summarize your specific log data.
* **📈 Live Dashboard:** Utilizes **Chart.js** to display a live, auto-updating dashboard of event trends, errors, and critical security alerts.
* **💻 On-Device Security:** All operations are performed client-side. Your sensitive Windows logs **never leave your computer**, ensuring absolute privacy.
* **⚙️ Automated Log Fetching:** Automatically fetches and parses Security, System, and Application logs from the Windows Event Viewer in real-time.
* **📄 Professional Reports:** Generate and download comprehensive reports of your system's activity in **PDF**, **CSV**, or **JSON** formats.
* **📦 Simple `.exe` Installer:** Packaged as a single executable file using **PyInstaller**. No complex setup or dependencies needed.
* **💡 Light & Dark Mode:** A sleek, modern UI with a theme toggle that respects your system preferences.

---

## Technology Stack

**Frontend:**
![React](https://img.shields.io/badge/react-%2320232a.svg?style=for-the-badge&logo=react&logoColor=%2361DAFB)
![Vite](https://img.shields.io/badge/vite-%23646CFF.svg?style=for-the-badge&logo=vite&logoColor=white)
![TailwindCSS](https://img.shields.io/badge/tailwindcss-%2338B2AC.svg?style=for-the-badge&logo=tailwind-css&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-FF6384?style=for-the-badge&logo=chartdotjs&logoColor=white)


**Backend & Database:**
![Python](https://img.shields.io/badge/python-3670A0?style=for-the-badge&logo=python&logoColor=ffdd54)
![Flask](https://img.shields.io/badge/flask-%23000.svg?style=for-the-badge&logo=flask&logoColor=white)
![PyInstaller](https://img.shields.io/badge/PyInstaller-8A2BE2?style=for-the-badge)
![SQLite](https://img.shields.io/badge/sqlite-%2307405e.svg?style=for-the-badge&logo=sqlite&logoColor=white)

**AI & Version Control:**
![Gemini API](https://img.shields.io/badge/Gemini%20API-4285F4?style=for-the-badge&logo=google&logoColor=white)
![PyWin32](https://img.shields.io/badge/PyWin32-0078D6?style=for-the-badge&logo=windows&logoColor=white)
![Git](https://img.shields.io/badge/Git-F05032?style=for-the-badge&logo=git&logoColor=white)

---

```.
├── LICENSE
├── my-cyber-dashboard
│   ├── cerelox_logs.db
│   ├── CyberChatbot.jsx
│   ├── eslint.config.js
│   ├── index.html
│   ├── package.json
│   ├── package-lock.json
│   ├── postcss.config.js
│   ├── public
│   │   └── vite.svg
│   ├── README.md
│   ├── server-main.py
│   ├── server.py
│   ├── src
│   │   ├── App.css
│   │   ├── Appinitial.jsx
│   │   ├── App.jsx
│   │   ├── App- see Later.jsx
│   │   ├── assets
│   │   │   └── react.svg
│   │   ├── index.css
│   │   └── main.jsx
│   ├── tailwind.config.js
│   └── vite.config.js
└── README.md
```

## How It Works

To run CereLoX directly from the source code, follow these steps to set up the backend server and frontend dashboard.

### 1. Clone & Setup 🚀

1.  Clone the repository to your local machine:
   
    git clone https://github.com/YOUR_USERNAME/CereLoX.git
    cd CereLoX/my-cyber-dashboard
    
2.  Install Frontend Dependencies:
   
    npm install
    
3.  Install Backend Dependencies:
    You'll need Python installed. Run the following command:
   
    pip install flask flask-cors google-generativeai pywin32
    
### 2. Configure AI Features (Optional) 🧠

1. Open server.py in your preferred code editor.
2. Locate the line GEMINI_API_KEY = "PASTE_YOUR_KEY_HERE" and insert your Google Gemini API key. 
*(If skipped, the dashboard will still function but the AI Chatbot will be disabled).*

### 3. Launch the Application ⚡

You will need two separate terminal windows open, both pointing to the my-cyber-dashboard directory.

1.  Start the Backend (Terminal 1):
   
    python server.py
    
    This launches the Flask backend on http://localhost:5000 to parse Windows Event Logs.

2.  Start the Frontend (Terminal 2):
   
    npm run dev
    
    This starts the Vite React application. Simply open the URL provided in the terminal (usually http://localhost:5173) in your web browser.

## Authors

**Team SaEcho**

* **Email:** `infa.ismailai@gmail.com infa.khadershareef@gmail.com`
* **GitHub:** ` [github.com/ismailali025] [github.com/KHADERSHAREEF19]`
* **LinkedIn:** `[linkedin.com/in/Ismail Ali]`

---

## License

This project is distributed under the MIT License. See `LICENSE` for more information.

---

## Acknowledgements

* **Flask** for the powerful and simple micro-backend.
* **Google Gemini** for the AI integration.
* **Chart.js** for the beautiful and responsive charts.
* **PyInstaller** for the hassle-free `.exe` packaging.
* **ReportLab** for the PDF report generation.
