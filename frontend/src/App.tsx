import { BrowserRouter, Routes, Route } from "react-router-dom";
import LandingPage from "./pages/LandingPage";
import ProcessingPage from "./pages/ProcessingPage";
import ResultsPage from "./pages/ResultsPage";

function App() {
  return (
    <BrowserRouter>
      {/* We no longer need the generic wrapper div because the pages handle their own full-screen height and background coloring */}
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/processing/:id" element={<ProcessingPage />} />
        <Route path="/results/:id" element={<ResultsPage />} />
        <Route path="/results/:id/clip/:clipId" element={<div className="p-10 text-center text-xl text-primary font-headline">Final Render Player goes here</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
