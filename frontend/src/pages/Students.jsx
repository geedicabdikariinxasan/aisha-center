import React, { useMemo, useRef, useState, useEffect } from "react";
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
  Upload,
  Download,
  X,
  FileSpreadsheet,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  CheckCircle,
  Eye,
  Pencil,
  Trash2,
  RotateCcw,
  Menu,
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import * as XLSX from "xlsx";

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
              {navigation.map(({ label, icon: Icon }) => {
                const isActive = activePath === label;
                return (
                  <button
                    key={label}
                    onClick={() => {
                      setMobileOpen(false);
                      setActivePath(label);
                      if (label === "Dashboard") {
                        navigate("/dashboard");
                      } else if (label === "Students") {
                        navigate("/students");
                      } else if (label === "Teachers") {
                        navigate("/teachers");
                         } else  if(label === "Classes"){
                        navigate("/Classes");
                      } else {
                        alert(`Bogga "${label}" dhawaan ayaa la dhisayaa!`);
                      }
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

export default function Students() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activePath, setActivePath] = useState("Students");

  const [students, setStudents] = useState([]);

  const [search, setSearch] = useState("");
  const [classFilter, setClassFilter] = useState("All Classes");
  const [genderFilter, setGenderFilter] = useState("All Gender");
  const [statusFilter, setStatusFilter] = useState("All Status");

  const [showImport, setShowImport] = useState(false);
  const [showAdd, setShowAdd] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedFile, setSelectedFile] = useState(null);
  const [preview, setPreview] = useState([]);
  const [importError, setImportError] = useState("");
  const [message, setMessage] = useState("");
  const [viewStudent, setViewStudent] = useState(null);

  const fileRef = useRef(null);

  const [newStudent, setNewStudent] = useState({
    id: "",
    name: "",
    className: "Class A",
    gender: "Male",
    status: "Active",
  });

 const BASE_URL = "https://aisha-center.onrender.com/api/students";

  const fetchStudents = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (response.ok) {
        const data = await response.json();
        setStudents(data);
      }
    } catch (err) {
      console.error("Error fetching students:", err);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const query = search.toLowerCase();
      const matchesSearch =
        student.name.toLowerCase().includes(query) ||
        student.id.toLowerCase().includes(query) ||
        student.className.toLowerCase().includes(query);

      const matchesClass = classFilter === "All Classes" || student.className === classFilter;
      const matchesGender = genderFilter === "All Gender" || student.gender === genderFilter;
      const matchesStatus = statusFilter === "All Status" || student.status === statusFilter;

      return matchesSearch && matchesClass && matchesGender && matchesStatus;
    });
  }, [students, search, classFilter, genderFilter, statusFilter]);

  const totalMale = students.filter((s) => s.gender && s.gender.toLowerCase() === "male").length;
  const totalFemale = students.filter((s) => s.gender && s.gender.toLowerCase() === "female").length;
  const totalClasses = new Set(students.map((s) => s.className)).size;

  const exportExcel = async () => {
    try {
      const response = await fetch(BASE_URL);
      if (!response.ok) {
        alert("Cillad ayaa ka dhacday soo jiidashada xogta.");
        return;
      }
      const latestStudents = await response.json();

      if (latestStudents.length === 0) {
        alert("No student data available to export.");
        return;
      }

      const exportData = latestStudents.map((student, index) => ({
        No: index + 1,
        "Student ID": student.id,
        Name: student.name,
        Class: student.className,
        Gender: student.gender,
        Status: student.status,
      }));

      const worksheet = XLSX.utils.json_to_sheet(exportData);
      const workbook = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(workbook, worksheet, "Students");
      XLSX.writeFile(workbook, `Markaz_Aisha_Students_${new Date().toISOString().slice(0, 10)}.xlsx`);
    } catch (err) {
      console.error("Export error:", err);
      alert("Lama dhoofin karo xogta. Hubi xiriirka server-ka.");
    }
  };

  const handleFile = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setImportError("");
    setPreview([]);
    setSelectedFile(file);

    try {
      const buffer = await file.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: "array" });
      const firstSheet = workbook.Sheets[workbook.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json(firstSheet, { defval: "", raw: false });

      if (!rows.length) {
        setImportError("Faylka Excel-ka wax xog ah kuma jiro.");
        return;
      }

      const normalizedRows = rows.map((row) => {
        const normalized = {};
        Object.entries(row).forEach(([key, value]) => {
          normalized[key.toLowerCase().trim().replace(/[_\s]+/g, "")] = String(value).trim();
        });

        const getValue = (...keys) => {
          for (const key of keys) {
            const value = normalized[key];
            if (value !== undefined && value !== "") return value;
          }
          return "";
        };

        let rawGender = getValue("gender", "jinsiga") || "Male";
        let formattedGender = rawGender.toLowerCase() === "female" ? "Female" : "Male";

        let rawStatus = getValue("status", "xaaladda") || "Active";
        let formattedStatus = rawStatus.toLowerCase() === "inactive" ? "Inactive" : "Active";

        return {
          name: getValue("name", "studentname", "fullname", "magaca"),
          className: getValue("class", "classname", "grade", "fasalka") || "Class A",
          gender: formattedGender,
          status: formattedStatus,
        };
      });

      const missingData = normalizedRows.some((s) => !s.name);
      if (missingData) {
        setImportError("Arday kasta waa inuu lahaadaa Magaca (Name).");
        return;
      }

      setPreview(normalizedRows);
    } catch {
      setImportError("Lama akhrin karo faylkan Excel-ka ah.");
    }
  };

  // IMPORT FUNCTION LA HAGAAJIYAY SI TIRADA SAXDA AH U SOO GASHO
  const importStudents = async () => {
    if (!selectedFile || preview.length === 0) {
      alert("Fadlan dooro fayl sax ah oo leh xog horay loo eegay.");
      return;
    }

    try {
      // Isticmaalka nidaamka ardayda hal mar loo diro si sax ah
      for (const student of preview) {
        await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(student),
        });
      }

      // Sug oo dib u soo jiid xogta cusub si tirada guud (summary cards) ay isku baddesho isla markiiba
      await fetchStudents();
      closeImport();
      setMessage(`Successfully uploaded! ${preview.length} students imported.`);
    } catch (err) {
      console.error("Import error:", err);
      alert("Cillad ayaa ka dhacday soo dejinta ardayda.");
    }
  };

  const closeImport = () => {
    setShowImport(false);
    setSelectedFile(null);
    setPreview([]);
    setImportError("");
    if (fileRef.current) fileRef.current.value = "";
  };

  const handleSaveStudent = async (event) => {
    event.preventDefault();
    if (!newStudent.name.trim()) {
      alert("Please enter Student Name.");
      return;
    }

    try {
      if (isEditing) {
        const response = await fetch(`${BASE_URL}/${newStudent.id}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        });
        if (response.ok) setMessage("Student updated successfully.");
      } else {
        const response = await fetch(BASE_URL, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(newStudent),
        });
        if (response.ok) setMessage("Student added successfully.");
      }

      await fetchStudents();
      setShowAdd(false);
      setIsEditing(false);
      setNewStudent({ id: "", name: "", className: "Class A", gender: "Male", status: "Active" });
    } catch {
      alert("Server connection error.");
    }
  };

  const deleteStudent = async (id) => {
    if (!window.confirm("Are you sure you want to delete this student?")) return;
    try {
      const response = await fetch(`${BASE_URL}/${id}`, { method: "DELETE" });
      if (response.ok) {
        await fetchStudents();
        setMessage("Student deleted successfully.");
      }
    } catch {
      alert("Server connection error.");
    }
  };

  const deleteAllStudents = async () => {
    if (students.length === 0) {
      alert("Wax arday ah oo la tirtiro ma jiraan.");
      return;
    }

    if (!window.confirm("Digniin! Ma hubtaa inaad rabto inaad tirtirto DHAMMAAN ardayda ku jirta database-ka?")) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/delete-all`, {
        method: "DELETE",
      });

      if (response.ok) {
        await fetchStudents();
        setMessage("Dhammaan ardaydii waa la tirtiray.");
      } else {
        alert("Cillad ayaa dhacday intii la tirtirayay ardayda.");
      }
    } catch {
      alert("Server connection error.");
    }
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
        .ma-danger { color: white; background: linear-gradient(110deg,#dc2626,#991b1b); }
        .ma-danger:hover { background: #b91c1c; }
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
        
        {/* Top Header - Qoraalkii Dashboard > Students iyo line-kii cagaarka ahaa waa laga saaray */}
        <header className="flex h-14 items-center justify-between px-5 bg-gradient-to-r from-[#00513c] to-[#003c30] rounded-xl shadow-xs mb-4 text-white shrink-0">
          <div className="flex items-center gap-2">
            <button onClick={() => setMobileOpen(true)} className="lg:hidden p-1.5 hover:bg-white/10 rounded-lg cursor-pointer">
              <Menu size={20} />
            </button>
            {/* Laga saaray qoraalkii bidixda */}
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

        {/* Page title & Add Student Button */}
        <div className="mb-4 flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-emerald-800 text-white shadow-xs">
              <UsersRound size={22} />
            </div>
            <div>
              <h2 className="text-lg font-bold text-[#075448] leading-tight">Students Management</h2>
              <p className="text-[11px] text-slate-500">View and manage registered students</p>
            </div>
          </div>

          <button
            type="button"
            className="ma-button ma-primary text-xs"
            onClick={() => {
              setIsEditing(false);
              setNewStudent({ id: "", name: "", className: "Class A", gender: "Male", status: "Active" });
              setShowAdd(true);
            }}
          >
            <Plus size={16} /> Add New Student
          </button>
        </div>

        {/* Summary cards */}
        <div className="mb-4 grid grid-cols-2 gap-2.5 xl:grid-cols-4 shrink-0">
          <SummaryCard title="Total Students" value={students.length} icon={<UsersRound size={20} />} color="green" />
          <SummaryCard title="Male Students" value={totalMale} icon={<UsersRound size={20} />} color="blue" />
          <SummaryCard title="Female Students" value={totalFemale} icon={<UsersRound size={20} />} color="pink" />
          <SummaryCard title="Total Classes" value={totalClasses} icon={<BookOpen size={20} />} color="gold" />
        </div>

        {/* Import, Export & Delete All controls */}
        <div className="ma-card mb-4 flex items-center justify-between p-2.5 shrink-0">
          <p className="text-xs text-slate-500">Manage student database records.</p>
          <div className="flex gap-2">
            <button type="button" className="ma-button ma-danger text-xs py-1.5 cursor-pointer" onClick={deleteAllStudents}>
              <Trash2 size={14} /> Delete All
            </button>
            <button type="button" className="ma-button ma-outline text-xs py-1.5 cursor-pointer" onClick={exportExcel}>
              <Download size={14} /> Export
            </button>
            <button 
              type="button" 
              className="ma-button ma-primary text-xs py-1.5 cursor-pointer" 
              onClick={() => { 
                setShowImport(true); 
                setImportError(""); 
                setSelectedFile(null);
                setPreview([]);
              }}
            >
              <Upload size={14} /> Import
            </button>
          </div>
        </div>

        {/* Students Table & Filters */}
        <section className="ma-card overflow-hidden flex flex-col flex-1 mb-2">
          <div className="grid grid-cols-1 gap-2 border-b border-slate-100 p-3 sm:grid-cols-2 xl:grid-cols-5 items-center shrink-0">
            <div className="relative">
              <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-emerald-700 pointer-events-none" />
              <input
                className="ma-input text-xs"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search name, ID..."
              />
            </div>

            <div className="relative">
              <select value={classFilter} onChange={(e) => setClassFilter(e.target.value)} className="ma-select text-xs">
                <option value="All Classes">All Classes</option>
                {CLASSES_LIST.map((cls) => (
                  <option key={cls} value={cls}>{cls}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-800" />
            </div>

            <div className="relative">
              <select value={genderFilter} onChange={(e) => setGenderFilter(e.target.value)} className="ma-select text-xs">
                {["All Gender", "Male", "Female"].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-800" />
            </div>

            <div className="relative">
              <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="ma-select text-xs">
                {["All Status", "Active", "Inactive"].map((opt) => (
                  <option key={opt} value={opt}>{opt}</option>
                ))}
              </select>
              <ChevronDown size={14} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-emerald-800" />
            </div>

            <button
              type="button"
              className="ma-button ma-outline text-xs h-[35px]"
              onClick={() => { setSearch(""); setClassFilter("All Classes"); setGenderFilter("All Gender"); setStatusFilter("All Status"); }}
            >
              <RotateCcw size={14} /> Reset
            </button>
          </div>

          <div className="overflow-x-auto p-2 flex-1">
            <table className="ma-table w-full border-collapse">
              <thead>
                <tr>
                  <th className="w-8"><input type="checkbox" aria-label="Select all" /></th>
                  <th>#</th>
                  <th>Student ID</th>
                  <th>Name</th>
                  <th>Class</th>
                  <th>Gender</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {filteredStudents.map((student, index) => (
                  <tr key={student._id || student.id}>
                    <td><input type="checkbox" aria-label="Select student" /></td>
                    <td>{index + 1}</td>
                    <td className="font-bold text-emerald-800">{student.id}</td>
                    <td>
                      <div className="flex items-center gap-2">
                        <div className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[10px] font-bold text-white ${student.gender === "Female" ? "bg-pink-400" : "bg-sky-700"}`}>
                          {student.name.split(" ").map((p) => p[0]).join("").slice(0, 2).toUpperCase()}
                        </div>
                        <span className="font-medium text-slate-700">{student.name}</span>
                      </div>
                    </td>
                    <td>{student.className}</td>
                    <td>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${student.gender === "Female" ? "bg-pink-50 text-pink-600" : "bg-sky-50 text-sky-700"}`}>
                        {student.gender}
                      </span>
                    </td>
                    <td>
                      <span className={`rounded-full px-2 py-0.5 text-[11px] font-medium ${student.status === "Active" ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"}`}>
                        ● {student.status}
                      </span>
                    </td>
                    <td>
                      <div className="flex items-center gap-1">
                        <button type="button" title="View" className="rounded p-1 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer" onClick={() => setViewStudent(student)}>
                          <Eye size={15} />
                        </button>
                        <button type="button" title="Edit" className="rounded p-1 text-slate-500 hover:bg-emerald-50 hover:text-emerald-700 cursor-pointer" onClick={() => {
                          setNewStudent({
                            id: student.id,
                            name: student.name,
                            className: student.className,
                            gender: student.gender,
                            status: student.status
                          });
                          setIsEditing(true);
                          setShowAdd(true);
                        }}>
                          <Pencil size={15} />
                        </button>
                        <button type="button" title="Delete" className="rounded p-1 text-slate-500 hover:bg-red-50 hover:text-red-600 cursor-pointer" onClick={() => deleteStudent(student.id)}>
                          <Trash2 size={15} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}

                {filteredStudents.length === 0 && (
                  <tr>
                    <td colSpan="8" className="py-8 text-center text-slate-400 text-xs">
                      No students found in Database. Add a new student!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

          <div className="flex items-center justify-between border-t border-slate-100 px-4 py-2.5 text-xs text-slate-500 shrink-0">
            <span>Showing {filteredStudents.length} of {students.length} students</span>
            <div className="flex items-center gap-1.5">
              <button type="button" className="rounded border p-1 hover:bg-emerald-50 cursor-pointer"><ChevronLeft size={14} /></button>
              <span className="rounded bg-emerald-800 px-2.5 py-1 text-white text-[11px]">1</span>
              <button type="button" className="rounded border p-1 hover:bg-emerald-50 cursor-pointer"><ChevronRight size={14} /></button>
            </div>
          </div>
        </section>
      </div>

      {/* Import Excel Modal */}
      {showImport && (
        <div className="ma-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) closeImport(); }}>
          <section className="ma-modal p-5">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <div className="flex items-center gap-2.5">
                <div className="flex h-9 w-9 items-center justify-center rounded-xl bg-emerald-50 text-emerald-700"><FileSpreadsheet size={22} /></div>
                <div>
                  <h3 className="text-sm font-bold text-emerald-800">Import Students from Excel</h3>
                  <p className="text-[10px] text-slate-500">Upload Excel file (.xlsx, .xls)</p>
                </div>
              </div>
              <button type="button" onClick={closeImport} className="rounded-lg p-1 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
            </div>

            <div className="space-y-3">
              <label htmlFor="excel-file" className="flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-emerald-200 bg-[#fbfefd] p-5 text-center hover:border-emerald-500">
                <Upload size={28} className="mb-2 text-emerald-700" />
                <span className="font-semibold text-xs text-emerald-900">Choose Excel File</span>
                <span className="text-[10px] text-slate-400 mt-1">Columns required: Name, Class, Gender, Status</span>
                <input id="excel-file" ref={fileRef} type="file" accept=".xlsx,.xls" className="hidden" onChange={handleFile} />
              </label>

              {selectedFile && (
                <div className="flex items-center justify-between gap-3 rounded-xl border border-emerald-200 p-2.5 text-xs">
                  <div className="flex items-center gap-2 truncate">
                    <FileSpreadsheet size={18} className="shrink-0 text-emerald-700" />
                    <span className="truncate font-medium">{selectedFile.name}</span>
                  </div>
                  <CheckCircle size={18} className="shrink-0 text-emerald-600" />
                </div>
              )}

              {importError && <div className="rounded-lg border border-red-200 bg-red-50 p-2.5 text-xs text-red-700">{importError}</div>}

              {preview.length > 0 && (
                <div className="text-xs">
                  <p className="font-bold text-slate-700 mb-1">Preview Data ({preview.length} ready to import):</p>
                  <div className="max-h-36 overflow-auto rounded-lg border border-slate-200">
                    <table className="w-full text-left text-[11px]">
                      <thead className="bg-emerald-50 text-emerald-900 sticky top-0">
                        <tr><th className="p-2">Name</th><th className="p-2">Class</th><th className="p-2">Gender</th></tr>
                      </thead>
                      <tbody>
                        {preview.slice(0, 4).map((s, idx) => (
                          <tr key={idx} className="border-t border-slate-100">
                            <td className="p-2">{s.name}</td><td className="p-2">{s.className}</td><td className="p-2">{s.gender}</td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </div>

            <div className="flex justify-end gap-2 pt-3 border-t mt-3">
              <button type="button" className="ma-button ma-outline text-xs py-1.5 cursor-pointer" onClick={closeImport}>Cancel</button>
              <button 
                type="button" 
                className="ma-button ma-primary text-xs py-1.5 cursor-pointer" 
                disabled={!selectedFile || preview.length === 0} 
                onClick={importStudents}
                style={{ opacity: !selectedFile || preview.length === 0 ? 0.5 : 1 }}
              >
                <Upload size={14} /> Upload & Import
              </button>
            </div>
          </section>
        </div>
      )}

      {/* Add / Edit Student Modal */}
      {showAdd && (
        <div className="ma-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setShowAdd(false); }}>
          <section className="ma-modal p-5">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <h3 className="text-base font-bold text-emerald-800">
                {isEditing ? `Edit Student (${newStudent.id})` : "Add New Student (Auto ID)"}
              </h3>
              <button type="button" onClick={() => setShowAdd(false)} className="rounded-lg p-1 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
            </div>

            <form onSubmit={handleSaveStudent} className="space-y-3">
              <div>
                <label className="mb-1 block text-xs font-medium">Student Name</label>
                <input className="ma-input-plain" value={newStudent.name} onChange={(e) => setNewStudent({ ...newStudent, name: e.target.value })} placeholder="Enter student name" required />
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Class</label>
                <select className="ma-input-plain cursor-pointer" value={newStudent.className} onChange={(e) => setNewStudent({ ...newStudent, className: e.target.value })}>
                  {CLASSES_LIST.map((cls) => (
                    <option key={cls} value={cls}>{cls}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Gender</label>
                <select className="ma-input-plain cursor-pointer" value={newStudent.gender} onChange={(e) => setNewStudent({ ...newStudent, gender: e.target.value })}>
                  <option>Male</option><option>Female</option>
                </select>
              </div>

              <div>
                <label className="mb-1 block text-xs font-medium">Status</label>
                <select className="ma-input-plain cursor-pointer" value={newStudent.status} onChange={(e) => setNewStudent({ ...newStudent, status: e.target.value })}>
                  <option>Active</option><option>Inactive</option>
                </select>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button type="button" className="ma-button ma-outline text-xs py-1.5" onClick={() => setShowAdd(false)}>Cancel</button>
                <button type="submit" className="ma-button ma-primary text-xs py-1.5">
                  <Plus size={15} /> {isEditing ? "Update Student" : "Save Student"}
                </button>
              </div>
            </form>
          </section>
        </div>
      )}

      {/* View Student Modal */}
      {viewStudent && (
        <div className="ma-modal-backdrop" onMouseDown={(e) => { if (e.target === e.currentTarget) setViewStudent(null); }}>
          <section className="ma-modal p-5">
            <div className="flex items-center justify-between border-b pb-3 mb-3">
              <h3 className="text-base font-bold text-emerald-800">Student Details</h3>
              <button type="button" onClick={() => setViewStudent(null)} className="rounded-lg p-1 hover:bg-slate-100 cursor-pointer"><X size={18} /></button>
            </div>
            <div className="space-y-2.5 text-xs text-slate-700">
              <p><strong>Student ID:</strong> {viewStudent.id}</p>
              <p><strong>Name:</strong> {viewStudent.name}</p>
              <p><strong>Class:</strong> {viewStudent.className}</p>
              <p><strong>Gender:</strong> {viewStudent.gender}</p>
              <p><strong>Status:</strong> {viewStudent.status}</p>
            </div>
            <div className="flex justify-end pt-4 border-t mt-4">
              <button type="button" className="ma-button ma-primary text-xs py-1.5" onClick={() => setViewStudent(null)}>Close</button>
            </div>
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

function SummaryCard({ title, value, icon, color, colorClass }) {
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