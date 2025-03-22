const audioPlayer = document.getElementById('audioPlayer');
const playlistEl = document.getElementById('playlist');
let currentAudioIndex = 0;
let audioList = [];
function loadAudioData() {
  fetch('assets/data/audio.json')
    .then(response => response.json())
    .then(data => {
      audioList = data;
      renderPlaylist();
      loadAudio(currentAudioIndex);
    })
    .catch(error => console.error('Error fetching audio data:', error));
}
function renderPlaylist() {
  playlistEl.innerHTML = '';
  audioList.forEach((audio, index) => {
    const li = document.createElement('li');
    li.textContent = audio.title;
    li.dataset.index = index;
    li.addEventListener('click', () => {
      currentAudioIndex = index;
      loadAudio(currentAudioIndex);
      updateActiveItem();
      audioPlayer.play();
    });
    playlistEl.appendChild(li);
  });
}
function loadAudio(index) {
  const audio = audioList[index];
  if (audio) {
    audioPlayer.src = audio.url;
  }
}
function updateActiveItem() {
  const items = playlistEl.querySelectorAll('li');
  items.forEach(item => item.classList.remove('active'));
  const currentItem = playlistEl.querySelector(`li[data-index="${currentAudioIndex}"]`);
  if (currentItem) currentItem.classList.add('active');
}
audioPlayer.addEventListener('ended', () => {
  currentAudioIndex = (currentAudioIndex + 1) % audioList.length;
  loadAudio(currentAudioIndex);
  updateActiveItem();
  audioPlayer.play();
});
loadAudioData();