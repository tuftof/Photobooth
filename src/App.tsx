import "./App.css";
import Photobooth from "./pages/Photobooth";
import PhotoTemplate from "./pages/PhotoTemplate";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Photobooth />} />
        <Route path="/download" element={<PhotoTemplate />} />
      </Routes>
    </Router>
  );
}

export default App;
