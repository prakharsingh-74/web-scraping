import React, { useState } from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import DomainInput from "./components/DomainInput";
import ProductList from "./components/ProductList";

function App() {
  const [sitemapUrl, setSitemapUrl] = useState('');

  return (
    <Router>
      <Routes>
        <Route path="/" element={<DomainInput setSitemapUrl={setSitemapUrl} />} />
        <Route path="/products" element={<ProductList sitemapUrl={sitemapUrl} />} />
      </Routes>
    </Router>
  );
}

export default App;
