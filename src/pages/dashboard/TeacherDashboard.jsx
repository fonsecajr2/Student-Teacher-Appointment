import { useEffect, useState } from "react";
import { getAppointmentsByTeacherId, updateAppointmentStatus } from "../../services/appointmentService";
import { useProtected } from "../../context/ProtectedContext";

const TeacherDashboard = () => {
  const { user } = useProtected();
  const [appointments, setAppointments] = useState([]);

  useEffect(() => {
    if (user?.uid) {
      getAppointmentsByTeacherId(user.uid).then(setAppointments);
    }
  }, [user?.uid]);

  const handleStatus = async (appointmentId, status) => {
    await updateAppointmentStatus(appointmentId, status);
    const updated = await getAppointmentsByTeacherId(user.uid);
    setAppointments(updated);
  };

  return (
    <div>
      <h2>Agendamentos Recebidos</h2>
      {appointments.map((app) => (
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
      ))}
    </div>
  );
};

export default TeacherDashboard;
