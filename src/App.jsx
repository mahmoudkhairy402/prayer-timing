import { useState } from "react";
import "./App.css";
import MainComponent from "./Components/MainComponent";
import { Container } from "@mui/material";

function App() {
  return (
    <>
      <div style={{ width: "100vw", direction: "rtl" }}>
        <Container maxWidth="lg" style={{ backgroundColor: "#222" }}>
          <MainComponent />
        </Container>
      </div>
    </>
  );
}

export default App;
