'use client'
 
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Form, FormControl } from "@/components/ui/form"
import CustomFormField from "../CustomFormField"
import SubmitButton from "../SubmitButton"
import { useState } from "react"
import { PatientFormValidation } from "@/lib/validation"
import { useRouter } from "next/navigation"
import { registerPatient } from "@/lib/actions/patient.actions"
import { FormFieldType } from "./PatientForm"
import { RadioGroup, RadioGroupItem } from "../ui/radio-group"
import { Doctors, GenderOptions, IdentificationTypes, PatientFormDefaultValues } from "@/constants"
import { Label } from "../ui/label"
import { SelectItem } from "../ui/select"
import Image from "next/image"
import FileUploader from "../FileUploader"

const RegisterForm = ({ user }: { user: User }) => {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);

  const form = useForm<z.infer<typeof PatientFormValidation>>({
    resolver: zodResolver(PatientFormValidation),
    defaultValues: {
      ...PatientFormDefaultValues,
      name: "",
      email: "",
      phone: "",
    },
  })
 
  async function onSubmit(values: z.infer<typeof PatientFormValidation>) {
    setIsLoading(true);

    let formData;

    if (values.identificationDocument && values.identificationDocument.length > 0) {
        const blobFile = new Blob([values.identificationDocument[0]], {
          type: values.identificationDocument[0].type,
        })

        formData = new FormData();
        formData.append('blobFile', blobFile);
        formData.append('fileName', values.identificationDocument[0].name);
    }

    try {
        const patientData = {
            ...values,
            userId: user.$id,
            birthDate: new Date(values.birthDate),
            identificationDocument: formData,
        };

        // @ts-ignore
        const patient = await registerPatient(patientData);

        if (patient) {
            router.push(`/patients/${user.$id}/new-appointment`);
        }
    } catch (error) {
        console.error("Fehler beim Registrieren des Patienten:", error);
    }

    setIsLoading(false);
}

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-12 flex-1">
        <section className="space-y-4">
            <h1 className="header">Willkommen 👋</h1>
            <p className="text-dark-700">Ihre Angaben helfen uns, Sie optimal zu betreuen.</p>
        </section>

        <section className="space-y-6">
            <div className="mb-9 space-y-1">
                <h2 className="sub-header">Persönliche Angaben</h2>
            </div>
        </section>
       
        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="name"
          label="Vollständiger Name"
          placeholder="Max Muster"
          iconSrc="/assets/icons/user.svg"
          iconAlt="user"
        />

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="email"
          label="E-Mail"
          placeholder="max@muster.de"
          iconSrc="/assets/icons/email.svg"
          iconAlt="email"
        />

        <CustomFormField 
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name="phone"
          label="Telefonnummer"
          placeholder="01234 567890"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
          fieldType={FormFieldType.DATE_PICKER}
          control={form.control}
          name="birthDate"
          label="Geburtsdatum"
          dateFormat="dd.MM.yyyy"
          showTimeSelect={false}
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="gender"
          label="Geschlecht"
          renderSkeleton={(field) => (
            <FormControl>
              <RadioGroup className="flex h-11 gap-6 xl:justify-between"
              onValueChange={field.onChange}
              defaultValue={field.value}>
                {GenderOptions.map((option) => (
                  <div key={option} className="radio-group">
                    <RadioGroupItem value={option} id={option} />
                    <Label htmlFor={option} className="cursor-pointer">
                      {option}
                    </Label>
                  </div>
                ))}
              </RadioGroup>
            </FormControl>
          )}
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="address"
          label="Wohnort"
          placeholder="Musterstraße 12, Ulm"
        />

        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="occupation"
          label="Beruf"
          placeholder="Web Developer"
        />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="emergencyContactName"
            label="Name des Notfallkontakts"
            placeholder="Vollständigen Namen eingeben"
          />

          <CustomFormField 
            fieldType={FormFieldType.PHONE_INPUT}
            control={form.control}
            name="emergencyContactNumber"
            label="Notfallkontakt-Telefonnummer"
            placeholder="01234 56789"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
              <h2 className="sub-header">Medizinische Informationen</h2>
          </div>
        </section>

         {/* PRIMARY CARE PHYSICIAN */}
         <CustomFormField
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name="primaryPhysician"
            label="Wunscharzt"
            placeholder="Arzt auswählen"
          >
            {Doctors.map((doctor, i) => (
              <SelectItem key={doctor.name + i} value={doctor.name}>
                <div className="flex cursor-pointer items-center gap-2">
                  <Image
                    src={doctor.image}
                    width={32}
                    height={32}
                    alt="doctor"
                    className="rounded-full border border-dark-500"
                  />
                  <p>{doctor.name}</p>
                </div>
              </SelectItem>
            ))}
          </CustomFormField>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insuranceProvider"
            label="Krankenkasse"
            placeholder="Name der Krankenkasse"
          />

          <CustomFormField 
            fieldType={FormFieldType.INPUT}
            control={form.control}
            name="insurancePolicyNumber"
            label="Versicherungsnummer"
            placeholder="L123456789"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="allergies"
            label="Bekannte Allergien"
            placeholder="Nüsse, Pollen, Penicillin"
          />

          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="currentMedication"
            label="Aktuelle Medikation"
            placeholder="Ibuprofen 200mg, Paracetamol 500mg"
          />
        </div>

        <div className="flex flex-col gap-6 xl:flex-row">
          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="familyMedicalHistory"
            label="Familienanamnese"
            placeholder="Mutter hat eine Herzkrankheit. Vater hat Diabetes"
          />

          <CustomFormField 
            fieldType={FormFieldType.TEXTAREA}
            control={form.control}
            name="pastMedicalHistory"
            label="Vorerkrankungen"
            placeholder="Asthma, Bluthochdruck"
          />
        </div>

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
              <h2 className="sub-header">Identifikation und Verifizierung</h2>
          </div>
        </section>

        <CustomFormField 
          fieldType={FormFieldType.SELECT}
          control={form.control}
          name="identificationType"
          label="Art der Identifikation"
          placeholder="Auswählen"
        >
          {IdentificationTypes.map((type) => (
            <SelectItem key={type} value={type}>
              {type}
            </SelectItem>
          ))}
        </CustomFormField>

        <CustomFormField 
          fieldType={FormFieldType.INPUT}
          control={form.control}
          name="identificationNumber"
          label="Ausweisnummer"
          placeholder="123456789"
        />

        <CustomFormField
          fieldType={FormFieldType.SKELETON}
          control={form.control}
          name="identificationDocument"
          label="Ausweisdokument"
          renderSkeleton={(field) => (
            <FormControl>
              <FileUploader files={field.value} onChange={field.onChange} />
            </FormControl>
          )}
        />

        <section className="space-y-6">
          <div className="mb-9 space-y-1">
              <h2 className="sub-header">Datenschutzerklärung & Einwilligung</h2>
          </div>
        </section>

        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="treatmentConsent"
          label="Ich stimme der Behandlung zu"
        />
        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="disclosureConsent"
          label="Ich stimme der Weitergabe von Informationen zu"
        />
        <CustomFormField 
          fieldType={FormFieldType.CHECKBOX}
          control={form.control}
          name="privacyConsent"
          label="Ich stimme der Datenschutzrichtlinie zu"
        />

        <SubmitButton isLoading={isLoading}>Loslegen</SubmitButton>
      </form>
    </Form>
  )
}

export default RegisterForm