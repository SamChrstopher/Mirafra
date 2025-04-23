import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [apiData, setApiData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [filteredData, setFilteredData] = useState([]);
  const [count, setCount] = useState(0);
  const [isMobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    fetch("https://fakestoreapi.com/products")
      .then((response) => response.json())
      .then((data) => {
        setApiData(data);
        setFilteredData(data);
      });
  }, []);

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
            className={isMobileMenuOpen ? "fi fi-br-cross" : "fi fi-rr-menu-burger"}
          ></i>
        </div>

        <ul className={`nav-links ${isMobileMenuOpen ? "active" : ""}`}>
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
        </ul>

        <span className="icon2">
          <i className="fi fi-sr-shopping-cart-check logo-icon2"></i> {count}
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
                  <h2 className="price">Price: {item.price}</h2>
                </div>
                {/* <div className="desc">
                <p>{item.description}</p>
              </div> */}
                <div className="btn">
                  <button onClick={() => setCount(count + 1)}>
                    Add to Cart
                  </button>
                </div>
              </div>
            );
          })
        )}
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
