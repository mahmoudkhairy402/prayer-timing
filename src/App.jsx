import "./App.css";
import Iqraa from "./Components/Iqraa/iqraa";
import MainComponent from "./Components/mainContent/MainComponent";
import Navbar from "./Components/navbar/navbar";
import { BrowserRouter, Route, Routes } from "react-router-dom";

function App() {
  return (
    <>
      <BrowserRouter>
        <Navbar />
        <div style={{ direction: "rtl" }}>
          <div className="">
            <Routes>
              <Route path="/prayer" element={<MainComponent />} />
              {["/", "iqraa"].map((ele, index) => (
                <Route path={ele} key={index} element={<Iqraa />} />
              ))}
            </Routes>
          </div>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
