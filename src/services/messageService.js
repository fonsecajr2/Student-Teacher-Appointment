// src/services/messageService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const messageCollection = collection(db, "messages");

export const sendMessage = async (messageData) => {
  await addDoc(messageCollection, messageData);
};

export const getMessagesBetweenUsers = async (senderId, receiverId) => {
  const q = query(
    messageCollection,
    where("senderId", "==", senderId),
    where("receiverId", "==", receiverId)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

export const getAllMessages = async () => {
  const snapshot = await getDocs(messageCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
