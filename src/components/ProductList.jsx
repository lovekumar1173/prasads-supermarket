import { SearchX } from 'lucide-react';
import ProductCard from './ProductCard';

export const ProductList = ({
  categories = [],
  products = [],
  searchQuery = '',
  onClearSearch,
  registerSectionRef,
}) => {
  const isSearching = searchQuery.trim().length > 0;

  // Filter products when search query is entered
  const filteredProducts = isSearching
    ? products.filter((item) =>
        item.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      )
    : products;

  // Render Search Results Mode
  if (isSearching) {
    return (
      <main className="product-listing-section">
        <div className="search-results-header">
          <div className="search-header-info">
            <h2 className="search-title">
              Search Results for <span className="highlight">"{searchQuery}"</span>
            </h2>
            <p className="search-count">
              Found {filteredProducts.length}{' '}
              {filteredProducts.length === 1 ? 'product' : 'products'}
            </p>
          </div>
          <button
            type="button"
            className="clear-search-pill-btn"
            onClick={onClearSearch}
          >
            Clear Search
          </button>
        </div>

        {filteredProducts.length === 0 ? (
          <div className="empty-search-state">
            <div className="empty-search-icon-wrap">
              <SearchX size={48} className="empty-search-icon" />
            </div>
            <h3 className="empty-search-title">No products match your search</h3>
            <p className="empty-search-desc">
              We couldn't find anything matching "<strong>{searchQuery}</strong>".
              Try checking your spelling or search for popular items like apples,
              milk, bread, or snacks.
            </p>
            <button
              type="button"
              className="primary-btn empty-search-action"
              onClick={onClearSearch}
            >
              Browse All Categories
            </button>
          </div>
        ) : (
          <div className="products-grid">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </main>
    );
  }

  // Render Categorized Sections Mode (Default)
  return (
    <main className="product-listing-section" id="product-listing">
      {categories.map((cat) => {
        const catProducts = products.filter(
          (p) => p.categoryId === cat.id
        );

        if (catProducts.length === 0) return null;

        return (
          <section
            key={cat.id}
            id={`category-${cat.id}`}
            ref={registerSectionRef ? registerSectionRef(cat.id) : null}
            className="category-section"
            data-category-id={cat.id}
          >
            {/* Category Header */}
            <div className="category-section-header">
              <div className="category-header-main">
                <h2 className="category-section-title">{cat.name}</h2>
                <span className="category-badge">
                  {catProducts.length} items
                </span>
              </div>
              {cat.description && (
                <p className="category-section-subtitle">{cat.description}</p>
              )}
            </div>

            {/* Products Grid */}
            <div className="products-grid">
              {catProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </section>
        );
      })}
    </main>
  );
};

export default ProductList;
