import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProcessingPage from "./pages/ProcessingPage";

function App() {
  return (
    <BrowserRouter>
      {/* We no longer need the generic wrapper div because the pages handle their own full-screen height and background coloring */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/processing/:id" element={<ProcessingPage />} />
        <Route path="/results/:id" element={<div className="p-10 text-center text-xl text-green-400">Results/Clip Grid UI goes here (Run v0.dev Prompt 3)</div>} />
        <Route path="/results/:id/clip/:clipId" element={<div className="p-10 text-center text-xl text-purple-400">Final Render Player goes here</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
