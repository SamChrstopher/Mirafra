import React, { useState } from 'react';
import axios from 'axios';
import './App.css'

function App() {
  const [query, setQuery] = useState('');
  const [articles, setArticles] = useState([]);

  const API_KEY = 'd6486588d2a84fcbbe0daf880aa87030';

  const handleSearch = async () => {
    try {
      const response = await axios.get(
        `https://newsapi.org/v2/top-headlines?q=${query}&apiKey=${API_KEY}&language=en`
      );
      setArticles(response.data.articles);
    } catch (error) {
      console.error("Error fetching news:", error);
    }
  };

  return (
    <div className="container">
      <h1>News App</h1>

      <input
        type="text"
        placeholder="Enter city/place..."
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <button onClick={handleSearch}>Search News</button>

      <div className="news-cards">
        {articles.map((news, index) => (
          <div key={index} className="card">
            <img src={news.urlToImage} alt="news" />
            <h3>{news.title}</h3>
            <p>{news.description}</p>
            <a href={news.url} target="_blank" rel="noreferrer">Read More</a>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;
