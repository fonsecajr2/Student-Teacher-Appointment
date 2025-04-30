import { db } from './firebase';
import { collection, addDoc, getDocs, query, where, orderBy, doc, getDoc } from 'firebase/firestore';
import logger from '../utils/logger.js';

// Reference to the "messages" collection
const messageCollection = collection(db, "messages");
const usersCollection = collection(db, "users");  // Assuming there is a users collection to fetch user names

/**
 * Send a new message from one user to another.
 * @param {Object} param0
 * @param {string} param0.fromId - Sender's user ID
 * @param {string} param0.toId - Receiver's user ID
 * @param {string} param0.content - Message text
 */
export const sendMessage = async ({ fromId, toId, content }) => {
  logger.info(`Sending message from user ${fromId} to user ${toId} with content: ${content}`);
  const messageData = {
    fromId,
    toId,
    content,
    timestamp: new Date() // Save the exact sending time
  };
  await addDoc(messageCollection, messageData);
  logger.info(`Message sent from user ${fromId} to user ${toId}`);
};

/**
 * Fetch all messages involving a user (both sent and received),
 * sorted by timestamp in ascending order (oldest first).
 * @param {string} userId - The user's ID
 * @returns {Promise<Array>} - List of message objects with user names
 */
export const getMessagesByUserId = async (userId) => {
  logger.info(`Fetching messages for userId: ${userId}`);
  const fromQuery = query(messageCollection, where("fromId", "==", userId));
  const toQuery = query(messageCollection, where("toId", "==", userId));

  const [fromSnapshot, toSnapshot] = await Promise.all([
    getDocs(fromQuery),
    getDocs(toQuery)
  ]);

  // Combine messages
  const allMessages = [
    ...fromSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    ...toSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  ];

  // Sort messages by timestamp
  allMessages.sort((a, b) => a.timestamp?.toDate() - b.timestamp?.toDate());

  // Fetch user names and include them in the messages
  const messagesWithNames = await Promise.all(allMessages.map(async (msg) => {
    const fromUserDoc = await getDoc(doc(usersCollection, msg.fromId));
    const toUserDoc = await getDoc(doc(usersCollection, msg.toId));

    const fromName = fromUserDoc.exists() ? fromUserDoc.data().name : 'Unknown';
    const toName = toUserDoc.exists() ? toUserDoc.data().name : 'Unknown';

    return {
      ...msg,
      fromName,
      toName
    };
  }));

  logger.info(`Fetched ${messagesWithNames.length} messages for userId: ${userId}`);
  return messagesWithNames;
};

/**
 * Fetch all messages in the system.
 * Intended for admin use.
 * @returns {Promise<Array>} - List of all messages sorted by timestamp
 */
export const getAllMessages = async () => {
  logger.info(`Fetching all messages`);
  const allMessagesQuery = query(messageCollection, orderBy("timestamp", "asc"));
  const snapshot = await getDocs(allMessagesQuery);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  logger.info(`Fetched ${results.length} total messages`);
  return results;
};
