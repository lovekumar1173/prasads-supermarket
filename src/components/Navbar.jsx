import { useDispatch, useSelector } from 'react-redux';
import {
  ShoppingCart,
  Search,
  X,
  Sparkles,
  Crown,
  Clock,
  ShieldCheck,
} from 'lucide-react';
import {
  selectCartCount,
  selectCartTotal,
  toggleCart,
} from '../redux/cartSlice';

export const Navbar = ({ searchQuery, onSearchChange, onClearSearch }) => {
  const dispatch = useDispatch();
  const cartCount = useSelector(selectCartCount);
  const cartTotal = useSelector(selectCartTotal);

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* Brand / Logo */}
        <div className="navbar-brand">
          <div className="brand-logo-wrap" title="Prasad's Supermarket - Royal Quality Guarantee">
            <Crown className="brand-icon" size={24} />
          </div>
          <div className="brand-text">
            <div className="brand-name">
              Prasad's <span className="brand-accent">Supermarket</span>
            </div>
            <div className="delivery-badge">
              <Sparkles size={11} className="delivery-icon" />
              <span>Royal Express • 10 Mins</span>
            </div>
          </div>
        </div>

        {/* Search Bar */}
        <div className="navbar-search">
          <div className="search-input-wrapper">
            <Search className="search-icon" size={18} />
            <input
              type="text"
              className="search-input"
              placeholder="Search royal fresh fruits, veggies, artisan dairy, bakery..."
              value={searchQuery}
              onChange={(e) => onSearchChange(e.target.value)}
              aria-label="Search grocery products"
            />
            {searchQuery && (
              <button
                type="button"
                className="search-clear-btn"
                onClick={onClearSearch}
                aria-label="Clear search query"
              >
                <X size={16} />
              </button>
            )}
          </div>
        </div>

        {/* Right Section: Perks & Cart Button */}
        <div className="navbar-actions">
          <div className="navbar-perk desktop-only">
            <ShieldCheck size={16} className="perk-icon perk-icon-gold" />
            <div className="perk-text">
              <span className="perk-title">100% Purity Certified</span>
              <span className="perk-sub">Direct farm harvest</span>
            </div>
          </div>

          <div className="navbar-perk desktop-only">
            <Clock size={16} className="perk-icon" />
            <div className="perk-text">
              <span className="perk-title">10-Min Delivery</span>
              <span className="perk-sub">Direct to your doorstep</span>
            </div>
          </div>

          {/* Cart Trigger Button */}
          <button
            type="button"
            className={`cart-btn ${cartCount > 0 ? 'cart-btn-active' : ''}`}
            onClick={() => dispatch(toggleCart())}
            aria-label={`View cart with ${cartCount} items`}
          >
            <div className="cart-btn-icon-wrap">
              <ShoppingCart size={20} />
              {cartCount > 0 && (
                <span className="cart-badge animate-badge">{cartCount}</span>
              )}
            </div>
            <div className="cart-btn-info desktop-only">
              <span className="cart-btn-label">My Basket</span>
              <span className="cart-btn-value">
                {cartCount > 0 ? `₹${cartTotal}` : 'Empty'}
              </span>
            </div>
          </button>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
