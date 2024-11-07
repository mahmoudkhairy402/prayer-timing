// QuranContext.js
import React, { createContext, useState, useEffect } from "react";
import axios from "axios";

const QuranContext = createContext();

const QuranProvider = ({ children }) => {
  const [quranMeta, setQuranMeta] = useState(null);
  const [surah, setSurah] = useState(null);
  const [juz, setJuz] = useState(null);
  const [readers, setReaders] = useState([]);
  const [ayah, setAyah] = useState(null);
  const [tafsir, setTafsir] = useState(null);
  const [pageAyahs, setPageAyahs] = useState(null);
  const [surahAudio, setSurahAudio] = useState(null);
  const [searchResults, setSearchResults] = useState([]); // New state for search results

  const searchQuran = async (query) => {
    try {
      const response = await axios.get(
        `https://api.quran.com/api/v4/search?query=${query}`
      );
      console.log(
        "🚀 ~ searchQuran ~ response:",
        response?.data?.search?.results
      );
      setSearchResults(response?.data?.search?.results); // Set search results
    } catch (error) {
      console.error("Error fetching search results:", error);
    }
  };

  useEffect(() => {
    const fetchQuranMeta = async () => {
      const response = await axios.get("https://api.alquran.cloud/v1/meta");
      setQuranMeta(response.data.data);
    };
    fetchQuranMeta();
  }, []);

  const getSurah = async (surahNumber) => {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/surah/${surahNumber}`
    );
    setSurah(response.data.data);
  };

  const getReaders = async (type) => {
    if (type === "ayah") {
      const response = await axios.get(
        "https://api.alquran.cloud/v1/edition?format=audio&language=ar"
      );
      setReaders(response.data.data);
    } else if (type === "surah") {
      const response = await axios.get(
        "https://raw.githubusercontent.com/islamic-network/cdn/master/info/cdn_surah_audio.json"
      );
      setReaders(response.data);
    }
  };

  //المشكله ان في شيوخ شفاله مع السور ومش شفاله مع الايات والعكس و هنثبت السور دلوقتي علي العقاسي لحد منحلها
  // https://raw.githubusercontent.com/islamic-network/cdn/master/info/cdn_surah_audio.json

  const getAyah = async (ayahNumber, readerIdentifier) => {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${ayahNumber}/${readerIdentifier}`
    );
    setAyah(response.data.data);
  };

  const getAyahWithSurah = async (
    surahNumber,
    ayahNumber,
    readerIdentifier
  ) => {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/ayah/${surahNumber}:${ayahNumber}/${readerIdentifier}`
    );
    setAyah(response.data.data);
  };

  const getTafsir = async (surahNumber, numberInSurah) => {
    const response = await axios.get(
      `https://quranenc.com/api/v1/translation/aya/arabic_moyassar/${surahNumber}/${numberInSurah}`
    );
    setTafsir(response.data.result);
  };

  const getPageAyahs = async (pageNumber) => {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/page/${pageNumber}/quran-uthmani`
    );
    setPageAyahs(response.data.data);
  };

  const getJuz = async (juzNumber) => {
    const response = await axios.get(
      `https://api.alquran.cloud/v1/juz/${juzNumber}/quran-uthmani`
    );
    setJuz(response.data.data);
  };

  const getSurahAudio = async (surahNumber, readerIdentifier) => {
    const surahAudioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${readerIdentifier}/${surahNumber}.mp3`;
    setSurahAudio(surahAudioUrl);
  };

  return (
    <QuranContext.Provider
      value={{
        quranMeta,
        surah,
        readers,
        ayah,
        tafsir,
        pageAyahs,
        juz,
        surahAudio,
        getSurah,
        getReaders,
        getAyah,
        getAyahWithSurah,
        getTafsir,
        getPageAyahs,
        getJuz,
        getSurahAudio,
        searchQuran,
        searchResults,
      }}
    >
      {children}
    </QuranContext.Provider>
  );
};

export { QuranProvider, QuranContext };
