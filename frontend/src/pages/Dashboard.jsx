import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useContactStore } from '../store/store'; // Zustand stores
import { axiosInstance } from '../utils/axios'; // Axios instance
import Search from '../components/Search';
import { FaSearch } from "react-icons/fa";
import AddContact from '../components/AddContacts';
import Pagination from '../components/Pagination'; // Import the Pagination component
import SoftDelete from '../components/SoftDelete';

const ITEMS_PER_PAGE = 5; // Moved outside the useEffect to avoid redefinition

const Dashboard = () => {
  const { user, token, logOut } = useAuthStore(); // Auth state
  const { contacts, setContacts, softDeleteContact, editContact, deletedContacts } = useContactStore(); // Contact state
  const navigate = useNavigate();

  const [isLoading, setIsLoading] = useState(true);
  const [trackContact, setTrackContacts] = useState(false);
  const [trackRestore, setTrackRestore] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Fetch contacts with pagination
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        if (!token) {
          navigate('/login');
          return;
        }

        const response = await axiosInstance.get('/contacts/search-all', {
          headers: { Authorization: `Bearer ${token}` },
          params: { limit: ITEMS_PER_PAGE, offset: (currentPage - 1) * ITEMS_PER_PAGE },
        });

        setContacts(response.data.contacts); // Update contacts state
        setTotalPages(Math.ceil(response.data.total / ITEMS_PER_PAGE)); // Use `total` instead of `totalCount` based on API response
        setIsLoading(false);
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [token, currentPage, setContacts, navigate]);

  // Logout logic
  const handleLogout = async () => {
    await logOut();
    navigate('/login');
  };

  // Pagination handlers
  const handleNextPage = () => {
    if (currentPage < totalPages) setCurrentPage(currentPage + 1);
  };

  const handlePrevPage = () => {
    if (currentPage > 1) setCurrentPage(currentPage - 1);
  };

  if (isLoading) return <div>Loading...</div>;

  return (
    <div>
      {trackContact && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <AddContact setTrackContacts={setTrackContacts} />
        </div>
      )}

      {trackRestore && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <SoftDelete setTrackRestore={setTrackRestore} />
        </div>
      )}

      <div className="dashboard-container bg-gray-900 text-white min-h-screen flex flex-col w-[100vw]">
        <header className="flex items-center justify-between p-4 bg-gradient-to-r from-green-500 to-emerald-600">
          <h1 className="text-2xl font-bold">Welcome to the Dashboard</h1>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600 transition"
          >
            Log Out
          </button>
        </header>

        <main className="flex-1 p-6">
          <section className="profile-info mb-8">
            <h2 className="text-xl font-semibold mb-2">Profile Information</h2>
            <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
              <p className="text-lg"><strong>Username:</strong> {user?.username}</p>
              <p className="text-lg"><strong>Email:</strong> {user?.email}</p>
            </div>
          </section>

          <section className="contacts mb-8">
            <div className="flex p-2">
              <h2 className="text-xl flex items-center justify-start font-semibold mb-2 w-full">
                Your Contacts
                <div className="pl-10"><Search /></div>
                <button className="pl-3"><FaSearch /></button>
              </h2>
              <button onClick={() => setTrackRestore(!trackRestore)} className="font-semibold w-40 bg-red-500 flex items-center justify-center rounded-md mr-4 cursor-pointer hover:bg-red-600">Restore contacts</button>
              <h2
                onClick={() => setTrackContacts(!trackContact)}
                className="font-semibold w-32 bg-sky-500 flex items-center justify-center rounded-md cursor-pointer hover:bg-sky-600"
              >
                Add Contact
              </h2>
            </div>

            <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
              {contacts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {contacts.filter(contact => !contact.isDeleted).map((contact) => (
                    <div key={contact.id} className="contact-card bg-gray-700 p-4 rounded-lg shadow-md">
                      <div className="flex justify-between items-center mb-4">
                        <span className="text-lg font-semibold">
                          {contact.first_name} {contact.last_name}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => editContact(contact.id, { first_name: 'Updated' })}
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
                  ))}
                </div>
              ) : (
                <p>No contacts found, create contacts</p>
              )}
            </div>

            {/* Pagination Controls */}
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              handleNextPage={handleNextPage}
              handlePrevPage={handlePrevPage}
            />
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
