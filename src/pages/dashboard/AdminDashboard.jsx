import { useEffect, useState } from "react";
import {
  createUser,
  deleteUser,
  getAllTeachers,
  getPendingStudents,
  approveStudent,
  getApprovedStudents
} from "../../services/userService";
import { useProtected } from "../../context/ProtectedContext";
import { db } from "../../services/firebase";
import { doc, setDoc } from "firebase/firestore";

const AdminDashboard = () => {
  const { role } = useProtected();
  const [teachers, setTeachers] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    department: "",
    subject: "",
    password: "",
    role: "teacher"
  });
  const [approvedList, setApprovedList] = useState([]);

  useEffect(() => {
    if (role === "admin") {
      getAllTeachers().then(setTeachers);
      getPendingStudents().then(setPendingList);
      getApprovedStudents().then(setApprovedList);
    }
  }, [role]);

  const handleCreate = async () => {
    try {
      if (!newTeacher.name || !newTeacher.email || !newTeacher.password || !newTeacher.department || !newTeacher.subject) {
        alert("Please fill in all fields.");
        return;
      }

      const userCredential = await createUser(newTeacher.email, newTeacher);
      const user = userCredential.user;
      await createTeacherInFirestore(user.uid, newTeacher);

      const updated = await getAllTeachers();
      setTeachers(updated);

      setNewTeacher({ name: "", email: "", department: "", subject: "", password: "", role: "teacher" });

      alert("Teacher registered successfully!");
    } catch (error) {
      console.error("Error creating teacher:", error);
      alert("Failed to register teacher.");
    }
  };

  const createTeacherInFirestore = async (uid, teacherData) => {
    try {
      await setDoc(doc(db, "users", uid), {
        name: teacherData.name,
        email: teacherData.email,
        department: teacherData.department,
        subject: teacherData.subject,
        role: "teacher",
      });
    } catch (error) {
      console.error("Error saving teacher data:", error);
      alert("Failed to save teacher data.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      const updatedList = await getApprovedStudents();
      setApprovedList(updatedList);
    } catch (error) {
      console.error("Error deleting student:", error);
      alert("Failed to delete student.");
    }
  };

  const handleApprove = async (studentId) => {
    await approveStudent(studentId);
    setPendingList(await getPendingStudents());
    setApprovedList(await getApprovedStudents());
  };

  return (
    <div className="min-h-screen bg-amber-400 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Register New Teacher</h2>

      <div className="bg-white rounded-xl shadow p-6 mb-6">
        <h3 className="text-xl font-semibold mb-4">Teacher Information</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-sm text-gray-700 mb-2">Name</label>
            <input
              type="text"
              placeholder="Enter Name"
              value={newTeacher.name}
              onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium text-sm text-gray-700 mb-2">Email</label>
            <input
              type="email"
              placeholder="Enter Email"
              value={newTeacher.email}
              onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium text-sm text-gray-700 mb-2">Password</label>
            <input
              type="password"
              placeholder="Enter Password"
              value={newTeacher.password}
              onChange={(e) => setNewTeacher({ ...newTeacher, password: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <h3 className="text-xl font-semibold mt-6 mb-4">Department and Subject</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block font-medium text-sm text-gray-700 mb-2">Department</label>
            <input
              type="text"
              placeholder="Enter Department"
              value={newTeacher.department}
              onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
          <div>
            <label className="block font-medium text-sm text-gray-700 mb-2">Subject</label>
            <input
              type="text"
              placeholder="Enter Subject"
              value={newTeacher.subject}
              onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
              className="border p-2 rounded w-full"
            />
          </div>
        </div>

        <div className="flex justify-center mt-6">
          <button
            onClick={handleCreate}
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
          >
            Register Teacher
          </button>
        </div>
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">Registered Teachers</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map((t) => (
          <div key={t.id} className="bg-white rounded-xl shadow p-4">
            <p><strong>Name:</strong> {t.name}</p>
            <p><strong>Email:</strong> {t.email}</p>
            <p><strong>Department:</strong> {t.department}</p>
            <p><strong>Subject:</strong> {t.subject}</p>
            <button
              onClick={() => handleDelete(t.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Approve Students</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {pendingList.map((s) => (
          <div key={s.id} className="bg-white rounded-xl shadow p-4">
            <p><strong>Student:</strong> {s.name}</p>
            <button
              onClick={() => handleApprove(s.id)}
              className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded mt-2"
            >
              Approve
            </button>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mt-8 mb-4 text-center">Approved Students</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {approvedList.map((s) => (
          <div key={s.id} className="bg-white rounded-xl shadow p-4">
            <p><strong>Student:</strong> {s.name}</p>
            <p><strong>Email:</strong> {s.email}</p>
            <button
              onClick={() => handleDelete(s.id)}
              className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AdminDashboard;
