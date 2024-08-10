import React from "react";
import styles from "./card.module.scss";
function PrayerCard(props) {
  // let info = props;
  //   console.log(info);
  return (
    <>
      <div className={styles.card} style={{ Width: "260px" }}>
        <div
          className={styles.imageContainer}
          image={props?.image}
          alt="green iguana"
        >
          <img src={props?.image} alt="green iguana" srcset="" />
        </div>
        <div className={styles.cardContent}>
          <h2>{props?.name}</h2>
          <h1 style={{ fontWeight: "200", opacity: ".8" }}>{props?.time}</h1>
        </div>
      </div>
    </>
  );
}

export default PrayerCard;
