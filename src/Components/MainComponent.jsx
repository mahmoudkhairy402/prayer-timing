import Divider from "@mui/material/Divider";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import Stack from "@mui/material/Stack";
import Grid from "@mui/material/Unstable_Grid2";
import axios from "axios";
import React, { useEffect, useState } from "react";
import PrayerCard from "./Card";
import moment from "moment";

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
      console.log("next is duhr");
      prayerIndex = 1;
    } else if (timeNow.isAfter(Dhuhr) && timeNow.isBefore(Asr)) {
      console.log("next is Asr");
      prayerIndex = 2;
    } else if (timeNow.isAfter(Asr) && timeNow.isBefore(Maghrib)) {
      console.log("next is Maghrib");
      prayerIndex = 3;
    } else if (timeNow.isAfter(Maghrib) && timeNow.isBefore(Isha)) {
      console.log("next is Isha");

      prayerIndex = 4;
    } else {
      console.log("next is Fajr");
      prayerIndex = 0;
    }
    setnextPrayerIndex(prayerIndex);
    let nextPrayerTime = timing[prayerArray[prayerIndex].key];
    console.log(
      "🚀 ~ file: MainComponent.jsx:116 ~ countDownTimer ~ nextPrayerTime:",
      nextPrayerTime
    );
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
    console.log(event.target.value);
    setLocation(event.target.value);
  };
  return (
    <>
      <div style={{ width: "100%" }}>
        <Grid
          container
          justifyContent={"space-around"}
          alignItems={"center"}
          spacing={{ xs: 5 }}
        >
          <Grid xs={6} style={{ textAlign: "center" }}>
            <h3> {date}</h3>
            {location.city == "Cairo" ? (
              <h2>القاهرة, مصر</h2>
            ) : location.city == "Mecca" ? (
              <h2> مكة المكرمة, المملكة العربية السعودية</h2>
            ) : location.city == "Madina" ? (
              <h2> المدينة , المملكة العربية السعودية</h2>
            ) : (
              <h2>Unknown City</h2>
            )}
          </Grid>
          <Grid xs={6} style={{ textAlign: "center" }}>
            <h3>متبقي حتي صلاة {prayerArray[nextPrayerIndex].displayName} </h3>
            <h2>{timer}</h2>
          </Grid>
          <Grid xs={12} style={{ textAlign: "center" }}>
            <Stack className="sellect" style={{ width: "100%" }}>
              <FormControl
                style={{
                  width: "400px",
                  margin: "20px auto",
                  backgroundColor: "#fff",
                  borderRadius: "4px",
                }}
              >
                <InputLabel id="demo-simple-select-label">
                  <span
                    style={{
                      fontSize: "20px",
                      backgroundColor: "#fff",
                      padding: "10px",
                    }}
                  >
                    City
                  </span>
                </InputLabel>
                <Select
                  style={{ borderColor: "#fff" }}
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={location.city}
                  onChange={handleChange}
                >
                  <MenuItem
                    value={{ city: "Cairo", country: "Egypt" }}
                    selected
                  >
                    القاهرة, مصر
                  </MenuItem>
                  <MenuItem value={{ city: "Mecca", country: "Saudi Arabia" }}>
                    مكة المكرمة, المملكة العربية السعودية
                  </MenuItem>
                  <MenuItem value={{ city: "Madina", country: "Saudi Arabia" }}>
                    المدينة, المملكة العربية السعودية
                  </MenuItem>
                </Select>
              </FormControl>
            </Stack>
          </Grid>
        </Grid>
        {/* //!Devider */}
        <Divider style={{ borderColor: "#fff", opacity: ".3" }} />
        {/* //!Devider */}
        <Stack
          style={{
            marginTop: "20px",
            display: "flex",
            justifyContent: "space-around",
            flexWrap: "wrap",
            gap: "20px",
            rowGap: "30px",
          }}
          direction={{ xs: "column", sm: "row" }}
        >
          <PrayerCard
            name="الفجر"
            time={timing.Fajr}
            image="src\images\fajr-prayer.png"
          />
          <PrayerCard
            name="الظهر"
            time={timing.Dhuhr}
            image="src\images\dhhr-prayer-mosque.png"
          />
          <PrayerCard
            name="العصر"
            time={timing.Asr}
            image="src\images\asr-prayer-mosque.png"
          />
          <PrayerCard
            name="المغرب"
            time={timing.Maghrib}
            image="src\images\sunset-prayer-mosque.png"
          />
          <PrayerCard
            name="العشاء"
            time={timing.Isha}
            image="src\images\night-prayer-mosque.png"
          />
        </Stack>
      </div>
    </>
  );
}

export default MainComponent;
