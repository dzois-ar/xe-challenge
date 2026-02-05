import { BrowserRouter, Routes, Route } from "react-router-dom";
import { NewAdPage } from "./pages/NewAdPage";
import { AdDetailsPage } from "./pages/AdDetailsPage";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<NewAdPage />} />
        <Route path="/ads/:id" element={<AdDetailsPage />} />
      </Routes>
    </BrowserRouter>
  );
}


