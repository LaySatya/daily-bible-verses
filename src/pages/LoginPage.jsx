import { useState } from "react";
import { useAuth } from "../hooks/useAuth";
import { login } from "../api/auth/authApi";
import { FaCross } from "react-icons/fa"; // Ensure react-icons is installed
import BibleImage from "../assets/images/bible.png"; // Adjust the path as necessary

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const [success, setSuccess] = useState("");
  const { login: setToken, setIsLoading, isLoading } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");
    setSuccess("");
    setFieldErrors({});
    try {
      const data = await login({ email, password });
      setToken(data.token);
      if (data.user && data.user.name) {
        localStorage.setItem("userName", data.user.name);
      }
      setSuccess(data.message || "Login successful");
      // refresh page 
      window.location.reload();
    } catch (err) {
      setFieldErrors(err.details || {});
      setError(err.error || err.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-slate-900 p-4">
      {/* App Name at the very top of the page (always visible) */}
      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-white mb-2 flex"> <FaCross className="text-5xl mx-2 text-teal-300"/> DailyBibleNote</h1>
        <p className="text-xl text-slate-400">
          Your spiritual journey, recorded.
        </p>
      </div>

      {/* Main Login Card - flex-col on mobile, flex-row on desktop */}
      <div className="flex flex-col md:flex-row w-full max-w-4xl bg-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {/* Left Side: Image Section (Top on mobile, Left on desktop) */}
        <div
          className="w-full h-64 md:w-1/2 md:h-auto bg-cover bg-center relative flex jus items-center justify-center  p-8" // h-64 fixed height for mobile, h-auto for desktop
        >
          <img src={BibleImage} className="h-56" alt="" />
          {/* Optional: Overlay on the image for text readability / theme consistency */}
          <div className="absolute inset-0 bg-slate-700 opacity-30"></div>{" "}
          {/* Adjust opacity as needed */}
          <div className="relative z-10 text-white text-center">
            {/* FaCross icon on the image */}
            {/* <FaCross className='text-6xl text-teal-300 mx-auto' style={{ textShadow: '0 0 10px rgba(0, 255, 255, 0.8)' }} /> */}
          </div>
        </div>

        {/* Right Side: Login Form Section (Bottom on mobile, Right on desktop) */}
        <div className="w-full md:w-1/2 p-8 flex flex-col justify-center">
          <h2 className="text-3xl font-bold text-white mb-6 text-center">
            Login to your account
          </h2>

          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            {error && <div className="text-red-400 text-sm">{error}</div>}
            {success && (
              <div className="text-green-400 text-sm mb-2">{success}</div>
            )}

            <div>
              <label className="label text-slate-300 text-sm">Email</label>
              <input
                type="email"
                className="input input-bordered bg-slate-700 text-white w-full
                           focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent rounded-md"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              {fieldErrors.email && (
                <div className="text-red-400 text-xs mt-1">
                  {fieldErrors.email.join(", ")}
                </div>
              )}
            </div>

            <div>
              <label className="label text-slate-300 text-sm">Password</label>
              <input
                type="password"
                className="input input-bordered bg-slate-700 text-white w-full
                           focus:outline-none focus:ring-2 focus:ring-teal-300 focus:border-transparent rounded-md"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
              {fieldErrors.password && (
                <div className="text-red-400 text-xs mt-1">
                  {fieldErrors.password.join(", ")}
                </div>
              )}
            </div>

            <button
              className="btn bg-teal-400 hover:bg-teal-700 border-0 text-white font-semibold py-3 px-4 rounded-lg transition duration-200 ease-in-out text-md mt-4"
              type="submit"
              disabled={isLoading}
            >
              {isLoading ? (
                <span className="loading loading-spinner loading-sm"></span> // DaisyUI spinner
              ) : (
                "Login"
              )}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
