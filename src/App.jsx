import "./App.css";
import Iqraa from "./Components/Iqraa/iqraa";
import MainComponent from "./Components/mainContent/MainComponent";
import Navbar from "./Components/navbar/navbar";
function App() {
  return (
    <>
      <Navbar />
      <div style={{ direction: "rtl" }}>
        <div className="">
          <MainComponent />
          <Iqraa />
        </div>
      </div>
    </>
  );
}

export default App;
