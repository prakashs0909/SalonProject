import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext'; // Import your AuthContext


const MyAppointments = () => {
  const [appointments, setAppointments] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  const { user } = useContext(AuthContext); // Get the user from AuthContext

  useEffect(() => {
    const fetchAppointments = async () => {
      // if (!user) return; // If no user is logged in, return early
      try {
        if(user){
          console.log(user)
        const response = await axios.get('http://127.0.0.1:8000/api/user/appointments/');
        setAppointments(response.data);
        // setLoading(false);
      }
      } catch (err) {
        // setError(err);
        // setLoading(false);
      }
    };

    fetchAppointments();
  }, [user]);

  // if (loading) return <p>Loading...</p>;
  // if (error) return <p>Error loading appointments: {error.message}</p>;

  return (
    <div className='mt-16 p-4' >
      <h1>My Appointments</h1>
      <ul>
        {appointments.map(appointment => (
          <li key={appointment.id}>
            
            {appointment.customer_name} - {appointment.appointment_date} at {appointment.appointment_time} with user id {appointment.user}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default MyAppointments;
