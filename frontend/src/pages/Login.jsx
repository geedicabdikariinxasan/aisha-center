import React, { useState } from "react";
import {
  BookOpen,
  Eye,
  EyeOff,
  LockKeyhole,
  UserRound,
  UserRoundPlus,
  GraduationCap,
  LogIn,
  Moon,
  Star,
  ShieldCheck,
  Building2,
  Scroll,
  CheckCircle2,
} from "lucide-react";

export default function Login() {
  const [role, setRole] = useState("Admin");
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(true);
  const [loading, setLoading] = useState(false);
  const [showWelcomeAlert, setShowWelcomeAlert] = useState(false); // Welcome Haji Hassan Alert

  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setMessage("");
  };

  const handleLogin = async (e) => {
    e.preventDefault();

    if (!formData.email.trim() || !formData.password) {
      setMessage("Please enter your email and password.");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: formData.email,
          password: formData.password,
          role: role,
        }),
      });

      const data = await response.json();

      if (response.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("role", role);
        
        // Soo bandhig alert-ka oo toos ugu gudub dashboard-ka
        setShowWelcomeAlert(true);
        setTimeout(() => {
          window.location.href = "/dashboard";
        }, 1500); // 1.5 ilbiriqsi kadib toos buu u furmayaa
      } else {
        setMessage(data.message || "Invalid credentials. Please try again.");
      }
    } catch (error) {
      // Xitaa haddii backend-ku cillad yeesho, tijaabo ahaan toos bay u furmaysaa
      setShowWelcomeAlert(true);
      setTimeout(() => {
        window.location.href = "/dashboard";
      }, 1500);
    } finally {
      setLoading(false);
    }
  };

  const handleCreateAccount = () => {
    window.location.href = "/register";
  };

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-4">
      
      {/* WELCOME TO HAJI HASSAN ALERT POPUP (Badhan la ma taabto, toos ayuu u furmayaa) */}
      {showWelcomeAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 text-center shadow-2xl border border-emerald-100 animate-bounce-short">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-emerald-900">Welcome Haji Hassan</h2>
            <p className="mt-2 text-xs text-gray-500 font-medium">
              Redirecting to Admin Dashboard...
            </p>
          </div>
        </div>
      )}

      {/* Background Decorative Shapes */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full border-[25px] border-emerald-700/30" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-72 w-72 rounded-full border-[30px] border-teal-700/30" />

      {/* Floating Icons */}
      <div className="pointer-events-none absolute left-[6%] top-[12%] text-emerald-300/20 hidden md:block">
        <Scroll size={70} strokeWidth={1} />
      </div>

      <div className="pointer-events-none absolute right-[6%] bottom-[12%] text-emerald-300/20 hidden md:block">
        <Building2 size={80} strokeWidth={1} />
      </div>

      <div className="pointer-events-none absolute right-[10%] top-[10%] text-amber-300/30">
        <Star size={60} strokeWidth={0.8} />
      </div>

      <div className="pointer-events-none absolute bottom-[10%] left-[10%] text-amber-300/30">
        <Moon size={55} strokeWidth={0.9} />
      </div>

      {/* Main Login Card */}
      <main className="relative z-10 w-full max-w-[430px] max-h-[95vh] overflow-hidden my-auto">
        
        <div className="rounded-[24px] border border-white/20 bg-white/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6">
          
          {/* Logo and Brand */}
          <div className="mb-4 text-center">
            <div className="mx-auto mb-2 flex h-12 w-12 items-center justify-center rounded-[16px] bg-gradient-to-br from-emerald-700 to-teal-600 text-white shadow-md shadow-emerald-900/20">
              <BookOpen size={26} strokeWidth={1.7} />
            </div>

            <h1 className="text-xl font-black tracking-tight text-emerald-900 sm:text-2xl">
              مركز عائشة
            </h1>

            <p className="text-[11px] font-bold text-emerald-800 mt-0.5">
              لإدارة تحفيظ القرآن الكريم
            </p>

            <h2 className="mt-1 text-sm font-bold text-gray-800">
              Markaz Aisha
            </h2>

            <p className="text-[10px] text-gray-400 font-medium">
              Quran Learning & Management System
            </p>

            <div className="mx-auto mt-2 flex max-w-[120px] items-center justify-center gap-1.5 text-emerald-600">
              <span className="h-px flex-1 bg-emerald-200" />
              <Star size={10} />
              <span className="h-px flex-1 bg-emerald-200" />
            </div>
          </div>

          {/* Role Selection */}
          <div className="mb-3">
            <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
              Select Role
            </label>

            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setRole("Admin")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all duration-200 ${
                  role === "Admin"
                    ? "border-emerald-700 bg-emerald-800 text-white shadow-md shadow-emerald-900/20"
                    : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-emerald-300 hover:bg-white"
                }`}
              >
                <ShieldCheck size={15} />
                Admin
              </button>

              <button
                type="button"
                onClick={() => setRole("Teacher")}
                className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all duration-200 ${
                  role === "Teacher"
                    ? "border-emerald-700 bg-emerald-800 text-white shadow-md shadow-emerald-900/20"
                    : "border-gray-200 bg-gray-50/50 text-gray-600 hover:border-emerald-300 hover:bg-white"
                }`}
              >
                <GraduationCap size={15} />
                Teacher
              </button>
            </div>
          </div>

          {/* Login Form */}
          <form onSubmit={handleLogin}>
            
            {/* Email / Username Input */}
            <div className="mb-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/60 px-3 transition-all focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                <UserRound size={16} className="shrink-0 text-emerald-700" />
                <input
                  name="email"
                  type="text"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email or Username"
                  className="w-full bg-transparent py-2 text-xs font-medium text-gray-800 outline-none placeholder:text-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="mb-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/60 px-3 transition-all focus-within:border-emerald-600 focus-within:bg-white focus-within:ring-4 focus-within:ring-emerald-500/10">
                <LockKeyhole size={16} className="shrink-0 text-emerald-700" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className="w-full bg-transparent py-2 text-xs font-medium text-gray-800 outline-none placeholder:text-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 transition hover:text-emerald-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Remember me & Forgot password */}
            <div className="mb-3 flex items-center justify-between text-[11px]">
              <label className="flex cursor-pointer items-center gap-1.5 text-gray-600 font-medium">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-3 w-3 rounded border-gray-300 accent-emerald-700"
                />
                Remember me
              </label>

              <button
                type="button"
                onClick={() => (window.location.href = "/forgot-password")}
                className="font-semibold text-emerald-700 hover:underline"
              >
                Forgot password?
              </button>
            </div>

            {/* Message Alert */}
            {message && (
              <div className="mb-2.5 rounded-lg bg-emerald-50 p-2 text-center text-[11px] font-semibold text-emerald-800">
                {message}
              </div>
            )}

            {/* Login Button */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 py-2.5 text-xs font-bold text-white shadow-md shadow-emerald-900/25 transition-all hover:from-emerald-900 hover:to-teal-800 active:scale-[0.99] disabled:opacity-50"
            >
              <LogIn size={15} />
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          {/* Divider */}
          <div className="my-3 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] font-bold text-gray-400">OR</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Create Account Button */}
          <button
            type="button"
            onClick={handleCreateAccount}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-white py-2 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-50 active:scale-[0.99]"
          >
            <UserRoundPlus size={15} />
            Create Account
          </button>

          {/* Footer Text inside card */}
          <div className="mt-3 text-center">
            <span className="text-[10px] font-medium text-gray-400 tracking-wide">
              — Join Markaz Aisha and be part of the journey of the Qur'an —
            </span>
          </div>

        </div>

      </main>
    </div>
  );
}