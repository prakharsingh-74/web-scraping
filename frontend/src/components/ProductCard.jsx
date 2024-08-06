import React from 'react';
import './ProductCard.css';

function ProductCard({ product }) {
  return (
    <div className="product-card">
      <img src={product.image} alt={product.title} />
      <h3>{product.title}</h3>
      {product.summary && <p>{product.summary}</p>}
    </div>
  );
}

export default ProductCard;
