import React, {useState, useEffect} from 'react'
import './App.css'

function App() {
  const[data, setData] = useState([])

  useEffect(()=>{
    fetch('https://jsonplaceholder.typicode.com/users')
    .then(res=> res.json())
    .then(json =>setData(json))
  },[])
  return (
    <div>
      <table>
        <thead>
        <tr>
          <th>ID</th>
          <th>Name</th>
          <th>Username</th>
          <th>Email</th>
          <th>Action</th>
        </tr>
        </thead>
        <tbody>
        {data.map(item=>(
          <tr key={item.id}>
            <td>{item.id}</td>
            <td>{item.name}</td>
            <td>{item.username}</td>
            <td>{item.email}</td>
            <td><button>Add</button><button>Delete</button></td>
          </tr>
        ))}
        </tbody>
      </table>
    </div>
  )
}

export default App