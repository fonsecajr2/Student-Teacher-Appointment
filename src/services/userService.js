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

const usersCollection = collection(db, "users");

// ✅ Buscar um usuário pelo ID
export const getUserById = async (uid) => {
  const docRef = doc(db, "users", uid);
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

// Função para pegar os estudantes pendentes
export const getPendingStudents = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs
    .filter(doc => doc.data().approved !== true) // Filtra estudantes não aprovados
    .map(doc => ({ id: doc.id, ...doc.data() }));
};

// ✅ Aprovar um estudante
export const approveStudent = async (studentId) => {
  try {
    console.log(`Approving student with ID: ${studentId}`);

    // Referência ao documento do aluno
    const studentRef = doc(db, 'users', studentId);
    const studentDoc = await getDoc(studentRef);

    if (!studentDoc.exists()) {
      throw new Error(`Student with ID: ${studentId} not found.`);
    }

    // Atualização do status do aluno
    await updateDoc(studentRef, {
      approved: true,  // Alterando o campo `approved`, não `status`
    });

    console.log(`Student ${studentId} approved successfully`);
  } catch (error) {
    console.error('Error approving student:', error);
    throw new Error('Failed to approve student. Please check the permissions.');
  }
};

// 🔄 Atualizado: Criar um novo usuário com autenticação e dados no Firestore
export const createUser = async (email, userData) => {
  try {
    const { password, ...rest } = userData;

    const userCredential = await createUserWithEmailAndPassword(auth, email, password);
    const uid = userCredential.user.uid;

    const userToSave = {
      ...rest,
      approved: userData.role === "student" ? false : true, // Professores já aprovados
    };

    await setDoc(doc(db, "users", uid), userToSave);
  } catch (error) {
    console.error("Erro ao criar usuário:", error);
    throw error;
  }
};

// ✅ Atualizar um usuário
export const updateUser = async (uid, updatedData) => {
  const userRef = doc(db, "users", uid);
  await updateDoc(userRef, updatedData);
};

// ✅ Deletar um usuário
export const deleteUser = async (uid) => {
  const userRef = doc(db, "users", uid);
  await deleteDoc(userRef);
};

// ✅ Buscar todos os estudantes aprovados
export const getApprovedStudents = async () => {
  const querySnapshot = await getDocs(collection(db, "users"));
  return querySnapshot.docs
    .filter(doc => doc.data().approved === true) // Filtra estudantes aprovados
    .map(doc => ({ id: doc.id, ...doc.data() }));
}