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
      alert("Your account has not been approved yet. Please wait for admin approval.");
      navigate("/login"); // or redirect to a pending page if you prefer
    }
  }, [user, navigate]);

  useEffect(() => {
    getAllTeachers()
      .then((data) => {
        setTeachers(data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to load teachers.");
        console.error(err);
        setLoading(false);
      });

    getAppointmentsByUserId(user.uid).then(setAppointments); // Load student's appointments
  }, [user]);

  const handleDateChange = (teacherId, value) => {
    setDateInputs((prev) => ({ ...prev, [teacherId]: value }));
  };

  const handleBook = async (teacherId) => {
    const datetime = dateInputs[teacherId];
    if (!datetime) {
      alert("Please select a date and time.");
      return;
    }

    try {
      await createAppointment({
        userId: user.uid,
        teacherId,
        datetime,
        status: "pending"
      });
      alert("Appointment requested!");
    } catch (err) {
      console.error("Failed to book:", err);
      alert("Failed to request appointment.");
    }
  };

  const handleSend = async (toId) => {
    try {
      await sendMessage({ fromId: user.uid, toId, content: "Hello, I would like to talk." });
      alert("Message sent!");
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message.");
    }
  };

  return (
    <div className="min-h-screen bg-amber-400 p-6">
      
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Find a Teacher</h2>

      {loading && <p className="text-center text-white">Loading teachers...</p>}
      {error && <p className="text-center text-red-700">{error}</p>}

      {!loading && teachers.length === 0 && (
        <p className="text-center text-red-600">No teachers found.</p>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {teachers.map((teacher) => (
          <div key={teacher.id} className="bg-white rounded-2xl shadow-lg p-5">
            <p className="text-gray-700"><strong>Name:</strong> {teacher.name}</p>
            <p className="text-gray-700"><strong>Department:</strong> {teacher.department}</p>
            <p className="text-gray-700"><strong>Subject:</strong> {teacher.subject}</p>

            <input
              type="datetime-local"
              value={dateInputs[teacher.id] || ""}
              onChange={(e) => handleDateChange(teacher.id, e.target.value)}
              className="mt-4 border border-gray-300 px-3 py-2 rounded w-full focus:ring-2 focus:ring-amber-300"
            />

            <div className="flex gap-3 mt-4">
              <button
                onClick={() => handleBook(teacher.id)}
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition"
              >
                Book Appointment
              </button>
              <button
                onClick={() => handleSend(teacher.id)}
                className="flex-1 bg-gray-800 hover:bg-gray-900 text-white px-4 py-2 rounded-lg transition"
              >
                Send Message
              </button>
            </div>
          </div>
        ))}
      </div>

      <h2 className="text-3xl font-bold mb-6 mt-10 text-center text-white">My Appointments</h2>

      {appointments.length === 0 && !loading && (
        <p className="text-center text-white">You have no appointments yet.</p>
      )}

      <div className="space-y-4">
        {appointments.map((appointment) => (
          <div key={appointment.id} className="bg-white border p-4 rounded-lg shadow-md">
            <p className="text-gray-700"><strong>Teacher:</strong> {appointment.teacherName}</p>
            <p className="text-gray-700"><strong>Date:</strong> {appointment.datetime}</p>
            <p className="text-gray-700"><strong>Status:</strong> {appointment.status}</p>
          </div>
        ))}
      </div>

    </div>
  );
}
