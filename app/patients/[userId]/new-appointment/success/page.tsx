import Image from "next/image";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Doctors } from "@/constants";
import { formatDateTime } from "@/lib/utils";
import { getAppoinment } from "@/lib/actions/appointment.action";

import * as Sentry from "@sentry/nextjs";
import { getUser } from "@/lib/actions/patient.actions";

const Success = async ({ params: { userId }, searchParams }: SearchParamProps) => {
    const appointmentId = (searchParams?.appointmentId as string) || '';
    const appointment = await getAppoinment(appointmentId);
    const doctor = Doctors.find((doc) => doc.name === appointment.primaryPhysician);
    const user = await getUser(userId);

    Sentry.metrics.set("user_view_appointment-success", user.name);

    // Formatierung von Datum und Uhrzeit
    const appointmentDate = new Date(appointment.schedule);
    const formattedDate = appointmentDate.toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' });
    const formattedTime = `${appointmentDate.getHours()}:${appointmentDate.getMinutes().toString().padStart(2, '0')} Uhr`;

    return (
        <div className=" flex h-screen max-h-screen px-[5%]">
          <div className="success-img">
            <Link href="/">
              <Image
                src="/assets/icons/logo-full.svg"
                height={1000}
                width={1000}
                alt="logo"
                className="h-10 w-fit"
              />
            </Link>
    
            <section className="flex flex-col items-center">
              <Image
                src="/assets/gifs/success.gif"
                height={300}
                width={280}
                alt="success"
              />
              <h2 className="header mb-6 max-w-[600px] text-center">
                Deine <span className="text-green-500">Terminanfrage</span> wurde erfolgreich übermittelt!
              </h2>
              <p>Wir werden uns in Kürze bei Ihnen melden, um den Termin zu bestätigen.</p>
            </section>
    
            <section className="request-details">
              <p>Details des angeforderten Termins: </p>
              <div className="flex items-center gap-3">
                <Image
                  src={doctor?.image!}
                  alt="doctor"
                  width={100}
                  height={100}
                  className="size-6"
                />
                <p className="whitespace-nowrap">Dr. {doctor?.name}</p>
              </div>
              <div className="flex gap-2">
                <Image
                  src="/assets/icons/calendar.svg"
                  height={24}
                  width={24}
                  alt="calendar"
                />
                {/* Formatierung von Datum und Uhrzeit */}
                <p>{`${formattedDate}, ${formattedTime}`}</p>
              </div>
            </section>
    
            <Button variant="outline" className="shad-primary-btn" asChild>
              <Link href={`/patients/${userId}/new-appointment`}>
                Weiteren Termin buchen
              </Link>
            </Button>
    
            <p className="copyright">© 2024 CarePluse</p>
          </div>
        </div>
    );
};

export default Success;
