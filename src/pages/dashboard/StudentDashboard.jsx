import { useEffect, useState } from "react";
import { getAllTeachers } from "../../services/userService";
import { createAppointment, getAppointmentsByUserId } from "../../services/appointmentService";
import { sendMessage } from "../../services/messageService";
import { useProtected } from "../../context/ProtectedContext";
import { useNavigate } from "react-router-dom";

export default function StudentDashboard() {
  const { user } = useProtected();
  const [teachers, setTeachers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [dateInputs, setDateInputs] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.role === "student" && user?.approved === false) {
      alert("Sua conta ainda não foi aprovada. Aguarde a aprovação do administrador.");
      navigate("/login"); // ou para uma tela de espera se quiser
    }
  }, [user, navigate]);

  useEffect(() => {
    getAllTeachers()
      .then((data) => {
        setTeachers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Erro ao carregar professores.");
        console.error(err);
        setLoading(false);
      });

    getAppointmentsByUserId(user.uid).then(setAppointments); // Carregar os agendamentos do aluno
  }, [user]);

  const handleDateChange = (teacherId, value) => {
    setDateInputs((prev) => ({ ...prev, [teacherId]: value }));
  };

  const handleBook = async (teacherId) => {
    const datetime = dateInputs[teacherId];
    if (!datetime) {
      alert("Por favor, selecione uma data e hora.");
      return;
    }

    try {
      await createAppointment({
        userId: user.uid,
        teacherId,
        datetime,
        status: "pendente"
      });
      alert("Agendamento solicitado!");
    } catch (err) {
      console.error("Erro ao agendar:", err);
      alert("Falha ao agendar.");
    }
  };

  const handleSend = async (toId) => {
    try {
      await sendMessage({ fromId: user.uid, toId, content: "Olá, gostaria de conversar." });
      alert("Mensagem enviada!");
    } catch (err) {
      console.error("Erro ao enviar mensagem:", err);
      alert("Falha ao enviar mensagem.");
    }
  };

  return (
    <div className="min-h-screen bg-amber-400 p-4">
      <h2 className="text-2xl font-bold mb-4 text-center">Buscar Professores</h2>

      {loading && <p className="text-center">Carregando professores...</p>}
      {error && <p className="text-center text-red-700">{error}</p>}

      {!loading && teachers.length === 0 && (
        <p className="text-center text-red-600">Nenhum professor encontrado.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-xl shadow p-4">
            <p><strong>Nome:</strong> {teacher.name}</p>
            <p><strong>Departamento:</strong> {teacher.department}</p>
            <p><strong>Matéria:</strong> {teacher.subject}</p>

            <input
              type="datetime-local"
              value={dateInputs[teacher.id] || ""}
              onChange={(e) => handleDateChange(teacher.id, e.target.value)}
              className="mt-2 border border-gray-300 px-2 py-1 rounded w-full"
            />

            <div className="flex gap-2 mt-3">
              <button
                onClick={() => handleBook(teacher.id)}
                className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
              >
                Agendar
              </button>
              <button
                onClick={() => handleSend(teacher.id)}
                className="bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded"
              >
                Enviar Mensagem
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-2xl font-bold mb-4 text-center">Meus Agendamentos</h2>
      {appointments.map((appointment) => (
        <div key={appointment.id} className="border p-2 my-2 bg-white rounded">
          <p><strong>Professor:</strong> {appointment.teacherName}</p>
          <p><strong>Data:</strong> {appointment.datetime}</p>
          <p><strong>Status:</strong> {appointment.status}</p>
        </div>
      ))}
    </div>
  );
}
