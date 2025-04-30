import React, { useState, useEffect, useRef } from "react";
import db from "./db.json";
import "./App.css";

function App() {
  const [apiData, setApiData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [categories, setCategories] = useState([]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(true);
  const [isRegister, setIsRegister] = useState(false);
  const [userProfilePic, setUserProfilePic] = useState(null);
  const [registeredUser, setRegisteredUser] = useState(null);
  const [errorMessage, setErrorMessage] = useState("");

  const [showHeader, setShowHeader] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");

  const printRef = useRef();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const localData = db; 
        setApiData(localData);
        setFilteredData(localData);

      
        const uniqueCategories = [
          ...new Set(localData.map((item) => item.category)),
        ];
        setCategories(uniqueCategories);
      } catch (error) {
        console.error("Error loading local products:", error);
      }
    };

    fetchProducts();

    // User authentication check
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUserProfilePic(parsedUser.profilePic);
      setShowAuthModal(false);
    }
  }, []);

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (
      registeredUser &&
      email === registeredUser.email &&
      password === registeredUser.password
    ) {
      const userData = {
        email,
        profilePic:
          "https://files.idyllic.app/files/static/2618803?width=384&optimizer=image",
      };
      localStorage.setItem("user", JSON.stringify(userData));

      setIsAuthenticated(true);
      setUserProfilePic(userData.profilePic);
      setShowAuthModal(false);
      setErrorMessage("");
    } else {
      setErrorMessage("❌ Please enter the correct email or password.");
    }
    alert("Welcome!");
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value;

    // Save registered user
    setRegisteredUser({ email, password, username });
    setIsRegister(false); 
    setErrorMessage("✅ Registered successfully. Please login.");
    alert("Registration Successful ✅");
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserProfilePic(null);
    setShowAuthModal(true);
  };

  // Add item to the cart
  const handleAddToCart = (product) => {
    const existingItem = cartItems.find((item) => item.id === product.id);
    if (existingItem) {
      setCartItems(
        cartItems.map((item) =>
          item.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        )
      );
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const handleQuantityChange = (id, quantity) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Remove an item from the cart
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handlePurchase = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    alert("Proceeding to the Checkout...");
    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

    setCartItems([]);
    window.location.reload();
  };

  // Search handler
  const handleChange = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    setSearchItem(searchTerm);

    if (searchTerm.trim() === "") {
      setShowHeader(true);
    } else {
      setShowHeader(false);
    }

    const filtered = apiData.filter(
      (product) =>
        product.title.toLowerCase().includes(searchTerm) ||
        product.category.toLowerCase().includes(searchTerm)
    );
    setFilteredData(filtered);
  };

  const handleCategoryFilter = (category) => {
    const filteredByCategory = apiData.filter(
      (product) => product.category === category
    );
    setFilteredData(filteredByCategory);
  };

  const capitalizeWords = (str) => {
    return str
      .split(" ")
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
      .join(" ");
  };

  return (
    <div className="container">
      <div className="navbar">
        <div className="navbar-row1">
          <div className="logo-section">
            <i className="fi fi-brands-shopify logo-icon"></i>
            <h2 className="shop-name">QuickBasket</h2>
          </div>
          <div className="right-icons">
            <div
              className="menu-icon"
              onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
            >
              <i
                className={
                  isMobileMenuOpen ? "fi fi-br-cross" : "fi fi-rr-menu-burger"
                }
              ></i>
            </div>
            <div className="profile-section">
              {isAuthenticated ? (
                <img
                  src={userProfilePic}
                  alt="Profile"
                  className="profile-pic"
                  onClick={handleLogout}
                  title="Click to logout"
                />
              ) : (
                <img
                  src="https://i.pinimg.com/736x/b6/e3/1a/b6e31a84c99848a3822f8770db472627.jpg"
                  alt="Default profile"
                  className="profile-pic"
                  onClick={() => setShowAuthModal(true)}
                  title="Login"
                />
              )}
            </div>
            <span className="icon2" onClick={() => setIsCartOpen(true)}>
              <i className="fi fi-sr-shopping-cart-check logo-icon2"></i>{" "}
              {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
            </span>
          </div>
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <li>
            <span className="material-symbols-outlined nav-logo">home</span>{" "}
            Home
          </li>
          <li>
            <span className="material-symbols-outlined nav-logo">info</span>{" "}
            About
          </li>
          <li>
            <span className="material-symbols-outlined nav-logo">
              home_repair_service
            </span>{" "}
            Services
          </li>
          <li
            className={`dropdown ${isDropdownOpen ? "active" : ""}`}
            onClick={() => setIsDropdownOpen(!isDropdownOpen)}
          >
            <span className="material-symbols-outlined nav-logo">
              local_mall
            </span>
            Products <i className="fi fi-rr-angle-small-down"></i>
            <ul className="dropdown-menu">
              <li onClick={() => setFilteredData(apiData)}>All Products</li>
              {categories.map((category, index) => (
                <li key={index} onClick={() => handleCategoryFilter(category)}>
                  {capitalizeWords(category)}
                </li>
              ))}
            </ul>
          </li>
          <li>
            <span className="material-symbols-outlined nav-logo">mail</span>{" "}
            Contact
          </li>
        </ul>

        <div className="navbar-row3">
          <input
            className="search"
            type="search"
            placeholder="Search..."
            value={searchItem}
            onChange={handleChange}
          />
        </div>
      </div>

      {/* Offer Image */}
      {searchItem.trim() === "" && (
        <div className="offer-section">
          <img
            src="./src/assets/7005953.jpg" 
            alt="Special Offer"
            className="offer-image"
          />
        </div>
      )}

      {/* Auth Modal */}
      {showAuthModal && (
        <div className="auth-modal">
          <div className="auth-box">
            <h2>{isRegister ? "Sign Up" : "Login"}</h2>

            <form onSubmit={isRegister ? handleRegister : handleLogin}>
              <input type="email" name="email" placeholder="Email" required />
              <input
                type="password"
                name="password"
                placeholder="Password"
                required
              />
              {isRegister && (
                <input
                  type="text"
                  name="username"
                  placeholder="Username"
                  required
                />
              )}
              <button type="submit">{isRegister ? "Register" : "Login"}</button>
            </form>

            {/* Show error or success message */}
            {errorMessage && (
              <p
                style={{
                  color: errorMessage.includes("❌") ? "red" : "green",
                  marginTop: "10px",
                }}
              >
                {errorMessage}
              </p>
            )}

            <p className="toggle-link">
              {isRegister ? "Already have an account?" : "Not registered?"}{" "}
              <span onClick={() => setIsRegister(!isRegister)}>
                {isRegister ? "Login here" : "Register now"}
              </span>
            </p>
          </div>
        </div>
      )}
      <div className={`page-content ${!isAuthenticated ? "blurred" : ""}`}>
        <h1>🛒 Explore Our Latest Products</h1>
        <div className="products" ref={printRef}>
          {filteredData.length === 0 ? (
            <p>No products found!</p>
          ) : (
            filteredData.map((item) => (
              <div className="card" key={item.id}>
                <div>
                  <img
                    src={
                      item.image ||
                      "https://cdn-icons-png.flaticon.com/512/12311/12311758.png"
                    }
                    alt={item.title || "Product Image"}
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src =
                        "https://cdn-icons-png.flaticon.com/512/12311/12311758.png";
                    }}
                  />
                </div>
                <div>
                  <h3>{item.title}</h3>
                </div>
                <div>
                  <h2 className="price">Price: ${item.price}</h2>
                </div>
                <div className="btn">
                  <button onClick={() => handleAddToCart(item)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            ))
          )}
        </div>

        {/* Cart Sidebar */}
        {isCartOpen && (
          <div className="cart-sidebar">
            <div className="cart-header">
              <h2>Your Cart</h2>
              <button
                onClick={() => setIsCartOpen(false)}
                className="close-cart"
              >
                X
              </button>
            </div>
            <div className="cart-items">
              {cartItems.length === 0 ? (
                <p>Your cart is empty!</p>
              ) : (
                cartItems.map((item) => (
                  <div key={item.id} className="cart-item">
                    <img src={item.image} alt={item.title} />
                    <div className="cart-item-details">
                      <h4>{item.title}</h4>
                      <div className="quantity">
                        <button
                          className="btn-decrement"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity - 1)
                          }
                          disabled={item.quantity <= 1}
                        >
                          -
                        </button>
                        <span>{item.quantity}</span>
                        <button
                          className="btn-increment"
                          onClick={() =>
                            handleQuantityChange(item.id, item.quantity + 1)
                          }
                        >
                          +
                        </button>
                      </div>
                      <p>Price: ${item.price * item.quantity}</p>
                      <button
                        onClick={() => handleRemoveItem(item.id)}
                        className="remove-item"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="cart-footer">
              <button onClick={handlePurchase} className="purchase-button">
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
        <div style={{ display: "none" }}>
          <div ref={printRef}>
            <h2>Invoice</h2>
            <table border="1" cellPadding="10" cellSpacing="0" width="100%">
              <thead>
                <tr>
                  <th>Product</th>
                  <th>Qty</th>
                  <th>Price</th>
                  <th>Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                <tr>
                  <td
                    colSpan="3"
                    style={{ textAlign: "right", fontWeight: "bold" }}
                  >
                    Grand Total:
                  </td>
                  <td style={{ fontWeight: "bold" }}>
                    $
                    {cartItems
                      .reduce(
                        (acc, item) => acc + item.price * item.quantity,
                        0
                      )
                      .toFixed(2)}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
        <footer className="footer">
          <div className="footer-content">
            <div className="footer-section about">
              <h2>ShopNow</h2>
              <p>
                Your one-stop destination for trending products. Quality
                guaranteed!
              </p>
            </div>
            <div className="footer-section links">
              <h3>Quick Links</h3>
              <ul>
                <li>
                  <a href="#">Home</a>
                </li>
                <li>
                  <a href="#">About</a>
                </li>
                <li>
                  <a href="#">Services</a>
                </li>
                <li>
                  <a href="#">Contact</a>
                </li>
              </ul>
            </div>
            <div className="footer-section contact">
              <h3>Contact Us</h3>
              <p>Email: support@shopnow.com</p>
              <p>Phone: +91 82785 00787</p>
            </div>
          </div>
          <div className="footer-bottom">
            <p>&copy; 2025 ShopNow. All rights reserved.</p>
          </div>
        </footer>
      </div>
    </div>
  );
}

export default App;
