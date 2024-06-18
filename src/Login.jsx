import React from "react";
import "./styles/Login.css";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [users, setUsers] = useState([]);
  function handleInputChange(e) {
    setFormData((prevData) => ({
      ...prevData,
      [e.target.name]: e.target.value,
    }));
  }
  function fetchUsers() {
    fetch("http://localhost:3031/users")
      .then((res) => res.json().then((data) => setUsers(data)))
      .catch((err) => console.log(err));
  }
  async function handleLogin(e) {
    e.preventDefault();
    await fetchUsers(); // Assuming fetchUsers() is asynchronous
    console.log(users);
    const user = users.find((user) => user.username === formData.username); // Use find instead of filter
    console.log(user);
    if (!user) {
      Swal.fire({
        title: "error",
        text: `no user with username ${formData.username} found`,
        timer: 3000,
      });
      setFormData({
        username: "",
        password: "",
      });
    } else {
      if (
        user.username === formData.username &&
        user.password === formData.password
      ) {
        Swal.fire({
          title: "success",
          text: "you have successfully logged in",
          timer: 3000,
        });
        setFormData({
          username: "", // Adjusted to match your form field names
          password: "", // Adjusted to match your form field names
        });
        navigate("/chat_with_morio");
      } else if (
        user.password !== formData.password &&
        user.username === formData.username
      ) {
        Swal.fire({
          title: "error",
          text: "incorrect password",
          timer: 3000,
        });
        setFormData({
          username: "", // Adjusted to match your form field names
          password: "", // Adjusted to match your form field names
        });
      }
    }
  }

  return (
    <body>
      <div>
        <h1>Login</h1>
        <form onSubmit={handleLogin}>
          <label for="username">Username</label>
          <input
            type="text"
            id="username"
            name="username"
            value={formData.username}
            onChange={handleInputChange}
            required
          />

          <label for="login-password">Password</label>
          <input
            type="password"
            id="password"
            name="password"
            value={formData.password}
            onChange={handleInputChange}
            required
          />

          <input type="submit" value="Login" />
          <p>
            Don't have an account? <a href="/signup">Signup</a>
          </p>
        </form>
      </div>
    </body>
  );
}

export default Login;
