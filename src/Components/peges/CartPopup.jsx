import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, toggleCart, clearCart } from './cartSlice';
import { Link } from 'react-router-dom';
import * as styles from './CartPopup.module.css';

const CartPopup = () => {
  const dispatch = useDispatch();
  const { items, isCartOpen } = useSelector(state => state.cart);
  const { isAuth } = useSelector(state => state.profile);

  if (!isCartOpen) return null;

  const total = items.reduce((sum, item) => sum + (item.price * item.quantity), 0).toFixed(2);

  const handleCheckout = () => {
    if (!isAuth) {
      alert("Для оформления заказа необходимо войти в систему");
      return;
    }
    if (items.length === 0) {
      alert("Ваша корзина пуста");
      return;
    }
    alert(`Заказ на сумму ${total}₽ оформлен!`);
    dispatch(clearCart());
  };

  return (
    <div className={`${styles['cart-popup-overlay']} ${isCartOpen ? styles.open : ''}`} onClick={() => dispatch(toggleCart())}>
      <div className={styles['cart-popup']} onClick={(e) => e.stopPropagation()}>
        <div className={styles['cart-header']}>
          <h3>Ваша корзина</h3>
          <button className={styles['close-btn']} onClick={() => dispatch(toggleCart())}>
            ×
          </button>
        </div>
        
        {items.length === 0 ? (
          <div className={styles['empty-cart']}>
            <h2>Корзина пуста</h2>
            <p>Добавьте товары из каталога</p>
            <Link to="/products" onClick={() => dispatch(toggleCart())}>
              Перейти в каталог
            </Link>
          </div>
        ) : (
          <>
            <div className={styles['cart-items']}>
              {items.map(item => (
                <div key={item.id} className={styles['cart-item']}>
                  <img src={`./img/${item.img}`} alt={item.title} />
                  <div className={styles['item-info']}>
                    <h4>{item.title}</h4>
                    <div className={styles['quantity-controls']}>
                      <button onClick={() => 
                        dispatch(updateQuantity({
                          id: item.id,
                          quantity: Math.max(1, item.quantity - 1)
                        }))}
                      >
                        -
                      </button>
                      <span>{item.quantity}</span>
                      <button onClick={() => 
                        dispatch(updateQuantity({
                          id: item.id,
                          quantity: item.quantity + 1
                        }))}
                      >
                        +
                      </button>
                    </div>
                    <p>{item.price}₽ × {item.quantity} = {(item.price * item.quantity).toFixed(2)}₽</p>
                  </div>
                  <button
                    className={styles['remove-btn']}
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Удалить
                  </button>
                </div>
              ))}
            </div>
            <div className={styles['cart-summary']}>
              <div className={styles.total}>
                Итого: <span>{total}₽</span>
              </div>
              <button className={styles['checkout-btn']} onClick={handleCheckout}>
                Оформить заказ
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default CartPopup;