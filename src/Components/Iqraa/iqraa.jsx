import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { QuranContext } from "../../ContextApi/QuranContext";
import { FaCircleNotch } from "react-icons/fa6";
import { LiaQuranSolid } from "react-icons/lia";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { FaArrowTurnUp } from "react-icons/fa6";

import { FaBookQuran } from "react-icons/fa6";
import { AiOutlinePauseCircle } from "react-icons/ai";
import { IoPlayCircleOutline } from "react-icons/io5";
import { FaMosque } from "react-icons/fa";

import styles from "./iqraa.module.scss";
import SearchBar from "../search/searchBar";

export default function Iqraa() {
  const [active, setActive] = useState("surah");
  const [readerType, setReadertype] = useState("ayah");
  const [reader, setReader] = useState({
    identifier: "ar.husary",
    language: "ar",
    name: "محمود خليل الحصري",
    englishName: "Husary",
    format: "audio",
    type: "versebyverse",
    direction: null,
  });
  const [activeView, setActiveView] = useState({});
  const [searchQuery, setSearchQuery] = useState("");
  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingSurah, setPlayingSurah] = useState(null); // Track the currently playing Surah
  const [playState, setPlayState] = useState(false);
  const [tafsirPop, setTafsirPop] = useState(false);
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [highlightedAyahId, setHighlightedAyahId] = useState(null); // Test with a known Ayah ID

  const {
    quranMeta,
    getSurah,
    getReaders,
    getAyah,
    getAyahWithSurah,
    getTafsir,
    getPageAyahs,
    getJuz,
    getSurahAudio,
    surah,
    readers,
    ayah,
    tafsir,
    pageAyahs,
    juz,
    surahAudio,
  } = useContext(QuranContext);

  const handleNextPage = () => {
    const currentPageNumber = pageAyahs?.number;
    if (currentPageNumber < 604) {
      getPageAyahs(currentPageNumber + 1);
    } else {
      getPageAyahs(1);
    }
  };

  const handlePreviousPage = () => {
    const currentPageNumber = pageAyahs?.number;
    if (currentPageNumber > 1) {
      getPageAyahs(currentPageNumber - 1);
    } else {
      getPageAyahs(604);
    }
  };
  const handleNextSurah = () => {
    const currentSurahNumber = surah?.number;
    if (currentSurahNumber < 114) {
      getSurah(currentSurahNumber + 1);
    } else {
      getSurah(1);
    }
  };

  const handlePreviousSurah = () => {
    const currentSurahNumber = surah?.number;
    if (currentSurahNumber > 1) {
      getSurah(currentSurahNumber - 1);
    } else {
      getSurah(114);
    }
  };

  const handleNextJuz = () => {
    const currentJuzNumber = juz?.number;
    if (currentJuzNumber < 30) {
      getJuz(currentJuzNumber + 1);
    } else {
      getJuz(1);
    }
  };

  const handlePreviousJuz = () => {
    const currentJuzNumber = juz?.number;
    if (currentJuzNumber > 1) {
      getJuz(currentJuzNumber - 1);
    } else {
      getJuz(30);
    }
  };

  const changeActive = (active) => {
    setActive(active);
  };
  const handleChangeReader = (reader) => {
    setReader(reader);
  };

  const handleClickAyah = (ayah) => {
    //
    handleChangeReaderType("ayah");

    getAyah(ayah?.number, reader?.identifier);
    setSelectedAyah(ayah);
    setHighlightedAyahId(ayah.number);
    setTafsirPop(true);
  };

  useEffect(() => {
    if (ayah) {
      if (currentAudio) {
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
      getTafsir(ayah?.surah?.number, ayah?.numberInSurah);
      const audio = new Audio(ayah?.audio);
      setCurrentAudio(audio);
      audio.play();
    }
  }, [ayah]);

  const playSurahAudio = (surahNumber) => {
    handleChangeReaderType("surah");
    if (currentAudio) {
      currentAudio.pause();
      setCurrentAudio(null);
    }

    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${reader.identifier}/${surahNumber}.mp3`;
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      setPlayState(false);
      setPlayingSurah(null);
    };

    setCurrentAudio(audio);
    setPlayingSurah(surahNumber);
    setPlayState(true);
    audio.play();
  };

  const pauseAudio = () => {
    if (currentAudio) {
      currentAudio.pause();
      setPlayState(false);
    }
  };

  useEffect(() => {
    getSurah(1);
  }, []);

  useEffect(() => {
    getReaders(readerType);
  }, [readerType]);

  useEffect(() => {
    if (active === "surah" && surah) {
      setActiveView(surah);
    } else if (active === "juz" && juz) {
      setActiveView(juz);
    } else if (active === "page" && pageAyahs) {
      setActiveView(pageAyahs);
    }
  }, [surah, juz, pageAyahs, active]);

  const handleSearchChange = (event) => {
    setSearchQuery(event.target.value);
  };

  const filteredSurahs = quranMeta?.surahs?.references?.filter((ele) =>
    ele.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredJuzs = Array.from({ length: 30 }, (_, i) => ({
    number: i + 1,
  })).filter((ele) => `juz ${ele.number}`.includes(searchQuery.toLowerCase()));

  const filteredPages = Array.from({ length: 604 }, (_, i) => ({
    number: i + 1,
  })).filter((ele) => `page ${ele.number}`.includes(searchQuery.toLowerCase()));

  const groupAyahsByPage = (ayahs) => {
    return ayahs.reduce((pages, ayah) => {
      if (!pages[ayah.page]) {
        pages[ayah.page] = [];
      }
      pages[ayah.page].push(ayah);
      return pages;
    }, {});
  };

  const groupedAyahs = groupAyahsByPage(activeView.ayahs || []);
  useEffect(() => {
    if (readers && readers.length > 0) {
      setReader(readers[0]);
    }
  }, [readerType, readers]);

  const handleChangeReaderType = async (type) => {
    setReadertype(type);
  };

  return (
    <>
      <div id="iqraa" className={`${styles.iqraa}`}>
        <div className={`${styles.iqraaContent} `}>
          <div className={styles.togglers}>
            <button
              className={styles.togleCanvas}
              type="button"
              data-bs-toggle="offcanvas"
              data-bs-target="#offcanvasWithBothOptions"
              aria-controls="offcanvasWithBothOptions"
            >
              {active == "surah"
                ? `${activeView.name} | ${activeView.revelationType} | ${activeView.englishName}`
                : ""}
              <FaMosque className="mx-1" size={25} />
            </button>
          </div>

          <div className={styles.ayasContainer}>
            {tafsirPop && selectedAyah && (
              <div className={styles.tafsirPopup}>
                <button
                  className="btn btn-close text-bg-light"
                  onClick={() => setTafsirPop(false)}
                ></button>

                <p>{tafsir?.arabic_text}</p>
                <p>{tafsir?.translation}</p>
              </div>
            )}
            {Object.keys(groupedAyahs).length > 0 ? (
              Object.keys(groupedAyahs).map((page) => (
                <div className={styles.page} key={page} id="topPage">
                  <div className={styles.pageData}>
                    <div className={styles.pageNum}>Page {page}</div>
                    <div className={styles.pageNum} id={page}>
                      الجزء {groupedAyahs[page][0]?.juz}
                    </div>
                    <div className={styles.pageNum}>
                      ربع الحزب {groupedAyahs[page][0]?.hizbQuarter}
                    </div>
                  </div>
                  {groupedAyahs[page].map((ayah) => (
                    <span
                      onClick={() => {
                        handleClickAyah(ayah);
                      }}
                      className={
                        ayah.number === highlightedAyahId
                          ? `${styles.ayah} ${styles.highlighted}`
                          : `${styles.ayah}`
                      }
                      key={ayah.number}
                    >
                      {ayah.text}
                      {ayah.sajda ? (
                        <FaMosque size={25} color={"#508dbc"} />
                      ) : (
                        ""
                      )}

                      <span className={styles.seperatable}>
                        <FaCircleNotch className={styles.seperatableIcon} />
                        <p className={styles.seperatablenum}>
                          {" "}
                          {ayah.numberInSurah}
                        </p>
                      </span>
                    </span>
                  ))}
                  <div className={styles.pageData}>
                    {active == "page" ? (
                      <div className={styles.pagesSlider}>
                        <div className={styles.slide} onClick={handleNextPage}>
                          <IoIosArrowDropright />
                        </div>
                        <div
                          className={styles.slide}
                          onClick={handlePreviousPage}
                        >
                          <IoIosArrowDropleft />
                        </div>
                      </div>
                    ) : (
                      <div className={styles.pagesSlider}>
                        <a className={styles.slide} href={`#${+page + 1}`}>
                          <IoIosArrowDropright />
                        </a>
                        <a className={styles.slide} href={`#${page - 1}`}>
                          <IoIosArrowDropleft />
                        </a>
                      </div>
                    )}
                  </div>
                  {/* {page == Object.keys(groupedAyahs).length ? "" : ""} */}
                </div>
              ))
            ) : (
              <p className="mx-auto my-20px w-100">
                Please select something to read
              </p>
            )}
            {active == "surah" ? (
              <div className={styles.pageFooter}>
                <span className={styles.surahSliderParent}>
                  <span
                    onClick={handleNextSurah}
                    className={styles.surahSlider}
                    href="#topPage"
                  >
                    next surah
                  </span>
                  {surah?.name}
                  <span
                    onClick={handlePreviousSurah}
                    className={styles.surahSlider}
                  >
                    prev surah
                  </span>
                </span>
                <a className={styles.upBtn} href="#topPage">
                  <FaArrowTurnUp />
                </a>
              </div>
            ) : active == "juz" ? (
              <div className={styles.pageFooter}>
                <span className={styles.surahSliderParent}>
                  <span onClick={handleNextJuz} className={styles.surahSlider}>
                    juz {juz?.number == 30 ? 1 : juz?.number + 1}
                  </span>
                  <span
                    onClick={handlePreviousJuz}
                    className={styles.surahSlider}
                  >
                    juz {juz?.number == 1 ? 30 : juz?.number - 1}
                  </span>
                </span>
                <a className={styles.upBtn} href="#topPage">
                  <FaArrowTurnUp />
                </a>
              </div>
            ) : (
              ""
            )}
          </div>
        </div>
        <div
          className={`offcanvas offcanvas-end  ${styles.canvas}`}
          data-bs-scroll="true"
          tabIndex="-1"
          id="offcanvasWithBothOptions"
          aria-labelledby="offcanvasWithBothOptionsLabel"
        >
          <div className="offcanvas-header d-flex justify-content-between p-0">
            <a className="logoContainer" href="#">
              <img src={logo} alt="logo" />
            </a>
            <button
              type="button"
              className="btn-close m-0"
              data-bs-dismiss="offcanvas"
              aria-label="Close"
            ></button>
          </div>
          <SearchBar
            setActive={setActive}
            setHighlightedAyahId={setHighlightedAyahId}
            highlightedAyahId={highlightedAyahId}
          />
          <hr className="mt-0" />
          <div className=" p-0 m-0">
            <div className="d-flex w-100">
              <span className="dropdown ">
                <button
                  className={`${styles.togleCanvas}  dropdown-toggle`}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  نوع القراءه
                </button>
                <ul className={`dropdown-menu ${styles.redersUl}`}>
                  <li
                    className={`dropdown-item ${styles.redersLi}`}
                    onClick={() => {
                      handleChangeReaderType("surah");
                    }}
                  >
                    قارئ السوره
                  </li>
                  <li
                    className={`dropdown-item ${styles.redersLi}`}
                    onClick={() => {
                      handleChangeReaderType("ayah");
                    }}
                  >
                    قارئ الايه
                  </li>
                </ul>
              </span>
              <span className="dropdown">
                <button
                  className={`${styles.togleCanvas}  dropdown-toggle`}
                  type="button"
                  data-bs-toggle="dropdown"
                  aria-expanded="false"
                >
                  {reader?.name}
                  <LiaQuranSolid className="mx-1" size={25} />
                  {/* <FaMosque className="mx-1" size={25} /> */}
                </button>
                <ul className={`dropdown-menu ${styles.redersUl}`}>
                  {readers ? (
                    readers?.map((reader) => {
                      return (
                        <li
                          className={`dropdown-item ${styles.redersLi}`}
                          key={reader?.identifier}
                          onClick={() => {
                            handleChangeReader(reader);
                          }}
                        >
                          {reader.name}
                        </li>
                      );
                    })
                  ) : (
                    <li key={reader?.identifier}>
                      <a class="dropdown-item" href="#">
                        Loading...
                      </a>
                    </li>
                  )}
                </ul>
              </span>
            </div>
            <div className={styles.filter}>
              <div
                className={
                  active === "juz"
                    ? `${styles.juz} ${styles.active}`
                    : `${styles.juz}`
                }
                onClick={() => changeActive("juz")}
              >
                الجزء
              </div>
              <div
                className={
                  active === "surah"
                    ? `${styles.surah} ${styles.active}`
                    : `${styles.surah}`
                }
                onClick={() => changeActive("surah")}
              >
                السورة
              </div>
              <div
                className={
                  active === "page"
                    ? `${styles.page} ${styles.active}`
                    : `${styles.page}`
                }
                onClick={() => changeActive("page")}
              >
                الصفحة
              </div>
            </div>
            <form action="" className={styles.search}>
              <input
                type="text"
                name="search"
                placeholder={`search ${active}`}
                value={searchQuery}
                onChange={handleSearchChange}
              />
            </form>
            <ul className={styles.searchResult}>
              {active === "surah" && filteredSurahs
                ? filteredSurahs.map((ele, index) => (
                    <li
                      className="d-flex justify-content-between align-items-center"
                      onClick={() => {
                        getSurah(ele.number);
                      }}
                      key={ele.number}
                    >
                      <p>{`${ele.name} | ${ele.englishName}`}</p>{" "}
                      {playingSurah === ele.number && playState ? (
                        <AiOutlinePauseCircle
                          size={25}
                          onClick={() => {
                            pauseAudio();
                          }}
                        />
                      ) : (
                        <IoPlayCircleOutline
                          size={25}
                          onClick={() => {
                            playSurahAudio(ele.number);
                          }}
                        />
                      )}
                    </li>
                  ))
                : active === "juz" && filteredJuzs
                ? filteredJuzs.map((ele, index) => (
                    <li
                      onClick={() => {
                        getJuz(ele.number);
                      }}
                      key={index}
                    >{`juz ${ele.number}`}</li>
                  ))
                : active === "page" && filteredPages
                ? filteredPages.map((ele, index) => (
                    <li
                      onClick={() => {
                        getPageAyahs(ele.number);
                      }}
                      key={index}
                    >{`page ${ele.number}`}</li>
                  ))
                : "network error"}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
