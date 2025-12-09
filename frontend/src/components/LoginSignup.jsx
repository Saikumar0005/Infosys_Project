import React, { useState } from 'react';

const LoginSignup = () => {
  const [action, setAction] = useState("Login");
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: ""
  });

  const changeHandler = (e) => {
    setFormData({...formData, [e.target.name]: e.target.value});
  }

  const handleSubmit = async () => {
    console.log("Function executed", formData);
    let responseData;
    
    if (action === "Login") {
        await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json()).then((data) => responseData = data);
    } else {
        await fetch('http://localhost:5000/signup', {
            method: 'POST',
            headers: {
                Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData),
        }).then((response) => response.json()).then((data) => responseData = data);
    }

    if (responseData) {
        if (responseData.message === "Login successful") {
            setIsLoggedIn(true);
        } else {
            alert(responseData.message || "Success!");
        }
    }
  }

  if (isLoggedIn) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
        <div className="text-center">
          <h1 className="text-5xl font-bold text-sky-600 mb-4">Modern Banking System</h1>
          <p className="text-xl text-gray-600">Welcome to the future of banking.</p>
          <button 
            onClick={() => setIsLoggedIn(false)}
            className="mt-8 px-6 py-2 bg-sky-500 text-white rounded-full hover:bg-sky-600 transition duration-200"
          >
            Logout
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="w-full max-w-md bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="px-8 py-10">
          <div className="text-center mb-10">
            <h2 className="text-3xl font-bold text-gray-800">{action}</h2>
            <div className="w-16 h-1 bg-sky-500 mx-auto mt-2 rounded-full"></div>
          </div>
          
          <div className="space-y-6">
            {action === "Sign Up" && (
              <div className="relative">
                <input 
                  name="name"
                  value={formData.name}
                  onChange={changeHandler}
                  type="text" 
                  placeholder="Name" 
                  className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
                />
              </div>
            )}
            
            <div className="relative">
              <input 
                name="email"
                value={formData.email}
                onChange={changeHandler}
                type="email" 
                placeholder="Email Address" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
              />
            </div>
            
            <div className="relative">
              <input 
                name="password"
                value={formData.password}
                onChange={changeHandler}
                type="password" 
                placeholder="Password" 
                className="w-full px-4 py-3 bg-gray-50 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-sky-500 focus:border-transparent transition duration-200"
              />
            </div>
          </div>

          {action === "Login" && (
            <div className="mt-4 text-right">
              <a href="#" className="text-sm text-sky-500 hover:text-sky-700 font-medium">Forgot Password?</a>
            </div>
          )}

          <div className="mt-8 flex gap-4">
             {action === "Sign Up" ? (
                <div className="w-full flex flex-col gap-4">
                    <button 
                        className="w-full py-3 rounded-full font-semibold text-lg bg-sky-500 text-white shadow-lg hover:bg-sky-600 transition duration-200"
                        onClick={handleSubmit}
                    >
                    Sign Up
                    </button>
                    <p className="text-center text-gray-500">Already have an account? <span className="text-sky-500 cursor-pointer" onClick={() => setAction("Login")}>Login</span></p>
                </div>
             ) : (
                <div className="w-full flex flex-col gap-4">
                    <button 
                        className="w-full py-3 rounded-full font-semibold text-lg bg-sky-500 text-white shadow-lg hover:bg-sky-600 transition duration-200"
                        onClick={handleSubmit}
                    >
                    Login
                    </button>
                    <p className="text-center text-gray-500">Don't have an account? <span className="text-sky-500 cursor-pointer" onClick={() => setAction("Sign Up")}>Sign Up</span></p>
                </div>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginSignup;
