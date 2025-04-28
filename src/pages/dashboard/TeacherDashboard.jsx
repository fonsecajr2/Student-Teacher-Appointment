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

  // Load appointments and messages when the component mounts
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
        console.error("Error loading data:", error);
      } finally {
        setLoadingAppointments(false);
        setLoadingMessages(false);
      }
    };

    loadData();
  }, [user?.uid]);

  // Update appointment status (approve or cancel)
  const handleStatus = async (appointmentId, status) => {
    try {
      await updateAppointmentStatus(appointmentId, status);
      const updatedAppointments = await getAppointmentsByTeacherId(user.uid);
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  // Send a message to a student
  const handleSendMessage = async (toId, content) => {
    try {
      await sendMessage({ fromId: user.uid, toId, content });
      setResponse("");
      const updatedMessages = await getMessagesByUserId(user.uid);
      setMessages(updatedMessages);
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  // Separate appointments into pending and approved
  const pendingAppointments = appointments.filter((app) => app.status === "pending");
  const approvedAppointments = appointments.filter((app) => app.status === "aproved");

  return (
    <div className="min-h-screen bg-amber-400 p-4">

      {/* Teacher's Information */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h1 className="text-3xl font-bold mb-2">Welcome, {user?.name || "Teacher"}!</h1>
        <p className="text-gray-700">Email: {user?.email}</p>
      </div>

      {/* Pending Appointments */}
      <h2 className="text-2xl font-bold mb-4">Pending Appointments</h2>

      {loadingAppointments ? (
        <p>Loading Appointments...</p>
      ) : pendingAppointments.length > 0 ? (
        pendingAppointments.map((app) => (
          <div key={app.id} className="border p-2 my-2 bg-white rounded">
            <p><strong>Student:</strong> {app.studentName || "ID: " + app.userId}</p>
            <p><strong>Date:</strong> {app.datetime}</p>
            <p><strong>Status:</strong> {app.status}</p>
            <button
              onClick={() => handleStatus(app.id, "aproved")}
              className="bg-green-500 text-white px-2 rounded mr-2 mt-2"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatus(app.id, "cancelado")}
              className="bg-red-500 text-white px-2 rounded mt-2"
            >
              Cancel
            </button>
          </div>
        ))
      ) : (
        <p>No pending appointments at the moment.</p>
      )}

      {/* Approved Appointments */}
      <h2 className="text-2xl font-bold mt-8 mb-4">Approved Appointments</h2>

      {loadingAppointments ? (
        <p>Loading Appointments...</p>
      ) : approvedAppointments.length > 0 ? (
        approvedAppointments.map((app) => (
          <div key={app.id} className="border p-2 my-2 bg-white rounded">
            <p><strong>Student:</strong> {app.studentName || "ID: " + app.userId}</p>
            <p><strong>Date:</strong> {app.datetime}</p>
            <p><strong>Status:</strong> {app.status}</p>
          </div>
        ))
      ) : (
        <p>No approved appointments yet.</p>
      )}

      {/* Messages Section */}
      <h3 className="text-2xl font-bold mt-8 mb-4">Messages</h3>

      {loadingMessages ? (
        <p>Loading Messages...</p>
      ) : messages.length > 0 ? (
        messages.map((msg) => (
          <div key={msg.id} className="border p-2 my-2 bg-white rounded">
            <p><strong>From:</strong> {msg.fromName}</p>
            <p>{msg.content}</p>
            <textarea
              value={response}
              onChange={(e) => setResponse(e.target.value)}
              placeholder="Type your answer"
              className="border p-2 mt-2 w-full"
            />
            <button
              onClick={() => handleSendMessage(msg.fromId, response)}
              className="bg-blue-500 text-white px-2 py-1 rounded mt-2"
            >
              Send
            </button>
          </div>
        ))
      ) : (
        <p>No new messages.</p>
      )}
    </div>
  );
};

export default TeacherDashboard;
