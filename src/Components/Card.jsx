import React from "react";
import { Card } from "@mui/material";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import { CardActionArea } from "@mui/material";

function PrayerCard(props) {
  let info = props;
  //   console.log(info);
  return (
    <>
      <Card style={{ Width: "260px" }}>
        <CardActionArea>
          <CardMedia
            component="img"
            height="160"
            image={info.image}
            alt="green iguana"
          />
          <CardContent>
            <h2>{info.name}</h2>
            <h1 style={{ fontWeight: "200", opacity: ".8" }}>{info.time}</h1>
          </CardContent>
        </CardActionArea>
      </Card>
    </>
  );
}

export default PrayerCard;
