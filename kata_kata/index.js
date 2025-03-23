const wordDisplay = document.getElementById("word-display");

async function KataKata() {
  try {
    const response = await fetch("kata_kata/index.json");
    const data = await response.json();
    const words = data.words;
    
    function showRandomWord() {
      const randomIndex = Math.floor(Math.random() * words.length);
      wordDisplay.textContent = words[randomIndex];
    }
    
    showRandomWord();
    setInterval(showRandomWord, 15000);
  } catch (error) {
    console.error("Gagal memuat kata-kata:", error);
  }
}

KataKata();