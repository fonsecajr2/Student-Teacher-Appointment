import { useEffect, useState } from "react";
import { getAppointmentsByTeacherId, updateAppointmentStatus } from "../../services/appointmentService";
import { getMessagesByUserId, sendMessage } from "../../services/messageService";
import { useProtected } from "../../context/ProtectedContext";

const TeacherDashboard = () => {
  const { user } = useProtected();
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [response, setResponse] = useState("");
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  // Carregar agendamentos e mensagens
  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.uid) {
          setLoadingAppointments(true);
          const appointmentsData = await getAppointmentsByTeacherId(user.uid);
          setAppointments(appointmentsData);

          setLoadingMessages(true);
          const messagesData = await getMessagesByUserId(user.uid);
          setMessages(messagesData);
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setLoadingAppointments(false);
        setLoadingMessages(false);
      }
    };

    loadData();
  }, [user?.uid]);

  // Atualizar o status de um agendamento
  const handleStatus = async (appointmentId, status) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      const updatedAppointments = await getAppointmentsByTeacherId(user.uid);
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Erro ao atualizar status:", error);
    }
  };

  // Enviar uma resposta a uma mensagem
  const handleSendMessage = async (toId, content) => {
    try {
      await sendMessage({ fromId: user.uid, toId, content });
      setResponse(""); // Limpar o campo de resposta após o envio
      const updatedMessages = await getMessagesByUserId(user.uid);
      setMessages(updatedMessages); // Recarregar as mensagens
    } catch (error) {
      console.error("Erro ao enviar mensagem:", error);
    }
  };

  return (
    <div className="min-h-screen bg-amber-400 p-4">
      <h2 className="text-2xl font-bold mb-4">Agendamentos Recebidos</h2>

      {loadingAppointments ? (
        <p>Carregando agendamentos...</p>
      ) : (
        appointments.map((app) => (
          <div key={app.id} className="border p-2 my-2 bg-white rounded">
            <p><strong>Aluno:</strong> {app.studentName || "ID: " + app.userId}</p>
            <p><strong>Data:</strong> {app.datetime}</p>
            <p><strong>Status:</strong> {app.status}</p>
            <button onClick={() => handleStatus(app.id, "aprovado")} className="bg-green-500 text-white px-2 rounded mr-2">
              Aprovar
            </button>
            <button onClick={() => handleStatus(app.id, "cancelado")} className="bg-red-500 text-white px-2 rounded">
              Cancelar
            </button>
          </div>
        ))
      )}

      <h3 className="text-2xl font-bold mt-8">Mensagens</h3>

      {loadingMessages ? (
        <p>Carregando mensagens...</p>
      ) : (
        messages.map((msg) => (
          <div key={msg.id} className="border p-2 my-2 bg-white rounded">
            <p><strong>De:</strong> {msg.fromName}</p>
            <p>{msg.content}</p>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Digite sua resposta"
              className="border p-2 mt-2 w-full"
            />
            <button
              onClick={() => handleSendMessage(msg.fromId, response)}
              className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
            >
              Responder
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default TeacherDashboard;
