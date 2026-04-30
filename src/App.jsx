import React from "react";
import "./index.css";
import MainLayout from "./components/layout/MainLayout";
import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transaction";
import Budgets from "./pages/Budgets";
import Wallets from "./pages/Wallets";
import Categories from "./pages/Category";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function App() {
  return (
    <BrowserRouter>
      <MainLayout>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/finance-fe/" element={<Dashboard />} />
          <Route path="/finance-fe/transaction" element={<Transactions />} />
          <Route path="/finance-fe/budgets" element={<Budgets />} />
          <Route path="/finance-fe/wallets" element={<Wallets />} />
          <Route path="/finance-fe/categories" element={<Categories />} />
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
