import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<div>Landing Page</div>} />
        <Route path="/processing/:id" element={<div>Processing</div>} />
        <Route path="/results/:id" element={<div>Results</div>} />
        <Route path="/results/:id/clip/:clipId" element={<div>Clip</div>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
