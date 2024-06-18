import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./Login";
import Signup from "./Signup";
import ChatApp from "./ChatApp";
function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/chat_with_morio" element={<ChatApp />} />
      </Routes>
    </Router>
  );
}

export default App;
