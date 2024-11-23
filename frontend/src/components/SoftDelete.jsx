import React, { useEffect, useState } from 'react';
import { useContactStore } from '../store/store'; // Zustand store
import { FaUndo } from "react-icons/fa";

const SoftDelete = ({ setTrackRestore }) => {
    const { contacts, restoreContact } = useContactStore();
    const [deletedContacts, setDeletedContacts] = useState([]);

    useEffect(() => {
        // Filter out the contacts that are marked as deleted (soft delete logic)
        console.log(contacts);
        const deleted = contacts.filter(contact => contact.isDeleted);
        console.log(deleted);
        setDeletedContacts(deleted);
    }, [contacts]);

    const handleRestore = (contactId) => {
        restoreContact(contactId);
        setTrackRestore(false); // Close the restore modal after restoration
    };

    const handleClose = () => {
        setTrackRestore(false); // Close the restore modal without action
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96">
                <h3 className="text-xl font-semibold mb-4">Soft Deleted Contacts</h3>
                {deletedContacts.length > 0 ? (
                    <div>
                        {deletedContacts.map((contact) => (
                            <div key={contact.id} className="flex justify-between items-center mb-3">
                                <div>
                                    <span className="text-lg">{contact.first_name} {contact.last_name}</span>
                                    <div className="text-sm text-gray-400">{contact.email}</div>
                                </div>
                                <button
                                    onClick={() => handleRestore(contact.id)}
                                    className="px-3 py-1 bg-green-500 rounded-lg text-white hover:bg-green-600"
                                >
                                    <FaUndo /> Restore
                                </button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p>No soft deleted contacts found.</p>
                )}

                <button
                    onClick={handleClose}
                    className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
                >
                    Close
                </button>
            </div>
        </div>
    );
};



export default SoftDelete;
