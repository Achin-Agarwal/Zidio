import React, { useState } from "react";
import axios from "axios";
import { url } from "./url";
import { useNavigate } from "react-router-dom";
import "./AuthForm.css";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [logEmail, setLogEmail] = useState("");
  const [logPassword, setLogPassword] = useState("");
  const [signEmail, setSignEmail] = useState("");
  const [signPassword, setSignPassword] = useState("");
  const [name, setName] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + "user/login", {
        email: logEmail,
        password: logPassword,
      });
      console.log("Login response:", response.data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      localStorage.setItem("name", JSON.stringify(response.data.user.name));
      localStorage.setItem("id", JSON.stringify(response.data.user.id));
      localStorage.setItem("role", JSON.stringify(response.data.user.role));
      if (token) {
        if (response.data.user.role === "admin") {
          navigate("/admin", { state: { user: response.data.user } });
        } else {
          navigate("/dashboard", { state: { user: response.data.user } });
        }
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Login error:", error.response?.data || error.message);
      navigate("/");
    }
  };

  const handleSignup = async(e) => {
    e.preventDefault();
    try {
      const response = await axios.post(url + "user/register", {
        name,
        email: signEmail,
        password: signPassword,
        role: "user",
      });
      console.log("Signup response:", response.data);
      const token = response.data.token;
      localStorage.setItem("token", token);
      if (token) {
        
          navigate("/userdashboard");
      } else {
        navigate("/");
      }
    } catch (error) {
      console.error("Signup error:", error.response?.data || error.message);
      navigate("/");
    }
  };

  return (
    <div className="f-container">
      <div className="form-container">
        <div className="form-toggle">
          <button
            className={isLogin ? "active" : ""}
            onClick={() => setIsLogin(true)}
          >
            Login
          </button>
          <button
            className={!isLogin ? "active" : ""}
            onClick={() => setIsLogin(false)}
          >
            SignUp
          </button>
        </div>

        {isLogin ? (
          <form className="form" onSubmit={handleLogin}>
            <h2>Login Form</h2>
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={logEmail}
              onChange={(e) => setLogEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={logPassword}
              onChange={(e) => setLogPassword(e.target.value)}
              required
            />
            <button type="submit">Login</button>
          </form>
        ) : (
          <form className="form" onSubmit={handleSignup}>
            <h2>SignUp Form</h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={signEmail}
              onChange={(e) => setSignEmail(e.target.value)}
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={signPassword}
              onChange={(e) => setSignPassword(e.target.value)}
              required
            />
            <button type="submit">SignUp</button>
          </form>
        )}
      </div>
    </div>
  );
}
