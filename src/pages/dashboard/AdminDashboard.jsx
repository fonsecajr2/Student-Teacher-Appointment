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

const AdminDashboard = () => {
  const { role } = useProtected();
  const [teachers, setTeachers] = useState([]);
  const [pendingList, setPendingList] = useState([]);
  const [newTeacher, setNewTeacher] = useState({
    name: "",
    email: "",
    department: "",
    subject: "",
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
      if (!newTeacher.name || !newTeacher.email || !newTeacher.department || !newTeacher.subject) {
      alert("Preencha todos os campos.");
      return;
    }
      await createUser(newTeacher.email, newTeacher);
      const updated = await getAllTeachers();
      setTeachers(updated);
      setNewTeacher({ name: "", email: "", department: "", subject: "", role: "teacher" });
      alert("Professor cadastrado com sucesso!");
    } catch (error) {
      console.error("Erro ao criar professor:", error);
      alert("Erro ao cadastrar professor.");
    }
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id); // Excluir o estudante
      const updatedList = await getApprovedStudents(); // Atualiza a lista de estudantes aprovados
      setApprovedList(updatedList); // Atualiza o estado com a nova lista
    } catch (error) {
      console.error("Erro ao excluir o estudante:", error);
      alert("Erro ao excluir o estudante.");
    }
  };

  const handleApprove = async (studentId) => {
    await approveStudent(studentId);
    setPendingList(await getPendingStudents());
  };


  return (
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Cadastrar Novo Professor</h2>
      <div className="bg-white rounded p-4 shadow mb-6">
        <input
          type="text"
          placeholder="Nome"
          value={newTeacher.name}
          onChange={(e) => setNewTeacher({ ...newTeacher, name: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="email"
          placeholder="Email"
          value={newTeacher.email}
          onChange={(e) => setNewTeacher({ ...newTeacher, email: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="text"
          placeholder="Departamento"
          value={newTeacher.department}
          onChange={(e) => setNewTeacher({ ...newTeacher, department: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />
        <input
          type="text"
          placeholder="Matéria"
          value={newTeacher.subject}
          onChange={(e) => setNewTeacher({ ...newTeacher, subject: e.target.value })}
          className="border p-2 mr-2 mb-2"
        />
        <button
          onClick={handleCreate}
          className="bg-blue-600 text-white px-4 py-2 rounded mt-2"
        >
          Cadastrar
        </button>
      </div>

      <h2 className="text-2xl font-bold mb-4">Professores Cadastrados</h2>
      {teachers.map((t) => (
        <div key={t.id} className="border p-2 my-2 rounded bg-white">
          <p><strong>Nome:</strong> {t.name}</p>
          <p><strong>Email:</strong> {t.email}</p>
          <p><strong>Departamento:</strong> {t.department}</p>
          <p><strong>Matéria:</strong> {t.subject}</p>
          <button
            onClick={() => handleDelete(t.id)}
            className="bg-red-500 text-white px-2 py-1 rounded mt-1"
          >
            Excluir
          </button>
        </div>
      ))}

      <h2 className="text-2xl font-bold mt-6 mb-4">Aprovar Alunos</h2>
      {pendingList.map((s) => (
        <div key={s.id} className="border p-2 my-2 rounded bg-white">
          <p><strong>Aluno:</strong> {s.name}</p>
          <button
            onClick={() => handleApprove(s.id)}
            className="bg-green-500 text-white px-2 py-1 rounded mt-1"
          >
            Aprovar
          </button>
        </div>
      ))}


      <h2 className="text-2xl font-bold mt-6 mb-4">Estudantes Aprovados</h2>
      {approvedList.map((s) => (
        <div key={s.id} className="border p-2 my-2 rounded bg-white">
          <p><strong>Aluno:</strong> {s.name}</p>
          <p><strong>Email:</strong> {s.email}</p>
          <button
            onClick={() => handleDelete(s.id)}
            className="bg-red-500 text-white px-2 py-1 rounded mt-1"
          >
            Excluir
          </button>
        </div>
      ))}

    </div>
  );
};

export default AdminDashboard;
