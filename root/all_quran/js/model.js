export const API_URL = "https://api.quran.com/api/v4/";

export async function fetchSurahs() {
  try {
    const response = await fetch(API_URL + "chapters");
    const data = await response.json();
    return data.chapters;
  } catch (error) {
    console.error("Error fetching Surahs:", error);
    return [];
  }
}

export async function fetchAyahs(surahId) {
  try {
    const response = await fetch(
      `${API_URL}verses/by_chapter/${surahId}?fields=text_uthmani,translations&translations=131&per_page=300`,
    );
    const data = await response.json();

    return data.verses.map((ayah) => ({
      key: ayah.verse_key,
      text: ayah.text_uthmani || "No text available",
      translation:
        ayah.translations && ayah.translations.length > 0
          ? ayah.translations[0].text
          : "Translation not available",
    }));
  } catch (error) {
    console.error("Error fetching Ayahs:", error);
    return [];
  }
}
