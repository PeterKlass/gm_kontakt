import clsx from 'clsx'
import Image from 'next/image'
import { StatusIcon } from '@/constants'

const statusTranslation = {
  pending: 'Ausstehend',
  scheduled: 'Geplant',
  cancelled: 'Abgesagt'
};

const StatusBadge = ({ status }: { status: Status } ) => {
  return (
    <div className={clsx('status-badge', {
      'bg-green-600': status === 'scheduled',
      'bg-blue-600': status === 'pending',
      'bg-red-600': status === 'cancelled',
    })}
    style={{ minWidth: '120px', textAlign: 'center', display: 'flex', alignItems: 'center', justifyContent: 'center' }}
    >
      <Image 
        src={StatusIcon[status]}
        alt={statusTranslation[status]}  // Hier wird die Übersetzung verwendet
        width={24}
        height={24}
        className='h-fit w-3'
      />
      <p
        className={clsx("text-12-semibold capitalize", {
          "text-green-500": status === "scheduled",
          "text-blue-500": status === "pending",
          "text-red-500": status === "cancelled",
        })}
      >
        {statusTranslation[status]}  {/* Hier wird die Übersetzung verwendet */}
      </p>
    </div>
  )
}

export default StatusBadge
