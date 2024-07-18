import React, { useEffect, useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import api from "../services/api";

const AppointmentList = () => {
  const [color, setColor] = useState("red");
  const [appointments, setAppointments] = useState([]);
  const { user } = useContext(AuthContext);
  const { logout } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        if (user) {
          const response = await axios.get(
            "http://localhost:8000/api/appointments/"
          );
          setAppointments(response.data);
        }
      } catch (error) {
        console.error("Error fetching appointments:", error);
      }
    };

    fetchAppointments();
  }, [user]);

  const handleClick = () => {
    setColor((prevColor) => (prevColor === "red" ? "blue" : "red"));
  };
  const toggleChecklistItemStatus = async (appointmentId, itemIndex) => {
    try {
      const appointment = appointments.find((app) => app.id === appointmentId);
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
          const ampm = hours >= 12 ? "PM" : "AM";
          const hours12 = hours % 12 || 12;
          const minutesStr = minutes < 10 ? `0${minutes}` : minutes;
          return `${hours12}:${minutesStr} ${ampm}`;
        };

        const formattedAppointmentTime = convertTo12HourFormat(
          appointment.appointment_time
        );

        const payload = {
          ...appointment,
          appointment_time: formattedAppointmentTime,
          checklist: updatedChecklist,
        };

        const response = await axios.put(
          `http://localhost:8000/api/appointments/${appointmentId}/`,
          payload,
          {
            headers: {
              "Content-Type": "application/json",
            },
          }
        );

        setAppointments((prevAppointments) =>
          prevAppointments.map((app) => {
            if (app.id === appointmentId) {
              return response.data;
            }
            return app;
          })
        );
      }
    } catch (error) {
      console.error("Error updating checklist item status:", error);
      if (error.response) {
        console.log("Error response:", error.response.data);
      }
    }
  };

  if (!user) {
    return (
      <p className="text-center mt-4">Please log in to view appointments.</p>
    );
  }

  const formatTime = (timeString) => {
    const time = new Date(`1970-01-01T${timeString}`);
    return time.toLocaleTimeString([], { hour: "numeric", minute: "2-digit" });
  };

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
  const capitalize = (word) => {
    if (word === "danger") {
      word = "error";
    }
    const lower = word.toLowerCase();
    return lower.charAt(0).toUpperCase() + lower.slice(1);
  };

  return (
    <div>
      {" "}
      <ul className="flex items-center bg-gray-800 justify-content-between p-2 fixed-top">
        {" "}
        <button
          className="d-flex border-0 btn btn-outline-light fs-4"
          onClick={() => navigate("/")}
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
      <div className="mt-16 p-3">
        {appointments.map((appointment) => (
          <li
            key={appointment.id}
            className="bg-gray-100 border border-gray-300 mb-4 p-4 rounded-lg shadow-md d-flex fs-5 "
          >
            <div className="fw-bold text-1xl  ">{appointment.id}</div>{" "}
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
              {renderChecklist(appointment, toggleChecklistItemStatus)}{" "}
            </div>{" "}
            <div className=" d-flex align-items-end ">
              <button
                className="btn"
                style={{ color: color }}
                onClick={handleClick}
              >
                Done
              </button>
            </div>
          </li>
        ))}{" "}
      </div>
    </div>
  );
};

const renderChecklist = (appointment, toggleChecklistItemStatus) => {
  if (!appointment.checklist || !Array.isArray(appointment.checklist)) {
    return <p className="text-gray-700 mt-2">No checklist items</p>;
  }

  return (
    <div className="mt-2  ">
      <ul className="list-none ">
        <p className="font-semibold">List:</p>
        {appointment.checklist.map((item, index) => (
          <li key={index} className="flex items-center py-1 ">
            {/* <input
              type="checkbox"
              checked={item.done}
              onChange={() => toggleChecklistItemStatus(appointment.id, index)}
              className="mr-2"
            /> */}
            <span className="">{item.text.name} </span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AppointmentList;
