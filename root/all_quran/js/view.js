export function displaySurahs(surahs, onSurahClick) {
  const container = document.getElementById("surahList");
  container.innerHTML = "";

  surahs.forEach((surah) => {
    const div = document.createElement("div");
    div.classList.add("surah");
    div.innerHTML = `<strong>${surah.id}. ${surah.name_simple} (${surah.translated_name.name})</strong>`;
    div.onclick = () => onSurahClick(surah.id, surah.name_simple);
    container.appendChild(div);
  });
}

export function updateAyahs(ayahs, currentPage, ayahsPerPage) {
  const container = document.getElementById("ayahs");
  container.innerHTML = "";

  let start = currentPage * ayahsPerPage;
  let end = Math.min(start + ayahsPerPage, ayahs.length);
  let pageAyahs = ayahs.slice(start, end);

  pageAyahs.forEach((ayah) => {
    const div = document.createElement("div");
    div.classList.add("ayah");

    div.innerHTML = `
            <p class="arabic"><strong>(${ayah.key.split(":")[1]})</strong>   ${
              ayah.text
            }</p>
            <p class="translation">${ayah.translation}</p>
        `;
    container.appendChild(div);
  });

  document.getElementById("prevBtn").disabled = currentPage === 0;
  document.getElementById("nextBtn").disabled =
    start + ayahsPerPage >= ayahs.length;
}

export function showSurahTitle(name) {
  document.getElementById("surahTitle").innerText = `Surah ${name}`;
  document.getElementById("surahList").classList.add("hidden");
  document.getElementById("ayahContainer").classList.remove("hidden");
}

export function showSurahList() {
  document.getElementById("surahList").classList.remove("hidden");
  document.getElementById("ayahContainer").classList.add("hidden");
}
