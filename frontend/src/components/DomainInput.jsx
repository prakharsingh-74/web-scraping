import React, { useState } from "react";
import axios from "axios";
import './ProductCard.css';

function DomainInput() {
  const [domain, setDomain] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [products, setProducts] = useState([]);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      
      const response = await axios.post("http://localhost:3000/api/pre-scrape", { domain });
      setSitemapUrl(response.data.productSitemapUrl);
      setError("");

      
      const productsResponse = await axios.post("http://localhost:3000/api/fetch-products", { sitemapUrl: response.data.productSitemapUrl });
      setProducts(productsResponse.data);
    } catch (err) {
      setError("Error fetching product sitemap URL or products");
      setSitemapUrl("");
      setProducts([]);
    }
  };

  return (
    <div className="container">
      <div className="heading">Web Scraping</div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter domain"
          value={domain}
          onChange={(e) => setDomain(e.target.value)}
          required
        />
        <button type="submit">Get Products</button>
      </form>
      {sitemapUrl && (
        <div>
          <h3>Product Sitemap URL:</h3>
          <a href={sitemapUrl} target="_blank" rel="noopener noreferrer">{sitemapUrl}</a>
        </div>
      )}
      {error && <p>{error}</p>}
      {products.length > 0 && (
        <div>
          <h3>Products:</h3>
          <div className="product-list">
            {products.map((product, index) => (
              <div key={index} className="product-card">
                {product.image && <img src={product.image} alt={product.title} />}
                <h4>{product.title}</h4>
                <a href={product.link} target="_blank" rel="noopener noreferrer">View Product</a>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default DomainInput;
