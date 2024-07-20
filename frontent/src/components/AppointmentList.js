import React, { useEffect, useState, useContext, useCallback } from 'react';
import axios from 'axios';
import { AuthContext } from '../context/AuthContext';
import Filters from './Filters';
import AppointmentCard from './AppointmentCard';
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const AppointmentList = () => {
    const [appointments, setAppointments] = useState([]);
    const [filteredAppointments, setFilteredAppointments] = useState([]);
    const [filter, setFilter] = useState({ search: '', sort: '', status: '' });
    const { user } = useContext(AuthContext);
    const { logout } = useContext(AuthContext);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchAppointments = async () => {
            try {
                if (user) {
                    const response = await axios.get('http://localhost:8000/api/appointments/');
                    setAppointments(response.data);
                    setFilteredAppointments(response.data);
                }
            } catch (error) {
                console.error('Error fetching appointments:', error);
            }
        };

        fetchAppointments();
    }, [user]);

    const applyFilters = useCallback(() => {
        let filtered = [...appointments];

        // Filter by search term (customer name or date)
        if (filter.search) {
            filtered = filtered.filter(appointment =>
                appointment.customer_name.toLowerCase().includes(filter.search.toLowerCase()) ||
                appointment.appointment_date.includes(filter.search)
            );
        }

        // Sort by date
        if (filter.sort === 'oldest') {
            filtered.sort((a, b) => new Date(a.appointment_date) - new Date(b.appointment_date));
        } else if (filter.sort === 'newest') {
            filtered.sort((a, b) => new Date(b.appointment_date) - new Date(a.appointment_date));
        }

        // Filter by appointment status
        if (filter.status) {
            filtered = filtered.filter(appointment => appointment.status === filter.status);
        }

        setFilteredAppointments(filtered);
    }, [appointments, filter]);

    useEffect(() => {
        applyFilters();
    }, [appointments, filter, applyFilters]);

    const resetFilters = () => {
        setFilter({ search: '', sort: '', status: '' });
    };

    const toggleChecklistItemStatus = async (appointmentId, itemIndex) => {
        try {
            const appointment = appointments.find(app => app.id === appointmentId);
            if (appointment) {
                const updatedChecklist = appointment.checklist.map((item, index) => {
                    if (index === itemIndex) {
                        return { ...item, done: !item.done };
                    }
                    return item;
                });

                const convertTo12HourFormat = (timeString) => {
                    const time = new Date(`1970-01-01T${timeString}`);
                    const hours = time.getHours();
                    const minutes = time.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const hours12 = hours % 12 || 12;
                    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
                    return `${hours12}:${minutesStr} ${ampm}`;
                };

                const formattedAppointmentTime = convertTo12HourFormat(appointment.appointment_time);

                const payload = {
                    ...appointment,
                    appointment_time: formattedAppointmentTime,
                    checklist: updatedChecklist,
                };

                const response = await axios.put(`http://localhost:8000/api/appointments/${appointmentId}/`, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                setAppointments(prevAppointments => prevAppointments.map(app => {
                    if (app.id === appointmentId) {
                        return response.data;
                    }
                    return app;
                }));
            }
        } catch (error) {
            console.error('Error updating checklist item status:', error);
            if (error.response) {
                console.log('Error response:', error.response.data);
            }
        }
    };

    const toggleAppointmentStatus = async (appointmentId) => {
        try {
            const appointment = appointments.find(app => app.id === appointmentId);
            if (appointment) {
                const updatedStatus = appointment.status === 'pending' ? 'done' : 'pending';

                const convertTo12HourFormat = (timeString) => {
                    const time = new Date(`1970-01-01T${timeString}`);
                    const hours = time.getHours();
                    const minutes = time.getMinutes();
                    const ampm = hours >= 12 ? 'PM' : 'AM';
                    const hours12 = hours % 12 || 12;
                    const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
                    return `${hours12}:${minutesStr} ${ampm}`;
                };

                const formattedAppointmentTime = convertTo12HourFormat(appointment.appointment_time);

                const payload = {
                    ...appointment,
                    appointment_time: formattedAppointmentTime,
                    status: updatedStatus,
                };

                const response = await axios.put(`http://localhost:8000/api/appointments/${appointmentId}/`, payload, {
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });

                setAppointments(prevAppointments => prevAppointments.map(app => {
                    if (app.id === appointmentId) {
                        return response.data;
                    }
                    return app;
                }));
            }
        } catch (error) {
            console.error('Error updating appointment status:', error);
            if (error.response) {
                console.log('Error response:', error.response.data);
            }
        }
    };

    if (!user) {
        return <p className="text-center mt-4">Please log in to view appointments.</p>;
    }

    const handleLogout = async () => {
        try {
          await api.logout();
          logout();
          navigate("/");
          console.log("Logged out successfully");
        } catch (error) {
          console.error("Logout error:", error);
        }
      };

    return (
        <div className="container mx-auto mt-8 px-4">
            <ul className="flex items-center bg-gray-800 justify-content-between p-2 fixed-top">
        {" "}
        <button
          className="d-flex border-0 btn btn-outline-light fs-4"
          onClick={() => navigate("/Home")}
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            width="25"
            height="36"
            className="fill-current"
          >
            {" "}
            <path d="M0 0h24v24H0z" fill="none" />{" "}
            <path d="M14.41 7.41L13 6l-6 6 6 6 1.41-1.41L9.83 12z" />{" "}
          </svg>{" "}
        </button>{" "}
        <li className="nav-item ">
          {" "}
          <Link className="nav-link active text-white fs-4" aria-current="page">
            {" "}
            Appointments{" "}
          </Link>{" "}
        </li>{" "}
        <button
          className="d-flex border-0 btn btn-outline-light fs-4"
          onClick={handleLogout}
        >
          {" "}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="38"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="feather feather-log-out"
          >
            {" "}
            <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>{" "}
            <polyline points="16 17 21 12 16 7"></polyline>{" "}
            <line x1="21" y1="12" x2="9" y2="12"></line>{" "}
          </svg>{" "}
        </button>{" "}
      </ul>{" "}

            <Filters filter={filter} setFilter={setFilter} resetFilters={resetFilters} />

            <ul className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredAppointments.map(appointment => (
                    <AppointmentCard
                        key={appointment.id}
                        appointment={appointment}
                        toggleAppointmentStatus={toggleAppointmentStatus}
                        toggleChecklistItemStatus={toggleChecklistItemStatus}
                    />
                ))}
            </ul>
        </div>
    );
};

export default AppointmentList;
