import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllTeachers } from "../../services/userService";
import { createAppointment, getAppointmentsByUserId } from "../../services/appointmentService";
import { getMessagesByUserId, sendMessage } from "../../services/messageService";
import { useProtected } from "../../context/ProtectedContext";

export default function StudentDashboard() {
  const { user } = useProtected();
  const navigate = useNavigate();

  const [teachers, setTeachers] = useState([]);
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState([]);
  const [dateInputs, setDateInputs] = useState({});
  const [messageInputs, setMessageInputs] = useState({});
  const [loading, setLoading] = useState({ teachers: true, appointments: true, messages: true });
  const [error, setError] = useState("");

  useEffect(() => {
    if (user?.role === "student" && user?.approved === false) {
      alert("Your account has not been approved yet. Please wait for admin approval.");
      navigate("/login");
    }
  }, [user, navigate]);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.uid) {
          setLoading({ teachers: true, appointments: true, messages: true });

          const [teachersData, appointmentsData, messagesData] = await Promise.all([
            getAllTeachers(),
            getAppointmentsByUserId(user.uid),
            getMessagesByUserId(user.uid)
          ]);

          setTeachers(teachersData);
          setAppointments(appointmentsData);
          setMessages(messagesData);

          setLoading({ teachers: false, appointments: false, messages: false });
        }
      } catch (err) {
        console.error(err);
        setError("Failed to load data.");
        setLoading({ teachers: false, appointments: false, messages: false });
      }
    };
    loadData();
  }, [user]);

  // --- Handlers ---
  const handleDateChange = (teacherId, value) => {
    setDateInputs(prev => ({ ...prev, [teacherId]: value }));
  };

  const handleMessageChange = (teacherId, value) => {
    setMessageInputs(prev => ({ ...prev, [teacherId]: value }));
  };

  const hasPendingAppointment = (teacherId) => {
    return appointments.some(app => app.teacherId === teacherId && app.status === "pending");
  };

  const handleBook = async (teacherId) => {
    if (hasPendingAppointment(teacherId)) {
      return alert("You already have a pending appointment with this teacher.");
    }

    const datetime = dateInputs[teacherId];
    if (!datetime) {
      return alert("Please select a date and time.");
    }

    const selectedDateTime = new Date(datetime);
    const now = new Date();
    if (selectedDateTime <= now) {
      return alert("You cannot book an appointment in the past.");
    }

    try {
      await createAppointment({ userId: user.uid, teacherId, datetime, status: "pending" });
      alert("Appointment requested successfully!");
      const updatedAppointments = await getAppointmentsByUserId(user.uid);
      setAppointments(updatedAppointments);
    } catch (err) {
      console.error("Failed to book:", err);
      alert("Failed to request appointment. Please try again.");
    }
  };

  const handleSend = async (teacherId) => {
    const content = messageInputs[teacherId];
    if (!content || content.trim() === "") {
      return; // Don't send if empty
    }

    try {
      await sendMessage({ fromId: user.uid, toId: teacherId, content });
      setMessageInputs(prev => ({ ...prev, [teacherId]: "" }));

      // Update messages automatically
      const updatedMessages = await getMessagesByUserId(user.uid);
      setMessages(updatedMessages);
    } catch (err) {
      console.error("Failed to send message:", err);
      alert("Failed to send message.");
    }
  };

  const formatDateTime = (datetimeStr) => {
    return new Date(datetimeStr).toLocaleString(undefined, {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const renderMessageBubble = (msg) => (
    <div key={msg.id} className={`flex gap-3 mb-2 ${msg.fromId === user.uid ? "justify-end" : "justify-start"}`}>
      <div
        className={`rounded-lg p-3 max-w-xs ${msg.fromId === user.uid ? "bg-blue-600 text-white" : "bg-gray-300"}`}
      >
        <p>{msg.content}</p>
      </div>
    </div>
  );

  const renderTeacherCard = (teacher) => {
    const studentAppointments = appointments.filter((app) => app.teacherId === teacher.id);

    return (
      <div key={teacher.id} className="bg-white rounded-2xl shadow-lg p-5">
        <p><strong>Name:</strong> {teacher.name}</p>
        <p><strong>Department:</strong> {teacher.department}</p>
        <p><strong>Subject:</strong> {teacher.subject}</p>

        <input
          type="datetime-local"
          value={dateInputs[teacher.id] || ""}
          onChange={(e) => handleDateChange(teacher.id, e.target.value)}
          className="mt-4 border border-gray-300 px-3 py-2 rounded w-full"
        />

        {/* Bookings and their status */}
        <div className="mt-4">
          <h3 className="font-bold text-lg">Your Bookings</h3>
          {studentAppointments.length === 0 ? (
            <p>No appointments booked.</p>
          ) : (
            <ul>
              {studentAppointments.map((appointment) => (
                <li key={appointment.id} className="mb-2">
                  <span>{formatDateTime(appointment.datetime)}</span> - 
                  <span className={`text-sm ${appointment.status === "pending" ? "text-yellow-500" : "text-green-500"}`}>
                    {appointment.status}
                  </span>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Chat area */}
        <div className="mt-4 h-48 overflow-y-auto bg-gray-100 p-4 rounded-lg">
          {messages
            .filter((msg) => msg.fromId === teacher.id || msg.toId === teacher.id)
            .map(renderMessageBubble)}
        </div>

        {/* Textarea for message */}
        <textarea
          placeholder="Type your message..."
          value={messageInputs[teacher.id] || ""}
          onChange={(e) => handleMessageChange(teacher.id, e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              handleSend(teacher.id);
              e.preventDefault();
            }
          }}
          className="mt-4 border border-gray-300 px-3 py-2 rounded w-full h-24 resize-none"
        />

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleBook(teacher.id)}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg"
          >
            Book Appointment
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-amber-400 p-6">
      <h2 className="text-3xl font-bold mb-6 text-center text-white">Find a Teacher</h2>

      {error && <p className="text-center text-red-700">{error}</p>}

      {loading.teachers ? (
        <p className="text-center text-white">Loading teachers...</p>
      ) : teachers.length === 0 ? (
        <p className="text-center text-red-600">No teachers available.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {teachers.map(renderTeacherCard)}
        </div>
      )}
    </div>
  );
}
