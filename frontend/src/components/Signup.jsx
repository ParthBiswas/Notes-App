import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";

const Signup = ({ setUser }) => {
  const [name, setName] = useState("");
  const [dob, setDOB] = useState("");
  const [email, setEmail] = useState("");
  const [otp, setOtp] = useState("");
  const [error, setError] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const navigate = useNavigate();

  const handleSendOtp = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await axios.post(
       ` ${__API_URL__}/api/auth/signup/send`,
        { name,dob,email },
        { headers: { "Content-Type": "application/json" } }
      );
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
        `${__API_URL__}/api/auth/signup/verify`,
        { email, otp: String(otp).trim() },
        { headers: { "Content-Type": "application/json" }, withCredentials: true }
      );

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      setUser(data);
      navigate("/");
    } catch (error) {
      console.error("Verify OTP error:", error.response || error);
      setError(error.response?.data?.message || "Invalid OTP");
    }
  };

  return (
    <div className="container mx-auto max-w-md mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-center">Sign Up</h2>
      {error && <p className="text-red-500 mb-4 text-center">{error}</p>}

      {!otpSent ? (
        <form onSubmit={handleSendOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="date"
            placeholder="Date of Birth"
            value={dob}
            onChange={(e) => setDOB(e.target.value)}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
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
        <form onSubmit={handleVerifyOtp} className="space-y-4">
          <input
            type="text"
            placeholder="Enter OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
            className="w-full px-3 py-2 border rounded-md outline-none focus:ring-2 focus:ring-blue-400"
            required
          />

          <button
            type="submit"
            className="w-full bg-green-500 text-white py-2 rounded-md hover:bg-green-700"
          >
            Verify OTP
          </button>
        </form>
      )}

      <p className="mt-4 text-center">
        Already have an account?{" "}
        <Link to="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
};

export default Signup;
