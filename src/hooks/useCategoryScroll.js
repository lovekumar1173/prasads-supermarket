import { useState, useEffect, useRef, useCallback } from 'react';

/**
 * Custom hook for bidirectional category and product-list scrolling synchronization.
 *
 * @param {Array} categories - Array of category objects with `id`
 * @returns {Object} - { activeCategory, setActiveCategory, scrollToCategory, registerSectionRef }
 */
export function useCategoryScroll(categories = []) {
  const [activeCategory, setActiveCategory] = useState(
    categories[0]?.id || 'fruits'
  );

  // References to keep track of section elements
  const sectionRefs = useRef({});

  // Flag to lock observer/scroll listener updates while programmatic smooth scrolling is occurring
  const isProgrammaticScrollRef = useRef(false);
  const scrollTimeoutRef = useRef(null);

  /**
   * Register a DOM element ref for a given category ID
   */
  const registerSectionRef = useCallback(
    (categoryId) => (element) => {
      if (element) {
        sectionRefs.current[categoryId] = element;
      } else {
        delete sectionRefs.current[categoryId];
      }
    },
    []
  );

  /**
   * Calculate top offset taking navbar and mobile sticky bar into account
   */
  const getHeaderOffset = useCallback(() => {
    const navbar = document.querySelector('.navbar');
    const mobilePanel = document.querySelector('.category-panel-mobile');

    let offset = navbar ? navbar.offsetHeight : 72;
    if (mobilePanel && window.innerWidth <= 900) {
      offset += mobilePanel.offsetHeight;
    }
    // Add extra breathing padding
    return offset + 12;
  }, []);

  /**
   * Programmatic scroll to category on click
   */
  const scrollToCategory = useCallback(
    (categoryId) => {
      const element =
        sectionRefs.current[categoryId] ||
        document.getElementById(`category-${categoryId}`);
      if (!element) return;

      // Update active category immediately for crisp UI feedback
      setActiveCategory(categoryId);

      // Lock manual scroll sync temporarily while animating
      isProgrammaticScrollRef.current = true;
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }

      const offset = getHeaderOffset();
      const elementTop =
        element.getBoundingClientRect().top + window.pageYOffset;
      const targetScrollY = Math.max(0, Math.round(elementTop - offset));

      window.scrollTo({
        top: targetScrollY,
        behavior: 'smooth',
      });

      // Release the lock after the smooth scroll animation completes
      scrollTimeoutRef.current = setTimeout(() => {
        isProgrammaticScrollRef.current = false;
      }, 1000);
    },
    [getHeaderOffset]
  );

  /**
   * Manual scroll detection with rapid scroll and bottom-of-page handling
   */
  useEffect(() => {
    let ticking = false;

    const handleScroll = () => {
      // If user triggered category click, ignore manual scroll updates temporarily
      if (isProgrammaticScrollRef.current) return;

      if (!ticking) {
        window.requestAnimationFrame(() => {
          const scrollY = window.pageYOffset;
          const windowHeight = window.innerHeight;
          const documentHeight = document.documentElement.scrollHeight;
          const offset = getHeaderOffset();

          // 1. Bottom-of-page check: if scrolled near the bottom, highlight the last category
          if (scrollY + windowHeight >= documentHeight - 60) {
            const lastCategory = categories[categories.length - 1];
            if (lastCategory && activeCategory !== lastCategory.id) {
              setActiveCategory(lastCategory.id);
            }
            ticking = false;
            return;
          }

          // 2. Scan section positions from top to bottom
          const triggerLine = scrollY + offset + 60;
          let currentActiveId = null;

          for (let i = 0; i < categories.length; i++) {
            const catId = categories[i].id;
            const element = sectionRefs.current[catId];
            if (!element) continue;

            const rect = element.getBoundingClientRect();
            const top = rect.top + scrollY;
            const bottom = top + element.offsetHeight;

            // If the trigger line falls within this section
            if (top <= triggerLine && bottom > triggerLine) {
              currentActiveId = catId;
              break;
            }
          }

          // If no section matched (e.g. above first section), default to first category
          if (!currentActiveId && categories.length > 0) {
            const firstElement = sectionRefs.current[categories[0].id];
            if (firstElement) {
              const firstTop =
                firstElement.getBoundingClientRect().top + scrollY;
              if (triggerLine < firstTop) {
                currentActiveId = categories[0].id;
              } else {
                // If past all sections, default to last
                currentActiveId = categories[categories.length - 1].id;
              }
            } else {
              currentActiveId = categories[0].id;
            }
          }

          if (currentActiveId && currentActiveId !== activeCategory) {
            setActiveCategory(currentActiveId);
          }

          ticking = false;
        });

        ticking = true;
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    // Initial check on mount
    handleScroll();

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
      if (scrollTimeoutRef.current) {
        clearTimeout(scrollTimeoutRef.current);
      }
    };
  }, [categories, activeCategory, getHeaderOffset]);

  return {
    activeCategory,
    setActiveCategory,
    scrollToCategory,
    registerSectionRef,
  };
}

export default useCategoryScroll;
