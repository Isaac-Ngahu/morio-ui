import React from "react";
import "./styles/Login.css";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";

function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    email: "",
  });
  function handleInputChange(e) {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }
  function handleSignup(e) {
    e.preventDefault();
    fetch("http://localhost:3031/users", {
      method: "POST",
      headers: {
        "Content-type": "application/json",
      },
      body: JSON.stringify(formData),
    })
      .then((res) => console.log(res.data))
      .catch((err) => console.log(err));
    setFormData({
      username: "",
      password: "",
      email: "",
    });
    Swal.fire({
      title: "success",
      text: "user created successfully",
      timer: 3000,
    });
    navigate("/");
  }
  return (
    <body>
      <div class="container">
        <h1>Sign Up</h1>
        <form onSubmit={handleSignup}>
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          <label for="password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />
          <label for="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleInputChange}
            required
          />

          <input type="submit" value="Sign Up" />
        </form>
      </div>
    </body>
  );
}

export default Signup;
