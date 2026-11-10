import { useEffect, useRef } from 'react';
import {
  Apple,
  Carrot,
  Milk,
  Cookie,
  Coffee,
  Croissant,
  Home,
  Sparkles,
  ShoppingBag,
  ChevronRight,
} from 'lucide-react';

const iconMap = {
  Apple,
  Carrot,
  Milk,
  Cookie,
  Coffee,
  Croissant,
  Home,
  Sparkles,
};

const getCategoryIcon = (iconName) => {
  const IconComponent = iconMap[iconName] || ShoppingBag;
  return <IconComponent size={20} className="category-icon" />;
};

export const CategoryPanel = ({
  categories = [],
  activeCategory,
  onSelectCategory,
  variant, // 'mobile' | 'desktop' | undefined
}) => {
  const mobileContainerRef = useRef(null);
  const activeMobileBtnRef = useRef(null);

  // Safely scroll active category button into view inside the horizontal scroll container ONLY
  // (Avoid window.scrollIntoView which pulls the whole page vertically to the top)
  useEffect(() => {
    if (activeMobileBtnRef.current && mobileContainerRef.current) {
      const container = mobileContainerRef.current;
      const button = activeMobileBtnRef.current;

      const containerWidth = container.clientWidth;
      const buttonLeft = button.offsetLeft;
      const buttonWidth = button.clientWidth;

      // Center the button inside the scroll container
      const targetScrollLeft = buttonLeft - containerWidth / 2 + buttonWidth / 2;

      container.scrollTo({
        left: Math.max(0, targetScrollLeft),
        behavior: 'smooth',
      });
    }
  }, [activeCategory]);

  const renderMobile = () => (
    <nav
      className="category-panel-mobile"
      aria-label="Mobile grocery categories"
    >
      <div className="mobile-category-scroll" ref={mobileContainerRef}>
        {categories.map((cat) => {
          const isActive = activeCategory === cat.id;
          return (
            <button
              key={`mobile-${cat.id}`}
              ref={isActive ? activeMobileBtnRef : null}
              type="button"
              className={`mobile-cat-pill ${isActive ? 'active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isActive}
            >
              <span className="mobile-cat-icon">
                {getCategoryIcon(cat.icon)}
              </span>
              <span className="mobile-cat-name">{cat.shortName || cat.name}</span>
              {isActive && <span className="mobile-active-dot" />}
            </button>
          );
        })}
      </div>
    </nav>
  );

  const renderDesktop = () => (
    <aside
      className="category-panel-desktop"
      aria-label="Desktop grocery categories"
    >
      <div className="category-panel-inner">
        <div className="category-panel-header">
          <span className="category-header-title">Categories</span>
          <span className="category-header-count">{categories.length} total</span>
        </div>

        <div className="category-list" role="tablist">
          {categories.map((cat) => {
            const isActive = activeCategory === cat.id;
            return (
              <button
                key={`desktop-${cat.id}`}
                type="button"
                role="tab"
                aria-selected={isActive}
                className={`category-item ${isActive ? 'active' : ''}`}
                onClick={() => onSelectCategory(cat.id)}
              >
                <div className="category-item-left">
                  <span className="category-icon-wrapper">
                    {getCategoryIcon(cat.icon)}
                  </span>
                  <div className="category-text-wrap">
                    <span className="category-name">{cat.name}</span>
                    <span className="category-item-count">
                      {cat.itemCount || 6} items
                    </span>
                  </div>
                </div>
                <ChevronRight
                  size={16}
                  className={`category-arrow ${isActive ? 'visible' : ''}`}
                />
              </button>
            );
          })}
        </div>

        <div className="category-panel-footer">
          <div className="eco-tag">
            <span className="eco-bullet">🌱</span>
            <span>100% Quality Guaranteed</span>
          </div>
        </div>
      </div>
    </aside>
  );

  if (variant === 'mobile') {
    return renderMobile();
  }

  if (variant === 'desktop') {
    return renderDesktop();
  }

  return (
    <>
      {renderMobile()}
      {renderDesktop()}
    </>
  );
};

export default CategoryPanel;
