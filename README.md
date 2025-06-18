


# 🎥 YouLayer — Secure Video Publishing Middleware for YouTube Teams

🌐 **Frontend:** [https://youlayer.vercel.app](https://youlayer.vercel.app)  
🔧 **Backend API:** [https://youlayer-api.onrender.com](https://youlayer-api.onrender.com)

![Made with Node.js](https://img.shields.io/badge/Backend-Node.js-green)
![Made with React](https://img.shields.io/badge/Frontend-React-blue)
![Database-MongoDB](https://img.shields.io/badge/Database-MongoDB-brightgreen)
![License-Proprietary](https://img.shields.io/badge/License-All--Rights--Reserved-red)
![Frontend Deployment](https://img.shields.io/website?url=https%3A%2F%2Fyoulayer.vercel.app)
![Backend API](https://img.shields.io/website?url=https%3A%2F%2Fyoulayer-api.onrender.com)

---

## 📑 Table of Contents

- [Overview](#-overview)
- [Problem It Solves](#-problem-it-solves)
- [Core Features](#-core-features)
- [Tech Stack](#️-tech-stack)
- [How It Works](#-how-it-works)
- [Deployment](#-deployment)
- [Demo Screenshots](#-demo-screenshots)
- [License](#-license-all-rights-reserved)
- [Contact](#-contact)

---

## 📌 Overview

**YouLayer** is a secure publishing layer built for YouTube creators who work with teams. It helps creators manage remote submissions from editors or managers — without giving them direct access to the YouTube account.

This avoids accidental uploads, copyright strikes, or demonetization risks, while making team collaboration smooth and secure.


---

## 🎬 View in Action

Want to see how YouLayer works in real-time?

👉 **Live App**: [https://youlayer.vercel.app](https://youlayer.vercel.app)  
🔐 *Use demo credentials or register with Google OAuth to explore.*

---

## 📺 YouTube Demo / Walkthrough

Get a complete walkthrough of the platform, features, and how it solves real problems for YouTube creators.

[![YouLayer Demo - Secure YouTube Publishing](https://img.youtube.com/vi/3ElNLQ1FfCU/0.jpg)](https://www.youtube.com/watch?v=3ElNLQ1FfCU)

> Click the thumbnail above to watch the full YouLayer tutorial on YouTube.

⏱️ **Highlights:**
- 00:00 – Introduction & Why YouLayer
- 01:20 – How the Role System Works (Creator vs Manager)
- 03:00 – Upload Workflow by Manager
- 04:30 – Review & Approve by Creator
- 05:15 – YouTube Integration & Final Publish

---

## 🎯 Problem It Solves

YouTube’s built-in roles (Manager, Editor) still allow others to upload and publish content — which is risky.  

Consequences of misuse:
- Accidental publishing of unfinished or wrong videos
- **Copyright strikes**
- **Demonetization**
- **Damage to brand reputation**

**YouLayer** solves this by:
- Allowing team members to upload video drafts remotely  
- Giving full control to the creator to review & approve videos before they are uploaded to YouTube  
- Removing the need to share YouTube login or editor access

---

## 🧩 Core Features

- **👥 Role-Based Access:**
  - **Creator:** Full control over publishing, reviews, and team.
  - **Manager:** Uploads draft videos, no YouTube access.

- **🔐 Secure Login:**
  - Google OAuth 2.0 to link YouTube account.
  - JWT-based login system.

- **✉️ Team Management:**
  - Creators invite managers via secure email links.
  - Tokenized invites ensure safe onboarding.

- **📤 Video Upload & Review:**
  - Managers upload draft videos + metadata (title, tags, description, thumbnail).
  - Videos stored on Backblaze (or any cloud).

- **✅ Review & Approval:**
  - Creators preview videos before publishing.
  - Only approved videos are uploaded to YouTube via API.

- **📩 Notifications:**
  - Email alerts sent when a new video is submitted.

- **☁️ Cloud Storage:**
  - Media stored in Backblaze B2 using signed URLs (reduces server load).

---

## 🛠️ Tech Stack

| Layer     | Technology                        |
|-----------|-----------------------------------|
| Frontend  | React.js, Context API, Tailwind CSS |
| Backend   | Node.js, Express.js               |
| Auth      | JWT, Google OAuth 2.0             |
| Database  | MongoDB                           |
| Storage   | Backblaze B2                      |
| APIs      | YouTube Data API v3               |
| Security  | AES encryption, role-based access |

---

## 🚀 How It Works

1. Creator signs up and links their YouTube channel.
2. Creator invites team members as managers via email.
3. Managers upload draft videos (remotely).
4. Creators review, approve or reject.
5. Only approved videos are uploaded automatically via API.

---

## ⚙️ Deployment

### 🌐 Frontend (Vercel)

```bash
# Push frontend code to GitHub
# Connect your repo on Vercel.com
# Set environment variables (REACT_APP_BACKEND_URL)
# Deploy!
````

### 🔧 Backend (Render.com)

```bash
# Push backend code to GitHub
# Go to render.com → New Web Service → Connect your repo
# Set environment variables:
  - MONGO_URI
  - JWT_SECRET
  - GOOGLE_CLIENT_ID / SECRET
  - CLOUD_STORAGE_KEYS (Backblaze or other)
# Deploy!
```

---

## 📸 Demo Screenshots

> Upload real UI screenshots or placeholder images in `/demo/` folder.

![Dashboard](demo/dashboard.png)
*Creator dashboard showing pending submissions*

![Video Upload](demo/upload.png)
*Manager interface for uploading draft video*

---

## 🔐 License (All Rights Reserved)

```
Copyright (c) 2025 Keshav Girase

All rights reserved.

This source code and all associated files are the intellectual property of the author.  
You are NOT permitted to copy, modify, share, distribute, or use any part of this codebase, in whole or in part, without prior written permission from the copyright holder.

Unauthorized use, reproduction, or distribution is strictly prohibited and may result in legal action.

For permissions, contact: keshavgirase007@gmail.com
```

---

## 📞 Contact

**Keshav Girase**
📧 [keshavgirase007@gmail.com](mailto:keshavgirase007@gmail.com)
🔗 [GitHub: Keshav-girase](https://github.com/Keshav-girase)

---

> *Built to empower creators to work securely with remote teams without ever risking their channel.*

