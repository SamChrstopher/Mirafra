import React, { useState, useEffect } from "react";
import "./App.css";

function App() {
  const [apiData, setApiData] = useState([]);

  useEffect(() => {
    fetch("https://fakestoreapi.in/api/products")
      .then((response) => response.json())
      .then((data) => setApiData(data.products));
  });
  return (
    <div className="container">
      <div className="navbar">
        <ul>
          <li>Home</li>
          <li>About</li>
          <li>Services</li>
          <li>Contact</li>
          <li>Dashboard</li>
          <li>Login</li>
          <li>Register</li>
        </ul>
      </div>
      <h1>Product Page</h1>
      <div className="products">
        {apiData.map((item) => {
          return (
            <div className="card" key={item.id}>
              <div>
                <img src={item.image} alt="Image" onError={(e)=>{
                  e.target.onerror = null;
                  e.target.src="https://cdn-icons-png.flaticon.com/512/12311/12311758.png";
                }} />
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
                <button>Add to Card</button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default App;
