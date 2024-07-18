import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';

const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      try {
        const response = await axios.get('http://127.0.0.1:8000/api/user/appointments/', {
          params: { user_id: user.id } // Assuming you can pass user ID as a query parameter
        });
        setAppointments(response.data);
      } catch (err) {
        setError(err);
      } finally {
        setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const capitalize = (word) => {
    if (word === "danger") {
      word = "error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  const convertTo12HourFormat = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    const hours = time.getHours();
    const minutes = time.getMinutes();
    const ampm = hours >= 12 ? "PM" : "AM";
    const hours12 = hours % 12 || 12;
    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
    return `${hours12}:${minutesStr} ${ampm}`;
  };
  
  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error loading appointments: {error.message}</p>;

  return (
    <div className='mt-16 p-4'>
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Appointments</h1>
      <div>
      <ol className="list-group list-group-numbered fw-bold">
        {appointments.map((appointment) => (
          <li
            key={appointment.id}
            className="bg-gray-100 border border-gray-300 mb-4 p-4 rounded-lg shadow-md d-flex fs-5 "
          >
            <div className="ms-2 me-auto">
              {" "}
              <div className="fw-bold text-1xl ">
                {capitalize(appointment.customer_name)}
              </div>{" "}
              <p className="font-semibold">
                Date:{" "}
                <span className="text-gray-700">
                  {appointment.appointment_date}
                </span>
              </p>{" "}
              <p className="font-semibold">
                Time:{" "}
                <span className="text-gray-700">
                  {formatTime(appointment.appointment_time)}
                </span>
              </p>{" "}
            </div>{" "}
          </li>
        ))}{" "}
        </ol>
      </div>

    </div>
  );
};

export default MyAppointments;
