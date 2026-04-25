import React from "react";
import "./index.css";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transaction";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finance-fe" element={<Dashboard />} />
          <Route path="/transaction" element={<Transactions />} />
          <Route
            path="*"
            elemetn={
              <div className="flex items-center justify-center h-full text-gray-400">
                Halaman ini sedang dalam tahap pengembangan 🚀
              </div>
            }
          />
        </Routes>
      </MainLayout>
    </BrowserRouter>
  );
}

export default App;
