function updateClock() {
  const now = new Date();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');
  const clockEl = document.getElementById('clock');
  clockEl.innerText = hours + ':' + minutes + ':' + seconds;
  clockEl.classList.remove('fade');
  void clockEl.offsetWidth;
  clockEl.classList.add('fade');
}

updateClock();
setInterval(updateClock, 1000);