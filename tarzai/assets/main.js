function saveMessage(role, text) {
    const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ role, text });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadMessages() {
    return JSON.parse(localStorage.getItem("chatHistory")) || [];
}

function displayMessages(chatBox) {
    const chatHistory = loadMessages();
    chatHistory.forEach(message => {
        const messageContainer = document.createElement("div");
        messageContainer.className = `message-container ${message.role}-container`;
        messageContainer.innerHTML = `
            <img src="${message.role === 'user' ? '../img/user.png' : '../img/faicon.png'}" class="profile-img" alt="${message.role}">
            <div class="message ${message.role}">${marked.parse(message.text)}</div>
        `;
        chatBox.appendChild(messageContainer);
    });
}

document.addEventListener("DOMContentLoaded", () => {
    const chatBox = document.getElementById("chat-box");
    displayMessages(chatBox);
});

async function sendMessage() {
    const chatBox = document.getElementById("chat-box");
    const userInput = document.getElementById("user-input");
    const text = userInput.value.trim();

    if (!text) return;

    const userMessageContainer = document.createElement("div");
    userMessageContainer.className = "message-container user-container";
    userMessageContainer.innerHTML = `
        <div class="message user">${marked.parse(text)}</div>
        <img src="../img/user.png" class="profile-img" alt="User">
    `;
    chatBox.appendChild(userMessageContainer);

    saveMessage("user", text);

    userInput.value = "";

    const loadingMessage = document.createElement("div");
    loadingMessage.className = "message-container ai-container";
    loadingMessage.innerHTML = `
        <img src="../img/faicon.png" class="profile-img" alt="AI">
        <div class="message ai">TarzAI Mengetik...</div>
    `;
    chatBox.appendChild(loadingMessage);
    chatBox.scrollTop = chatBox.scrollHeight;

    try {
        let reply;
        const greetings = ["halo", "hay", "p", "hi", "hai", "hello", "hy"];

        if (greetings.includes(text.toLowerCase())) {
            reply = "Hai, apa kabar? Saya adalah asisten TarzAI siap membantu!";
        } else if (text.toLowerCase().includes("developer kau siapa") || text.toLowerCase().includes("developermu siapa") || text.toLowerCase().includes("siapa pembuatmu")) {
            reply = "Saya dibuat oleh TarnaWijaya seorang programmer muda, yang sedang mengembangkan berbagai aplikasi dan chatbot!";
        } else if (text.toLowerCase().includes(".menu") || text.toLowerCase().includes("menu")) {
            reply = "All-Menu👇👇<br>.status :untuk melihat status admin<br>.get-apikey: untuk mendapatkan apikey secara gratis<br>.join-grup :untuk bergabung ke Grups WhatsApp<br>.down-app : download aplikasi";
        } else if (text.toLowerCase().includes(".join-grup")) {
            reply = "Join Grups WhatsApp:<br>`https://chat.whatsapp.com/Gomu4BhzluT3gaXRHmNs4n`";
        } else if (text.toLowerCase().includes(".status")) {
            reply = "<p>admin:</p><br>Tarna Wijaya";
        } else if (text.toLowerCase().includes(".down-app")) {
            reply = "Download apk ai:<br>`https://github.com/TarnaWijaya/Tarz-AI/releases/tag/Download-Apk`";
        } else if (text.toLowerCase().includes("siapa tarna") || text.toLowerCase().includes("siapa tarnawijaya") || text.toLowerCase().includes("siapakah tarna")) {
            reply = "TarnaWijaya adalah penciptaku, sosok yang hebat dalam bidang informatika menurut saya. Saya sangat kagum dengan kemampuannya membuat saya ini!";
        } else if (["nama", "nama kamu siapa", "siapa namamu", "siapa nama kau", "siapa namakau", "namamu"].includes(text.toLowerCase())) {
            reply = "Nama saya adalah TarzAI, yang dinamakan oleh developernya.";
        } else {
            const apiKey = "AIzaSyC0Cjd5U_kIM9tvqxfjjvQ_MlhabjtxA30";
            const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${apiKey}`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    contents: [{ parts: [{ text: text }] }]
                })
            });

            const data = await response.json();
            reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "AInya Error 🗿";
        }

        chatBox.removeChild(loadingMessage);

        const aiMessageContainer = document.createElement("div");
        aiMessageContainer.className = "message-container ai-container";
        aiMessageContainer.innerHTML = `
            <img src="../img/faicon.png" class="profile-img" alt="AI">
            <div class="message ai">${marked.parse(reply)}</div>
        `;
        chatBox.appendChild(aiMessageContainer);

        saveMessage("ai", reply);
    } catch (error) {
        console.error("Error:", error);
        chatBox.removeChild(loadingMessage);
        const errorMessage = document.createElement("div");
        errorMessage.className = "message-container ai-container";
        errorMessage.innerHTML = `
            <img src="../img/faicon.png" class="profile-img" alt="AI">
            <div class="message ai">Error: API gak bisa diakses.</div>
        `;
        chatBox.appendChild(errorMessage);
    }
    chatBox.scrollTop = chatBox.scrollHeight;
}

function clearChatHistory() {
    localStorage.removeItem("chatHistory");
    location.reload();
}