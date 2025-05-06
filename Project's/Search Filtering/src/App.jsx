import React, { useState, useEffect } from "react";
import './App.css'

function App() {
  const [apiData, setApiData] = useState([]);
  const [searchItem, setSearchItem] = useState("");
  const [filteredData, setFilteredData] = useState([]);

  useEffect(() => {
    fetch("https://dummyjson.com/users")
      .then((response) => response.json())
      .then((data) => {
        setApiData(data.users);
        setFilteredData(data.users);
      })
      .catch((error) => console.log("Error: ", error));
  }, []);

  const handleChange = (e) => {
    const searchTerm = e.target.value;
    setSearchItem(searchTerm);
    const filteredUsers = apiData.filter((item) => (
      item.firstName.toLowerCase().includes(searchTerm.toLowerCase())
    ))
    setFilteredData(filteredUsers);
  };
  return (
    <div className="container">
      <input type="text" value={searchItem} onChange={handleChange} placeholder="Search by firstName..." />
      {filteredData.length === 0 ? (
        <h3>No users Found!</h3>
      ) : (
        <ul>
          {filteredData.map((item) => (
            <li key={item.id}>{item.firstName}</li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default App;
