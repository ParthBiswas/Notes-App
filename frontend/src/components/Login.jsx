import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';

axios.defaults.withCredentials = true;

const Login = ({ setUser }) => {
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false); 
  const navigate = useNavigate();

  
  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      
      await axios.post(`${__API_URL__}/api/auth/login/send`, { email }, {
        headers: { "Content-Type": "application/json" },
      });
      setOtpSent(true);
    } catch (error) {
      console.error("Send OTP error:", error.response || error);
      setError(error.response?.data?.message || "Failed to send OTP");
    }
  };

  
  const handleVerifyOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      
      const { data } = await axios.post(
  `${__API_URL__}/api/auth/login/verify`,
  {
    email: email,
    otp: String(otp).trim(), 
  },
  {
    headers: { "Content-Type": "application/json" }, 
    withCredentials: true
  }
);

      // if backend returns token
      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setUser(data); // update global user state
      navigate("/");
    } catch (error) {
      console.error("Verify OTP error:", error.response || error);
      setError(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Login</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {!otpSent ? (
        // STEP 1: SEND OTP
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Email"
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-700"
          >
            Send OTP
          </button>
        </form>
      ) : (
        // STEP 2: VERIFY OTP
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            placeholder="Enter OTP"
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-700"
          >
            Verify OTP & Login
          </button>
        </form>
      )}

      <p className="mt-4 text-center">
        Don't have an account?{" "}
        <Link to="/signup" className="text-blue-600 hover:underline">
          SignUp
        </Link>
      </p>
    </div>
  );
};

export default Login;
