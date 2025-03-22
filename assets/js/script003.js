document.addEventListener("DOMContentLoaded", () => {  
  const container = document.getElementById("weather-container");  

  function convertUnixTimestampToTime(unixTimestamp) {
    const date = new Date(unixTimestamp * 1000);
    const hours = date.getHours();
    const minutes = "0" + date.getMinutes();
    return `${hours}:${minutes.substr(-2)}`;
  }

  function changeBackground(condition) {
    switch (condition) {
      case "Clear": document.body.style.backgroundColor = "#87CEEB"; break;
      case "Clouds": document.body.style.backgroundColor = "#B0C4DE"; break;
      case "Rain": document.body.style.backgroundColor = "#708090"; break;
      case "Snow": document.body.style.backgroundColor = "#F0F8FF"; break;
      case "Thunderstorm": document.body.style.backgroundColor = "#2F4F4F"; break;
      default: document.body.style.backgroundColor = "#FFF";
    }
  }

  function fetchWeather() {  
    const apiKey = "0fa590e5755750bfbe1f2d3d86a29010";  
    const url = `https://api.openweathermap.org/data/2.5/weather?q=Indramayu,ID&appid=${apiKey}&units=metric&lang=id`;  

    fetch(url)
      .then(response => response.json())
      .then(data => {
        changeBackground(data.weather[0].main);

        container.innerHTML = `
          <p><strong>Suhu:</strong> ${data.main.temp}°C</p>
          <p><strong>Cuaca:</strong> ${data.weather[0].description}</p>
          <img src="https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png" alt="${data.weather[0].description}">
          <p><strong>Kelembapan:</strong> ${data.main.humidity}%</p>
          <p><strong>Tekanan Udara:</strong> ${data.main.pressure} hPa</p>
          <p><strong>Kecepatan Angin:</strong> ${data.wind.speed} m/s</p>
          <p><strong>Matahari Terbit:</strong> ${convertUnixTimestampToTime(data.sys.sunrise)} WIB</p>
          <p><strong>Matahari Terbenam:</strong> ${convertUnixTimestampToTime(data.sys.sunset)} WIB</p>
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