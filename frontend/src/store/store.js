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
export const useContactStore = create((set, get) => ({
  contacts: [],
  loading: false,
  error: null,
  editableContact: null,

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

  // Fetch contacts based on a search term
  getContactsBySearchTerm: async (searchTerm) => {
    set({ loading: true });
    try {
      // Updated URL with query parameter for search term
      const response = await axiosInstance.get(`/contacts/search-one`, {
        params: { searchTerm }, // Sending search term as query parameter
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set({ contacts: response.data.contacts, loading: false });
    } catch (error) {
      set({ error: error.message, loading: false });
    }
  },

  // Soft delete contact
  softDeleteContact: async (contactId, token) => {
    set({ isLoading: true });
    try {
      await axiosInstance.put(
        `/contacts/delete/${contactId}/`,
        {},
        { headers: { Authorization: `Bearer ${token}` } }
      );
      set((state) => ({
        contacts: state.contacts.filter((contact) => contact.id !== contactId),
        isLoading: false,
      }));
    } catch (error) {
      set({ error: error.response?.data?.message || 'Failed to delete contact', isLoading: false });
    }
  },


  // Function to fetch editable contact data
  fetchEditableContact: async (contactId) => {
    set({ loading: true, error: null });
    try {
      const response = await axiosInstance.get(`/contacts/edit/${contactId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });

      const contact = Array.isArray(response.data.contact) ? response.data.contact[0] : response.data.contact;

      set({ editableContact: contact, loading: false });
    } catch (error) {
      set({
        error: error.response?.data?.message || 'Failed to fetch contact data',
        loading: false,
      });
    }
  },


  // update a contact
  updateContact: async (contactId, updatedData) => {
    set({ loading: true });
    try {
      const response = await axiosInstance.put(`/contacts/edit/${contactId}`, updatedData, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` },
      });
      set((state) => ({
        contacts: state.contacts.map((contact) =>
          contact.id === contactId ? { ...contact, ...response.data } : contact
        ),
        loading: false,
      }));
    } catch (error) {
      console.log(error.message);
      set({ error: error.response?.data?.message || 'Failed to update contact', loading: false });
    }
  },
}));
