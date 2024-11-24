import React, { useState, useEffect } from 'react';
import { useContactStore } from '../store/store'; // Assuming the store is in the right path

const EditContact = ({ contactId, closeEditModal }) => {
  const { updateContact, editableContact, error, loading, fetchEditableContact } = useContactStore((state) => state);
  const [formData, setFormData] = useState({
    first_name: '',
    middle_name: '',
    last_name: '',
    email: '',
    phone_number_1: '',
    phone_number_2: '',
    address: '',
  });
  
  useEffect(() => {
    // Fetch the contact data when the modal is opened and a contactId is provided
    if (contactId) {
      fetchEditableContact(contactId);
    }
  }, [contactId, fetchEditableContact]);

  useEffect(() => {
    // Ensure formData is updated with editableContact details
    if (editableContact) {
      setFormData({
        first_name: editableContact.first_name || '',
        middle_name: editableContact.middle_name || '',
        last_name: editableContact.last_name || '',
        email: editableContact.email || '',
        phone_number_1: editableContact.phone_number_1 || '',
        phone_number_2: editableContact.phone_number_2 || '',
        address: editableContact.address || '',
      });
    }
  }, [editableContact]);
  
  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await updateContact(contactId, formData);
      closeEditModal(); // Close the modal after successful update
      
    } catch (err) {
      console.error(err);
    }
  };

  if (!contactId) return null; // Don't render if no contactId is provided

  return (
    <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
      <div className="relative w-full max-w-md bg-white rounded-lg shadow-2xl p-6 space-y-4">
        {/* Close button */}
        <button
          onClick={closeEditModal}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
          </svg>
        </button>

        <h2 className="text-2xl font-extrabold text-center text-gray-800 tracking-wide">
          Edit Contact
        </h2>
        <form className="space-y-4" onSubmit={handleSubmit}>
          {['first_name', 'middle_name', 'last_name', 'email', 'phone_number_1', 'phone_number_2', 'address'].map((field) => (
            <div key={field}>
              <label
                htmlFor={field}
                className="block text-sm font-medium text-gray-700"
              >
                {field.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase())}
              </label>
              <input
                type="text"
                id={field}
                value={formData[field]}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-lg border border-gray-300 shadow-sm focus:ring-2 focus:ring-indigo-500 focus:outline-none sm:text-sm p-2 bg-gray-100"
              />
            </div>
          ))}
          <button
            type="submit"
            className="w-full bg-indigo-600 text-white py-2 px-4 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-300 transform hover:scale-105"
            disabled={loading}
          >
            {loading ? 'Updating Contact...' : 'Save Changes'}
          </button>
          {error && <p className="text-red-500 text-center">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default EditContact;
