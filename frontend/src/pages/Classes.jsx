import React, { useMemo, useState, useEffect } from "react";
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
  Search,
  Plus,
  X,
  Pencil,
  Trash2,
  Eye,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  RotateCcw,
  Users,
  Clock,
  MapPin,
  CheckCircle,
  Menu,
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

const CLASSES_LIST = ["Class A", "Class B", "Class C", "Class D"];

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

export default function Classes() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState("Classes");

  const [classes, setClasses] = useState([]);
  const [teachersList, setTeachersList] = useState([]);

  const [search, setSearch] = useState("");
  const [teacherFilter, setTeacherFilter] = useState("All Teachers");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("add");
  const [selectedClass, setSelectedClass] = useState(null);

  const [formData, setFormData] = useState({
    id: "",
    name: "Class A",
    teacher: "",
    room: "",
    status: "Active",
  });
  const [message, setMessage] = useState("");

  const BASE_URL = "http://localhost:5000/api/classes";
  const TEACHERS_URL = "http://localhost:5000/api/teachers";

  const fetchData = async () => {
    try {
      const [classRes, teachRes] = await Promise.all([
        fetch(BASE_URL),
        fetch(TEACHERS_URL)
      ]);

      if (classRes.ok) {
        setClasses(await classRes.json());
      }
      if (teachRes.ok) {
        setTeachersList(await teachRes.json());
      }
    } catch (err) {
      console.error("Error fetching data:", err);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const teachersNames = useMemo(
    () => teachersList.map((t) => t.name),
    [teachersList]
  );

  const teachersFilterList = useMemo(
    () => [...new Set(classes.map((item) => item.teacher))],
    [classes]
  );

  const filteredClasses = useMemo(() => {
    return classes.filter((item) => {
      const query = search.toLowerCase();

      const matchesSearch =
        item.id.toLowerCase().includes(query) ||
        item.name.toLowerCase().includes(query) ||
        item.teacher.toLowerCase().includes(query) ||
        item.room.toLowerCase().includes(query);

      const matchesTeacher =
        teacherFilter === "All Teachers" ||
        item.teacher === teacherFilter;

      const matchesStatus =
        statusFilter === "All Status" ||
        item.status === statusFilter;

      return matchesSearch && matchesTeacher && matchesStatus;
    });
  }, [classes, search, teacherFilter, statusFilter]);

  const activeClasses = classes.filter(
    (item) => item.status === "Active"
  ).length;

  const totalStudents = classes.reduce(
    (total, item) => total + Number(item.students || 0),
    0
  );

  const openAddModal = () => {
    setModalMode("add");
    setSelectedClass(null);
    setFormData({
      id: "",
      name: "Class A",
      teacher: teachersNames[0] || "",
      room: "",
      status: "Active",
    });
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setModalMode("edit");
    setSelectedClass(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const openViewModal = (item) => {
    setModalMode("view");
    setSelectedClass(item);
    setFormData({ ...item });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (
      !formData.name.trim() ||
      !formData.teacher.trim() ||
      !formData.room.trim()
    ) {
      alert("Please complete all required fields.");
      return;
    }

    try {
      if (modalMode === "add") {
        const response = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setMessage("New class added successfully!");
        }
      } else if (modalMode === "edit" && selectedClass) {
        const response = await fetch(`${BASE_URL}/${selectedClass.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        });

        if (response.ok) {
          setMessage("Class information updated successfully!");
        }
      }

      await fetchData();
      closeModal();
    } catch {
      alert("Server connection error.");
    }
  };

  const deleteClass = async (item) => {
    const confirmed = window.confirm(
      `Are you sure you want to delete ${item.name}?`
    );

    if (!confirmed) return;

    try {
      const response = await fetch(`${BASE_URL}/${item.id}`, { method: "DELETE" });
      if (response.ok) {
        await fetchData();
        setMessage(`${item.name} deleted successfully!`);
      }
    } catch {
      alert("Server connection error.");
    }
  };

  const resetFilters = () => {
    setSearch("");
    setTeacherFilter("All Teachers");
    setStatusFilter("All Status");
  };

  return (
    <div className="h-screen w-screen bg-[#f3f8f7] text-slate-700 flex overflow-hidden">
      <style>{`
        * { box-sizing: border-box; }
        .ma-input { width: 100%; border: 1px solid #dce8e7; border-radius: 8px; background: white; padding: 8px 11px 8px 34px; outline: none; font-size: 13px; }
        .ma-input-plain { width: 100%; border: 1px solid #dce8e7; border-radius: 8px; background: white; padding: 8px 11px; outline: none; font-size: 13px; }
        .ma-select { width: 100%; border: 1px solid #dce8e7; border-radius: 8px; background: white; padding: 8px 30px 8px 11px; outline: none; font-size: 13px; cursor: pointer; appearance: none; }
        .ma-button { display: inline-flex; align-items: center; justify-content: center; gap: 6px; border-radius: 8px; padding: 7px 12px; font-weight: 600; font-size: 13px; cursor: pointer; transition: .2s; }
        .ma-primary { color: white; background: linear-gradient(110deg,#007552,#005c43); }
        .ma-primary:hover { background: #004d38; }
        .ma-outline { border: 1px solid #c6dfd8; background: white; color: #00664b; }
        .ma-outline:hover { background: #effaf6; }
        .ma-card { border: 1px solid #e2ecea; border-radius: 11px; background: white; box-shadow: 0 2px 10px #123e3208; }
        .ma-table th { background: #edf7f5; color: #075649; font-weight: 600; text-align: left; padding: 10px 10px; white-space: nowrap; font-size: 12px; }
        .ma-table td { padding: 8px 10px; border-bottom: 1px solid #edf2f1; white-space: nowrap; font-size: 13px; }
        .ma-modal-backdrop { position: fixed; inset: 0; z-index: 50; display: flex; align-items: center; justify-content: center; padding: 12px; background: #062c2480; backdrop-filter: blur(4px); }
        .ma-modal { width: 100%; max-width: 480px; background: white; border-radius: 14px; box-shadow: 0 20px 50px #002b2040; }
      `}</style>

      {/* Sidebar */}
      <Sidebar 
        mobileOpen={mobileOpen} 
        setMobileOpen={setMobileOpen} 
        activePath={activePath} 
        setActivePath={setActivePath} 
      />

      {/* Main Page Content */}
      <div className="flex-1 flex flex-col h-screen overflow-y-auto lg:ml-[240px] p-4 md:p-5">
        
        {/* Top Header */}
        <header className="flex h-14 items-center justify-between px-5 bg-gradient-to-r from-[#00513c] to-[#003c30] rounded-xl shadow-xs mb-4 text-white shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg cursor-pointer">
              <Menu size={20} />
            </button>
          </div>

          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-emerald-100 font-bold text-emerald-800 text-xs">
              H
            </div>
            <div className="text-white text-xs">
              <p className="font-semibold leading-tight">Haji Hassan</p>
              <p className="text-[9px] text-emerald-200">Administrator</p>
            </div>
          </div>
        </header>

        {/* Page title & Add Class Button */}
        <div className="mb-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-xs">
              <BookOpen size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#075448] leading-tight">Classes Management</h2>
              <p className="text-[11px] text-slate-500">Manage Quran classes, teachers and schedules</p>
            </div>
          </div>

          <button
            type="button"
            className="ma-button ma-primary text-xs cursor-pointer"
            onClick={openAddModal}
          >
            <Plus size={16} /> Add New Class
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 xl:grid-cols-4 shrink-0">
          <SummaryCard title="Total Classes" value={classes.length} icon={<BookOpen size={20} />} color="green" />
          <SummaryCard title="Active Classes" value={activeClasses} icon={<CheckCircle size={20} />} color="blue" />
          <SummaryCard title="Total Students" value={totalStudents} icon={<GraduationCap size={20} />} color="pink" />
          <SummaryCard title="Teachers Assigned" value={teachersFilterList.length} icon={<Users size={20} />} color="gold" />
        </div>

        {/* Classes Table & Filters */}
        <section className="ma-card overflow-hidden flex flex-col flex-1 mb-2">
          <div className="grid grid-cols-1 gap-2 border-b border-slate-100 p-3 sm:grid-cols-3 xl:grid-cols-4 items-center shrink-0">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700 pointer-events-none" />
              <input
                className="ma-input text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search class, ID, teacher..."
              />
            </div>

            <div className="relative">
              <select value={teacherFilter} onChange={(e) => setTeacherFilter(e.target.value)} className="ma-select text-xs">
                <option>All Teachers</option>
                {teachersFilterList.map((teacher) => (
                  <option key={teacher} value={teacher}>{teacher}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-800" />
            </div>

            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="ma-select text-xs">
                <option>All Status</option>
                <option>Active</option>
                <option>Inactive</option>
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-800" />
            </div>

            <button
              type="button"
              className="ma-button ma-outline text-xs h-[35px]"
              onClick={resetFilters}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="overflow-x-auto p-2 flex-1">
            <table className="ma-table w-full border-collapse">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Class ID</th>
                  <th>Class Name</th>
                  <th>Teacher</th>
                  <th>Students (Relation)</th>
                  <th>Room</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredClasses.map((item, index) => (
                  <tr key={item._id || item.id}>
                    <td>{index + 1}</td>
                    <td className="font-bold text-emerald-800">{item.id}</td>
                    <td>
                      <span className="font-medium text-slate-700">{item.name}</span>
                    </td>
                    <td>{item.teacher}</td>
                    <td>
                      <span className="inline-flex items-center gap-1 rounded bg-blue-50 px-2 py-0.5 font-semibold text-blue-700 text-xs">
                        <Users size={12} /> {item.students} Students
                      </span>
                    </td>
                    <td>{item.room}</td>
                    <td>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${item.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        ● {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button type="button" title="View" className="rounded p-1 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer" onClick={() => openViewModal(item)}>
                          <Eye size={15} />
                        </button>
                        <button type="button" title="Edit" className="rounded p-1 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer" onClick={() => openEditModal(item)}>
                          <Pencil size={15} />
                        </button>
                        <button type="button" title="Delete" className="rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer" onClick={() => deleteClass(item)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredClasses.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">
                      No classes found in Database. Add a new class!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-xs text-slate-500 shrink-0">
            <span>Showing {filteredClasses.length} of {classes.length} classes</span>
            <div className="flex items-center gap-1.5">
              <button type="button" className="rounded border p-1 hover:bg-emerald-50 cursor-pointer"><ChevronLeft size={14} /></button>
              <span className="rounded bg-emerald-800 px-2.5 py-1 text-white text-[11px]">1</span>
              <button type="button" className="rounded border p-1 hover:bg-emerald-50 cursor-pointer"><ChevronRight size={14} /></button>
            </div>
          </div>
        </section>
      </div>

      {/* Add / Edit / View Modal */}
      {showModal && (
        <div className="ma-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeModal(); }}>
          <section className="ma-modal p-5">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <h3 className="text-base font-bold text-emerald-800">
                {modalMode === "add" ? "Add New Class" : modalMode === "edit" ? "Edit Class" : "Class Details"}
              </h3>
              <button type="button" onClick={closeModal} className="rounded-lg p-1 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
            </div>

            {modalMode === "view" ? (
              <div className="space-y-2.5 text-xs text-slate-700">
                <p><strong>Class ID:</strong> {formData.id}</p>
                <p><strong>Class Name:</strong> {formData.name}</p>
                <p><strong>Teacher:</strong> {formData.teacher}</p>
                <p><strong>Students:</strong> {formData.students}</p>
                <p><strong>Room:</strong> {formData.room}</p>
                <p><strong>Status:</strong> {formData.status}</p>
                <div className="flex justify-end pt-3 border-t mt-4">
                  <button type="button" className="ma-button ma-primary text-xs py-1.5" onClick={closeModal}>Close</button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* CLASS NAME COMBOBOX (Class A ilaa Class D) */}
                <div>
                  <label className="mb-1 block text-xs font-medium">Class Name</label>
                  <select className="ma-input-plain cursor-pointer" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required>
                    {CLASSES_LIST.map((cls) => (
                      <option key={cls} value={cls}>{cls}</option>
                    ))}
                  </select>
                </div>

                {/* TEACHER NAME COMBOBOX (Laga soo jiidayo Teachers Collection) */}
                <div>
                  <label className="mb-1 block text-xs font-medium">Teacher Name</label>
                  <select className="ma-input-plain cursor-pointer" value={formData.teacher} onChange={(e) => setFormData({ ...formData, teacher: e.target.value })} required>
                    <option value="">-- Select Teacher --</option>
                    {teachersNames.map((tName) => (
                      <option key={tName} value={tName}>{tName}</option>
                    ))}
                  </select>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="mb-1 block text-xs font-medium">Room</label>
                    <input className="ma-input-plain" value={formData.room} onChange={(e) => setFormData({ ...formData, room: e.target.value })} placeholder="Room 01" required />
                  </div>
                  <div>
                    <label className="mb-1 block text-xs font-medium">Status</label>
                    <select className="ma-input-plain cursor-pointer" value={formData.status} onChange={(e) => setFormData({ ...formData, status: e.target.value })}>
                      <option>Active</option>
                      <option>Inactive</option>
                    </select>
                  </div>
                </div>

                <div className="flex justify-end gap-2 pt-2">
                  <button type="button" className="ma-button ma-outline text-xs py-1.5" onClick={closeModal}>Cancel</button>
                  <button type="submit" className="ma-button ma-primary text-xs py-1.5">
                    <Plus size={15} /> {modalMode === "add" ? "Save Class" : "Update Class"}
                  </button>
                </div>
              </form>
            )}
          </section>
        </div>
      )}

      {/* Success notification */}
      {message && (
        <div role="status" className="fixed bottom-4 right-4 z-[70] flex items-center gap-2.5 rounded-xl border border-emerald-200 bg-white p-3 shadow-xl text-xs">
          <CheckCircle size={18} className="shrink-0 text-emerald-600" />
          <p className="flex-1 text-slate-700">{message}</p>
          <button type="button" onClick={() => setMessage("")} className="text-slate-400 hover:text-slate-700 cursor-pointer"><X size={15} /></button>
        </div>
      )}
    </div>
  );
}

function SummaryCard({ title, value, icon, color }) {
  const styles = {
    green: "bg-emerald-50 text-emerald-700",
    blue: "bg-sky-50 text-sky-600",
    pink: "bg-pink-50 text-pink-500",
    gold: "bg-amber-50 text-amber-600",
  };

  return (
    <div className="ma-card flex items-center gap-3 p-3">
      <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${styles[color]}`}>{icon}</div>
      <div>
        <p className="text-[11px] text-slate-500">{title}</p>
        <p className="text-lg font-bold text-[#064e43] leading-tight">{value}</p>
      </div>
    </div>
  );
}