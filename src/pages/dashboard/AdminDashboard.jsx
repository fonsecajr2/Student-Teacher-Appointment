import { useEffect, useState } from "react";
import {
  createUser,
  updateUser,
  deleteUser,
  getAllTeachers,
  getPendingStudents,
  approveStudent
} from "../../services/userService";
import { useProtected } from "../../context/ProtectedContext";

const AdminDashboard = () => {
  const { role } = useProtected();
  const [teachers, setTeachers] = useState([]);
  const [pendingList, setPendingList] = useState([]);

  useEffect(() => {
    if (role === "admin") {
      getAllTeachers().then(setTeachers);
      getPendingStudents().then(setPendingList);
    }
  }, [role]);

  const handleCreate = async (teacherData) => {
    await createUser(teacherData);
    setTeachers(await getAllTeachers());
  };

  const handleDelete = async (id) => {
    await deleteUser(id);
    setTeachers(await getAllTeachers());
  };

  const handleApprove = async (studentId) => {
    await approveStudent(studentId);
    setPendingList(await getPendingStudents());
  };

  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Gerenciar Professores</h2>
      {teachers.map((t) => (
        <div key={t.id} className="border p-2 my-2 rounded bg-white">
          <p><strong>Nome:</strong> {t.name}</p>
          <button onClick={() => handleDelete(t.id)} className="bg-red-500 text-white px-2 py-1 rounded mt-1">
            Excluir
          </button>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-6 mb-4">Aprovar Alunos</h2>
      {pendingList.map((s) => (
        <div key={s.id} className="border p-2 my-2 rounded bg-white">
          <p><strong>Aluno:</strong> {s.name}</p>
          <button onClick={() => handleApprove(s.id)} className="bg-green-500 text-white px-2 py-1 rounded mt-1">
            Aprovar
          </button>
        </div>
      ))}
    </div>
  );
};

export default AdminDashboard;
