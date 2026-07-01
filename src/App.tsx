import "./App.css";
import CreateADUser from "./components/CreateADUser/CreateADUser";
import VerifyADUser from "./components/VerifyADUser/VerifyADUser";
import { BrowserRouter, Routes, Route } from "react-router";
import Home from "./components/Home/Home";
import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";

function App() {
  return (
    <>
      <BrowserRouter>
        <div className="flex h-screen flex-col bg-blue-300">
          <Header></Header>
          <main className="flex-1 overflow-y-auto">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/create_ad_users" element={<CreateADUser />} />
              <Route path="/verify_ad_user" element={<VerifyADUser />} />
            </Routes>
          </main>
          <Footer></Footer>
        </div>
      </BrowserRouter>
    </>
  );
}

export default App;
