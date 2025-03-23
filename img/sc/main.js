fetch('img/sc/img.json')
  .then(response => response.json())
  .then(data => {
    const images = data.images;
    const randomIndex = Math.floor(Math.random() * images.length);
    const selectedImage = images[randomIndex];
    document.querySelector('.hero').style.background = `url('${selectedImage}') center/cover`;
  })
  .catch(error => console.error('Error loading images:', error));