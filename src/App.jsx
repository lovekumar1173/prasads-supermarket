import { useState } from 'react';
import Navbar from './components/Navbar';
import CategoryPanel from './components/CategoryPanel';
import ProductList from './components/ProductList';
import CartDrawer from './components/CartDrawer';
import { categories } from './data/categories';
import { products } from './data/products';
import { useCategoryScroll } from './hooks/useCategoryScroll';
import { ShieldCheck, Truck, Sparkles, Heart, Crown } from 'lucide-react';
import './App.css';

export function App() {
  const [searchQuery, setSearchQuery] = useState('');

  // Bidirectional scrolling synchronization hook
  const {
    activeCategory,
    scrollToCategory,
    registerSectionRef,
  } = useCategoryScroll(categories);

  const handleSearchChange = (query) => {
    setSearchQuery(query);
  };

  const handleClearSearch = () => {
    setSearchQuery('');
  };

  return (
    <div className="app-root">
      {/* Top Banner */}
      <aside className="top-announcement-banner" aria-label="Special Offers">
        <div className="announcement-content">
          <Crown size={15} className="announcement-icon" />
          <span>
            👑 <strong>Royal Freshness Pledge</strong> • Farm Harvested Produce & Daily Essentials • Free Express Delivery over ₹199!
          </span>
        </div>
      </aside>

      {/* Top Navigation Bar */}
      <Navbar
        searchQuery={searchQuery}
        onSearchChange={handleSearchChange}
        onClearSearch={handleClearSearch}
      />

      {/* Mobile Category Navigation (renders horizontally on mobile viewport) */}
      <CategoryPanel
        categories={categories}
        activeCategory={activeCategory}
        onSelectCategory={scrollToCategory}
        variant="mobile"
      />

      {/* Main Two-Column Layout */}
      <div className="main-content-layout">
        {/* Desktop Category Sidebar (sticky on the left) */}
        {searchQuery.trim().length === 0 && (
          <aside className="desktop-category-wrapper">
            <CategoryPanel
              categories={categories}
              activeCategory={activeCategory}
              onSelectCategory={scrollToCategory}
              variant="desktop"
            />
          </aside>
        )}

        {/* Product Listing Section (on the right) */}
        <ProductList
          categories={categories}
          products={products}
          searchQuery={searchQuery}
          onClearSearch={handleClearSearch}
          registerSectionRef={registerSectionRef}
        />
      </div>

      {/* Slide-over Cart Drawer */}
      <CartDrawer />

      {/* Modern Grocery Footer */}
      <footer className="app-footer">
        <div className="footer-container">
          <div className="footer-grid">
            <div className="footer-col">
              <div className="footer-brand">
                <span className="brand-name">
                  Prasad's <span className="brand-accent">Supermarket</span>
                </span>
              </div>
              <p className="footer-tagline">
                Your premier neighborhood supermarket delivering farm-fresh fruits,
                crisp organic vegetables, pure dairy, artisan bakery, and household essentials straight
                to your doorstep in 10 minutes.
              </p>
              <div className="footer-trust-pill">
                <ShieldCheck size={14} />
                <span>Royal Seal of Purity & 100% Quality Guaranteed</span>
              </div>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Top Categories</h4>
              <ul className="footer-links">
                {categories.slice(0, 5).map((cat) => (
                  <li key={cat.id}>
                    <button
                      type="button"
                      className="footer-link-btn"
                      onClick={() => {
                        handleClearSearch();
                        scrollToCategory(cat.id);
                      }}
                    >
                      {cat.name}
                    </button>
                  </li>
                ))}
              </ul>
            </div>

            <div className="footer-col">
              <h4 className="footer-heading">Royal Quality Pledge</h4>
              <ul className="footer-perks">
                <li>
                  <ShieldCheck size={16} className="perk-bullet" />
                  <span>100% Quality & Freshness Guarantee</span>
                </li>
                <li>
                  <Truck size={16} className="perk-bullet" />
                  <span>No-Questions-Asked Instant Return</span>
                </li>
                <li>
                  <Sparkles size={16} className="perk-bullet" />
                  <span>Sourced Daily From Certified Local Farmers</span>
                </li>
              </ul>
            </div>
          </div>

          <div className="footer-bottom">
            <p className="footer-copy">
              © {new Date().getFullYear()} Prasad's Supermarket. All rights reserved.
            </p>
            <div className="footer-badge">
              <span>Crafted with</span>
              <Heart size={14} className="heart-icon" fill="currentColor" />
              <span>for royal grocery shopping experiences</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
