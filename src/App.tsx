import "./App.css";
import CreateADUser from "./components/CreateADUser/CreateADUser";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <Header></Header>
      <section className="">
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/create_ad_users" element={<CreateADUser />} />
          </Routes>
        </BrowserRouter>
      </section>
      <Footer></Footer>
    </>
  );
}

export default App;
