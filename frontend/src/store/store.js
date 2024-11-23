import { create } from 'zustand';
import { axiosInstance } from '../utils/axios.js';

// Auth store to manage user and token
export const useAuthStore = create((set) => ({
    user: null,
    token: null, // Load token from localStorage
    error: null,
    isLoading: false,

    register: async (email, password, username) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/auth/register', { email, password, username });
            const { user } = response.data;
            console.log(response.data);
            set({ user, error: null, isLoading: false });
        } catch (error) {
            set({ error: error.response?.data?.message || 'Signup failed', isLoading: false });
            throw error;
        }
    },

    // Login function
    login: async (email, password) => {
        set({ isLoading: true, error: null });
        try {
            const response = await axiosInstance.post('/auth/login', { email, password });
            const { user, token } = response.data;
            set({ user, token, error: null, isLoading: false });
            localStorage.setItem('token', token); // Save the token in localStorage
        } catch (error) {
            set({ error: error.response?.data?.message || 'Login failed', isLoading: false });
            throw error;
        }
    },

    // Log out function
    logOut: async () => {
        try { 
          // Make a request to backend to clear the authentication cookie
          await axiosInstance.post('/auth/logout'); // You will need to implement this in your backend
    
          // Clear the user and token from the store
          set({ user: null, token: null, error: null });
          // Remove the token from localStorage
          localStorage.removeItem('token');
        } catch (error) {
          set({ error: 'Logout failed', isLoading: false });
          console.error(error.message);
        }
      },

}));

// Contact store to manage contacts
export const useContactStore = create((set,get) => ({
        contacts: [],
        loading: false,
        error: null,
        
        setContacts: (contacts) => set({ contacts }),  // Ensure this is defined

        // Add a contact
        addContact: async (contactData) => {
          set({ loading: true });
          try {
            const response = await axiosInstance.post('/contacts/add', contactData, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            set({ contacts: [...get().contacts, response.data], loading: false });
          } catch (error) {
            console.log(error.message);
            set({ error: error.message, loading: false });
          }
        },

        dummyRequest: async () => {
          try {
            const response = await axiosInstance.get('/dummy/', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            console.log(response.data);
          } catch (error) {
            console.log(error.message);
            set({ error: error.message, loading: false });
          }
        },


      
        // Edit a contact
        editContact: async (id, contactData) => {
          set({ loading: true });
          try {
            const response = await axiosInstance.put(`/contacts/edit/${id}`, contactData, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            const updatedContacts = get().contacts.map(contact =>
              contact._id === id ? response.data : contact
            );
            set({ contacts: updatedContacts, loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
      
        // Fetch all contacts
        getAllContacts: async () => {
          set({ loading: true });
          try {
            const response = await axiosInstance.get('/contacts/search-all', {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            set({ contacts: response.data, loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
      
        // Fetch one contact by ID
        getOneContact: async (id) => {
          set({ loading: true });
          try {
            const response = await axiosInstance.get(`/contacts/search-one/${id}`, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            set({ contacts: [response.data], loading: false });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
      
        // Soft delete a contact
        deleteContact: async (id) => {
          set({ loading: true });
          try {
            const response = await axiosInstance.put(`/contacts/delete/${id}`, null, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            set({
              contacts: get().contacts.filter((contact) => contact._id !== id),
              loading: false,
            });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
      
        // Restore a soft deleted contact
        restoreContact: async (id) => {
          set({ loading: true });
          try {
            const response = await axiosInstance.put(`/contacts/restore/${id}`, null, {
              headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
            });
            set({
              contacts: get().contacts.map((contact) =>
                contact._id === id ? response.data : contact
              ),
              loading: false,
            });
          } catch (error) {
            set({ error: error.message, loading: false });
          }
        },
}));
      