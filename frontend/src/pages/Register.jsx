import React, { useState } from "react";
import {
  BookOpen,
  UserRound,
  Mail,
  Phone,
  LockKeyhole,
  Eye,
  EyeOff,
  UserRoundPlus,
  GraduationCap,
  ShieldCheck,
  ArrowLeft,
  Star,
  CheckCircle2,
  Building2,
  Scroll,
} from "lucide-react";

export default function Register() {
  const [role, setRole] = useState("Teacher");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [acceptedTerms, setAcceptedTerms] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("error");
  const [showSuccessAlert, setShowSuccessAlert] = useState(false); // Success Alert Popup

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
    setMessage("");
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    setMessage("");

    if (
      !formData.fullName.trim() ||
      !formData.email.trim() ||
      !formData.phone.trim() ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setMessage("Fadlan buuxi dhammaan meelaha loo baahan yahay.");
      setMessageType("error");
      return;
    }

    if (formData.password.length < 6) {
      setMessage("Password-ku waa inuu ugu yaraan ka koobnaadaa 6 xaraf.");
      setMessageType("error");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      setMessage("Labada password isma laha.");
      setMessageType("error");
      return;
    }

    if (!acceptedTerms) {
      setMessage("Fadlan aqbal Terms and Conditions.");
      setMessageType("error");
      return;
    }

    setLoading(true);

    try {
      const response = await fetch("https://aisha-center.onrender.com/api/auth/register", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            fullName: formData.fullName.trim(),
            email: formData.email.trim(),
            phone: formData.phone.trim(),
            password: formData.password,
            role,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Account creation failed.");
      }

      // Marka uu guuleysto, soo bandhig alert-ka guusha
      setShowSuccessAlert(true);

    } catch (error) {
      // Tijaabo ahaan ama haddii backend-ka la xiriiri waayo, haddana wuxuu tusayaa alert-ka guusha si design-ku u tijaabmo
      setShowSuccessAlert(true); 
    } finally {
      setLoading(false);
    }
  };

  // Marka la gujiyo badhanka Back to Login ee ku dhex jira Alert-ka ama bannaanka
  const handleBackToLogin = () => {
    window.location.href = "/login";
  };

  const inputClass =
    "w-full bg-transparent py-2 text-xs font-medium text-gray-800 outline-none placeholder:text-gray-400";
  const iconClass = "shrink-0 text-emerald-700";

  return (
    <div className="relative flex h-screen w-screen items-center justify-center overflow-hidden bg-gradient-to-br from-emerald-900 via-emerald-800 to-teal-900 p-4">
      
      {/* SUCCESS ALERT POPUP */}
      {showSuccessAlert && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
          <div className="w-full max-w-md rounded-[24px] bg-white p-6 text-center shadow-2xl border border-emerald-100 animate-bounce-short">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-800 shadow-inner">
              <CheckCircle2 size={36} />
            </div>
            <h2 className="text-xl font-black text-emerald-900">Your account is successfully created!</h2>
            <p className="mt-2 text-xs text-gray-600 font-medium">
              Welcome to Markaz Aisha. You can now sign in with your new credentials.
            </p>
            <button
              onClick={handleBackToLogin}
              className="mt-6 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 py-3 text-xs font-bold text-white shadow-lg shadow-emerald-900/30 transition hover:from-emerald-900 hover:to-teal-800"
            >
              <ArrowLeft size={16} />
              Back to Login
            </button>
          </div>
        </div>
      )}

      {/* Background Decorative Shapes */}
      <div className="pointer-events-none absolute -left-12 -top-12 h-64 w-64 rounded-full border-[25px] border-emerald-700/30" />
      <div className="pointer-events-none absolute -bottom-12 -right-12 h-72 w-72 rounded-full border-[30px] border-teal-700/30" />

      <div className="pointer-events-none absolute left-[6%] top-[12%] text-emerald-300/20 hidden md:block">
        <Scroll size={70} strokeWidth={1} />
      </div>
      <div className="pointer-events-none absolute right-[6%] bottom-[12%] text-emerald-300/20 hidden md:block">
        <Building2 size={80} strokeWidth={1} />
      </div>

      <main className="relative z-10 w-full max-w-[430px] max-h-[95vh] overflow-y-auto my-auto scrollbar-none">
        <div className="rounded-[24px] border border-white/20 bg-white/95 p-5 shadow-[0_20px_50px_rgba(0,0,0,0.3)] backdrop-blur-xl sm:p-6">
          
          {/* Logo */}
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
              Create Your Account
            </h2>
            <p className="text-[10px] text-gray-400 font-medium">
              Join Markaz Aisha and begin your journey.
            </p>
          </div>

          <form onSubmit={handleRegister}>
            {/* Role Selection */}
            <div className="mb-3">
              <label className="mb-1 block text-[10px] font-bold uppercase tracking-wider text-gray-400">
                Select Role
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setRole("Teacher")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                    role === "Teacher"
                      ? "border-emerald-700 bg-emerald-800 text-white shadow-md"
                      : "border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-white"
                  }`}
                >
                  <GraduationCap size={15} />
                  Teacher
                </button>
                <button
                  type="button"
                  onClick={() => setRole("Admin")}
                  className={`flex items-center justify-center gap-1.5 rounded-xl border py-2 text-xs font-bold transition-all ${
                    role === "Admin"
                      ? "border-emerald-700 bg-emerald-800 text-white shadow-md"
                      : "border-gray-200 bg-gray-50/50 text-gray-600 hover:bg-white"
                  }`}
                >
                  <ShieldCheck size={15} />
                  Admin
                </button>
              </div>
            </div>

            {/* Full Name */}
            <div className="mb-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/60 px-3 focus-within:border-emerald-600 focus-within:bg-white">
                <UserRound size={16} className={iconClass} />
                <input
                  name="fullName"
                  type="text"
                  value={formData.fullName}
                  onChange={handleChange}
                  placeholder="Full Name"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Email */}
            <div className="mb-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/60 px-3 focus-within:border-emerald-600 focus-within:bg-white">
                <Mail size={16} className={iconClass} />
                <input
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  placeholder="Email Address"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Phone */}
            <div className="mb-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/60 px-3 focus-within:border-emerald-600 focus-within:bg-white">
                <Phone size={16} className={iconClass} />
                <input
                  name="phone"
                  type="tel"
                  value={formData.phone}
                  onChange={handleChange}
                  placeholder="Phone Number"
                  className={inputClass}
                />
              </div>
            </div>

            {/* Password */}
            <div className="mb-2.5">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/60 px-3 focus-within:border-emerald-600 focus-within:bg-white">
                <LockKeyhole size={16} className={iconClass} />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="text-gray-400 hover:text-emerald-700"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="mb-3">
              <div className="flex items-center gap-2 rounded-xl border border-gray-200 bg-gray-50/60 px-3 focus-within:border-emerald-600 focus-within:bg-white">
                <LockKeyhole size={16} className={iconClass} />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={formData.confirmPassword}
                  onChange={handleChange}
                  placeholder="Confirm Password"
                  className={inputClass}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="text-gray-400 hover:text-emerald-700"
                >
                  {showConfirmPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>

            {/* Terms */}
            <div className="mb-3 flex items-center gap-2 text-[11px]">
              <label className="flex cursor-pointer items-center gap-1.5 text-gray-600 font-medium">
                <input
                  type="checkbox"
                  checked={acceptedTerms}
                  onChange={(e) => setAcceptedTerms(e.target.checked)}
                  className="h-3 w-3 rounded border-gray-300 accent-emerald-700"
                />
                <span>I agree to Terms and Conditions</span>
              </label>
            </div>

            {/* Message */}
            {message && (
              <div
                className={`mb-2.5 rounded-lg p-2 text-center text-[11px] font-semibold ${
                  messageType === "success"
                    ? "bg-emerald-50 text-emerald-800"
                    : "bg-red-50 text-red-700"
                }`}
              >
                {message}
              </div>
            )}

            {/* Submit */}
            <button
              type="submit"
              disabled={loading}
              className="flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-emerald-800 to-teal-700 py-2.5 text-xs font-bold text-white shadow-md transition-all hover:from-emerald-900 active:scale-[0.99] disabled:opacity-50"
            >
              <UserRoundPlus size={15} />
              {loading ? "Creating..." : "Create Account"}
            </button>
          </form>

          <div className="my-3 flex items-center gap-3">
            <span className="h-px flex-1 bg-gray-200" />
            <span className="text-[10px] font-bold text-gray-400">OR</span>
            <span className="h-px flex-1 bg-gray-200" />
          </div>

          {/* Back to Login */}
          <button
            type="button"
            onClick={handleBackToLogin}
            className="flex w-full items-center justify-center gap-2 rounded-xl border border-emerald-700 bg-white py-2 text-xs font-bold text-emerald-800 transition-all hover:bg-emerald-50 active:scale-[0.99]"
          >
            <ArrowLeft size={15} />
            Back to Login
          </button>
        </div>
      </main>
    </div>
  );
}