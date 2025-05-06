import React, { useState, useEffect } from "react";
import Axios from "axios";

function App() {
  useEffect(() => {
    //Get Request
    Axios.get("https://jsonplaceholder.typicode.com/posts")
      .then((response) => {
        console.log("Response Data:", response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    //Post Request
    Axios.post("https://jsonplaceholder.typicode.com/posts", {
      title: "Learn Axios",
      body: "Axios is awesome!",
      userId: 1,
    })
      .then((response) => {
        console.log("POST response:", response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
    const axios = require("axios");

    //Put Request
    Axios.put("https://jsonplaceholder.typicode.com/posts/1", {
      id: 1,
      title: "Updated Title",
      body: "Updated Body Content",
      userId: 1,
    })
      .then((response) => {
        console.log("PUT response:", response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    //Patch
    Axios.patch("https://jsonplaceholder.typicode.com/posts/1", {
      title: "Only Title Updated",
    })
      .then((response) => {
        console.log("PATCH response:", response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });

    //Delete Request
    Axios.delete("https://jsonplaceholder.typicode.com/posts/1")
      .then((response) => {
        console.log("DELETE response:", response.data);
      })
      .catch((error) => {
        console.log("Error:", error);
      });
  }, []);

  return <div>App</div>;
}

export default App;
