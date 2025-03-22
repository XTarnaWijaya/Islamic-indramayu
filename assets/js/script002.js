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

async function updateSchedule() {
    const prayerData = await getPrayerTimes();
    if (!prayerData) return;

    const timings = prayerData.timings;
    const scheduleBox = document.getElementById('schedule');
    const now = new Date();
    
    const prayers = [
        { name: 'Subuh', time: timings.Fajr },
        { name: 'Dzuhur', time: timings.Dhuhr },
        { name: 'Ashar', time: timings.Asr },
        { name: 'Maghrib', time: timings.Maghrib },
        { name: 'Isya', time: timings.Isha },
        { name: 'Terbit', time: timings.Sunrise }
    ];

    scheduleBox.innerHTML = prayers.map(prayer => {
        const prayerTime = new Date(`${now.toDateString()} ${prayer.time}`);
        const isActive = now > prayerTime && now < new Date(prayerTime.getTime() + 600000);

        return `
            <div class="prayer-time ${isActive ? 'active' : ''}">
                <div class="prayer-name">${prayer.name}</div>
                <div class="prayer-hour">${prayer.time}</div>
            </div>
        `;
    }).join('');

    document.getElementById('last-update').textContent = 
        `Tanggal: ${prayerData.date.gregorian.date} | Update terakhir: ${new Date().toLocaleTimeString()}`;
    
    document.getElementById('hijri-date').textContent = 
        `Hijriah: ${prayerData.date.hijri.date} ${prayerData.date.hijri.month.en} ${prayerData.date.hijri.year}`;
}

function autoUpdate() {
    updateSchedule();
    setInterval(updateSchedule, 60000);
}
document.addEventListener('DOMContentLoaded', function() {
    autoUpdate();
});