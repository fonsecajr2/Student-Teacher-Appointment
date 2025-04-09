// src/services/userService.js
import { db } from './firebase';
import {
  doc,
  getDoc,
  updateDoc,
  deleteDoc,
  collection,
  getDocs,
  query,
  where,
  setDoc
} from 'firebase/firestore';

const usersCollection = collection(db, "users");

// ✅ Buscar um usuário pelo ID
export const getUserById = async (uid) => {
  const docRef = doc(usersCollection, uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// ✅ Buscar todos os usuários
export const getAllUsers = async () => {
  const snapshot = await getDocs(usersCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Buscar todos os professores
export const getAllTeachers = async () => {
  const q = query(usersCollection, where("role", "==", "teacher"));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Buscar estudantes não aprovados
export const getPendingStudents = async () => {
  const q = query(usersCollection, where("role", "==", "student"), where("approved", "==", false));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Aprovar um estudante
export const approveStudent = async (uid) => {
  const userRef = doc(usersCollection, uid);
  await updateDoc(userRef, { approved: true });
};

// ✅ Criar um novo usuário (ex: por admin)
export const createUser = async (uid, userData) => {
  const userRef = doc(usersCollection, uid);
  await setDoc(userRef, userData);
};

// ✅ Atualizar um usuário
export const updateUser = async (uid, updatedData) => {
  const userRef = doc(usersCollection, uid);
  await updateDoc(userRef, updatedData);
};

// ✅ Deletar um usuário
export const deleteUser = async (uid) => {
  const userRef = doc(usersCollection, uid);
  await deleteDoc(userRef);
};
