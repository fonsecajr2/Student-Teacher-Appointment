// src/services/messageService.js
import { db } from './firebase';
import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';

const messageCollection = collection(db, "messages");

// Enviar mensagem
export const sendMessage = async ({ fromId, toId, content }) => {
  const messageData = {
    fromId,
    toId,
    content,
    timestamp: new Date()
  };
  await addDoc(messageCollection, messageData);
};

// Buscar mensagens enviadas ou recebidas por um usuário
export const getMessagesByUserId = async (userId) => {
  const fromQuery = query(messageCollection, where("fromId", "==", userId));
  const toQuery = query(messageCollection, where("toId", "==", userId));

  const [fromSnapshot, toSnapshot] = await Promise.all([
    getDocs(fromQuery),
    getDocs(toQuery)
  ]);

  const allMessages = [
    ...fromSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })),
    ...toSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  ];

  return allMessages;
};

// Buscar todas as mensagens (para uso de admins)
export const getAllMessages = async () => {
  const snapshot = await getDocs(messageCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};
