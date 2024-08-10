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

  const countDownTimer = () => {
    let timeNow = moment();
    let Fajr = moment(timing["Fajr"], "hh:mm");
    let Dhuhr = moment(timing["Dhuhr"], "hh:mm");
    let Asr = moment(timing["Asr"], "hh:mm");
    let Maghrib = moment(timing["Maghrib"], "hh:mm");
    let Isha = moment(timing["Isha"], "hh:mm");

    console.log(timeNow.isAfter(Fajr));
    let prayerIndex = null;
    if (timeNow.isAfter(Fajr) && timeNow.isBefore(Dhuhr)) {
      // console.log("next is duhr");
      prayerIndex = 1;
    } else if (timeNow.isAfter(Dhuhr) && timeNow.isBefore(Asr)) {
      // console.log("next is Asr");
      prayerIndex = 2;
    } else if (timeNow.isAfter(Asr) && timeNow.isBefore(Maghrib)) {
      // console.log("next is Maghrib");
      prayerIndex = 3;
    } else if (timeNow.isAfter(Maghrib) && timeNow.isBefore(Isha)) {
      // console.log("next is Isha");

      prayerIndex = 4;
    } else {
      // console.log("next is Fajr");
      prayerIndex = 0;
    }
    setnextPrayerIndex(prayerIndex);
    let nextPrayerTime = timing[prayerArray[prayerIndex].key];
    // console.log(
    //   "🚀 ~ file: MainComponent.jsx:116 ~ countDownTimer ~ nextPrayerTime:",
    //   nextPrayerTime
    // );
    let remainTime = moment(nextPrayerTime, "hh:mm").diff(timeNow);

    if (remainTime < 0) {
      const midNightDiff = moment("11:59:59", "hh:mm:ss").diff(timeNow);
      const FajrToMidNightDiff = moment(nextPrayerTime, "hh:mm").diff(
        moment("00:00:00", "hh:mm:ss")
      );
      let fajrRemainTime = midNightDiff + FajrToMidNightDiff;
      remainTime = fajrRemainTime;
    }

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

  return (
    <div className={styles.landing}>
      <div className="row justify-content-center m-0 pe-0">
        <div className="col-md-6 text-center">
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
        </div>
        <div className="col-md-6 text-center p-md-0 ">
          <h3 className={styles.dynamicFont}>
            متبقي حتي صلاة {prayerArray[nextPrayerIndex].displayName}{" "}
          </h3>
          <h2 className={styles.dynamicFont}>{timer}</h2>
        </div>
        <div className="col-12 text-center p-md-0">
          <div className="form-group">
            {/* <label htmlFor="citySelect">
              <span
                style={{
                  fontSize: "20px",
                  backgroundColor: "#fff",
                  padding: "10px",
                }}
              >
                City
              </span>
            </label> */}
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
          </div>
        </div>
      </div>
      <hr style={{ borderColor: "#fff", opacity: ".3" }} />
      <div className="flex-container container">
        <PrayerCard name="الفجر" time={timing.Fajr} image={fajr} />
        <PrayerCard name="الظهر" time={timing.Dhuhr} image={duhr} />
        <PrayerCard name="العصر" time={timing.Asr} image={asr} />
        <PrayerCard name="المغرب" time={timing.Maghrib} image={magrip} />
        <PrayerCard name="العشاء" time={timing.Isha} image={ishaa} />
      </div>
    </div>
  );
}

export default MainComponent;
