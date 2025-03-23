function renderJavaneseCalendar() {
  const now = new Date();
  const currentYear = now.getFullYear();
  const currentMonth = now.getMonth();
  const currentDate = now.getDate();
  
  const year = now.getFullYear();
  const month = now.getMonth();
  const monthName = now.toLocaleString('id-ID', { month: 'long' });
  const header = '<h3>Kalender Jawa - ' + monthName + ' ' + year + '</h3>';
  const pasaranNames = ["Legi", "Pahing", "Pon", "Wage", "Kliwon"];
  const refDate = new Date(2000, 0, 1);
  
  let firstDay = new Date(year, month, 1);
  let lastDay = new Date(year, month + 1, 0);
  let daysInMonth = lastDay.getDate();
  
  let table = '<table><tr>';
  const weekdays = ['Ahad', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'];
  weekdays.forEach((day, index) => {
    if (index === now.getDay()) {
      table += '<th class="today-header">' + day + '</th>';
    } else {
      table += '<th>' + day + '</th>';
    }
  });
  table += '</tr><tr>';
  
  let startWeekday = firstDay.getDay();
  for (let i = 0; i < startWeekday; i++) {
    table += '<td></td>';
  }
  
  for (let d = 1; d <= daysInMonth; d++) {
    let date = new Date(year, month, d);
    const diffDays = Math.floor((date - refDate) / (1000 * 60 * 60 * 24));
    const pasaranIndex = (diffDays + 2) % 5;
    if (year === currentYear && month === currentMonth && d === currentDate) {
      table += '<td class="today">' + d + '<br><small>' + pasaranNames[pasaranIndex] + '</small></td>';
    } else {
      table += '<td>' + d + '<br><small>' + pasaranNames[pasaranIndex] + '</small></td>';
    }
    if ((startWeekday + d) % 7 === 0 && d !== daysInMonth) {
      table += '</tr><tr>';
    }
  }
  table += '</tr></table>';
  document.getElementById('javaneseCalendar').innerHTML = header + table;
}

renderJavaneseCalendar();