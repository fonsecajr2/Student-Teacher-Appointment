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
import logger from '../utils/logger.js';

const appointmentCollection = collection(db, "appointments");

// Criar agendamento
export const createAppointment = async (appointmentData) => {
  logger.info(`Creating appointment with data: ${JSON.stringify(appointmentData)}`);
  const docRef = await addDoc(appointmentCollection, appointmentData);
  logger.info(`Appointment created with id: ${docRef.id}`);
  return docRef.id;
};

// Buscar agendamentos por aluno
export const getAppointmentsByUserId = async (userId) => {
  logger.info(`Fetching appointments for userId: ${userId}`);
  const q = query(appointmentCollection, where("userId", "==", userId));
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  logger.info(`Found ${results.length} appointments for userId: ${userId}`);
  return results;
};

// Buscar agendamentos por professor
export const getAppointmentsByTeacherId = async (teacherId) => {
  logger.info(`Fetching appointments for teacherId: ${teacherId}`);
  const q = query(appointmentCollection, where("teacherId", "==", teacherId));
  const snapshot = await getDocs(q);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  logger.info(`Found ${results.length} appointments for teacherId: ${teacherId}`);
  return results;
};

// Buscar todos os agendamentos (para admin)
export const getAllAppointments = async () => {
  logger.info(`Fetching all appointments`);
  const snapshot = await getDocs(appointmentCollection);
  const results = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  logger.info(`Found ${results.length} total appointments`);
  return results;
};

// Atualizar status do agendamento
export const updateAppointmentStatus = async (id, status) => {
  logger.info(`Updating appointment status for id: ${id} to status: ${status}`);
  const ref = doc(appointmentCollection, id);
  await updateDoc(ref, { status });
  logger.info(`Updated appointment status for id: ${id}`);
};

// Cancelar agendamento (alias do delete)
export const cancelAppointment = async (id) => {
  logger.info(`Canceling appointment with id: ${id}`);
  await deleteDoc(doc(appointmentCollection, id));
  logger.info(`Canceled appointment with id: ${id}`);
};

// Excluir agendamento (caso precise diferenciar de cancelamento)
export const deleteAppointment = async (id) => {
  logger.info(`Deleting appointment with id: ${id}`);
  await deleteDoc(doc(appointmentCollection, id));
  logger.info(`Deleted appointment with id: ${id}`);
};
