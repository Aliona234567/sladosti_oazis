import React, { useState, useEffect } from 'react';
import { NavLink, Link, useLocation } from "react-router-dom";
import { PiShoppingCart } from "react-icons/pi";
import { FaBars, FaTimes } from "react-icons/fa";
import { useSelector, useDispatch } from 'react-redux';
import { 
  toggleCart,
  removeFromCart,
  clearCart,
  updateQuantity
} from './peges/cartSlice';
import './Navbar.module.css';

const Navbar = () => {
  const dispatch = useDispatch();
  const location = useLocation();
  const { isAuth, loggedInUser } = useSelector(state => state.profile || {});
  const { items = [], isCartOpen = false } = useSelector(state => state.cart || {});
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Закрываем корзину при изменении маршрута
  useEffect(() => {
    if (isCartOpen) {
      dispatch(toggleCart(false));
    }
  }, [location.pathname]);

  const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);

  const calculateTotal = () => {
    return items.reduce((sum, item) => {
      if (typeof item.price === 'number') {
        return sum + (item.price * item.quantity);
      }
      const price = parseFloat(item.price.replace(/[^0-9.]/g, ''));
      return sum + (isNaN(price) ? 0 : price * item.quantity);
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (!isAuth) {
      alert("Для оформления заказа необходимо войти в систему");
      return;
    }
    if (items.length === 0) {
      alert("Ваша корзина пуста");
      return;
    }
    alert(`Заказ на сумму ${calculateTotal()}₽ оформлен!`);
    dispatch(clearCart());
  };

  const handleQuantityChange = (id, newQuantity) => {
    if (newQuantity < 1) return;
    dispatch(updateQuantity({ id, quantity: newQuantity }));
  };

  const renderCartContent = () => {
    if (items.length === 0) {
      return (
        <div className='empty-cart'>
          <h2>Корзина пуста</h2>
          <p>Добавьте товары из каталога</p>
          <NavLink 
            to="/products" 
            onClick={() => dispatch(toggleCart(false))}
          >
            Перейти в каталог
          </NavLink>
        </div>
      );
    }

    return (
      <>
        <div className="cart-items">
          {items.map(item => (
            <div key={item.id} className="cart-item">
              <img src={`./img/${item.img}`} alt={item.title} />
              <div className="item-info">
                <h4>{item.title}</h4>
                <div className="quantity-controls">
                  <button onClick={() => handleQuantityChange(item.id, item.quantity - 1)}>
                    -
                  </button>
                  <span>{item.quantity}</span>
                  <button onClick={() => handleQuantityChange(item.id, item.quantity + 1)}>
                    +
                  </button>
                </div>
                <p>{(item.price * item.quantity).toFixed(2)}₽</p>
              </div>
              <button 
                className="remove-btn"
                onClick={() => dispatch(removeFromCart(item.id))}
              >
                Удалить
              </button>
            </div>
          ))}
        </div>
        <div className="cart-summary">
          <div className="total">
            Итого: <span>{calculateTotal()}₽</span>
          </div>
          <button 
            className='checkout-btn'
            onClick={handleCheckout}
          >
            Оформить заказ
          </button>
        </div>
      </>
    );
  };

  const toggleMobileMenu = () => {
    setIsMenuOpen(!isMenuOpen);
    // Закрываем корзину при открытии меню
    if (isCartOpen) {
      dispatch(toggleCart(false));
    }
  };

  const closeAllMenus = () => {
    setIsMenuOpen(false);
    if (isCartOpen) {
      dispatch(toggleCart(false));
    }
  };

  const handleCartToggle = () => {
    dispatch(toggleCart());
    setIsMenuOpen(false);
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        <Link to="/" className='logo' onClick={closeAllMenus}>
          Оазис
        </Link>

        {/* Кнопка мобильного меню */}
        <button className="mobile-menu-btn" onClick={toggleMobileMenu}>
          {isMenuOpen ? <FaTimes /> : <FaBars />}
        </button>

        {/* Затемнение фона при открытом меню */}
        {isMenuOpen && (
          <div className="menu-overlay" onClick={closeAllMenus} />
        )}

        {/* Основное меню навигации */}
        <nav className={`nav-links-container ${isMenuOpen ? 'active' : ''}`}>
          <ul className='nav-links'>
            {isAuth ? (
              <>
                <li className="user-greeting">
                  <NavLink to="/profile" onClick={closeAllMenus}>
                    {loggedInUser?.name || 'Профиль'}
                  </NavLink>
                </li>
                <li>
                  <NavLink to="/about" onClick={closeAllMenus}>О нас</NavLink>
                </li>
                <li>
                  <NavLink to="/products" onClick={closeAllMenus}>Продукты</NavLink>
                </li>
                <li>
                  <NavLink to="/contact" onClick={closeAllMenus}>Контакты</NavLink>
                </li>
              </>
            ) : (
              <>
                <li>
                  <NavLink to="/login" onClick={closeAllMenus}>Войти</NavLink>
                </li>
                <li>
                  <NavLink to="/register" onClick={closeAllMenus}>Регистрация</NavLink>
                </li>
                <li>
                  <NavLink to="/about" onClick={closeAllMenus}>О нас</NavLink>
                </li>
                <li>
                  <NavLink to="/products" onClick={closeAllMenus}>Продукты</NavLink>
                </li>
              </>
            )}

            <li className="cart-icon">
              <PiShoppingCart 
                onClick={handleCartToggle}
                className={`shop-cart-button ${isCartOpen ? 'active' : ''}`} 
              />
              {totalItems > 0 && (
                <span className="cart-badge">{totalItems}</span>
              )}
            </li>
          </ul>
        </nav>

        {/* Попап корзины */}
        {isCartOpen && (
          <div className="cart-popup-overlay" onClick={() => dispatch(toggleCart(false))}>
            <div className="cart-popup" onClick={(e) => e.stopPropagation()}>
              <div className="cart-header">
                <h3>Ваша корзина</h3>
                <button 
                  className="close-btn"
                  onClick={() => dispatch(toggleCart(false))}
                >
                  ×
                </button>
              </div>
              {renderCartContent()}
            </div>
          </div>
        )}
      </div>
    </header>
  );
};

export default Navbar;