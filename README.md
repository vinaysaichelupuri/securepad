Got it ✅ — here’s a **clean and detailed README.md** you can include in your project repo:

---

# 🔐 SecurePad – Password Protected Text Pad

SecurePad is a **password-protected online text editor** built with **React + Firebase**.
It lets you **store, edit, and access text securely** with a futuristic **black + neon blue theme**, smooth animations, and responsive design.

---

## ✨ Features

* 🔑 **Authentication** – Login with Firebase Authentication (email/password).
* 📝 **Secure Text Pad** – Write or paste text in a large editor.
* ☁️ **Cloud Storage** – Auto-save text to **Firebase Firestore**.
* ⚡ **Animations** – Smooth transitions and glowing effects with Framer Motion.
* 🎨 **Theme** – Pure black background with neon blue accents.
* 📱 **Responsive** – Works across desktop, tablet, and mobile.

---

## 🖥️ Tech Stack

* **Frontend:** React (Vite or CRA)
* **Styling:** TailwindCSS
* **Animations:** Framer Motion
* **Backend/DB:** Firebase Authentication + Firestore
* **Hosting:** Firebase Hosting

---

## 📂 Project Structure

```
securepad/
│── public/              # Static assets
│── src/
│   ├── components/      # UI components
│   ├── firebase.ts           # Login, Editor, Error pages
│   ├── App.tsx          # Routes and main app
│   ├── index.tsx        # Entry point
│── .env                 # Firebase config (API keys)
│── tailwind.config.js   # Tailwind setup
│── package.json
│── README.md
```

---

## ⚙️ Setup & Installation

1. **Clone the repo**

   ```bash
   git clone https://github.com/vinaysaichelupuri/securepad.git
   cd securepad
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Setup Firebase**

   * Go to [Firebase Console](https://console.firebase.google.com/)
   * Create a project
   * Enable **Authentication → Email/Password**
   * Enable **Firestore Database**
   * Copy your config from Firebase and paste it into `.env`

   Example `.env`:

   ```env
   VITE_FIREBASE_API_KEY=your_api_key
   VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your_project_id
   VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
   VITE_FIREBASE_APP_ID=your_app_id
   ```

4. **Run the project**

   ```bash
   npm run dev
   ```

5. **Deploy (Optional)**

   ```bash
   npm install -g firebase-tools
   firebase login
   firebase init hosting
   firebase deploy
   ```

---

## 🚀 Usage

1. Open the site.
2. Enter your password/login.
3. Start typing/pasting text in the editor.
4. Your text is auto-saved to Firestore.
5. Logout when done.

---

## 🎨 Theme & Design

* Background: **Pure Black (#000000)**
* Accent: **Neon Blue (#00FFFF or #1E90FF)**
* Font: Modern sans-serif (Inter / Poppins)
* Effects: Glow, hover scale, smooth transforms

---
