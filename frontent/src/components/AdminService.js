import React, { useEffect, useState } from "react";
import {
  getServices,
  createService,
  updateService,
  deleteService,
} from "../services/apiService";

const AdminService = () => {
  const [services, setServices] = useState([]);
  const [newService, setNewService] = useState({ name: "", price: "", time: "" });
  const [editingService, setEditingService] = useState(null);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = () => {
    getServices()
      .then((response) => {
        setServices(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the services!", error);
      });
  };

  const handleCreateService = () => {
    createService(newService)
      .then((response) => {
        setServices([...services, response.data]);
        setNewService({ name: "", price: "", time: "" });
      })
      .catch((error) => {
        console.error("There was an error creating the service!", error);
      });
  };

  const handleUpdateService = () => {
    updateService(editingService.id, editingService)
      .then((response) => {
        const updatedServices = services.map((service) =>
          service.id === editingService.id ? response.data : service
        );
        setServices(updatedServices);
        setEditingService(null);
      })
      .catch((error) => {
        console.error("There was an error updating the service!", error);
      });
  };

  const handleDeleteService = (id) => {
    deleteService(id)
      .then(() => {
        setServices(services.filter((service) => service.id !== id));
      })
      .catch((error) => {
        console.error("There was an error deleting the service!", error);
      });
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setNewService({ ...newService, [name]: value });
  };

  const handleEditInputChange = (event) => {
    const { name, value } = event.target;
    setEditingService({ ...editingService, [name]: value });
  };

  const capitalize = (word)=>{
    if (word==="danger") {
      word = "error"
    }
      const lower = word.toLowerCase();
      return lower.charAt(0).toUpperCase() + lower.slice(1);
  }
  let result;
  result = services.map((service) => {
    let unit;
    if (service.time <= 5) {
      unit = "hrs";
    } else {
      unit = "min";
    }
    return (
      <tr key={service.id}>
                {/* <td className="px-3">{service.id}</td> */}
                <td className="px-3">{capitalize(service.name)}</td>
                <td className="px-3">{service.price}</td> 
                <td className="pl-3">{service.time} {unit} </td> 
                <td className="pl-3 d-flex">
                  <div className="mr-2 ">
                    <button
                      className=" bg-purple-600 text-white px-3 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50 "
                      onClick={() => setEditingService(service)}
                    >
                      Edit
                    </button>
                  </div>
                  <div className="mr-2">
                    <button
                      className=" bg-purple-600 text-white px-3 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                      onClick={() => handleDeleteService(service.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
    );
  });

  return (
    <div>
      <div className="mt-16 bg-gray-200">
        <h1 className="text-4xl font-bold text-gray-800 p-3">Services</h1>
        {/* Add New Service */}
        <div className="p-3">
          <h2 className="fs-5 font-bold text-gray-800 mb-3 pl-2">
            Add New Service
          </h2>
          <input
            type="text"
            name="name"
            placeholder="Name"
            value={newService.name}
            onChange={handleInputChange}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 pl-2 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
          />
          <input
            type="number"
            name="price"
            placeholder="Price"
            value={newService.price}
            onChange={handleInputChange}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 pl-2 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
          />
          <input
            type="number"
            name="time"
            placeholder="Time"
            value={newService.time}
            onChange={handleInputChange}
            className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 pl-2 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
          />
          <button
            onClick={handleCreateService}
            className=" bg-purple-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
          >
            Add Service
          </button>
        </div>

        {/* Edit Service */}
        {editingService && (
          <div className="p-3">
            <h2 className="fs-5 font-bold text-gray-800 mb-3 pl-2">
              Edit Service
            </h2>
            <input
              type="text"
              name="name"
              placeholder="Name"
              value={editingService.name}
              onChange={handleEditInputChange}
              className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 pl-2 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
            />
            <input
              type="number"
              name="price"
              placeholder="Price"
              value={editingService.price}
              onChange={handleEditInputChange}
              className="block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-600 pl-2 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6 mb-2"
            />
            <div className="d-flex">
              <div className="mr-3">
                <button
                  className=" bg-purple-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                  onClick={handleUpdateService}
                >
                  Update Service
                </button>
              </div>
              <div>
                <button
                  className=" bg-purple-600 text-white py-2 px-4 rounded-md shadow-sm hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-400 focus:ring-opacity-50"
                  onClick={() => setEditingService(null)}
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Service List */}
        <table>
          <thead>
            <tr>
              {/* <th className="fs-5 px-3">ID</th> */}
              <th className="fs-5 px-3">Name</th>
              <th className="fs-5 px-3"> Price</th>
              <th className="fs-5 px-3"> Time</th>
              <th className="fs-5 px-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {result}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminService;
