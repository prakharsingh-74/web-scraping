import React, { useState } from "react";
import axios from "axios";

function DomainInput() {
  const [domain, setDomain] = useState("");
  const [sitemapUrl, setSitemapUrl] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://localhost:3000/api/pre-scrape", { domain });
      setSitemapUrl(response.data.productSitemapUrl);
      setError("");
    } catch (err) {
      setError("Error fetching product sitemap URL");
      setSitemapUrl("");
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <label>
          Domain:
          <input
            type="text"
            value={domain}
            onChange={(e) => setDomain(e.target.value)}
            required
          />
        </label>
        <button type="submit">Get Sitemap URL</button>
      </form>
      {sitemapUrl && (
        <div>
          <h3>Product Sitemap URL:</h3>
          <a href={sitemapUrl} target="_blank" rel="noopener noreferrer">{sitemapUrl}</a>
        </div>
      )}
      {error && <p>{error}</p>}
    </div>
  );
}

export default DomainInput;
