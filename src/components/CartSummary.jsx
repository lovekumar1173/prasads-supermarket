import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  ShieldCheck,
  ArrowRight,
  Sparkles,
  Trash2,
  CheckCircle2,
} from 'lucide-react';
import {
  selectCartCount,
  selectCartTotal,
  clearCart,
  closeCart,
} from '../redux/cartSlice';

export const CartSummary = () => {
  const dispatch = useDispatch();
  const count = useSelector(selectCartCount);
  const subtotal = useSelector(selectCartTotal);
  const [isOrdered, setIsOrdered] = useState(false);

  // Free delivery threshold: ₹199
  const deliveryFee = subtotal > 199 || count === 0 ? 0 : 25;
  const grandTotal = subtotal + deliveryFee;

  const handleCheckout = () => {
    setIsOrdered(true);
    setTimeout(() => {
      dispatch(clearCart());
      setIsOrdered(false);
      dispatch(closeCart());
      alert(
        `🎉 Thank you for your order at Prasad's Supermarket! Your ${count} items total ₹${grandTotal} will be delivered within 10-15 minutes.`
      );
    }, 1200);
  };

  if (count === 0) return null;

  return (
    <div className="cart-summary-card">
      <div className="cart-summary-header">
        <h3 className="summary-title">Bill Details</h3>
        <button
          type="button"
          className="cart-clear-link"
          onClick={() => dispatch(clearCart())}
          title="Remove all items from cart"
        >
          <Trash2 size={14} />
          <span>Clear All</span>
        </button>
      </div>

      <div className="summary-rows">
        <div className="summary-row">
          <span className="row-label">
            Items Subtotal ({count} {count === 1 ? 'item' : 'items'})
          </span>
          <span className="row-value">₹{subtotal}</span>
        </div>

        <div className="summary-row">
          <span className="row-label">Delivery Fee</span>
          <span className="row-value">
            {deliveryFee === 0 ? (
              <span className="free-tag">FREE</span>
            ) : (
              `₹${deliveryFee}`
            )}
          </span>
        </div>

        {subtotal < 199 && (
          <div className="free-delivery-hint">
            <Sparkles size={13} className="hint-icon" />
            <span>
              Add <strong>₹{199 - subtotal}</strong> more for FREE delivery
            </span>
          </div>
        )}

        <div className="summary-divider" />

        <div className="summary-row grand-total-row">
          <span className="total-label">Grand Total</span>
          <span className="total-amount">₹{grandTotal}</span>
        </div>
      </div>

      <button
        type="button"
        className={`checkout-btn ${isOrdered ? 'processing' : ''}`}
        onClick={handleCheckout}
        disabled={isOrdered}
      >
        {isOrdered ? (
          <>
            <CheckCircle2 size={18} className="spin-icon" />
            <span>Placing Order...</span>
          </>
        ) : (
          <>
            <span>Proceed to Checkout</span>
            <ArrowRight size={18} />
          </>
        )}
      </button>

      <div className="secure-badge">
        <ShieldCheck size={14} className="shield-icon" />
        <span>Safe & Encrypted Checkout • 100% Buyer Protection</span>
      </div>
    </div>
  );
};

export default CartSummary;
