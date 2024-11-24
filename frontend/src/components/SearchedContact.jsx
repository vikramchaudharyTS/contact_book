import React from 'react';

const SearchedContact = ({ contact, handleEditClick, softDeleteContact }) => {
  return (
    <div key={contact.id} className="contact-card bg-gray-700 p-4 rounded-lg shadow-md">
      <div className="flex justify-between items-center mb-4">
        <span className="text-lg font-semibold">
          {contact.first_name} {contact.last_name}
        </span>
        <div className="flex space-x-2">
          <button
            onClick={() => handleEditClick(contact.id)}
            className="px-3 py-1 bg-blue-500 rounded-lg text-white hover:bg-blue-600"
          >
            Edit
          </button>
          <button
            onClick={() => softDeleteContact(contact.id)}
            className="px-3 py-1 bg-red-500 rounded-lg text-white hover:bg-red-600"
          >
            Soft Delete
          </button>
        </div>
      </div>
      <div className="text-sm text-gray-400">
        <strong>Email:</strong> {contact.email}
      </div>
    </div>
  );
};

export default SearchedContact;
