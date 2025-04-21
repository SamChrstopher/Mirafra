import React, {useState, useEffect} from 'react'

function App() {
  const initialValues = {username: "", email: "", password: ""}
  const[formValues, setFormValues] = useState(initialValues)
  const[formErrors, setFormErrors] = useState({})
  const[isSubmit, setIsSubmit] = useState(false)

  const handleChange =(e)=>{
    const{name, value} = e.target;
    setFormValues({...formValues, [name]:value});
  }
  const handleSubmit = (e)=>{
    e.preventDefault();
    setFormErrors(validate(formValues));
    setIsSubmit(true);
  }
  useEffect(()=>{
    console.log(formErrors);
    if(Object.keys(formErrors).length==0 && isSubmit){
      console.log(formValues)
    }
  },[formErrors])

  const validate = (values)=>{
    const errors={}
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if(!values.username){
      errors.username="Please Enter the Username";
    }
    if(!values.email){
      errors.email = "Please Enter the Email";
    }else if(!emailRegex.test(values.email)){
      errors.email = "Please Enter the Valid Email Format";
    }
    if(!values.password){
      errors.password = "Please enter the password"
    }else if(values.password.length<5){
      errors.password = "Password Must be Greater than 5";
    }else if(values.password.length>10){
      errors.password = "Password Must be Less than 10";
    }
    return errors
  }

  return (
    <div className='container'>
      {Object.keys(formErrors).length==0 && isSubmit? <div>Signed In Successful</div> : <div>Enter the Correct Details below!</div>}
      <h2>Form Validation</h2>
      <form onSubmit={handleSubmit}>
        <div className='ui form'>
          <div>
            <label htmlFor="username">Username: </label>
            <input type="text" name="username" id="username" value={formValues.username} onChange={handleChange} />
          </div>
          <p>{formErrors.username}</p>
          <div>
            <label htmlFor="email">Email: </label>
            <input type="text" name="email" id="email" value={formValues.email} onChange={handleChange} />
          </div>
          <p>{formErrors.email}</p>
          <div>
            <label htmlFor="password">Password: </label>
            <input type="text" name="password" id="password" value={formValues.password} onChange={handleChange} />
          </div>
          <p>{formErrors.password}</p>
        </div>
        <button>Submit</button>
      </form>
    </div>
  )
}

export default App