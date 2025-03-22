import { fetchSurahs, fetchAyahs } from "./model.js";
import {
  displaySurahs,
  updateAyahs,
  showSurahTitle,
  showSurahList,
} from "./view.js";

let currentAyahs = [];
let currentPage = 0;
const ayahsPerPage = 10;

async function loadSurahs() {
  const surahs = await fetchSurahs();
  displaySurahs(surahs, fetchAndDisplayAyahs);
}

async function fetchAndDisplayAyahs(surahId, surahName) {
  currentAyahs = await fetchAyahs(surahId);
  currentPage = 0;
  showSurahTitle(surahName);
  updateAyahs(currentAyahs, currentPage, ayahsPerPage);
}

function changePage(direction) {
  currentPage += direction;
  updateAyahs(currentAyahs, currentPage, ayahsPerPage);
}

document
  .getElementById("prevBtn")
  .addEventListener("click", () => changePage(-1));
document
  .getElementById("nextBtn")
  .addEventListener("click", () => changePage(1));
document.getElementById("backBtn").addEventListener("click", showSurahList);
document.getElementById("backToTopBtn").addEventListener("click", function () {
  window.scrollTo({
    top: 0,
    behavior: "smooth",
  });
});

loadSurahs();
