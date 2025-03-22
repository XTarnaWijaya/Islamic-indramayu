document.addEventListener("DOMContentLoaded", () => {
  const container = document.getElementById("weather-container");
  function fetchWeather() {
    const apiKey = "0fa590e5755750bfbe1f2d3d86a29010";
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Indramayu,ID&appid=${apiKey}&units=metric&lang=id`;
    
    fetch(url)
      .then(response => response.json())
      .then(data => {
        container.innerHTML = `
          <p><strong>Suhu:</strong> ${data.main.temp}°C</p>
          <p><strong>Cuaca:</strong> ${data.weather[0].description}</p>
          <p><strong>Kecepatan Angin:</strong> ${data.wind.speed} m/s</p>
        `;
      })
      .catch(error => {
        console.error("Error fetching weather data:", error);
        container.innerHTML = `<p>Error mengambil data cuaca.</p>`;
      });
  }
  fetchWeather();
  setInterval(fetchWeather, 600000);
});