import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore, useContactStore } from '../store/store'; // Importing Zustand stores
import { axiosInstance } from '../utils/axios'; // Axios instance
import Search from '../components/Search';
const Dashboard = () => {
  const { user, token, logOut } = useAuthStore(); // Accessing user and token from Zustand store
  const { contacts, setContacts, softDeleteContact, restoreContact, editContact } = useContactStore(); // Accessing contact state and actions from Zustand store
  const navigate = useNavigate(); // For navigation
  const [isLoading, setIsLoading] = useState(true); // State for loading indication

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
        // Set contacts in Zus  tand store directly
        setContacts(response.data.contacts);  // Set contacts fetched from the API

        setIsLoading(false); // Stop loading state
      } catch (error) {
        console.error('Failed to fetch contacts:', error);
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [token, setContacts, navigate]);

  // Handle logout
  const handleLogout = async () => {
    await logOut(); // Clear user and token from store
    navigate('/login'); // Navigate to login page
  };

  if (isLoading) {
    return <div>Loading...</div>; // Display loading message
  }

  return (
    <div className="dashboard-container bg-gray-900 text-white min-h-screen flex flex-col w-full">
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
          <h2 className="text-xl font-semibold mb-2">Your Contacts</h2>
          <span><Search /></span>
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
              <p>No contacts found</p>
            )}
          </div>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
