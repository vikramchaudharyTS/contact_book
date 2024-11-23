import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useContactStore } from '../store/store'; // Importing Zustand stores
import { axiosInstance } from '../utils/axios'; // Axios instance
import Search from '../components/Search';
import { FaSearch } from "react-icons/fa";
import AddContact from '../components/AddContacts';

const Dashboard = () => {
  const { user, token, logOut } = useAuthStore(); // Accessing user and token from Zustand store
  const { contacts, setContacts, softDeleteContact, restoreContact, editContact } = useContactStore(); // Accessing contact state and actions from Zustand store
  const navigate = useNavigate(); // For navigation
  const [isLoading, setIsLoading] = useState(true); // State for loading indication
  const [trackContact, setTrackContacts] = useState(false); // State for tracking contact
  const [currentPage, setCurrentPage] = useState(1); // State for current page
  const [totalPages, setTotalPages] = useState(1); // State for total pages

  const ITEMS_PER_PAGE = 5; // Max number of contacts per page

  // Fetch user data (contacts in this case)
  useEffect(() => {
    if (!token) {
      navigate('/login'); // Redirect to login if token is not available
      return;
    }

    const fetchContacts = async () => {
      try {
        const token = localStorage.getItem('token');

        if (!token) {
          navigate('/login'); // Redirect to login if no token is found
          return;
        }

        const response = await axiosInstance.get('/contacts/search-all', {
          headers: { Authorization: `Bearer ${token}` },
        });

        // Pagination logic: Only set the contacts for the current page
        const startIdx = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedContacts = response.data.contacts.slice(startIdx, startIdx + ITEMS_PER_PAGE);

        setContacts(paginatedContacts);  // Set contacts for the current page
        setTotalPages(Math.ceil(response.data.contacts.length / ITEMS_PER_PAGE)); // Set total pages based on total contacts

        setIsLoading(false); // Stop loading state
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [token, currentPage, setContacts, navigate]);

  // Handle logout
  const handleLogout = async () => {
    await logOut(); // Clear user and token from store
    navigate('/login'); // Navigate to login page
  };

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1); // Go to next page
    }
  };

  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1); // Go to previous page
    }
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display loading message
  }

  return (
    <div>
      {trackContact && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-50 flex justify-center items-center z-50">
          <AddContact setTrackContacts={setTrackContacts} />
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
            <div className='flex p-2'>
              <h2 className="text-xl flex items-center justify-start font-semibold mb-2 w-full">
                Your Contacts
                <div className='pl-10'><Search /></div>
                <button className='pl-3'><FaSearch /></button>
              </h2>
              <h2
                onClick={() => setTrackContacts(!trackContact)}
                className='font-semibold w-28 bg-sky-500 flex items-center justify-center rounded-md cursor-pointer hover:bg-sky-600'
              >
                Add Contact
              </h2>
            </div>

            <div className="bg-zinc-800 p-4 rounded-lg shadow-md">
              {contacts.length > 0 ? (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {contacts.map((contact) => (
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
                          <button
                            onClick={() => restoreContact(contact.id)}
                            className="px-3 py-1 bg-green-500 rounded-lg text-white hover:bg-green-600"
                          >
                            Restore
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
            <div className="flex justify-between mt-4">
              <button
                onClick={handlePrevPage}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                disabled={currentPage === 1}
              >
                Previous
              </button>
              <button
                onClick={handleNextPage}
                className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600"
                disabled={currentPage === totalPages}
              >
                Next
              </button>
            </div>
          </section>
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
