import React, { useState, useEffect, useRef } from "react";
import db from "./db.json";
import "./App.css";

import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

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

  const [showAbout, setShowAbout] = useState(false);
  const [showService, setShowService] = useState(false);
  const [showContact, setShowContact] = useState(false);

  const [isChatOpen, setIsChatOpen] = useState(false);
  const [animatedMessage, setAnimatedMessage] = useState("");

  const printRef = useRef();

  const [isOrderHistoryOpen, setIsOrderHistoryOpen] = useState(false);
  const [showCartDropdown, setShowCartDropdown] = useState(false);

  const [orderHistory, setOrderHistory] = useState(() => {
    const stored = localStorage.getItem("orderHistory");
    return stored ? JSON.parse(stored) : [];
  });

  const images = [
    "https://cdn.venngage.com/template/thumbnail/full/5a5f1c47-6934-45fc-b94e-447e4b6a7567.webp",
    "https://cdn.shopify.com/s/files/1/0355/8296/7943/files/po-banner_a8ef554f-bbf2-4b3e-8bfb-d6673e9cb2c1.jpg?v=1644383681",
    "https://www.sammobile.com/wp-content/uploads/2017/09/anniversary_banner_d.jpg",
    "https://www.grodoor.in/uploads/category_banner/476238707b4a74bb27adceb7b2db702daed598.png",
    "https://thecare.com.sg/wp-content/uploads/2022/07/TC-Main-Banner-2-3.jpg",
  ];

  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    autoplay: true,
    autoplaySpeed: 3000,
    slidesToShow: 1,
    slidesToScroll: 1,
    arrows: false,
  };

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

    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setIsAuthenticated(true);
      setUserProfilePic(parsedUser.profilePic);
      setShowAuthModal(false);
    }
  }, []);

  useEffect(() => {
    if (isChatOpen) {
      const fullMessage = `Hello, Good ${getGreetingTime()}!\nHow can I help you today?`;
      let index = 0;
      const interval = setInterval(() => {
        setAnimatedMessage(fullMessage.slice(0, index));
        index++;
        if (index > fullMessage.length) clearInterval(interval);
      }, 30); 
    } else {
      setAnimatedMessage("");
    }
  }, [isChatOpen]);

  useEffect(() => {
    setErrorMessage(""); 
  }, [isRegister]);

  const goToNext = () => {
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const getGreetingTime = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "morning";
    if (hour < 18) return "afternoon";
    return "evening";
  };

  const handleLogin = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (!registeredUser) {
      setErrorMessage("❌ Please register before login.");
      return;
    }

    if (
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

      alert(`✅ Welcome ${registeredUser.username || "User"}!`);
    } else {
      setErrorMessage("❌ Please enter the correct email or password.");
    }
  };

  const handleRegister = (e) => {
    e.preventDefault();
    const email = e.target.email.value;
    const password = e.target.password.value;
    const username = e.target.username.value;

    setRegisteredUser({ email, password, username });
    alert("✅ Registered successfully. Please login.");

    setErrorMessage(""); 
    setIsRegister(false); 
  };

  const handleLogout = () => {
    localStorage.removeItem("user");
    setIsAuthenticated(false);
    setUserProfilePic(null);
    setShowAuthModal(true);
  };

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

  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  const handlePurchase = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;

    alert("✅ Proceeding to the Checkout...");

    const newOrder = {
      id: Date.now(),
      date: new Date().toLocaleDateString(),
      time: new Date().toLocaleTimeString(),
      items: cartItems.map((item) => ({
        id: item.id,
        title: item.title,
        image: item.image,
        price: item.price,
        quantity: item.quantity,
        total: (item.price * item.quantity).toFixed(2),
      })),
      total: cartItems.reduce(
        (acc, item) => acc + item.quantity * item.price,
        0
      ),
    };

    const updatedHistory = [...orderHistory, newOrder];
    setOrderHistory(updatedHistory);
    localStorage.setItem("orderHistory", JSON.stringify(updatedHistory));

    document.body.innerHTML = printContents;
    window.print();
    document.body.innerHTML = originalContents;

    setCartItems([]);
    window.location.reload();
  };

  const handleSubmit2 = (e) => {
    e.preventDefault();

    const modalBox = document.querySelector(".modal-box");
    modalBox.classList.add("fade-out");

    setTimeout(() => {
      setShowContact(false);
      alert("✅ Message sent successfully!");
    }, 300); 
  };

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
      <div className="navbar-mobile">
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
              <div
                className="cart-icon-wrapper"
                onMouseEnter={() => setShowCartDropdown(true)}
                onMouseLeave={() => setShowCartDropdown(false)}
              >
                <span className="cart-icon" title="Cart">
                  <i className="fi fi-sr-shopping-cart-check logo-icon22"></i>
                  <span className="cart-count">{cartItems.length}</span>
                </span>

                {showCartDropdown && (
                  <div className="cart-dropdown">
                    <div
                      onClick={() => {
                        setIsCartOpen(true);
                        setShowCartDropdown(false);
                      }}
                    >
                      🛒 Your Cart
                    </div>
                    <div
                      onClick={() => {
                        setIsOrderHistoryOpen(true);
                        setShowCartDropdown(false);
                      }}
                    >
                      📦 History
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
          <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
            <li>
              <span className="material-symbols-outlined nav-logo">home</span>{" "}
              Home
            </li>
            <li
              onClick={(e) => {
                e.preventDefault();
                setShowAbout(true);
              }}
            >
              <span className="material-symbols-outlined nav-logo nav-link">
                info
              </span>{" "}
              About
            </li>
            <li onClick={() => setShowService(true)}>
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
                  <li
                    key={index}
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {capitalizeWords(category)}
                  </li>
                ))}
              </ul>
            </li>
            <li onClick={() => setShowContact(true)}>
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
      </div>
      <div className="navbar-desktop">
        <div className="navbar2">
          <div className="logo-section2">
            <i className="fi fi-brands-shopify logo-icon2"></i>
            <h2 className="shop-name2">QuickBasket</h2>
          </div>
          <input
            className="search2"
            type="search"
            placeholder="Search..."
            value={searchItem}
            onChange={handleChange}
          />
          <div
            className="menu-icon2"
            onClick={() => setMobileMenuOpen(!isMobileMenuOpen)}
          >
            <i
              className={
                isMobileMenuOpen ? "fi fi-br-cross" : "fi fi-rr-menu-burger"
              }
            ></i>
          </div>
          <ul className={`nav-links2 ${isMobileMenuOpen ? "active2" : ""}`}>
            <li>
              <span className="material-symbols-outlined nav-logo">home</span>{" "}
              Home
            </li>
            <li
              onClick={(e) => {
                e.preventDefault();
                setShowAbout(true);
              }}
            >
              <span className="material-symbols-outlined nav-logo">info</span>{" "}
              About
            </li>
            <li onClick={() => setShowService(true)}>
              <span className="material-symbols-outlined nav-logo">
                home_repair_service
              </span>{" "}
              Services
            </li>
            <li
              className={`dropdown2 ${isDropdownOpen ? "active2" : ""}`}
              onClick={() => setIsDropdownOpen(!isDropdownOpen)}
            >
              <span className="material-symbols-outlined nav-logo">
                local_mall
              </span>
              Products <i className="fi fi-rr-angle-small-down"></i>
              <ul className="dropdown-menu2">
                <li onClick={() => setFilteredData(apiData)}>All Products</li>
                {categories.map((category, index) => (
                  <li
                    key={index}
                    onClick={() => handleCategoryFilter(category)}
                  >
                    {capitalizeWords(category)}
                  </li>
                ))}
              </ul>
            </li>
            <li onClick={() => setShowContact(true)}>
              <span className="material-symbols-outlined nav-logo">mail</span>{" "}
              Contact
            </li>
          </ul>
          <div className="right-icons2">
            <div className="profile-section2">
              {isAuthenticated ? (
                <img
                  src={userProfilePic}
                  alt="Profile"
                  className="profile-pic2"
                  onClick={handleLogout}
                  title="Click to logout"
                />
              ) : (
                <img
                  src="https://i.pinimg.com/736x/b6/e3/1a/b6e31a84c99848a3822f8770db472627.jpg"
                  alt="Default profile"
                  className="profile-pic2"
                  onClick={() => setShowAuthModal(true)}
                  title="Login"
                />
              )}
            </div>
            <div
              className="cart-icon-wrapper"
              onMouseEnter={() => setShowCartDropdown(true)}
              onMouseLeave={() => setShowCartDropdown(false)}
            >
              <span className="cart-icon" title="Cart">
                <i className="fi fi-sr-shopping-cart-check logo-icon22"></i>
                <span className="cart-count">{cartItems.length}</span>
              </span>

              {showCartDropdown && (
                <div className="cart-dropdown">
                  <div
                    onClick={() => {
                      setIsCartOpen(true);
                      setShowCartDropdown(false);
                    }}
                  >
                    🛒 Your Cart
                  </div>
                  <div
                    onClick={() => {
                      setIsOrderHistoryOpen(true);
                      setShowCartDropdown(false);
                    }}
                  >
                    📦 History
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {searchItem.trim() === "" && (
        <div style={{ width: "80%", margin: "0 auto", paddingTop: "20px" }}>
          <Slider {...settings}>
            {images.map((img, index) => (
              <div key={index}>
                <img
                  src={img}
                  alt={`Slide ${index + 1}`}
                  className="carousel-image"
                  style={{
                    width: "100%",
                    height: "auto",
                    objectFit: "contain",
                    borderRadius: "10px",
                  }}
                />
              </div>
            ))}
          </Slider>
        </div>
      )}

      {isOrderHistoryOpen && (
        <div className="order-history-sidebar">
          <div className="order-history-header">
            <h2>Order History</h2>
            <span
              className="close-button2"
              onClick={() => setIsOrderHistoryOpen(false)}
            >
              ❌
            </span>
          </div>

          <div className="order-history-content">
            {orderHistory.length === 0 ? (
              <p>No order history found.</p>
            ) : (
              orderHistory.map((order, index) => (
                <div key={index} className="order-block">
                  <div className="order-datetime">
                    <span>{order.date}</span>
                    <span>{order.time}</span>
                  </div>
                  <div className="order-products">
                    {order.items.map((item, i) => (
                      <div key={i} className="order-product-row">
                        <img
                          src={item.image}
                          alt={item.title}
                          className="order-product-img"
                        />
                        <span className="order-product-title">
                          {item.title}
                        </span>
                        <div className="order-product-details">
                          <span className="order-product-qty">
                            x{item.quantity}
                          </span>
                          <span className="order-product-price">
                            ₹{item.total}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>

          {orderHistory.length > 0 && (
            <div className="clear-history-container">
              <button
                className="clear-history-button"
                onClick={() => {
                  setOrderHistory([]);
                  localStorage.removeItem("orderHistory");
                }}
              >
                Clear History
              </button>
            </div>
          )}
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

      {isChatOpen && (
        <div className="chat-box">
          <div className="chat-header">
            <span className="chat-header-left">
              <span className="chat-person-icon">👤</span> Customer Support
            </span>
            <span className="chat-close" onClick={() => setIsChatOpen(false)}>
              &times;
            </span>
          </div>
          <div className="chat-body">
            <div className="bot-message">
              <span className="bot-icon">👤</span>
              <p className="typing-text">{animatedMessage}</p>
            </div>
          </div>
          <div className="chat-input">
            <input type="text" placeholder="Type your message..." disabled />
            <button disabled>Send</button>
          </div>
        </div>
      )}
      <div
        className="chat-icon"
        onClick={() => setIsChatOpen(true)}
        title="Chat with us"
      >
        💬
      </div>

      {showAbout && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              className="close-button"
              onClick={() => setShowAbout(false)}
              title="Close"
            >
              &times;
            </button>

            <h2 className="modal-title">
              <span role="img" aria-label="cart">
                🛒
              </span>{" "}
              About <span style={{ color: "#4CAF50" }}>Quick Basket</span>
            </h2>
            <br />

            <p className="modal-text">
              <span role="img" aria-label="sparkle">
                ✨
              </span>{" "}
              <strong>Quick Basket</strong> is your go-to destination for
              hassle-free, enjoyable online shopping. We blend quality,
              affordability, and convenience to bring the best products right to
              your doorstep.
            </p>

            <p className="modal-text">
              <span role="img" aria-label="delivery">
                🚀
              </span>{" "}
              <strong>Fast Delivery:</strong> We offer same-day or next-day
              delivery in most cities to make your experience swift and
              seamless.
            </p>

            <p className="modal-text">
              <span role="img" aria-label="shield">
                🛡️
              </span>{" "}
              <strong>Secure Shopping:</strong> Your data and payments are
              protected with industry-grade encryption and security protocols.
            </p>

            <p className="modal-text">
              <span role="img" aria-label="support">
                🤝
              </span>{" "}
              <strong>Dedicated Support:</strong> Our team is here 24/7 to
              assist you with orders, returns, and questions—your satisfaction
              is our priority.
            </p>

            <p className="modal-text">
              <span role="img" aria-label="gift">
                🎁
              </span>{" "}
              <strong>Exciting Deals:</strong> Enjoy regular discounts, cashback
              offers, and member-only perks to get the best value on every
              purchase.
            </p>

            <p
              className="modal-text"
              style={{
                textAlign: "center",
                marginTop: "20px",
                color: "#4CAF50",
                fontWeight: "bold",
              }}
            >
              Thank you for choosing Quick Basket!
            </p>
          </div>
        </div>
      )}

      {showService && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              className="close-button"
              onClick={() => setShowService(false)}
              title="Close"
            >
              &times;
            </button>

            <h2 className="modal-title">
              <span role="img" aria-label="gear">
                🛠️
              </span>{" "}
              Our Services at{" "}
              <span style={{ color: "#4CAF50" }}>Quick Basket</span>
            </h2>
            <br />

            <p className="modal-text">
              <span role="img" aria-label="fast">
                🚚
              </span>{" "}
              <strong>Fast & Reliable Delivery:</strong> Get your orders
              delivered at lightning speed across major cities with real-time
              tracking.
            </p>

            <p className="modal-text">
              <span role="img" aria-label="payment">
                💳
              </span>{" "}
              <strong>Secure Payment Options:</strong> Choose from multiple safe
              payment methods—Credit/Debit Cards, UPI, Wallets, and more.
            </p>

            <p className="modal-text">
              <span role="img" aria-label="returns">
                🔄
              </span>{" "}
              <strong>Easy Returns & Refunds:</strong> Hassle-free return policy
              with quick refunds for eligible items.
            </p>

            <p className="modal-text">
              <span role="img" aria-label="support">
                📞
              </span>{" "}
              <strong>24/7 Customer Support:</strong> Our friendly support team
              is always ready to help you via chat, email, or phone.
            </p>
          </div>
        </div>
      )}
      {showContact && (
        <div className="modal-overlay">
          <div className="modal-box">
            <button
              className="close-button"
              onClick={() => setShowContact(false)}
              title="Close"
            >
              &times;
            </button>

            <h2 className="modal-title">
              📞 Contact <span style={{ color: "#4CAF50" }}>Quick Basket</span>
            </h2>
            <br />

            <form className="contact-form" onSubmit={handleSubmit2}>
              <label htmlFor="name">👤 Name:</label>
              <input
                type="text"
                id="name"
                name="name"
                placeholder="Enter your name"
                required
              />

              <label htmlFor="email">📧 Email:</label>
              <input
                type="email"
                id="email"
                name="email"
                placeholder="Enter your email"
                required
              />

              <label htmlFor="message">💬 Message:</label>
              <textarea
                id="message"
                name="message"
                rows="3"
                placeholder="Your message..."
                required
              ></textarea>

              <button type="submit" className="contact-submit">
                ✅ Get in touch with us
              </button>
            </form>
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
                ✅ Proceed to Checkout
              </button>
            </div>
          </div>
        )}
        <div style={{ display: "none" }}>
          <div
            ref={printRef}
            style={{
              fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
              padding: "40px",
              color: "#333",
              maxWidth: "800px",
              margin: "auto",
              border: "2px solid #eee",
            }}
          >
  
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: "30px",
              }}
            >
              <div>
                <h1 style={{ fontSize: "36px", margin: 0, color: "#2E86C1" }}>
                  🛍️ Quick Basket
                </h1>
                <p style={{ fontSize: "14px", color: "#777" }}>
                  support@quickbasket.com
                  <br />
                  www.quickbasket.com
                </p>
              </div>
              <div style={{ textAlign: "right" }}>
                <p style={{ fontSize: "16px", marginBottom: "5px" }}>
                  <strong>Invoice ID:</strong> #
                  {Math.floor(Math.random() * 100000)}
                </p>
                <p style={{ fontSize: "16px" }}>
                  <strong>Date:</strong> {new Date().toLocaleDateString()}
                  <br />
                  <strong>Time:</strong> {new Date().toLocaleTimeString()}
                </p>
              </div>
            </div>

            {/* Table */}
            <table
              border="1"
              cellPadding="12"
              cellSpacing="0"
              width="100%"
              style={{ borderCollapse: "collapse", border: "1px solid #ccc" }}
            >
              <thead style={{ backgroundColor: "#f4f6f7", color: "#333" }}>
                <tr>
                  <th>🛒 Product</th>
                  <th>📦 Qty</th>
                  <th>💰 Price</th>
                  <th>🧮 Total</th>
                </tr>
              </thead>
              <tbody>
                {cartItems.map((item) => (
                  <tr key={item.id}>
                    <td>{item.title}</td>
                    <td style={{ textAlign: "center" }}>{item.quantity}</td>
                    <td>${item.price.toFixed(2)}</td>
                    <td>${(item.price * item.quantity).toFixed(2)}</td>
                  </tr>
                ))}
                <tr style={{ backgroundColor: "#f9f9f9", fontWeight: "bold" }}>
                  <td colSpan="3" style={{ textAlign: "right" }}>
                    Grand Total:
                  </td>
                  <td>
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

            <div
              style={{
                marginTop: "40px",
                textAlign: "center",
                color: "#555",
                fontSize: "14px",
              }}
            >
              <p>
                Thank you for shopping with <strong>Quick Basket</strong>! 😊
              </p>
              <p>
                Visit again at <strong>www.quickbasket.com</strong>
              </p>
            </div>
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
                <li
                  onClick={(e) => {
                    e.preventDefault();
                    setShowAbout(true);
                  }}
                >
                  <a href="#">About</a>
                </li>
                <li onClick={() => setShowService(true)}>
                  <a href="#">Services</a>
                </li>
                <li onClick={() => setShowContact(true)}>
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
