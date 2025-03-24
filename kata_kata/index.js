const wordDisplay = document.getElementById("word-display");

async function KataKata() {
  try {
    const response = await fetch("kata_kata/index.json");
    const data = await response.json();
    const words = data.words;

    function shuffle(array) {
      for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
      }
      return array;
    }

    let shuffledWords = shuffle([...words]);
    let currentIndex = 0;

    function showRandomWord() {
      wordDisplay.textContent = shuffledWords[currentIndex];
      currentIndex++;
      if (currentIndex >= shuffledWords.length) {
        shuffledWords = shuffle([...words]);
        currentIndex = 0;
      }
    }

    showRandomWord();
    setInterval(showRandomWord, 10000);

  } catch (error) {
    console.error("Gagal memuat kata-kata:", error);
  }
}

KataKata();
