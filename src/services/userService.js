// src/services/userService.js
import { db, auth } from './firebase';
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
import { createUserWithEmailAndPassword } from 'firebase/auth';
import logger from '../utils/logger.js';

const usersCollection = collection(db, "users");

// Buscar um usuário pelo ID
export const getUserById = async (uid) => {
  logger.info(`Fetching user by id: ${uid}`);
  const docRef = doc(db, "users", uid);
  const docSnap = await getDoc(docRef);
  return docSnap.exists() ? { id: docSnap.id, ...docSnap.data() } : null;
};

// Buscar todos os usuários
export const getAllUsers = async () => {
  logger.info(`Fetching all users`);
  const snapshot = await getDocs(usersCollection);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  logger.info(`Fetched ${results.length} users`);
  return results;
};

// Buscar todos os professores
export const getAllTeachers = async () => {
  logger.info(`Fetching all teachers`);
  const q = query(usersCollection, where("role", "==", "teacher"));
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  logger.info(`Fetched ${results.length} teachers`);
  return results;
};

// Função para pegar os estudantes pendentes
export const getPendingStudents = async () => {
  logger.info(`Fetching pending students`);
  const querySnapshot = await getDocs(collection(db, "users"));
  const results = querySnapshot.docs
    .filter(doc => doc.data().approved !== true) // Filtra estudantes não aprovados
    .map(doc => ({ id: doc.id, ...doc.data() }));
  logger.info(`Fetched ${results.length} pending students`);
  return results;
};

// Aprovar um estudante
export const approveStudent = async (studentId) => {
  try {
    logger.info(`Approving student with ID: ${studentId}`);

    // Referência ao documento do aluno
    const studentRef = doc(db, 'users', studentId);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      logger.error(`Student with ID: ${studentId} not found.`);
      throw new Error(`Student with ID: ${studentId} not found.`);
    }

    // Atualização do status do aluno
    await updateDoc(studentRef, {
      approved: true,  // Alterando o campo \`approved\`, não \`status\`
    });

    logger.info(`Student ${studentId} approved successfully`);
  } catch (error) {
    logger.error('Error approving student:', error);
    throw new Error('Failed to approve student. Please check the permissions.');
  }
};

// 🔄 Atualizado: Criar um novo usuário com autenticação e dados no Firestore
export const createUser = async (email, userData) => {
  try {
    logger.info(`Creating user with email: ${email}`);
    const { password, ...rest } = userData;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userToSave = {
      ...rest,
      approved: userData.role === "student" ? false : true, // Professores já aprovados
    };

    await setDoc(doc(db, "users", uid), userToSave);
    logger.info(`User created with email: ${email}, uid: ${uid}`);
  } catch (error) {
    logger.error("Erro ao criar usuário:", error);
    throw error;
  }
};

// ✅ Atualizar um usuário
export const updateUser = async (uid, updatedData) => {
  logger.info(`Updating user with id: ${uid}`);
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updatedData);
  logger.info(`User updated with id: ${uid}`);
};

// ✅ Deletar um usuário
export const deleteUser = async (uid) => {
  logger.info(`Deleting user with id: ${uid}`);
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
  logger.info(`User deleted with id: ${uid}`);
};

// ✅ Buscar todos os estudantes aprovados
export const getApprovedStudents = async () => {
  logger.info(`Fetching approved students`);
  const querySnapshot = await getDocs(collection(db, "users"));
  const results = querySnapshot.docs
    .filter(doc => doc.data().approved === true && doc.data().role !== "admin") // Filtra estudantes aprovados
    .map(doc => ({ id: doc.id, ...doc.data() }));
  logger.info(`Fetched ${results.length} approved students`);
  return results;
}
