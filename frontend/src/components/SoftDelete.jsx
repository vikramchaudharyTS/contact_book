import React, { useEffect, useState } from 'react';
import { axiosInstance } from '../utils/axios.js';
import { FaUndo } from "react-icons/fa";

const SoftDelete = ({ setTrackRestore }) => {
    const [deletedContacts, setDeletedContacts] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch deleted contacts from the backend
    useEffect(() => {
        const fetchDeletedContacts = async () => {
            try {
                const response = await axiosInstance.get('/contacts/deleted'); // Adjust the API endpoint as needed
                console.log(response.data); // Make sure data structure is correct
                setDeletedContacts(response.data);
            } catch (error) {
                console.error('Error fetching deleted contacts:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchDeletedContacts();
    }, []);

    // Restore a deleted contact by calling the backend
    const handleRestore = async (contactId) => {
        try {
            await axiosInstance.put(`/contacts/restore/${contactId}/`);
            setDeletedContacts((prev) =>
                prev.filter((contact) => contact.id !== contactId)
            );
        } catch (error) {
            console.error('Error restoring contact:', error);
        }
    };

    const handleClose = () => {
        setTrackRestore(false);
        setDeletedContacts([]);
    };

    return (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center text-white items-center z-50">
            <div className="bg-gray-800 p-6 rounded-lg shadow-md w-96">
                <h3 className="text-xl font-semibold mb-4">Soft Deleted Contacts</h3>
                {loading ? (
                    <p>Loading...</p>
                ) : deletedContacts.length > 0 ? (
                    <div>
                        {deletedContacts.map((contact) => (
                            // Ensure that contact first_name and last_name exist and are not empty
                            <div key={contact.id} className="flex justify-between items-center mb-3 bg-gray-700/50 px-2 py-1 rounded-md">
                                <div>
                                    <span className="text-lg">
                                        {contact.first_name || 'No First Name'} {contact.last_name || 'No Last Name'}
                                    </span>
                                    <div className="text-sm text-gray-400">{contact.email || 'No Email'}</div>
                                </div>
                                <button
                                    onClick={() => handleRestore(contact.id)}
                                    className="px-3 py-1 bg-green-500 rounded-lg text-white hover:bg-green-600 flex items-center gap-1"
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
