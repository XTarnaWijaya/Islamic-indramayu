document.addEventListener('DOMContentLoaded', () => {
    const navbarToggle = document.querySelector('.navbar-toggle'); 
    const navbar = document.querySelector('.navbar');
    const navLinks = document.querySelectorAll('.navbar a'); 
    navbarToggle.addEventListener('click', () => {
        navbar.classList.toggle('active');
    });
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navbar.classList.contains('active')) {
                navbar.classList.remove('active');
            }
        });
    });
    const loadBacaan = async () => {
        try {
            const response = await fetch('assets/data/bacaan.json');
            const data = await response.json();
            const container = document.getElementById('bacaan-container');
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<h3>${item.judul}</h3><p>${item.deskripsi}</p><a href="${item.link}" target="_blank" class="btn">Baca Selengkapnya</a>`;
                container.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading bacaan:', error);
        }
    };
    const loadStreaming = async () => {
        try {
            const response = await fetch('assets/data/streaming.json');
            const data = await response.json();
            const container = document.getElementById('streaming-container');
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<div class="video-container"><iframe width="100%" height="200" src="${item.link}" frameborder="0" allowfullscreen></iframe></div><h3>${item.judul}</h3>`;
                container.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading streaming:', error);
        }
    };
    const loadTilawah = async () => {
        try {
            const response = await fetch('assets/data/tilawah.json');
            const data = await response.json();
            const container = document.getElementById('tilawah-container');
            data.forEach(item => {
                const card = document.createElement('div');
                card.className = 'card';
                card.innerHTML = `<h3>${item.judul}</h3><audio controls><source src="${item.link}" type="audio/mpeg"></audio>`;
                container.appendChild(card);
            });
        } catch (error) {
            console.error('Error loading tilawah:', error);
        }
    };
    const searchInput = document.getElementById('searchInput');
    searchInput.addEventListener('keyup', function () {
      const filter = searchInput.value.toLowerCase();
      const sections = document.querySelectorAll('section');
      sections.forEach(section => {
        section.style.display = section.innerText.toLowerCase().includes(filter) ? "" : "none";
      });
    });

    loadBacaan();
    loadStreaming();
    loadTilawah();
});
