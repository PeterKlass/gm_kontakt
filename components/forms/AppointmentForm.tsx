'use client'
 
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Form } from "@/components/ui/form";
import "react-phone-number-input/style.css";
import CustomFormField from "../CustomFormField";
import SubmitButton from "../SubmitButton";
import { getAppointmentSchema } from "@/lib/validation";
import { useRouter } from "next/navigation";
import { FormFieldType } from "./PatientForm";
import { Doctors } from "@/constants";
import { SelectItem } from "../ui/select";
import Image from "next/image";
import { createAppointment, updateAppointment } from "@/lib/actions/appointment.action";
import { Appointment } from "@/types/appwrite.types";
 
export const AppointmentForm = ({
    userId, patientId, type, appointment, setOpen,
}: {
    userId: string;
    patientId: string;
    type: "create" | "cancel" | "schedule";
    appointment?: Appointment;
    setOpen: (open: boolean) => void;
}) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment.primaryPhysician : '',
      schedule: appointment ? new Date(appointment?.schedule): new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      note: appointment?.note || '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  })
 
  async function onSubmit(values: z.infer<typeof AppointmentFormValidation>) {
    setIsLoading(true);

    let status;
    switch (type) {
        case 'schedule':
            status = 'scheduled';
            break;
        case 'cancel':
            status = 'cancelled';
            break;
        default:
            status = 'pending';
            break;
    }

    try {
      setOpen(false)
        if (type === 'create' && patientId) {
            const appointmentData = {
                userId,
                patient: patientId,
                primaryPhysician: values.primaryPhysician,
                schedule: new Date(values.schedule),
                reason: values.reason!,
                note: values.note,
                status: status as Status,
            };

            const appointment = await createAppointment(appointmentData);

            if (appointment) {
                form.reset();
                setOpen(false);  // Modal schließen, bevor die Navigation erfolgt
                router.push(`/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`);
            }
        } else {
            const appointmentToUpdate = {
                userId,
                appointmentId: appointment?.$id!,
                appointment: {
                    primaryPhysician: values?.primaryPhysician,
                    schedule: new Date(values?.schedule),
                    status: status as Status,
                    cancellationReason: values?.cancellationReason,
                },
                type
            };

            const updatedAppointment = await updateAppointment(appointmentToUpdate);

            if (updatedAppointment) {
                setOpen(false);  // Modal schließen
                form.reset();
            }
        }
    } catch (error) {
        console.log(error);
    }

    setIsLoading(false);
}

  let buttonLabel;

  switch (type) {
    case 'cancel':
      buttonLabel = 'Termin absagen';
      break;
    case 'create':
      buttonLabel = 'Termin erstellen';
      break;
    case 'schedule':
      buttonLabel = 'Termin planen';
      break;
    default:
      break;
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 flex-1">
        {type === 'create' &&<section className="mb-12 space-y-4">
          <h1 className="header">Neuer Termin</h1>
          <p className="text-dark-700">Vereinbare deinen ersten Termin in 10 Sekunden</p>
        </section>}

        {type !== "cancel" && (
          <>
            <CustomFormField 
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name="primaryPhysician"
              label="Arzt"
              placeholder="Wähle einen Arzt"
            >
                {Doctors.map((doctor) => (
                  <SelectItem key={doctor.name} value={doctor.name}>
                    <div className="flex cursor-pointer items-center gap-2">
                      <Image 
                        src={doctor.image}
                        width={32}
                        height={32}
                        alt={doctor.name}
                        className="rounded-full border border-dark-500"
                      />
                      <p>{doctor.name}</p>
                    </div>
                  </SelectItem>
                ))}
            </CustomFormField>

            <CustomFormField 
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name="schedule"
              label="Wunschtermin"      
              showTimeSelect={true}
              dateFormat="dd.MM.yyyy - HH:mm"
            />

            <div className="flex flex-col gap-6 xl:flex-row">
                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="reason"
                  label="Grund des Termins"
                  placeholder="Grund für den Termin angeben"
                />

                <CustomFormField
                  fieldType={FormFieldType.TEXTAREA}
                  control={form.control}
                  name="note"
                  label="Sonstiges"
                  placeholder="Sonstige Angaben eingeben"
                />
            </div>
          </>
        )}

        {type === "cancel" && (
          <CustomFormField
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="cancellationReason"
            label="Grund der Terminabsage"
            placeholder="Grund für die Absage angeben"
          />
        )}

        <SubmitButton isLoading={isLoading} className={`${type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'} w-full`}>{buttonLabel}</SubmitButton>
      </form>
    </Form>
  )
}

export default AppointmentForm