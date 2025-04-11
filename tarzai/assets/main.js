let uploadedImages = [];

function saveMessage(role, text, images = []) {
  const chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
  // Gunakan URL.createObjectURL untuk masing-masing file
  const imageUrls = images.map(img => URL.createObjectURL(img));
  chatHistory.push({
    role,
    text,
    images: imageUrls,
    timestamp: new Date().toISOString()
  });
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
    
    let content = marked.parse(message.text);
    if (message.images && message.images.length > 0) {
      content += message.images.map(img =>
        `<img src="${img}" class="chat-image" alt="Uploaded image">`
      ).join('');
    }
    
    messageContainer.innerHTML = `
      <img src="${message.role === 'user' ? '../img/user.png' : '../img/faicon.png'}" class="profile-img" alt="${message.role}">
      <div class="message ${message.role}">${content}</div>
    `;
    chatBox.appendChild(messageContainer);
  });
  chatBox.scrollTop = chatBox.scrollHeight;
}

document.addEventListener("DOMContentLoaded", () => {
  const chatBox = document.getElementById("chat-box");
  displayMessages(chatBox);
});

async function sendMessage() {
  const chatBox = document.getElementById("chat-box");
  const userInput = document.getElementById("user-input");
  const sendBtn = document.getElementById("sendBtn");
  
  // Ambil teks dan cek apakah ada gambar
  let text = userInput.value.trim();
  const hasImages = uploadedImages.length > 0;
  
  // Set default prompt jika teks kosong
  if (!text && hasImages) text = "";
  else if (!text) text = "Apa itu?";
  
  // Simpan gambar yang akan diproses sebelum mereset uploadedImages
  const imagesForAPI = uploadedImages.slice();
  
  // Nonaktifkan tombol kirim
  sendBtn.disabled = true;
  
  // Tampilkan pesan pengguna
  const userMessageContainer = document.createElement("div");
  userMessageContainer.className = "message-container user-container";
  let userContent = marked.parse(text);
  
  if (hasImages) {
    userContent += imagesForAPI.map(img =>
      `<img src="${URL.createObjectURL(img)}" class="chat-image" alt="Uploaded image">`
    ).join('');
  }
  
  userMessageContainer.innerHTML = `
    <div class="message user">${userContent}</div>
    <img src="../img/user.png" class="profile-img" alt="User">
  `;
  chatBox.appendChild(userMessageContainer);
  
  // Simpan pesan dan reset input serta preview
  saveMessage("user", text, imagesForAPI);
  userInput.value = "";
  uploadedImages = [];
  document.getElementById("previewArea").innerHTML = "";
  
  // Tampilkan pesan loading AI
  const loadingMessage = document.createElement("div");
  loadingMessage.className = "message-container ai-container";
  loadingMessage.innerHTML = `
    <img src="../img/faicon.png" class="profile-img" alt="AI">
    <div class="message ai">TarzAI Mengetik<span class="loading-dots"></span></div>
  `;
  chatBox.appendChild(loadingMessage);
  chatBox.scrollTop = chatBox.scrollHeight;
  
  try {
    // Buat konten yang akan dikirim ke API (teks dan gambar)
    const parts = [{ text }];
    if (imagesForAPI.length > 0) {
      const imageParts = await Promise.all(imagesForAPI.map(convertImageToPart));
      parts.push(...imageParts);
    }
    const contents = [{ parts }];
    
    // Panggil API Gemini Pro Vision dengan data yang sesuai
    const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=AIzaSyC0Cjd5U_kIM9tvqxfjjvQ_MlhabjtxA30`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ contents })
    });
    
    const data = await response.json();
    const reply = data.candidates?.[0]?.content?.parts?.[0]?.text || "Tidak bisa melihat konten";
    
    // Hapus pesan loading dan tampilkan balasan AI
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
      <div class="message ai">Error: Gagal memproses permintaan</div>
    `;
    chatBox.appendChild(errorMessage);
  }
  
  chatBox.scrollTop = chatBox.scrollHeight;
  sendBtn.disabled = false;
}

// Fungsi helper untuk mengonversi gambar ke bagian inline untuk API
async function convertImageToPart(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const base64 = e.target.result.split(",")[1];
      resolve({
        inline_data: {
          mime_type: file.type,
          data: base64
        }
      });
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

function clearChatHistory() {
  localStorage.removeItem("chatHistory");
  location.reload();
}

// Handle upload gambar
const imageInput = document.getElementById("imageInput");
const previewArea = document.getElementById("previewArea");

imageInput.addEventListener("change", function() {
  previewArea.innerHTML = "";
  // Simpan file yang diupload
  uploadedImages = Array.from(this.files);
  
  uploadedImages.forEach(file => {
    if (!file.type.startsWith("image/")) return;
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const container = document.createElement("div");
      container.className = "preview-container";
      
      const img = document.createElement("img");
      img.src = e.target.result;
      
      const cancelBtn = document.createElement("button");
      cancelBtn.className = "cancel-btn";
      cancelBtn.innerHTML = "×";
      cancelBtn.onclick = () => {
        container.remove();
        // Hapus file dari uploadedImages
        uploadedImages = uploadedImages.filter(f => f !== file);
        if (previewArea.children.length === 0) imageInput.value = "";
      };
      
      container.appendChild(img);
      container.appendChild(cancelBtn);
      previewArea.appendChild(container);
    };
    reader.readAsDataURL(file);
  });
});