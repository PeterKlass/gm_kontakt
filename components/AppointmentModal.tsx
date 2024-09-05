'use client'

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { useState } from "react"
import { Button } from "./ui/button";
import AppointmentForm from "./forms/AppointmentForm";
import { Appointment } from "@/types/appwrite.types";

const AppointmentModal = ({ 
  type,
  patientId,
  userId,
  appointment,
  title,
  description
 } : {
  type: 'schedule' | 'cancel',
  patientId: string,
  userId: string,
  appointment?: Appointment
  title: string,
  description: string
  
}) => {
  const [open, setOpen] = useState(false);

  // Übersetzen der Button-Texte
  const buttonText = type === 'schedule' ? 'Termin zu planen' : 'Termin abzusagen';

  // Funktion zum Schließen des Modals nach erfolgreicher Aktion
  const handleSuccess = () => {
    setOpen(false);
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button
          variant="ghost"
          className={`capitalize underline ${type === "schedule" && "text-green-500"}`}
        >
          {type === 'schedule' ? 'Planen' : 'Absagen'}
        </Button>
      </DialogTrigger>
      <DialogContent className="shad-dialog sm:max-w-md">
        <DialogHeader className="mb-4 space-y-3">
          <DialogTitle>{type === 'schedule' ? 'Termin planen' : 'Termin absagen'}</DialogTitle>
          <DialogDescription>
            Bitte bestätigen Sie die folgenden Angaben, um den {buttonText}.
          </DialogDescription>
        </DialogHeader>

            <AppointmentForm
              userId={userId}
              patientId={patientId}
              type={type}
              appointment={appointment}
              setOpen={handleSuccess}
            />
      </DialogContent>
    </Dialog>
  )
}

export default AppointmentModal
