"use client"
import { isTokenValid } from '@/utils/checkAdminToken';
import { CHATBOT_BACKEND_URL } from '@/utils/env';
import { useRouter } from 'next/navigation';
import { useState, useEffect } from 'react';

const Page = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const router = useRouter();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (isTokenValid(token)) {
      router.push("/admin");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      const res = await fetch(`${CHATBOT_BACKEND_URL}/adminlogin`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await res.json();
      if (res.ok) {
        setMessage("✅ Login successful!");
        localStorage.setItem("adminToken", data.token);
        router.push("/admin");
      } else {
        setMessage(`❌ ${data.message || "Login failed"}`);
      }
    } catch (err) {
      console.error(err);
      setMessage("❌ An error occurred. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900">
      <div className="w-full max-w-sm p-6 bg-gray-800 rounded-2xl shadow-lg">
        <h2 className="text-2xl font-semibold text-gray-100 text-center mb-6">
          Admin Login
        </h2>
        <form
          className="flex flex-col gap-4 text-gray-200"
          onSubmit={handleLogin}
        >
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="p-2 rounded-lg bg-gray-700 border border-gray-600 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-gray-500"
            required
          />
          <button
            type="submit"
            disabled={loading}
            className={`p-2 rounded-lg text-white transition ${
              loading
                ? "bg-gray-600 cursor-not-allowed"
                : "bg-gray-700 hover:bg-gray-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>
        {message && (
          <p className="mt-4 text-center text-sm text-gray-400">{message}</p>
        )}
      </div>
    </div>
  );
};

export default Page;
