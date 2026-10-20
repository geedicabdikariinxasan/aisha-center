import React, { useState, useEffect } from "react";
import {
  LayoutDashboard,
  UsersRound,
  GraduationCap,
  BookOpen,
  BookMarked,
  CalendarCheck,
  FileText,
  Wallet,
  ChartNoAxesColumnIncreasing,
  Settings,
  LogOut,
  X,
  Menu,
  Search,
  Bell,
  TrendingUp,
  DollarSign,
  Calendar,
  UserPlus,
  ArrowRight,
  AlertCircle,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const navigation = [
  { label: "Dashboard", icon: LayoutDashboard, path: "/dashboard" },
  { label: "Students", icon: UsersRound, path: "/students" },
  { label: "Teachers", icon: GraduationCap, path: "/teachers" },
  { label: "Classes", icon: BookOpen, path: "/classes" },
  { label: "Hifdh", icon: BookMarked, path: "/hifdh" },
  { label: "Hijaad", icon: BookOpen, path: "/hijaad" },
  { label: "Attendance", icon: CalendarCheck, path: "/attendance" },
  { label: "Exams", icon: FileText, path: "/exams" },
  { label: "Payments", icon: Wallet, path: "/payments" },
  { label: "Reports", icon: ChartNoAxesColumnIncreasing, path: "/reports" },
  { label: "Settings", icon: Settings, path: "/settings" },
];

function Sidebar({ mobileOpen, setMobileOpen, activePath, setActivePath }) {
  const navigate = useNavigate();

  return (
    <>
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)} 
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
        />
      )}

      <aside className={`fixed left-0 top-0 h-screen w-[240px] bg-gradient-to-b from-[#064e3b] to-[#047857] text-white z-50 flex flex-col justify-between shadow-xl transition-transform duration-300 lg:translate-x-0 ${mobileOpen ? "translate-x-0" : "-translate-x-full"}`}>
        <div className="flex flex-col h-full overflow-hidden relative justify-between">
          <div>
            <button 
              onClick={() => setMobileOpen(false)}
              className="absolute right-3 top-3 text-white lg:hidden p-1 cursor-pointer z-10"
            >
              <X size={20} />
            </button>

            {/* Logo */}
            <div className="border-b border-white/10 px-4 py-2.5 text-center flex flex-col items-center justify-center">
              <div className="mb-1 flex h-10 w-10 items-center justify-center rounded-[14px] bg-gradient-to-br from-emerald-500 to-teal-600 text-white shadow-md relative">
                <BookOpen size={22} strokeWidth={1.7} />
                <span className="absolute top-0.5 right-1.5 text-[10px] text-emerald-200">☾</span>
              </div>
              <h1 className="text-sm font-black tracking-tight whitespace-nowrap">MARKAZ AISHA</h1>
              <p className="text-[8px] font-bold text-emerald-200">لإدارة تحفيظ القرآن الكريم</p>
            </div>

            {/* Navigation */}
            <nav className="px-2.5 py-1.5 space-y-0.5 overflow-y-auto max-h-[calc(100vh-190px)] [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden">
              {navigation.map(({ label, icon: Icon, path }) => {
                const isActive = activePath === label;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      setMobileOpen(false);
                      setActivePath(label);
                      navigate(path);
                    }}
                    className={`flex w-full items-center gap-2.5 rounded-xl px-3 py-1.5 text-xs font-semibold transition cursor-pointer ${
                      isActive
                        ? "bg-emerald-600 font-semibold shadow-md text-white"
                        : "hover:bg-white/10 text-emerald-50"
                    }`}
                  >
                    <Icon size={15} />
                    <span>{label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Footer & Logout */}
          <div className="p-2.5 text-center border-t border-white/10 bg-black/15 shrink-0 flex flex-col gap-1.5">
            <button
              onClick={() => {
                localStorage.removeItem("token");
                window.location.href = "/login";
              }}
              className="flex w-full items-center justify-center gap-2 rounded-lg bg-red-500/20 py-1.5 text-xs font-bold text-red-200 transition hover:bg-red-600 hover:text-white cursor-pointer"
            >
              <LogOut size={14} />
              Logout
            </button>
            <p className="text-[7px] text-emerald-300">© 2026 MARKAZ AISHA</p>
          </div>
        </div>
      </aside>
    </>
  );
}

function renderSafeText(val, fallback = "") {
  if (val === null || val === undefined) return fallback;
  if (typeof val === "string" || typeof val === "number") return val;
  if (typeof val === "object") {
    return val.name || val.title || val.studentName || val.email || val._id || fallback;
  }
  return String(val);
}

export default function AdminDashboard() {
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState("Dashboard");

  const [students, setStudents] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [payments, setPayments] = useState([]);

  const STUDENTS_URL = "http://localhost:5000/api/students";
  const TEACHERS_URL = "http://localhost:5000/api/teachers";
  const CLASSES_URL = "http://localhost:5000/api/classes";

  const fetchLiveMongoData = async () => {
    try {
      const [studRes, teachRes, classRes] = await Promise.all([
        fetch(STUDENTS_URL).catch(() => null),
        fetch(TEACHERS_URL).catch(() => null),
        fetch(CLASSES_URL).catch(() => null),
      ]);

      if (studRes && studRes.ok) setStudents(await studRes.json());
      if (teachRes && teachRes.ok) setTeachers(await teachRes.json());
      if (classRes && classRes.ok) setClasses(await classRes.json());
    } catch (err) {
      console.error("MongoDB Fetch Error:", err);
    }
  };

  useEffect(() => {
    fetchLiveMongoData();
    const interval = setInterval(fetchLiveMongoData, 5000);
    return () => clearInterval(interval);
  }, []);

  const totalStudentsCount = students.length;
  const totalTeachersCount = teachers.length;
  const totalClassesCount = classes.length;
  const totalPaymentsAmount = 0; // Halkan waad ku xiri kartaa payments marka ay diyaar noqdaan

  const recentStudents = [...students].reverse().slice(0, 5);
  const topTeachers = [...teachers].slice(0, 5);

  const currentDate = new Date().toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });

  return (
    <div className="min-h-screen w-screen bg-[#f8fafc] flex overflow-x-hidden">
      <Sidebar 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        activePath={activePath} 
        setActivePath={setActivePath} 
      />

      <div className="flex-1 flex flex-col min-h-screen overflow-y-auto lg:ml-[240px] p-4 md:p-6 lg:p-8">
        
        {/* Top Header - Wata Xariiqda Cagaaran (Green line / Breadcrumb) */}
        <div className="flex items-center justify-between mb-6 gap-4 flex-wrap bg-gradient-to-r from-[#00513c] to-[#003c30] p-4 rounded-xl text-white shadow-xs">
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-white hover:bg-white/10 rounded-xl cursor-pointer"
            >
              <Menu size={22} />
            </button>
            <span className="text-xs text-emerald-200">Dashboard › <strong className="text-white">Admin Dashboard</strong></span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-xs">
              H
            </div>
            <div className="text-white text-xs">
              <p className="font-semibold leading-tight">Haji Hassan</p>
              <p className="text-[9px] text-emerald-200">Administrator</p>
            </div>
          </div>
        </div>

        {/* Welcome Banner */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              Welcome Back, Haji Hassan <span className="text-emerald-600 text-xl">👑</span>
            </h1>
            <p className="text-xs text-gray-500 mt-1">Here's what's happening with Markaz Aisha today.</p>
          </div>
          <div className="flex items-center gap-2 bg-[#064e3b] text-white px-4 py-2.5 rounded-2xl shadow-sm text-xs font-semibold self-start sm:self-auto">
            <Calendar size={16} />
            <div>
              <p className="text-[9px] text-emerald-200 uppercase tracking-wider">Today</p>
              <p className="font-bold">{currentDate}</p>
            </div>
          </div>
        </div>

        {/* 5 Metric Cards (Live MongoDB) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3.5 mb-6">
          <MetricCard
            title="Total Students"
            value={totalStudentsCount}
            icon={<UsersRound size={18} className="text-emerald-600" />}
            bgColor="bg-emerald-50"
            iconBg="bg-emerald-100"
            badge="MongoDB Live"
          />
          <MetricCard
            title="Total Teachers"
            value={totalTeachersCount}
            icon={<GraduationCap size={18} className="text-purple-600" />}
            bgColor="bg-purple-50/60"
            iconBg="bg-purple-100"
            badge="MongoDB Live"
          />
          <MetricCard
            title="Total Classes"
            value={totalClassesCount}
            icon={<BookOpen size={18} className="text-emerald-600" />}
            bgColor="bg-emerald-50/60"
            iconBg="bg-emerald-100"
            badge="MongoDB Live"
          />
          <MetricCard
            title="Total Payments"
            value={`$${totalPaymentsAmount.toFixed(2)}`}
            icon={<Wallet size={18} className="text-blue-600" />}
            bgColor="bg-blue-50/60"
            iconBg="bg-blue-100"
            badge="MongoDB Live"
          />
          <MetricCard
            title="Hifdh Groups"
            value={0}
            icon={<BookMarked size={18} className="text-amber-600" />}
            bgColor="bg-amber-50/60"
            iconBg="bg-amber-100"
            badge="MongoDB Live"
          />
        </div>

        {/* Chart & Recent Students */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-sm font-bold text-gray-900">Students Enrollment Overview</h2>
                <div className="flex items-center gap-2 mt-1">
                  <span className="text-2xl font-black text-gray-900">{totalStudentsCount} Students</span>
                  <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-2 py-0.5 rounded-full flex items-center gap-0.5">
                    <TrendingUp size={12} /> Live Sync
                  </span>
                </div>
              </div>
              <select className="bg-gray-50 border border-gray-200 text-xs text-gray-600 rounded-xl px-2.5 py-1.5 outline-none font-medium">
                <option>This Month</option>
                <option>This Year</option>
              </select>
            </div>

            <div className="w-full h-44 relative mt-2">
              <svg className="w-full h-full overflow-visible" viewBox="0 0 500 150">
                <defs>
                  <linearGradient id="gradient" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#064e3b" stopOpacity="0.25" />
                    <stop offset="100%" stopColor="#064e3b" stopOpacity="0.0" />
                  </linearGradient>
                </defs>
                <path
                  d="M0 110 Q70 120 120 85 T250 60 T370 40 T500 20 L500 150 L0 150 Z"
                  fill="url(#gradient)"
                />
                <path
                  d="M0 110 Q70 120 120 85 T250 60 T370 40 T500 20"
                  fill="none"
                  stroke="#064e3b"
                  strokeWidth="3.5"
                  strokeLinecap="round"
                />
                <circle cx="120" cy="85" r="4" fill="#064e3b" />
                <circle cx="250" cy="60" r="4" fill="#064e3b" />
                <circle cx="370" cy="40" r="4" fill="#064e3b" />
                <circle cx="500" cy="20" r="5" fill="#064e3b" className="animate-pulse" />
              </svg>
              <div className="flex justify-between text-[10px] text-gray-400 font-medium mt-3">
                <span>Jan</span>
                <span>Mar</span>
                <span>May</span>
                <span>Jul</span>
                <span>Sep</span>
                <span>Nov</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between">
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-sm font-bold text-gray-900">Recent Students</h2>
              <button onClick={() => navigate("/students")} className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer">
                View All
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead>
                  <tr className="text-gray-400 border-b border-gray-100 text-[10px] uppercase font-bold">
                    <th className="pb-2">#</th>
                    <th className="pb-2">Student Name</th>
                    <th className="pb-2">Class</th>
                    <th className="pb-2 text-right">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50 font-medium text-gray-800">
                  {recentStudents.length > 0 ? (
                    recentStudents.map((std, idx) => (
                      <tr key={idx} className="hover:bg-gray-50/20">
                        <td className="py-2.5 font-semibold text-gray-500">{std.id}</td>
                        <td className="py-2.5">{renderSafeText(std.name, "Student")}</td>
                        <td className="py-2.5 text-gray-500">{renderSafeText(std.className, "Quran")}</td>
                        <td className="py-2.5 text-right">
                          <span className="inline-block px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 text-emerald-700">
                            {std.status || "Active"}
                          </span>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="py-8 text-center text-gray-400">
                        No recent students registered.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Quick Actions & Top Teachers */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6">
          <div className="lg:col-span-7 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-sm font-bold text-gray-900">Markaz Teachers</h2>
              <button onClick={() => navigate("/teachers")} className="text-xs font-semibold text-emerald-600 hover:underline cursor-pointer">
                View All
              </button>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
              {topTeachers.length > 0 ? (
                topTeachers.map((teach, idx) => (
                  <div key={idx} className="bg-gray-50 p-3 rounded-xl text-center border border-gray-100 hover:shadow-xs transition">
                    <div className="h-14 w-14 mx-auto rounded-full bg-emerald-100 text-emerald-800 font-bold flex items-center justify-center text-lg mb-2">
                      {renderSafeText(teach.name, "T").charAt(0)}
                    </div>
                    <h3 className="text-[11px] font-bold text-gray-800 truncate">{renderSafeText(teach.name, "Teacher")}</h3>
                    <p className="text-[10px] text-gray-400 truncate">{renderSafeText(teach.subjects, "Quran")}</p>
                  </div>
                ))
              ) : (
                <div className="col-span-5 py-6 text-center text-gray-400 text-xs">
                  No teachers found.
                </div>
              )}
            </div>
          </div>

          <div className="lg:col-span-5 bg-white p-5 rounded-2xl border border-gray-100 shadow-xs">
            <h2 className="text-sm font-bold text-gray-900 mb-4">Quick Actions</h2>
            <div className="grid grid-cols-2 gap-3">
              <button onClick={() => navigate("/students")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 transition cursor-pointer text-emerald-700 font-bold text-xs gap-1.5">
                <UserPlus size={20} />
                <span>Add Student</span>
              </button>
              <button onClick={() => navigate("/teachers")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 transition cursor-pointer text-emerald-700 font-bold text-xs gap-1.5">
                <GraduationCap size={20} />
                <span>Add Teacher</span>
              </button>
              <button onClick={() => navigate("/classes")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 transition cursor-pointer text-emerald-700 font-bold text-xs gap-1.5">
                <BookOpen size={20} />
                <span>Add Class</span>
              </button>
              <button onClick={() => alert("Payments module coming soon!")} className="flex flex-col items-center justify-center p-4 rounded-xl border border-emerald-100 bg-emerald-50/50 hover:bg-emerald-100/60 transition cursor-pointer text-emerald-700 font-bold text-xs gap-1.5">
                <Wallet size={20} />
                <span>Record Payment</span>
              </button>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

function MetricCard({ title, value, icon, bgColor, iconBg, badge }) {
  return (
    <div className={`${bgColor} p-4 rounded-2xl border border-gray-100 shadow-xs flex flex-col justify-between`}>
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-gray-600">{title}</span>
        <div className={`h-8 w-8 rounded-xl ${iconBg} flex items-center justify-center`}>
          {icon}
        </div>
      </div>
      <div>
        <p className="text-xl font-black text-gray-900">{value}</p>
        <p className="text-[9px] font-bold text-gray-500 mt-1">{badge}</p>
      </div>
    </div>
  );
}
