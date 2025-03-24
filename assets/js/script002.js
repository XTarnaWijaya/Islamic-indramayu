(async function() {  
  async function getPrayerTimes() {  
    try {  
      const response = await fetch('https://api.aladhan.com/v1/timingsByCity?city=Indramayu&country=Indonesia&method=20');  
      const data = await response.json();  
      return data.data;  
    } catch (error) {  
      console.error('Error fetching data:', error);  
      return null;  
    }  
  }  
    
  function parseTime(timeStr, baseDate = new Date()) {  
    return new Date(`${baseDate.toDateString()} ${timeStr}`);  
  }  
    
  function addMinutes(date, minutes) {  
    return new Date(date.getTime() + minutes * 60000);  
  }  
    
  async function updateSchedule() {  
    const prayerData = await getPrayerTimes();  
    if (!prayerData) return;  
    const timings = prayerData.timings;  
    const now = new Date();  
    const sahurTime = parseTime("02:30", now);
      
    const imsakTime = addMinutes(parseTime(timings.Fajr, now), -10);  
    const subuhTime = parseTime(timings.Fajr, now);  
    const terbitTime = parseTime(timings.Sunrise, now);  
    const dzuhurTime = parseTime(timings.Dhuhr, now);  
    const asharTime = parseTime(timings.Asr, now);  
    const maghribTime = parseTime(timings.Maghrib, now);  
    const terbenamTime = addMinutes(maghribTime, -5);  
    const isyaTime = parseTime(timings.Isha, now);  
    const istirahatTime = addMinutes(isyaTime, 15);  
      
    const mandatoryPrayers = [
      { name: 'Sahur', time: sahurTime }, 
      { name: 'Imsak', time: imsakTime },  
      { name: 'Subuh', time: subuhTime },  
      { name: 'Terbit', time: terbitTime },  
      { name: 'Dzuhur', time: dzuhurTime },  
      { name: 'Ashar', time: asharTime },  
      { name: 'Terbenam', time: terbenamTime },  
      { name: 'Maghrib', time: maghribTime },  
      { name: 'Isya', time: isyaTime },
      { name: 'Istirahat | Tidur', time: istirahatTime }
    ];  
      
    const dhuhaStart = addMinutes(terbitTime, 30);  
    const dhuhaEnd = addMinutes(dzuhurTime, -30);  
    const tahajudStart = addMinutes(isyaTime, 30);  
    const tahajudEnd = addMinutes(subuhTime, -30);  
      
    const sunnahPrayers = [  
      { name: 'Dhuha', start: dhuhaStart, end: dhuhaEnd, display: `${dhuhaStart.toLocaleTimeString()} - ${dhuhaEnd.toLocaleTimeString()}` },  
      { name: 'Tahajud', start: tahajudStart, end: tahajudEnd, display: `${tahajudStart.toLocaleTimeString()} - ${tahajudEnd.toLocaleTimeString()}` },  
      { name: 'Rawatib', display: 'Sebelum atau sesudah sholat wajib' },  
      { name: 'Witir', display: 'Setelah sholat Isya' },  
      { name: 'Tasbih', display: 'Di waktu bebas' },  
      { name: 'Istisqa', display: 'Saat membutuhkan hujan' },  
      { name: 'Tarawih', display: 'Setelah sholat Isya (Ramadan)' },  
      { name: 'Tahiyatul Masjid', display: 'Saat tiba di masjid' },  
      { name: 'Sholat Gerhana (Khusuf & Kusuf)', display: 'Saat terjadi gerhana' },  
      { name: 'Sholat Awwabin', display: 'Setelah Maghrib' },  
      { name: 'Sholat Mutlaq', display: 'Di waktu bebas' },  
      { name: 'Sholat Hajat', display: 'Di waktu bebas' },  
      { name: 'Sholat Taubat', display: 'Di waktu bebas' }  
    ];  
      
    const activeStyle = 'background-color: #a5d6a7; color: #1b5e20;';  
      
    const scheduleBox = document.getElementById('schedule');  
    if (scheduleBox) {  
      scheduleBox.innerHTML = `  
        <h2><br>Waktu Wajib</h2>  
        ${mandatoryPrayers.map(prayer => {  
          const preWindow = addMinutes(prayer.time, -10);  
          const postWindow = addMinutes(prayer.time, 10);  
          const isActive = now >= preWindow && now <= postWindow;  
          return `  
            <div class="prayer-time" style="${isActive ? activeStyle : ''}">  
              <div class="prayer-name">${prayer.name}</div>  
              <div class="prayer-hour">${prayer.time.toLocaleTimeString()}</div>  
            </div>  
          `;  
        }).join('')}  
        <h2><br>Waktu Sunnah</h2>  
        ${sunnahPrayers.map(prayer => {  
          let style = '';  
          if (prayer.start && prayer.end) {  
            style = (now >= prayer.start && now <= prayer.end) ? activeStyle : '';  
          }  
          return `  
            <div class="prayer-time" style="${style}">  
              <div class="prayer-name">${prayer.name}</div>  
              <div class="prayer-hour">${prayer.display}</div>  
            </div>  
          `;  
        }).join('')}  
        <div class="update-info">  
          Tanggal: ${prayerData.date.gregorian.date} | Hijriah: ${prayerData.date.hijri.date} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year} | Update terakhir: ${new Date().toLocaleTimeString()}  
        </div>  
      `;  
    } else {  
      console.log('Waktu Wajib:');  
      mandatoryPrayers.forEach(prayer => {  
        const preWindow = addMinutes(prayer.time, -10);  
        const postWindow = addMinutes(prayer.time, 10);  
        const isActive = now >= preWindow && now <= postWindow;  
        console.log(`${prayer.name}: ${prayer.time.toLocaleTimeString()} ${isActive ? '(ACTIVE)' : ''}`);  
      });  
      console.log('Waktu Sholat Sunnah:');  
      sunnahPrayers.forEach(prayer => {  
        if (prayer.start && prayer.end) {  
          const isActive = now >= prayer.start && now <= prayer.end;  
          console.log(`${prayer.name}: ${prayer.display} ${isActive ? '(ACTIVE)' : ''}`);  
        } else {  
          console.log(`${prayer.name}: ${prayer.display}`);  
        }  
      });  
      console.log(`Tanggal: ${prayerData.date.gregorian.date} | Hijriah: ${prayerData.date.hijri.date} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year}`);  
    }  
  }  
    
  function autoUpdate() {  
    updateSchedule();  
    setInterval(updateSchedule, 60000);  
  }  
    
  document.addEventListener('DOMContentLoaded', autoUpdate);  
})();