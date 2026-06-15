import React, { useState, useRef } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { Background3D } from '../Background3D/Background3D';
import './NewArrivals.css';

const PRODUCTS = [
  { id: 1, name: 'Neon Void Jacket', price: '$240', tag: 'New', image: 'https://images.unsplash.com/photo-1550614000-4b95d466bcbe?q=80&w=600&auto=format&fit=crop' },
  { id: 2, name: 'Cybernetic Boots', price: '$310', tag: 'Best Seller', image: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?q=80&w=600&auto=format&fit=crop' },
  { id: 3, name: 'Holo-Weave Pants', price: '$180', tag: 'Limited', image: 'https://images.unsplash.com/photo-1579730590815-56f4d2f09ba9?q=80&w=600&auto=format&fit=crop' },
  { id: 4, name: 'Flux Core Hoodie', price: '$150', tag: 'Drop 02', image: 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?q=80&w=600&auto=format&fit=crop' },
];

const TiltCard = ({ product }: { product: any }) => {
  const [style, setStyle] = useState<React.CSSProperties>({ transition: 'transform 0.5s ease-out' });
  const cardRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -15;
    const rotateY = ((x - centerX) / centerX) * 15;

    setStyle({
      transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`,
      transition: 'none'
    });
  };

  const handleMouseLeave = () => {
    setStyle({
      transform: `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`,
      transition: 'transform 0.5s ease-out'
    });
  };

  return (
    <div
      ref={cardRef}
      className="tilt-card"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => navigate(`/product/${product.id}`)}
      style={{ ...style, transformStyle: 'preserve-3d', cursor: 'pointer' }}
    >
      <div className="tilt-card__image-container">
        <img
          src={product.image}
          alt={product.name}
          className="tilt-card__image"
        />

        {product.tag && (
          <div className="tilt-card__tag">
            {product.tag}
          </div>
        )}

        <button 
          className="tilt-card__button"
          onClick={(e) => {
            e.stopPropagation();
            // Optional: Handle add to cart logic here later
          }}
        >
          Add to Cart
        </button>
      </div>

      <div className="tilt-card__details">
        <div>
          <h3 className="tilt-card__title">{product.name}</h3>
          <p className="tilt-card__price">{product.price}</p>
        </div>
      </div>
    </div>
  );
};

export const NewArrivals = () => {
  const { t } = useTranslation();

  return (
    <div className="new-arrivals-wrapper">
      <Background3D />
      
      <section id="new-arrivals" className="new-arrivals">
        <div className="new-arrivals__header">
          <h2 className="new-arrivals__title">
            New Arrivals
          </h2>
          <p className="new-arrivals__subtitle">
            Discover the latest high-tech apparel. Designed for the grid, built for reality.
          </p>
        </div>

        <div className="new-arrivals__grid">
          {PRODUCTS.map((product) => (
            <TiltCard key={product.id} product={product} />
          ))}
        </div>
      </section>
    </div>
  );
};
