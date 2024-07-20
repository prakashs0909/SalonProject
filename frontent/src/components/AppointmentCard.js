import React from 'react';
import Checklist from './Checklist';

const AppointmentCard = ({ appointment, toggleAppointmentStatus, toggleChecklistItemStatus }) => {
    const formatTime = (timeString) => {
        const time = new Date(`1970-01-01T${timeString}`);
        return time.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
    };

    const capitalize = (word)=>{
        if (word==="danger") {
          word = "error"
        }
          const lower = word.toLowerCase();
          return lower.charAt(0).toUpperCase() + lower.slice(1);
      }

    return (
        <li className="bg-gray-100 border border-gray-300 mb-4 p-4 rounded-lg shadow-md fs-5">
            <div className="fw-bold text-1xl  ">{appointment.id}</div>
            <p className="font-semibold">Customer: <span className="text-gray-700">{capitalize(appointment.customer_name)}</span></p>
            <p className="font-semibold">Date: <span className="text-gray-700">{appointment.appointment_date}</span></p>
            <p className="font-semibold">Time: <span className="text-gray-700">{formatTime(appointment.appointment_time)}</span></p>
            <div className="mt-2">
                <button
                    className={`p-2 border border-gray-300 rounded-md mr-2 ${appointment.status === 'done' ? 'bg-green-300' : 'bg-red-300'}`}
                    onClick={() => toggleAppointmentStatus(appointment.id)}
                >
                    {appointment.status === 'done' ? 'Mark as Pending' : 'Mark as Done'}
                </button>
            </div>
            <Checklist appointment={appointment} toggleChecklistItemStatus={toggleChecklistItemStatus} />
        </li>
    );
};

export default AppointmentCard;
