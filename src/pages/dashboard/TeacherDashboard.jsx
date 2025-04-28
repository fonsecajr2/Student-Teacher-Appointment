import { useEffect, useState } from "react";
import { getAppointmentsByTeacherId, updateAppointmentStatus } from "../../services/appointmentService";
import { getMessagesByUserId, sendMessage } from "../../services/messageService";
import { useProtected } from "../../context/ProtectedContext";

const TeacherDashboard = () => {
  const { user } = useProtected();
  const [appointments, setAppointments] = useState([]);
  const [messages, setMessages] = useState({});
  const [responseInputs, setResponseInputs] = useState({});
  const [loadingAppointments, setLoadingAppointments] = useState(true);
  const [loadingMessages, setLoadingMessages] = useState(true);

  useEffect(() => {
    const loadData = async () => {
      try {
        if (user?.uid) {
          setLoadingAppointments(true);
          const appointmentsData = await getAppointmentsByTeacherId(user.uid);
          setAppointments(appointmentsData);

          setLoadingMessages(true);
          const rawMessages = await getMessagesByUserId(user.uid);
          
          // Organize messages by conversation (by user)
          const organizedMessages = {};
          rawMessages.forEach(msg => {
            const conversationId = msg.fromId === user.uid ? msg.toId : msg.fromId;
            if (!organizedMessages[conversationId]) {
              organizedMessages[conversationId] = [];
            }
            organizedMessages[conversationId].push(msg);
          });
          setMessages(organizedMessages);
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

  const handleStatus = async (appointmentId, status) => {
    if (status === "cancelled" && !window.confirm("Are you sure you want to cancel this appointment?")) {
      return;
    }
    try {
      await updateAppointmentStatus(appointmentId, status);
      const updatedAppointments = await getAppointmentsByTeacherId(user.uid);
      setAppointments(updatedAppointments);
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleSendMessage = async (toId, content) => {
    if (!content.trim()) return;
    try {
      await sendMessage({ fromId: user.uid, toId, content });
      setResponseInputs((prev) => ({ ...prev, [toId]: "" }));

      // Refresh messages after sending
      const updatedMessages = await getMessagesByUserId(user.uid);
      const organizedMessages = {};
      updatedMessages.forEach(msg => {
        const conversationId = msg.fromId === user.uid ? msg.toId : msg.fromId;
        if (!organizedMessages[conversationId]) {
          organizedMessages[conversationId] = [];
        }
        organizedMessages[conversationId].push(msg);
      });
      setMessages(organizedMessages);

    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const formatDateTime = (datetimeStr) => {
    return new Date(datetimeStr).toLocaleString(undefined, {
      weekday: "short", year: "numeric", month: "short", day: "numeric",
      hour: "2-digit", minute: "2-digit"
    });
  };

  const pendingAppointments = appointments.filter((app) => app.status === "pending");
  const approvedAppointments = appointments.filter((app) => app.status === "approved");

  return (
    <div className="min-h-screen bg-amber-400 p-4">

      {/* Teacher Welcome Section */}
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
            <p><strong>Student:</strong> {app.studentName}</p>
            <p><strong>Date:</strong> {formatDateTime(app.datetime)}</p>
            <p><strong>Status:</strong> {app.status}</p>
            <button
              onClick={() => handleStatus(app.id, "approved")}
              className="bg-green-500 text-white px-2 rounded mr-2 mt-2"
            >
              Approve
            </button>
            <button
              onClick={() => handleStatus(app.id, "cancelled")}
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
            <p><strong>Student:</strong> {app.studentName}</p>
            <p><strong>Date:</strong> {formatDateTime(app.datetime)}</p>
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
      ) : Object.keys(messages).length > 0 ? (
        Object.entries(messages).map(([otherUserId, conversation]) => (
          <div key={otherUserId} className="border p-4 my-4 bg-white rounded">
            <h4 className="font-semibold mb-2">Conversation with {conversation[0]?.fromName || "Student"}</h4>
            <div className="max-h-60 overflow-y-auto bg-gray-100 p-2 rounded mb-2">
              {conversation.map((msg) => (
                <div
                  key={msg.id}
                  className={`mb-2 p-2 rounded ${msg.fromId === user.uid ? "bg-blue-100 text-right" : "bg-green-100 text-left"}`}
                >
                  <p className="text-sm">{msg.content}</p>
                  <p className="text-xs text-gray-500">{formatDateTime(msg.createdAt)}</p>
                </div>
              ))}
            </div>
            <textarea
              value={responseInputs[otherUserId] || ""}
              onChange={(e) => setResponseInputs((prev) => ({ ...prev, [otherUserId]: e.target.value }))}
              placeholder="Type your reply..."
              className="border p-2 w-full mb-2"
            />
            <button
              onClick={() => handleSendMessage(otherUserId, responseInputs[otherUserId])}
              className="bg-blue-500 text-white px-4 py-2 rounded"
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
