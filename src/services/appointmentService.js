// src/services/appointmentService.js
import { db } from './firebase';
import {
  collection,
  addDoc,
  getDocs,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from 'firebase/firestore';

const appointmentCollection = collection(db, "appointments");

// Criar agendamento
export const createAppointment = async (appointmentData) => {
  const docRef = await addDoc(appointmentCollection, appointmentData);
  return docRef.id;
};

// Buscar agendamentos por aluno
export const getAppointmentsByUserId = async (userId) => {
  const q = query(appointmentCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Buscar agendamentos por professor
export const getAppointmentsByTeacherId = async (teacherId) => {
  const q = query(appointmentCollection, where("teacherId", "==", teacherId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Buscar todos os agendamentos (para admin)
export const getAllAppointments = async () => {
  const snapshot = await getDocs(appointmentCollection);
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
};

// Atualizar status do agendamento
export const updateAppointmentStatus = async (id, status) => {
  const ref = doc(appointmentCollection, id);
  await updateDoc(ref, { status });
};

// Cancelar agendamento (alias do delete)
export const cancelAppointment = async (id) => {
  await deleteDoc(doc(appointmentCollection, id));
};

// Excluir agendamento (caso precise diferenciar de cancelamento)
export const deleteAppointment = async (id) => {
  await deleteDoc(doc(appointmentCollection, id));
};
