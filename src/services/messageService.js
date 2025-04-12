// src/services/messageService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const messageCollection = collection(db, "messages");

// Enviar mensagem
export const sendMessage = async (messageData) => {
  await addDoc(messageCollection, messageData);
};

// Buscar mensagens enviadas ou recebidas por um usuário (remetente ou destinatário)
export const getMessagesByUserId = async (userId) => {
  const q = query(
    messageCollection,
    where("senderId", "==", userId),  // Mensagens enviadas pelo usuário
    where("receiverId", "==", userId)  // Ou mensagens recebidas pelo usuário
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Buscar todas as mensagens (opção para admins ou visualização total)
export const getAllMessages = async () => {
  const snapshot = await getDocs(messageCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
