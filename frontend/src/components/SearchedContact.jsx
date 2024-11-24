import React from 'react';

const SearchedContact = ({ contacts, handleEditClick, softDeleteContact }) => {
  return (
    <div key={contacts.id} className="contact-card bg-gray-700 p-4 rounded-lg shadow-md w-fit mt-10">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">
          {contacts.first_name} {contacts.last_name}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditClick(contacts.id)}
            className="px-3 py-1 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => softDeleteContact(contacts.id)}
            className="px-3 py-1 bg-red-500 rounded-lg text-white hover:bg-red-600"
          >
            Soft Delete
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-400">
        <strong>Email:</strong> {contacts.email}
      </div>
    </div>
  );
};

export default SearchedContact;
