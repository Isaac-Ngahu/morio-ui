import React from "react";
import "./styles/Login.css";
import { useState } from "react";
import Swal from "sweetalert2";
import { useNavigate } from "react-router";
function Login() {
  const navigate = useNavigate();
  const [phoneNumber, setPhoneNumber] = useState("");
  function handleInputChange(e) {
    setPhoneNumber(e.target.value);
  }
  function handleLogin(e) {
    e.preventDefault();
    sessionStorage.setItem("number", phoneNumber);
    navigate("/chat_with_morio");
  }

  return (
    <body>
      <div>
        <h1>Welcome To penzi</h1>
        <h2>Enter your number to start</h2>
        <form onSubmit={handleLogin}>
          <label htmlFor="phone_number">Phone Number</label>
          <input
            type="text"
            name="phone_number"
            value={phoneNumber}
            onChange={handleInputChange}
            required
          />
          <input type="submit" value="Login" />
        </form>
      </div>
    </body>
  );
}

export default Login;
