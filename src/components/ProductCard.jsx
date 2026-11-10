import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Plus, Minus, Star, Check } from 'lucide-react';
import {
  addToCart,
  removeFromCart,
  selectIsInCart,
} from '../redux/cartSlice';

const FALLBACK_IMAGE =
  'https://images.unsplash.com/photo-1542838132-92c53300491e?auto=format&fit=crop&w=500&q=80';

export const ProductCard = ({ product }) => {
  const dispatch = useDispatch();
  const isInCart = useSelector(selectIsInCart(product.id));
  const [imgSrc, setImgSrc] = useState(product.image);

  const handleToggleCart = () => {
    if (isInCart) {
      dispatch(removeFromCart(product.id));
    } else {
      dispatch(addToCart(product));
    }
  };

  const handleImageError = () => {
    if (imgSrc !== FALLBACK_IMAGE) {
      setImgSrc(FALLBACK_IMAGE);
    }
  };

  return (
    <article className={`product-card ${isInCart ? 'in-cart' : ''}`}>
      {/* Product Image Container */}
      <div className="product-image-container">
        <img
          src={imgSrc}
          alt={product.name}
          className="product-image"
          loading="lazy"
          onError={handleImageError}
        />

        {/* Discount Badge */}
        {product.discount > 0 && (
          <span className="product-discount-tag">
            {product.discount}% OFF
          </span>
        )}

        {/* In-Cart Pill Badge */}
        {isInCart && (
          <span className="product-added-indicator">
            <Check size={12} strokeWidth={3} />
            <span>Added</span>
          </span>
        )}
      </div>

      {/* Product Content Details */}
      <div className="product-content">
        {/* Rating and Unit */}
        <div className="product-meta">
          <span className="product-unit">{product.unit}</span>
          {product.rating && (
            <span className="product-rating">
              <Star size={12} className="star-icon" fill="currentColor" />
              <span>{product.rating}</span>
            </span>
          )}
        </div>

        {/* Product Title */}
        <h3 className="product-title" title={product.name}>
          {product.name}
        </h3>

        {/* Price & Add/Remove Action Button */}
        <div className="product-footer">
          <div className="product-pricing">
            <span className="product-price">
              ₹{Number(product.price)}
            </span>
            {product.originalPrice && (
              <span className="product-original-price">
                ₹{Number(product.originalPrice)}
              </span>
            )}
          </div>

          {/* Required Add (+) / Remove (-) Action Button */}
          <button
            type="button"
            className={`cart-action-btn ${isInCart ? 'btn-remove' : 'btn-add'}`}
            onClick={handleToggleCart}
            aria-label={
              isInCart
                ? `Remove ${product.name} from cart`
                : `Add ${product.name} to cart`
            }
          >
            {isInCart ? (
              <>
                <Minus size={16} strokeWidth={2.5} className="btn-icon" />
                <span className="btn-text">Remove</span>
              </>
            ) : (
              <>
                <Plus size={16} strokeWidth={2.5} className="btn-icon" />
                <span className="btn-text">Add</span>
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};

export default ProductCard;
