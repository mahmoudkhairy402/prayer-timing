import React, { useEffect, useState } from "react";
import axios from "axios";
import moment from "moment";
import PrayerCard from "../card/Card";
import fajr from "../../assets/fajr-prayer.png";
import duhr from "../../assets/dhhr-prayer-mosque.png";
import asr from "../../assets/asr-prayer-mosque.png";
import magrip from "../../assets/sunset-prayer-mosque.png";
import ishaa from "../../assets/night-prayer-mosque.png";
import styles from "./mainContent.module.scss";
import { delay, easeInOut, motion } from "framer-motion";

function MainComponent() {
  const [timing, setTiming] = useState({
    Fajr: "",
    Dhuhr: "",
    Asr: "",
    Maghrib: "",
    Isha: "",
  });

  const [date, setDate] = useState("");
  const [timezone, setTimezone] = useState("Africa/Cairo");
  const [location, setLocation] = useState({ city: "Cairo", country: "Egypt" });
  const [timer, setTimer] = useState("");
  const [nextPrayerIndex, setnextPrayerIndex] = useState(0);

  let prayerArray = [
    { key: "Fajr", displayName: "الفجر" },
    { key: "Dhuhr", displayName: "الظهر" },
    { key: "Asr", displayName: "العصر" },
    { key: "Maghrib", displayName: "المغرب" },
    { key: "Isha", displayName: "العشاء" },
  ];

  let getTiming = () => {
    axios
      .get(
        `https://api.aladhan.com/v1/timingsByCity?city=${location.city}&country=${location.country}`
      )
      .then((res) => {
        console.log(res.data.data.timings);
        setTiming(res.data.data.timings);
        setTimezone(res.data.data.meta.timezone);
        console.log(res.data.data.meta.timezone);
      })
      .catch((err) => console.log(err));
  };

  const time = new Date();
  useEffect(() => {
    getTiming();
  }, [location]);

  useEffect(() => {
    let interval = setInterval(() => {
      countDownTimer();
    }, 1000);

    const options = {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
      hour12: true,
      timeZone: `${timezone}`,
    };
    const arabicDateTime = time.toLocaleString("ar", options);
    setDate(arabicDateTime);

    return () => {
      clearInterval(interval);
    };
  }, [timing]);

  // const countDownTimer = () => {
  //   let timeNow = moment();
  //   let Fajr = moment(timing["Fajr"], "hh:mm");
  //   let Dhuhr = moment(timing["Dhuhr"], "hh:mm");
  //   let Asr = moment(timing["Asr"], "hh:mm");
  //   let Maghrib = moment(timing["Maghrib"], "hh:mm");
  //   let Isha = moment(timing["Isha"], "hh:mm");

  //   // console.log(timeNow.isAfter(Fajr));
  //   let prayerIndex = null;
  //   if (timeNow.isAfter(Fajr) && timeNow.isBefore(Dhuhr)) {
  //     // console.log("next is duhr");
  //     prayerIndex = 1;
  //   } else if (timeNow.isAfter(Dhuhr) && timeNow.isBefore(Asr)) {
  //     // console.log("next is Asr");
  //     prayerIndex = 2;
  //   } else if (timeNow.isAfter(Asr) && timeNow.isBefore(Maghrib)) {
  //     // console.log("next is Maghrib");
  //     prayerIndex = 3;
  //   } else if (timeNow.isAfter(Maghrib) && timeNow.isBefore(Isha)) {
  //     // console.log("next is Isha");

  //     prayerIndex = 4;
  //   } else {
  //     console.log("next is Fajr");
  //     prayerIndex = 0;
  //   }
  //   setnextPrayerIndex(prayerIndex);
  //   let nextPrayerTime = timing[prayerArray[prayerIndex].key];
  //   // console.log(
  //   //   "🚀 ~ file: MainComponent.jsx:116 ~ countDownTimer ~ nextPrayerTime:",
  //   //   nextPrayerTime
  //   // );
  //   let remainTime = moment(nextPrayerTime, "hh:mm").diff(timeNow);

  //   if (remainTime < 0) {
  //     const midNightDiff = moment("11:59:59", "hh:mm:ss").diff(timeNow);
  //     const FajrToMidNightDiff = moment(nextPrayerTime, "hh:mm").diff(
  //       moment("00:00:00", "hh:mm:ss")
  //     );
  //     let fajrRemainTime = midNightDiff + FajrToMidNightDiff;
  //     remainTime = fajrRemainTime;
  //   }

  //   let remainTimeDuration = moment.duration(remainTime);
  //   setTimer(
  //     `${remainTimeDuration.hours()}:${remainTimeDuration.minutes()}:${remainTimeDuration.seconds()}`
  //   );
  // };
  const countDownTimer = () => {
    let timeNow = moment();
    let Fajr = moment(timing["Fajr"], "HH:mm");
    let Dhuhr = moment(timing["Dhuhr"], "HH:mm");
    let Asr = moment(timing["Asr"], "HH:mm");
    let Maghrib = moment(timing["Maghrib"], "HH:mm");
    let Isha = moment(timing["Isha"], "HH:mm");

    let prayerIndex = null;
    let nextPrayerTime = null;

    if (timeNow.isBefore(Fajr)) {
      prayerIndex = 0; // Next is Fajr
      nextPrayerTime = Fajr;
    } else if (timeNow.isBefore(Dhuhr)) {
      prayerIndex = 1; // Next is Dhuhr
      nextPrayerTime = Dhuhr;
    } else if (timeNow.isBefore(Asr)) {
      prayerIndex = 2; // Next is Asr
      nextPrayerTime = Asr;
    } else if (timeNow.isBefore(Maghrib)) {
      prayerIndex = 3; // Next is Maghrib
      nextPrayerTime = Maghrib;
    } else if (timeNow.isBefore(Isha)) {
      prayerIndex = 4; // Next is Isha
      nextPrayerTime = Isha;
    } else {
      prayerIndex = 0; // After Isha, next is Fajr of the next day
      nextPrayerTime = Fajr.add(1, "day");
    }

    setnextPrayerIndex(prayerIndex);

    let remainTime = nextPrayerTime.diff(timeNow);
    let remainTimeDuration = moment.duration(remainTime);
    setTimer(
      `${remainTimeDuration.hours()}:${remainTimeDuration.minutes()}:${remainTimeDuration.seconds()}`
    );
  };

  const handleChange = (event) => {
    const city = event.target.value;
    const country = city === "Cairo" ? "Egypt" : "Saudi Arabia";
    setLocation({ city, country });
  };
  const nextPray = prayerArray[nextPrayerIndex].displayName;
  return (
    <div className={styles.landing}>
      <motion.div
        className="row justify-content-center m-0 pe-0"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: {
              staggerChildren: 0.3,
              delay: 0.3,
            },
          },
        }}
        initial="hidden"
        animate="show"
      >
        <motion.div
          className="col-md-6 text-center"
          variants={{
            hidden: { opacity: 0, y: 50 },
            show: { opacity: 1, y: 0 },
            transition: { duration: 0.3, ease: "easeInOut" },
          }}
          initial="hidden"
          animate="show"
        >
          <h3 className={styles.dynamicFont}>{date}</h3>
          {location.city === "Cairo" ? (
            <h2 className={styles.dynamicFont}>القاهرة, مصر</h2>
          ) : location.city === "Mecca" ? (
            <h2 className={styles.dynamicFont}>
              {" "}
              مكة المكرمة, المملكة العربية السعودية
            </h2>
          ) : location.city === "Madina" ? (
            <h2 className={styles.dynamicFont}>
              {" "}
              المدينة , المملكة العربية السعودية
            </h2>
          ) : (
            <h2>Unknown City</h2>
          )}
        </motion.div>
        <motion.div
          className="col-md-6 text-center p-md-0 "
          variants={{
            hidden: { opacity: 0, y: 50 },
            show: { opacity: 1, y: 0 },
            transition: { duration: 0.6, ease: "easeInOut", delay: 0.6 }, // Adjusted delay for sequencing
          }}
          initial="hidden"
          animate="show"
        >
          <h3 className={styles.dynamicFont}>متبقي حتي صلاة {nextPray} </h3>
          <h2
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { opacity: 1, y: 0 },
              transition: { duration: 0.3, ease: easeInOut },
            }}
            className={styles.dynamicFont}
          >
            {timer}
          </h2>
        </motion.div>
        <motion.div
          className="col-12 text-center p-md-0"
          variants={{
            hidden: { opacity: 0, y: 50 },
            show: { opacity: 1, y: 0 },
            transition: { duration: 0.3, ease: "easeInOut", delay: 0.9 },
          }}
          initial="hidden"
          animate="show"
        >
          <motion.div
            className="form-group"
            variants={{
              hidden: { opacity: 0, y: 50 },
              show: { opacity: 1, y: 0 },
              transition: { duration: 0.3, ease: easeInOut },
            }}
          >
            <select
              className="form-control"
              id="citySelect"
              value={location.city}
              onChange={handleChange}
              style={{
                width: "400px",
                margin: "20px auto",
                backgroundColor: "#fff",
                borderRadius: "4px",
              }}
            >
              <option value="Cairo">القاهرة, مصر</option>
              <option value="Mecca">
                مكة المكرمة, المملكة العربية السعودية
              </option>
              <option value="Madina">المدينة, المملكة العربية السعودية</option>
            </select>
          </motion.div>
        </motion.div>
      </motion.div>
      <hr style={{ borderColor: "#fff", opacity: ".3" }} />
      <motion.div
        className="flex-container container"
        variants={{
          hidden: { opacity: 0 },
          show: {
            opacity: 1,
            transition: { staggerChildren: 0.25, delay: 0.3 },
          },
        }}
        viewport={{ once: false, amount: 0.3 }}
        initial="hidden"
        animate="show"
      >
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 }, // Slide in from below
            show: {
              opacity: 1,
              y: 0,
              scale: nextPray === "الفجر" ? 1.1 : 1, // Scale up the next prayer card
              transition: { ease: "easeInOut", duration: 0.5 },
            },
          }}
        >
          <PrayerCard name="الفجر" time={timing.Fajr} image={fajr} />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 }, // Slide in from below
            show: {
              opacity: 1,
              y: 0,
              scale: nextPray === "الظهر" ? 1.1 : 1, // Scale up the next prayer card
              transition: { ease: "easeInOut", duration: 0.5 },
            },
          }}
        >
          <PrayerCard name="الظهر" time={timing.Dhuhr} image={duhr} />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 }, // Slide in from below
            show: {
              opacity: 1,
              y: 0,
              scale: nextPray === "العصر" ? 1.1 : 1, // Scale up the next prayer card
              transition: { ease: "easeInOut", duration: 0.5 },
            },
          }}
        >
          <PrayerCard name="العصر" time={timing.Asr} image={asr} />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 }, // Slide in from below
            show: {
              opacity: 1,
              y: 0,
              scale: nextPray === "المغرب" ? 1.1 : 1, // Scale up the next prayer card
              transition: { ease: "easeInOut", duration: 0.5 },
            },
          }}
        >
          <PrayerCard name="المغرب" time={timing.Maghrib} image={magrip} />
        </motion.div>
        <motion.div
          variants={{
            hidden: { opacity: 0, y: 50 }, // Slide in from below
            show: {
              opacity: 1,
              y: 0,
              scale: nextPray === "العشاء" ? 1.1 : 1,
              transition: { ease: "easeInOut", duration: 0.5 },
            },
          }}
        >
          <PrayerCard name="العشاء" time={timing.Isha} image={ishaa} />
        </motion.div>
      </motion.div>
    </div>
  );
}

export default MainComponent;
