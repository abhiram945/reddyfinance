import "./App.css";
import LineSessions from "./pages/LineSessions";
import LineDaySession from "./pages/LineDaySession";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LineSessions />} />
        <Route path="/:line/:day/:session" element={<LineDaySession />} />
      </Routes>
    </Router>
  );
};

export default App;