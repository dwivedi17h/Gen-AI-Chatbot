# 🤖 AI Chatbot (Gemini Model)

An intelligent chatbot built with **Google Gemini API** that can handle both **casual conversations** and **technical queries (Data Structures & Algorithms, CS topics, etc.)**.
This project is simple, lightweight, and runs entirely in the **browser** using HTML, CSS, and JavaScript.

---

## ✨ Features

* 💬 Chat with AI for **general knowledge & casual conversations**.
* 🧑‍💻 Ask **technical questions (DSA, programming, computer science)** and get clear answers.
* ⚡ Powered by **Google Gemini model** via **AI Studio API**.
* 🎨 Clean and responsive **UI with HTML + CSS**.
* 🌍 Runs directly in the **browser** (no backend required).

---

## 🛠️ Tech Stack

* **Frontend** → HTML, CSS, JavaScript
* **AI Model** → Google Gemini (via AI Studio API)

---

## 🚀 Getting Started

### 1️⃣ Clone the repository

```bash
git clone https://github.com/your-username/ai-chatbot.git
cd ai-chatbot
```

### 2️⃣ Add your API Key

Create a file `script.js` (or edit the existing one) and replace with your API key:

```js
const API_KEY = "YOUR_GOOGLE_API_KEY";
```

⚠️ **Note:** Never expose your real API key in production apps. For learning/demo purposes, this is fine.

### 3️⃣ Open in Browser

Just open `chatbot.html` in any modern browser and start chatting 🎉

---

## 📂 Project Structure

```
├── chatbot.html   # Main UI
├── style.css      # Styling
├── script.js      # Chatbot logic (calls Gemini API)
└── README.md      # Documentation
```

---

## 🧠 Example Query

**User:** Why is India famous?
**AI:** India is famous for its cultural diversity, history, festivals, yoga, cuisine, and advancements in technology.

**User:** Explain QuickSort algorithm.
**AI:** QuickSort is a divide-and-conquer algorithm that selects a pivot, partitions the array, and recursively sorts the subarrays. Its average time complexity is O(n log n).

---

## 🌱 Future Enhancements

* Add **voice input/output** (speech-to-text & text-to-speech).
* Store chat history in **localStorage / database**.
* Deploy online with **Netlify / Vercel**.
* Improve UI with animations.

---

## 🤝 Contributing

Pull requests are welcome! Feel free to fork this repo and add new features.

---

## 📜 License

This project is licensed under the **MIT License**.
