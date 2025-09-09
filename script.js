document.addEventListener("DOMContentLoaded", () => {
  const chatbotForm = document.getElementById("chatbot-form");
  const userInput = document.getElementById("user-input");
  const chatbotMessages = document.getElementById("chatbot-messages");
  const themeSwitcher = document.getElementById("theme-switcher");
  const newChatBtn = document.getElementById("new-chat-btn");
  const historyList = document.getElementById("history-list");
  const appContainer = document.getElementById("app-container");
  const backgroundOptions = document.querySelector(".background-options");
  const voiceInputBtn = document.getElementById("voice-input-btn");

const API_KEY = "your api key here";
 // IMPORTANT: Replace with your actual API key

  let currentChatId = null;
  let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || {};

  // --- Theme and UI Initialization ---
  const applyTheme = (theme) => {
    document.body.dataset.theme = theme;
    themeSwitcher.className = theme === "dark" ? "fas fa-sun" : "fas fa-moon";
    localStorage.setItem("theme", theme);
  };

  const applyBackground = (bg) => {
    if (bg === "default") {
      appContainer.style.backgroundImage = "none";
      appContainer.style.backgroundColor = "var(--body-bg)";
    } else {
      appContainer.style.backgroundImage = "none";
      appContainer.style.backgroundColor = bg;
    }
    localStorage.setItem("background", bg);
  };

  const savedTheme = localStorage.getItem("theme") || "light";
  applyTheme(savedTheme);

  const savedBg = localStorage.getItem("background") || "default";
  applyBackground(savedBg);

  // --- Chat History Functions ---
  const renderHistory = () => {
    historyList.innerHTML = "";
    Object.keys(chatHistory).forEach((id) => {
      const chat = chatHistory[id];
      const listItem = document.createElement("li");
      listItem.textContent = chat.title;
      listItem.dataset.id = id;
      if (id === currentChatId) {
        listItem.classList.add("active");
      }
      listItem.addEventListener("click", () => loadChat(id));
      historyList.appendChild(listItem);
    });
  };

  const loadChat = (id) => {
    if (!chatHistory[id]) return;
    currentChatId = id;
    chatbotMessages.innerHTML = "";
    chatHistory[id].messages.forEach((msg) => {
      addMessage(msg.text, msg.sender, false);
    });
    document.querySelector("#history-list .active")?.classList.remove("active");
    document
      .querySelector(`#history-list [data-id="${id}"]`)
      .classList.add("active");
  };

  const saveCurrentChat = (userMessage, botResponse) => {
    if (!currentChatId) {
      currentChatId = "chat_" + Date.now();
      chatHistory[currentChatId] = {
        title: userMessage.substring(0, 30) + "...",
        messages: [
          {
            text: "Hello! I'm your DSA Instructor. Ask me anything about Data Structures and Algorithms!",
            sender: "bot-message",
          },
        ],
      };
    }
    chatHistory[currentChatId].messages.push({
      text: userMessage,
      sender: "user-message",
    });
    chatHistory[currentChatId].messages.push({
      text: botResponse,
      sender: "bot-message",
    });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
    renderHistory();
  };

  // --- Message Handling Functions ---
  const parseMarkdown = (text) => {
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>");
  };

  const addTypingIndicator = () => {
    if (document.getElementById("typing-indicator")) return;
    const typingIndicator = document.createElement("div");
    typingIndicator.classList.add("message", "bot-message", "typing");
    typingIndicator.textContent = "Typing...";
    typingIndicator.id = "typing-indicator";
    chatbotMessages.appendChild(typingIndicator);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;
  };

  const removeTypingIndicator = () => {
    document.getElementById("typing-indicator")?.remove();
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    const userMessage = userInput.value.trim();
    if (userMessage === "") return;

    addMessage(userMessage, "user-message");
    userInput.value = "";
    addTypingIndicator();

    try {
      const response = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${API_KEY}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: userMessage }] }],
          }),
        }
      );

      if (!response.ok) throw new Error(`API Error: ${response.statusText}`);

      const data = await response.json();
      removeTypingIndicator();

      const botResponse =
        data.candidates?.[0]?.content?.parts?.[0]?.text ||
        "Sorry, I couldn't get a response. Please try again.";
      addMessage(botResponse, "bot-message");
      saveCurrentChat(userMessage, botResponse);
    } catch (error) {
      removeTypingIndicator();
      console.error("Error:", error);
      addMessage(
        "An error occurred. Please check the console and your API key.",
        "bot-message"
      );
    }
  };

  // --- Event Listeners ---
  chatbotForm.addEventListener("submit", handleFormSubmit);

  themeSwitcher.addEventListener("click", () => {
    const newTheme = document.body.dataset.theme === "dark" ? "light" : "dark";
    applyTheme(newTheme);
  });

  newChatBtn.addEventListener("click", () => {
    currentChatId = null;
    chatbotMessages.innerHTML = "";
    addMessage(
      "Hello! I'm your DSA Instructor. How can I help you start this new chat?",
      "bot-message",
      false
    );
    document.querySelector("#history-list .active")?.classList.remove("active");
  });

  backgroundOptions.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      applyBackground(e.target.dataset.bg);
    }
  });

  // 🎤 Voice Input
  let isRecording = false;

  if ("webkitSpeechRecognition" in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;

    voiceInputBtn.addEventListener("click", () => {
      if (!isRecording) {
        recognition.start();
        voiceInputBtn.classList.add("recording");
      } else {
        recognition.stop();
        voiceInputBtn.classList.remove("recording");
      }
      isRecording = !isRecording;
    });

    recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      userInput.value = transcript;
      voiceInputBtn.classList.remove("recording");
      isRecording = false;
    };
  }

  // Character Counter
  userInput.addEventListener("input", () => {
    const length = userInput.value.length;
    document.querySelector(".char-counter").textContent = `${length}/500`;
    if (length > 500) {
      userInput.value = userInput.value.substring(0, 500);
    }
  });

  // Export Chat
  document.getElementById("export-chat").addEventListener("click", () => {
    const messages = Array.from(chatbotMessages.children)
      .map((msg) => {
        const text = msg.textContent;
        const type = msg.classList.contains("user-message") ? "User" : "Bot";
        return `${type}: ${text}\n`;
      })
      .join("\n");

    const blob = new Blob([messages], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "chat-history.txt";
    a.click();
    URL.revokeObjectURL(url);
  });

  // Clear Chat
  document.getElementById("clear-chat").addEventListener("click", () => {
    if (confirm("Are you sure you want to clear the chat?")) {
      chatbotMessages.innerHTML = "";
      addMessage(
        "Hello! I'm your DSA Instructor. How can I help you?",
        "bot-message"
      );
      currentChatId = null;
    }
  });

  // ✅ Final addMessage function (only once!)
  const addMessage = (message, className, animate = true) => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", className);

    const messageContent = document.createElement("div");
    messageContent.classList.add("message-content");
    messageContent.innerHTML = parseMarkdown(message);

    const timestamp = document.createElement("div");
    timestamp.classList.add("message-time");
    timestamp.textContent = new Date().toLocaleTimeString();

    const actions = document.createElement("div");
    actions.classList.add("message-actions");
    actions.innerHTML = `
        <button class="action-btn copy-btn" title="Copy"><i class="fas fa-copy"></i></button>
        <button class="action-btn delete-btn" title="Delete"><i class="fas fa-trash"></i></button>
    `;

    messageElement.appendChild(messageContent);
    messageElement.appendChild(timestamp);
    messageElement.appendChild(actions);

    if (!animate) messageElement.style.animation = "none";
    chatbotMessages.appendChild(messageElement);
    chatbotMessages.scrollTop = chatbotMessages.scrollHeight;

    // Add event listeners for actions
    actions.querySelector(".copy-btn").addEventListener("click", () => {
      navigator.clipboard.writeText(message);
    });

    actions.querySelector(".delete-btn").addEventListener("click", () => {
      messageElement.remove();
    });
  };
});
