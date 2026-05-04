# 🤖 AI Chatbot

A modern AI chatbot built with **Next.js** and **Tailwind CSS**, powered by the **Groq API**, and deployed on **Vercel**.

🌐 **Live Demo:** https://ai-chatbot-sand-five-30.vercel.app/

---

## 🚀 Tech Stack

- ⚡ Next.js (App Router)
- ⚛️ React
- 🎨 Tailwind CSS
- 🧠 Groq API (LLM backend)
- ☁️ Vercel (Deployment)

---

## 📦 Getting Started

Follow these steps to run the project locally.

### 1. Clone the Repository

```bash
git clone https://github.com/DiluTharushika/ai-chatbot.git
cd ai-chatbot
````

### 2. Install Dependencies

```bash
npm install
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory and add:

```env
GROQ_API_KEY=your_groq_api_key_here
```

🔒 **Important:** Never commit your `.env.local` file or expose your API keys.

### 4. Run the Development Server

```bash
npm run dev
```

Open 👉 [http://localhost:3000](http://localhost:3000) in your browser.

---

## 🌍 Deployment

This project is deployed on **Vercel** with automatic CI/CD.

🔁 Every push to the `main` branch triggers a new deployment.

### Deploy Your Own Version

1. Fork or clone this repository to your GitHub account
2. Go to [https://vercel.com](https://vercel.com) and create a new project
3. Import your repository
4. Add the environment variable:

   * `GROQ_API_KEY`
5. Click **Deploy**

---

## 📁 Project Structure

```bash
├── app/            # Next.js app directory
├── components/     # Reusable UI components
├── public/         # Static assets
├── styles/         # Global styles
└── .env.local      # Environment variables (not committed)
```

---

## 🛡️ License

This project is intended for **learning and demonstration purposes**.
Feel free to fork, customize, and build upon it.

---

## 💡 Acknowledgements

* Next.js
* Tailwind CSS
* Groq
* Vercel

---

⭐ If you found this project useful, consider giving it a star on GitHub!

```
```
