// SearchBar.js
import React, { useContext, useState } from "react";
import { QuranContext } from "../../ContextApi/QuranContext";

import styles from "../Iqraa/iqraa.module.scss";
const SearchBar = ({ setActive, setHighlightedAyahId, highlightedAyahId }) => {
  const {
    searchQuran,
    searchResults,
    ayah,
    getAyahWithSurah,
    getPageAyahs,
    pageAyahs,
  } = useContext(QuranContext);

  const [query, setQuery] = useState("");
  const [timeoutId, setTimeoutId] = useState(null);

  const handleSearchInput = (e) => {
    const value = e.target.value;
    setQuery(value);
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    const newTimeoutId = setTimeout(async () => {
      await searchQuran(value);
    }, 500);

    setTimeoutId(newTimeoutId);
  };
  const handleSubmitSearch = async (e) => {
    e.preventDefault();
    await searchQuran(query);
  };
  const handleClickAyah = async (result) => {
    await getAyahWithSurah(
      parseInt(result.verse_key.split(":")[0]),
      parseInt(result.verse_key.split(":")[1])
    );

    if (ayah?.page) {
      await getPageAyahs(ayah.page);
    }

    if (pageAyahs && pageAyahs.ayahs) {
      pageAyahs.ayahs.forEach((ayah) => {
        ayah.highlighted = false;
      });

      const matchedAyah = pageAyahs.ayahs.find(
        (ayah) => ayah.number === result.verse_id
      );
      console.log("🚀 ~ handleClickAyah ~ pageAyahs:", pageAyahs);
      console.log("🚀 ~ handleClickAyah ~ matchedAyah:", matchedAyah);

      if (matchedAyah) {
        matchedAyah.highlighted = true;
      }
    }
    await setActive("page");

    setHighlightedAyahId(result.verse_id);
  };

  return (
    <div style={{ padding: "10px" }}>
      <form onSubmit={handleSubmitSearch} className={styles.search}>
        <input
          type="text"
          value={query}
          onChange={handleSearchInput}
          className="w-100 mx-auto"
          placeholder="Search in Quran..."
        />
        {/* <button type="submit" style={{ padding: "8px" }}>
          Search
        </button> */}
      </form>

      {searchResults && searchResults.length > 0 && (
        <div style={{ marginTop: "20px" }}>
          <p className="me-auto text-dark">
            Search Results: {searchResults.length}
          </p>
          <ul style={{ listStyleType: "none", padding: 0 }}>
            {searchResults.map((result, index) => (
              <li
                key={index}
                style={{
                  marginBottom: "10px",
                  borderBottom: "1px solid #ccc",
                  paddingBottom: "10px",
                  cursor: "pointer",
                }}
                onClick={() => {
                  handleClickAyah(result);
                }}
              >
                <p>
                  <strong>
                    Surah {result.surah_name} Ayah {result.verse_key}:
                  </strong>{" "}
                  {result.text}
                </p>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default SearchBar;
