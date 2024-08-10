import React, { useContext, useEffect, useState } from "react";
import logo from "../../assets/logo.png";
import { QuranContext } from "../../ContextApi/QuranContext";
import { FaCircleNotch } from "react-icons/fa6";
import { LiaQuranSolid } from "react-icons/lia";
import { IoIosArrowDropright, IoIosArrowDropleft } from "react-icons/io";
import { FaBookQuran } from "react-icons/fa6";
import { AiOutlinePauseCircle } from "react-icons/ai";
import { IoPlayCircleOutline } from "react-icons/io5";

import styles from "./iqraa.module.scss";

export default function Iqraa() {
  const [active, setActive] = useState("surah");
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
  console.log("🚀 ~ Iqraa ~ tafsirPop:", tafsirPop);
  const [selectedAyah, setSelectedAyah] = useState(null);

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
  console.log("🚀 ~ Iqraa ~ tafsir:", tafsir);
  console.log("🚀 ~ Iqraa ~ ayah:", ayah);
  console.log("🚀 ~ Iqraa ~ readers:", readers);

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
      getSurah(114);
    }
  };

  const handlePreviousSurah = () => {
    const currentSurahNumber = surah?.number;
    if (currentSurahNumber > 1) {
      getSurah(currentSurahNumber - 1);
    } else {
      getSurah(1);
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
    // console.log("🚀🚀🚀 ~ handleClickAyah ~ ayah:", ayah);
    getAyah(ayah?.number, reader?.identifier);
    setSelectedAyah(ayah);
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
    setReader({
      identifier: "ar.alafasy",
      language: "ar",
      name: "مشاري العفاسي",
      englishName: "Alafasy",
      format: "audio",
      type: "versebyverse",
      direction: null,
    });

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
    getReaders();
  }, []);

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
  console.log("🚀 ~ Iqraa ~ groupedAyahs:", groupedAyahs);

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
              <LiaQuranSolid className="ms-1" size={25} />
            </button>

            <span className="dropdown">
              <button
                className={`${styles.togleCanvas}  dropdown-toggle`}
                type="button"
                data-bs-toggle="dropdown"
                aria-expanded="false"
              >
                {reader?.name}
                <FaBookQuran className="ms-1" size={25} />
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

          <div className={styles.ayasContainer}>
            {Object.keys(groupedAyahs).length > 0 ? (
              Object.keys(groupedAyahs).map((page) => (
                <div className={styles.page} key={page}>
                  {groupedAyahs[page].map((ayah) => (
                    <span
                      onClick={() => {
                        handleClickAyah(ayah);
                      }}
                      className={styles.ayah}
                      key={ayah.number}
                    >
                      {/* {tafsirPop && selectedAyah && (
                        <div className={styles.tafsirPopup}>
                          <button
                            className="btn btn-close"
                            onClick={() => setTafsirPop(false)}
                          ></button>

                          <p>{tafsir?.text}</p>
                        </div>
                      )} */}
                      {ayah.text}
                      <span className={styles.seperatable}>
                        <FaCircleNotch className={styles.seperatableIcon} />
                        <p className={styles.seperatablenum}>
                          {" "}
                          {ayah.numberInSurah}
                        </p>
                      </span>
                    </span>
                  ))}
                  {/* {page == Object.keys(groupedAyahs).length ? "" : ""} */}
                  <div className={styles.pageData}>
                    <div className={styles.pageNum} id={page}>
                      Page {page}
                    </div>
                    <div className={styles.pageNum} id={page}>
                      الجزء {groupedAyahs[page][0]?.juz}
                    </div>
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
                        <a className={styles.slide} href={`#${page}`}>
                          <IoIosArrowDropright />
                        </a>
                        <a className={styles.slide} href={`#${page - 2}`}>
                          <IoIosArrowDropleft />
                        </a>
                      </div>
                    )}
                  </div>
                </div>
              ))
            ) : (
              <p className="mx-auto my-20px w-100">
                Please select something to read
              </p>
            )}
            {active == "surah" ? (
              <div className={styles.surahSliderParent}>
                <span onClick={handleNextSurah} className={styles.surahSlider}>
                  next surah
                </span>
                {surah?.name}
                <span
                  onClick={handlePreviousSurah}
                  className={styles.surahSlider}
                >
                  prev surah
                </span>
              </div>
            ) : active == "juz" ? (
              <div className={styles.surahSliderParent}>
                <span onClick={handleNextJuz} className={styles.surahSlider}>
                  juz {juz?.number == 30 ? 1 : juz?.number + 1}
                </span>
                <span
                  onClick={handlePreviousJuz}
                  className={styles.surahSlider}
                >
                  juz {juz?.number == 1 ? 30 : juz?.number - 1}
                </span>
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
          <div className=" p-0 m-0">
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
            <ul>
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
