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
import { FaBookOpen } from "react-icons/fa";
import { IoMdClose } from "react-icons/io";

import styles from "./iqraa.module.scss";
import SearchBar from "../search/searchBar";
import { delay, easeInOut, motion } from "framer-motion";

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
  const [selectedAyah, setSelectedAyah] = useState(null);
  const [highlightedAyahId, setHighlightedAyahId] = useState(null); // Test with a known Ayah ID
  const [tafsirPop, setTafsirPop] = useState(false);
  const [ayahPop, setAyahPop] = useState(false);

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

  const handleClickAyah = async (ayah) => {
    await getAyah(ayah?.number, reader?.identifier);
    setSelectedAyah(ayah);
    setHighlightedAyahId(ayah.number);
    setAyahPop(true);
  };

  const showTafsir = () => {
    setTafsirPop(true);
  };

  const stopAyahSound = (e) => {
    e.stopPropagation();
    if (ayah) {
      if (currentAudio) {
        currentAudio.pause();
        setPlayState(false);
        // currentAudio.currentTime = 0;
      }
    }
  };

  const playAyahSound = (e) => {
    e.stopPropagation();

    if (currentAudio) {
      // Check if the current audio is the same as the new audio
      if (currentAudio?.src === ayah?.audio) {
        if (currentAudio.paused) {
          currentAudio.play();
          setPlayState(true);
        } else {
          currentAudio.pause(); // Pause if currently playing
          setPlayState(false);
        }
        return; // Exit the function to avoid creating a new audio instance
      } else {
        // Pause and reset the current audio if it's a different one
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    // Handle new audio playback
    handleChangeReaderType("ayah");
    const audio = new Audio(ayah.audio);
    setCurrentAudio(audio);
    setPlayState(true);
    audio.play();

    // Handle when audio ends
    audio.onended = () => {
      setPlayState(false);
      setCurrentAudio(null);
    };
  };

  useEffect(() => {
    getTafsir(ayah?.surah?.number, ayah?.numberInSurah);
  }, [ayah]);

  const playSurahAudio = (surah) => {
    handleChangeReaderType("surah");

    if (currentAudio) {
      // Check if the current audio is the same as the new Surah
      const newAudioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${reader.identifier}/${surah.number}.mp3`;

      if (currentAudio.src === newAudioUrl) {
        if (currentAudio.paused) {
          currentAudio.play();
          setPlayState(true);
        } else {
          currentAudio.pause();
          setPlayState(false);
        }
        return; // Exit if toggling play/pause for the same Surah
      } else {
        // Pause and reset the current audio if switching to a new Surah
        currentAudio.pause();
        currentAudio.currentTime = 0;
      }
    }

    // Play new Surah audio
    const audioUrl = `https://cdn.islamic.network/quran/audio-surah/128/${reader.identifier}/${surah.number}.mp3`;
    const audio = new Audio(audioUrl);

    audio.onended = () => {
      setPlayState(false);
      setPlayingSurah(null);
    };

    setCurrentAudio(audio);
    setPlayingSurah(surah.number);
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
    if (!surah || !juz || !pageAyahs) {
      getSurah(1);
    }
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
        {/* //! main content */}
        <motion.div
          className={`${styles.iqraaContent} `}
          variants={{
            hidden: { opacity: 0 },
            show: { opacity: 1, transition: { staggerChildren: 0.3 } },
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className={styles.togglers}
            variants={{
              hidden: { opacity: 0, x: 50 },
              show: {
                opacity: 1,
                x: 0,
              },
              transition: { duration: 0.5, ease: "easeInOut" },
            }}
          >
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
          </motion.div>

          <motion.div
            className={styles.ayasContainer}
            variants={{
              hidden: { opacity: 0 },
              show: { opacity: 1, transition: { staggerChildren: 0.3 } },
            }}
            initial="hidden"
            whileInView="show"
            viewport={{ once: false, amount: 0.5 }}
          >
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
                <motion.div
                  className={styles.page}
                  key={page}
                  id="topPage"
                  variants={{
                    hidden: { opacity: 0 },
                    show: {
                      opacity: 1,
                      y: 0,
                      transition: { duration: 0.5, ease: "easeInOut" },
                    },
                  }}
                  initial="hidden"
                  whileInView="show"
                  viewport={{ once: false, amount: 0.3 }}
                >
                  <div className={styles.pageData}>
                    <div className={styles.pageNum}>Page {page}</div>
                    <div className={styles.pageNum} id={page}>
                      الجزء {groupedAyahs[page][0]?.juz} -{" "}
                      {groupedAyahs[page][0]?.surah?.name || activeView.name}
                    </div>
                    <div className={styles.pageNum}>
                      ربع الحزب {groupedAyahs[page][0]?.hizbQuarter}
                    </div>
                  </div>

                  {groupedAyahs[page].map((ayah) => {
                    // Basmala handling
                    const basmalaPatterns = [
                      "بِسۡمِ ٱللَّهِ ٱلرَّحۡمَـٰنِ ٱلرَّحِیم",
                      "بِسْمِ ٱللَّهِ ٱلرَّحْمَٰنِ ٱلرَّحِيمِ",
                    ];

                    const startsWithBasmala = basmalaPatterns.some((pattern) =>
                      ayah.text.startsWith(pattern)
                    );

                    const basmala = startsWithBasmala
                      ? basmalaPatterns.find((pattern) =>
                          ayah.text.startsWith(pattern)
                        )
                      : null;

                    const restOfAyah = startsWithBasmala
                      ? ayah.text.replace(basmala, "").trim()
                      : ayah.text;

                    return (
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
                        {/* Ayah Popup */}
                        {ayahPop && selectedAyah.number === ayah.number && (
                          <div className={styles.ayahPop}>
                            <span
                              className="tafseer"
                              onClick={() => {
                                showTafsir(selectedAyah);
                              }}
                            >
                              <FaBookOpen />
                            </span>
                            <span className="play">
                              {selectedAyah.number === ayah.number &&
                              playState ? (
                                <AiOutlinePauseCircle
                                  size={25}
                                  onClick={(e) => {
                                    stopAyahSound(e);
                                  }}
                                />
                              ) : (
                                <IoPlayCircleOutline
                                  size={25}
                                  onClick={(e) => {
                                    playAyahSound(e);
                                  }}
                                />
                              )}
                            </span>
                            <span>
                              <IoMdClose
                                size={25}
                                onClick={(e) => {
                                  e.stopPropagation(); // Prevent event propagation
                                  setAyahPop(false);
                                  setTafsirPop(false);
                                  stopAyahSound(e);
                                  if (currentAudio) {
                                    currentAudio.currentTime = 0;
                                  }
                                }}
                              />
                            </span>
                          </div>
                        )}

                        {basmala ? (
                          playingSurah ===
                            (ayah?.surah?.number || surah?.number) &&
                          playState ? (
                            <span className={styles.basmala}>
                              {" "}
                              <AiOutlinePauseCircle
                                size={28}
                                className="ms-3"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  pauseAudio();
                                }}
                              />
                              {basmala}
                            </span>
                          ) : (
                            <span className={styles.basmala}>
                              {" "}
                              <IoPlayCircleOutline
                                size={28}
                                className="ms-3"
                                onClick={(e) => {
                                  e.stopPropagation();

                                  playSurahAudio(ayah?.surah || surah);
                                }}
                              />
                              {basmala}
                            </span>
                          )
                        ) : (
                          ""
                        )}
                        <span>{restOfAyah}</span>

                        {ayah.sajda ? (
                          <FaMosque size={25} color={"#508dbc"} />
                        ) : (
                          ""
                        )}

                        {/* Ayah Number */}
                        <span className={styles.seperatable}>
                          <FaCircleNotch className={styles.seperatableIcon} />
                          <p className={styles.seperatablenum}>
                            {ayah.numberInSurah}
                          </p>
                        </span>
                      </span>
                    );
                  })}

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
                </motion.div>
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
          </motion.div>
        </motion.div>
        {/* //! off canvas */}
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
                            playSurahAudio(ele);
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
