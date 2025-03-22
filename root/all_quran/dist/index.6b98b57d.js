const t = "https://api.quran.com/api/v4/";
async function e() {
  try {
    let e = await fetch(t + "chapters");
    return (await e.json()).chapters;
  } catch (t) {
    return console.error("Error fetching Surahs:", t), [];
  }
}
async function n(e) {
  try {
    let n = await fetch(
      `${t}verses/by_chapter/${e}?fields=text_uthmani,translations&translations=131&per_page=300`,
    );
    return (await n.json()).verses.map((t) => ({
      key: t.verse_key,
      text: t.text_uthmani || "No text available",
      translation:
        t.translations && t.translations.length > 0
          ? t.translations[0].text
          : "Translation not available",
    }));
  } catch (t) {
    return console.error("Error fetching Ayahs:", t), [];
  }
}
function a(t, e, n) {
  let a = document.getElementById("ayahs");
  a.innerHTML = "";
  let s = e * n,
    i = Math.min(s + n, t.length);
  t.slice(s, i).forEach((t) => {
    let e = document.createElement("div");
    e.classList.add("ayah"),
      (e.innerHTML = `
            <p class="arabic"><strong>(${t.key.split(":")[1]})</strong>   ${t.text}</p>
            <p class="translation">${t.translation}</p>
        `),
      a.appendChild(e);
  }),
    (document.getElementById("prevBtn").disabled = 0 === e),
    (document.getElementById("nextBtn").disabled = s + n >= t.length);
}
let s = [],
  i = 0;
async function r() {
  !(function (t, e) {
    let n = document.getElementById("surahList");
    (n.innerHTML = ""),
      t.forEach((t) => {
        let a = document.createElement("div");
        a.classList.add("surah"),
          (a.innerHTML = `<strong>${t.id}. ${t.name_simple} (${t.translated_name.name})</strong>`),
          (a.onclick = () => e(t.id, t.name_simple)),
          n.appendChild(a);
      });
  })(await e(), c);
}
async function c(t, e) {
  (s = await n(t)),
    (i = 0),
    (document.getElementById("surahTitle").innerText = `Surah ${e}`),
    document.getElementById("surahList").classList.add("hidden"),
    document.getElementById("ayahContainer").classList.remove("hidden"),
    a(s, i, 10);
}
function d(t) {
  (i += t), a(s, i, 10);
}
document.getElementById("prevBtn").addEventListener("click", () => d(-1)),
  document.getElementById("nextBtn").addEventListener("click", () => d(1)),
  document.getElementById("backBtn").addEventListener("click", function () {
    document.getElementById("surahList").classList.remove("hidden"),
      document.getElementById("ayahContainer").classList.add("hidden");
  }),
  document
    .getElementById("backToTopBtn")
    .addEventListener("click", function () {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }),
  r();
//# sourceMappingURL=index.6b98b57d.js.map
