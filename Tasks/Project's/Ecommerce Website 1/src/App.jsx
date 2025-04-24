import React, { useState, useEffect, useRef } from "react";
import "./App.css";

function App() {
  const [apiData, setApiData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const printRef = useRef();

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
        setFilteredData(data);
      });
  }, []);

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

  // Update the quantity of a cart item
  const handleQuantityChange = (id, quantity) => {
    setCartItems(
      cartItems.map((item) => (item.id === id ? { ...item, quantity } : item))
    );
  };

  // Remove an item from the cart
  const handleRemoveItem = (id) => {
    setCartItems(cartItems.filter((item) => item.id !== id));
  };

  // Handle the purchase button
  const handlePurchase = () => {
    const printContents = printRef.current.innerHTML;
    const originalContents = document.body.innerHTML;
    alert("Proceeding to the Checkout...")
    document.body.innerHTML = printContents; 
    window.print(); 
    document.body.innerHTML = originalContents; 

    setCartItems([]); 
    window.location.reload();
  };

  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);

    const filtered = apiData.filter((item) =>
      item.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredData(filtered);
  };

  return (
    <div className="container">
      <div className="navbar">
        <i className="fi fi-brands-shopify logo-icon"></i>

        <input
          className="search"
          type="search"
          placeholder="Search..."
          value={searchItem}
          onChange={handleChange}
        />

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

        <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
        </ul>

        <span className="icon2" onClick={() => setIsCartOpen(true)}>
          <i className="fi fi-sr-shopping-cart-check logo-icon2"></i>{" "}
          {cartItems.reduce((acc, item) => acc + item.quantity, 0)}
        </span>
      </div>

      <h1>TRENDING NOW</h1>
      <div className="products">
        {filteredData.length === 0 ? (
          <p>No Product Found!</p>
        ) : (
          filteredData.map((item) => {
            return (
              <div className="card" key={item.id}>
                <div>
                  <img
                    src={item.image}
                    alt="Image"
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
            );
          })
        )}
      </div>

      {/* Cart Sidebar */}
      {isCartOpen && (
        <div className="cart-sidebar">
          <div className="cart-header">
            <h2>Your Cart</h2>
            <button onClick={() => setIsCartOpen(false)} className="close-cart">
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
                    .reduce((acc, item) => acc + item.price * item.quantity, 0)
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
  );
}

export default App;
