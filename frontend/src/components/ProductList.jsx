import React, { useEffect, useState } from "react";
import axios from "axios";
import ProductCard from "./ProductCard";

function ProductList({ sitemapUrl }) {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.post('http://localhost:3000/api/fetch-products', { sitemapUrl });
        setProducts(response.data);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (sitemapUrl) {
      fetchProducts();
    }
  }, [sitemapUrl]);

  return (
    <div>
      {products.length > 0 ? (
        products.map((product, index) => (
          <ProductCard key={index} product={product} />
        ))
      ) : (
        <p>No products found.</p>
      )}
    </div>
  );
}

export default ProductList;
