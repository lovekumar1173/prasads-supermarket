import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  X,
  Trash2,
  ShoppingBag,
  ArrowRight,
  Package,
} from 'lucide-react';
import {
  selectCartItems,
  selectCartCount,
  selectIsCartOpen,
  closeCart,
  removeFromCart,
} from '../redux/cartSlice';
import CartSummary from './CartSummary';

export const CartDrawer = () => {
  const dispatch = useDispatch();
  const items = useSelector(selectCartItems);
  const count = useSelector(selectCartCount);
  const isOpen = useSelector(selectIsCartOpen);

  // Close on Escape key press
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape' && isOpen) {
        dispatch(closeCart());
      }
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, dispatch]);

  if (!isOpen) return null;

  return (
    <div className="cart-drawer-overlay" onClick={() => dispatch(closeCart())}>
      <aside
        className="cart-drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="dialog"
        aria-modal="true"
        aria-label="Shopping Cart"
      >
        {/* Drawer Header */}
        <div className="cart-drawer-header">
          <div className="header-title-wrap">
            <ShoppingBag size={22} className="drawer-bag-icon" />
            <h2 className="drawer-title">My Cart</h2>
            <span className="drawer-count-badge">
              {count} {count === 1 ? 'item' : 'items'}
            </span>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={() => dispatch(closeCart())}
            aria-label="Close cart drawer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Drawer Body */}
        <div className="cart-drawer-content">
          {count === 0 ? (
            /* Empty Cart State */
            <div className="empty-cart-view">
              <div className="empty-cart-circle">
                <Package size={52} className="empty-cart-package-icon" />
              </div>
              <h3 className="empty-cart-headline">Your cart is empty</h3>
              <p className="empty-cart-subtext">
                Your basket is craving fresh fruits, vegetables, dairy, and snacks.
                Browse our categories and pick your favorites!
              </p>
              <button
                type="button"
                className="start-shopping-btn"
                onClick={() => dispatch(closeCart())}
              >
                <span>Start Shopping</span>
                <ArrowRight size={16} />
              </button>
            </div>
          ) : (
            /* Selected Items List */
            <div className="cart-items-list">
              <div className="cart-items-intro">
                <span>Selected Items ({count})</span>
              </div>

              {items.map((item) => (
                <div key={item.id} className="cart-item-row">
                  <div className="cart-item-thumb-wrap">
                    <img
                      src={item.image}
                      alt={item.name}
                      className="cart-item-thumb"
                      loading="lazy"
                    />
                  </div>

                  <div className="cart-item-details">
                    <h4 className="cart-item-name">{item.name}</h4>
                    <span className="cart-item-unit">{item.unit}</span>
                    <span className="cart-item-price">
                      ₹{Number(item.price)}
                    </span>
                  </div>

                  {/* Remove Action Button */}
                  <button
                    type="button"
                    className="cart-item-remove-btn"
                    onClick={() => dispatch(removeFromCart(item.id))}
                    title={`Remove ${item.name}`}
                    aria-label={`Remove ${item.name} from cart`}
                  >
                    <Trash2 size={16} />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Drawer Footer with Cart Summary */}
        {count > 0 && (
          <div className="cart-drawer-footer">
            <CartSummary />
          </div>
        )}
      </aside>
    </div>
  );
};

export default CartDrawer;
