import React, { useState } from 'react';
import { useContactStore } from '../store/store.js'; // Assuming you have this store in the right path

const AddContact = ({ setTrackContacts }) => {
  const { addContact, error, loading, dummyRequest } = useContactStore((state) => state);  // Destructure the necessary methods and state
  const [formData, setFormData] = useState({
    firstName: '',
    middleName: '',
    lastName: '',
    email: '',
    phone1: '',
    phone2: '',
    address: '',
  });
  const [isOpen, setIsOpen] = useState(true); // State to manage the visibility of the form

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email) {
      console.error('First name and email are required');
      return;
    }
    try {
      await addContact(formData);
      await dummyRequest();
      setFormData({
        firstName: '',
        middleName: '',
        lastName: '',
        email: '',
        phone1: '',
        phone2: '',
        address: '',
      });
    } catch (err) {
      console.error(err);
    }
  };
  

  const handleClose = () => {
    setIsOpen(false);  // Close the form
    setTrackContacts(false);
  };

  if (!isOpen) return null; // If form is closed, return null to hide it

  return (
    <div className="min-h-screen flex items-center justify-center my-20">
      <div className="w-full max-w-sm bg-white rounded-lg shadow-2xl p-6 space-y-6 duration-500 hover:scale-[101%] hover:shadow-xl">
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-2xl font-extrabold text-center text-gray-800 tracking-wide">
          Add Contact
        </h2>
        <form className="space-y-6" onSubmit={handleSubmit}>
          {/* First Name */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label className="block text-sm font-medium text-gray-700 sm:w-32" htmlFor="firstName">
              First Name
            </label>
            <input
              type="text"
              id="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              className="mt-2 sm:mt-0 block w-full sm:w-auto rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm p-3 bg-gray-100"
            />
          </div>

          {/* Middle Name */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label className="block text-sm font-medium text-gray-700 sm:w-32" htmlFor="middleName">
              Middle Name
            </label>
            <input
              type="text"
              id="middleName"
              value={formData.middleName}
              onChange={handleInputChange}
              className="mt-2 sm:mt-0 block w-full sm:w-auto rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm p-3 bg-gray-100"
            />
          </div>

          {/* Last Name */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label className="block text-sm font-medium text-gray-700 sm:w-32" htmlFor="lastName">
              Last Name
            </label>
            <input
              type="text"
              id="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              className="mt-2 sm:mt-0 block w-full sm:w-auto rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm p-3 bg-gray-100"
            />
          </div>

          {/* Email Address */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label className="block text-sm font-medium text-gray-700 sm:w-32" htmlFor="email">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              value={formData.email}
              onChange={handleInputChange}
              className="mt-2 sm:mt-0 block w-full sm:w-auto rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm p-3 bg-gray-100"
            />
          </div>

          {/* Phone Number 1 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label className="block text-sm font-medium text-gray-700 sm:w-32" htmlFor="phone1">
              Phone Number 1
            </label>
            <input
              type="tel"
              id="phone1"
              value={formData.phone1}
              onChange={handleInputChange}
              className="mt-2 sm:mt-0 block w-full sm:w-auto rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm p-3 bg-gray-100"
            />
          </div>

          {/* Phone Number 2 */}
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4">
            <label className="block text-sm font-medium text-gray-700 sm:w-32" htmlFor="phone2">
              Phone Number 2
            </label>
            <input
              type="tel"
              id="phone2"
              value={formData.phone2}
              onChange={handleInputChange}
              className="mt-2 sm:mt-0 block w-full sm:w-auto rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm p-3 bg-gray-100"
            />
          </div>

          {/* Address */}
          <div className="flex flex-col sm:flex-row sm:items-start sm:space-x-4">
            <label className="block text-sm font-medium text-gray-700 sm:w-32" htmlFor="address">
              Address
            </label>
            <textarea
              id="address"
              value={formData.address}
              onChange={handleInputChange}
              className="mt-2 sm:mt-0 block w-full sm:w-auto rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm p-3 bg-gray-100"
              rows="3"
            />
          </div>

          {/* Submit Button */}
          <div className="mt-6">
            <button
              type="submit"
              className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-300 transform hover:scale-105"
              disabled={loading}  // Disable the button if loading
            >
              {loading ? 'Adding Contact...' : 'Submit'}
            </button>
          </div>
          {error && <p className="text-red-500 text-center">{error}</p>}  {/* Display error */}
        </form>
      </div>
    </div>
  );
};

export default AddContact;
