//@ts-nocheck
import Input from "../components/Input";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import PasswordStrengthMeter from "../components/PasswordStrengthMeter";
import { useAuthStore } from "../store/store"; // Importing the useAuthStore

const Register = () => {
  const [username, setUsername] = useState("");  // Change from 'name' to 'username'

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const { register, error, isLoading } = useAuthStore(); // Destructure Register, error, and isLoading from the store

  const handleSignUp = async (e) => {
    e.preventDefault();

    try {
      await register(email, password, username);  // Use 'username' instead of 'name'
      console.log('user created');
      navigate("/login");
    } catch (error) {
      console.log(error.message);
    }
  };


  return (
    <div className="max-w-md w-full bg-zinc-800 bg-opacity-50 backdrop-filter backdrop-blur-xl rounded-2xl shadow-xl overflow-hidden">
      <div className="p-8">
        <h2 className="text-3xl font-bold mb-6 text-center bg-gradient-to-r from-sky-400 to-blue-500 text-transparent bg-clip-text">
          Create Account
        </h2>

        <form onSubmit={handleSignUp}>
          <Input
            type="text"
            placeholder="Username"  // Change placeholder to reflect 'Username'
            value={username}
            onChange={(e) => setUsername(e.target.value)}  // Update to 'username'
          />

          <Input
            type="email"
            placeholder="Email Address"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <p className="text-red-500 font-semibold mt-2">{error}</p>} {/* Display error message */}
          <PasswordStrengthMeter password={password} />

          <button
            className="mt-5 w-full py-3 px-4 bg-gradient-to-r from-sky-500 to-blue-600 text-white 
            font-bold rounded-lg shadow-lg hover:from-sky-600
            hover:to-blue-700 focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2
             focus:ring-offset-zinc-900 transition duration-200"
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? "Loading..." : "Sign Up"}
          </button>
        </form>
      </div>
      <div className="px-8 py-4 bg-zinc-900 bg-opacity-50 flex justify-center">
        <p className="text-sm text-zinc-400">
          Already have an account?{" "}
          <Link to={"/login"} className="text-sky-400 hover:underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
