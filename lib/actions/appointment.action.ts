'use server'

import { ID, Query } from "node-appwrite";
import { APPOINTMENT_COLLECTION_ID, DATABASE_ID, databases, messaging } from "../appwrite.config";
import { formatDateTime, parseStringify } from "../utils";
import { Appointment } from "@/types/appwrite.types";
import { revalidatePath } from 'next/cache';

export const createAppointment = async (appointment: CreateAppointmentParams) => {
    try {
        const newAppointment = await databases.createDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            ID.unique(),
            appointment
        );

        return parseStringify(newAppointment);
    } catch (error) {
        console.error("Error creating appointment:", error);
        return null; // Rückgabe eines Nullwertes im Fehlerfall
    }
}

export const getAppoinment = async (appointmentId: string) => {
    try {
        const appointment = await databases.getDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
        );
        
        return parseStringify(appointment);
    } catch (error) {
        console.error("Error fetching appointment:", error);
        return null; // Rückgabe eines Nullwertes im Fehlerfall
    }
}

export const getRecentAppointmentList = async () => {
    try {
        const appointments = await databases.listDocuments(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            [Query.orderDesc('$createdAt')] // Korrektur: '$createAt' in '$createdAt' ändern
        );

        const initialCounts = {
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
        };

        const counts = (appointments.documents as Appointment[]).reduce((acc, appointment) => {
            if (appointment.status === 'scheduled') {
                acc.scheduledCount += 1;
            } else if (appointment.status === 'pending') {
                acc.pendingCount += 1;
            } else if (appointment.status === 'cancelled') {
                acc.cancelledCount += 1;
            }

            return acc;
        }, initialCounts);

        const data = {
            totalCount: appointments.total,
            ...counts,
            documents: appointments.documents
        };

        return parseStringify(data);
    } catch (error) {
        console.error("Error fetching recent appointments:", error);
        return {
            totalCount: 0,
            scheduledCount: 0,
            pendingCount: 0,
            cancelledCount: 0,
            documents: [],
        }; // Rückgabe eines leeren Ergebnisses im Fehlerfall
    }
}

export const updateAppointment = async ({ appointmentId, userId, appointment, type }: UpdateAppointmentParams) => {
     try {
        const updatedAppointment = await databases.updateDocument(
            DATABASE_ID!,
            APPOINTMENT_COLLECTION_ID!,
            appointmentId,
            appointment
        )

        if(!updatedAppointment) {
            throw new Error('Termin nicht gefunden');
        }

        const smsMessage = `
            Hallo, hier ist CarePulse.
            ${type === 'schedule'
                ? `Your appointment has been scheduled for ${formatDateTime(appointment.schedule!).dateTime} mit Dr. ${appointment.primaryPhysician}.`
                : `We regret to inform you that your appointment has been cancelled for the following reason: ${appointment.cancellationReason}`
            }
        `

        revalidatePath('/admin');
        return parseStringify(updateAppointment)
     }  catch (error) {
        console.log(error)
     }
}

export const sendSMSNotification = async (userId: string, content: string) => {
    try {
      // https://appwrite.io/docs/references/1.5.x/server-nodejs/messaging#createSms
      const message = await messaging.createSms(
        ID.unique(),
        content,
        [],
        [userId]
      );
      return parseStringify(message);
    } catch (error) {
      console.error("An error occurred while sending sms:", error);
    }
  };
  