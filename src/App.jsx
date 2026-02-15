import React from "react";
import TopHeader from "./components/header/TopHeader";
import BottomHeader from "./components/header/BottomHeader";
import Home from "./page/home/Home";


function App() {
  return (
    <>
      <header>
        <TopHeader />
        <BottomHeader />
      </header>
      <Home />
    </>
  );
}

export default App;
