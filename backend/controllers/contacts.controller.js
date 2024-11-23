import db from '../models/schema.js';


// Get user profile with contacts
export const searchContacts = async (req, res) => {
  const query = req.body; // Search term from the request body

  if (!query) {
    return res.status(400).json({ message: 'Search query is required' });
  }

  try {
    // Create a case-insensitive regular expression for the search term
    const regex = new RegExp(query, 'i'); // 'i' makes the search case-insensitive

    // Build the WHERE clause dynamically to only use REGEXP when query is provided
    const whereClause = [
      'first_name REGEXP ?',
      'middle_name REGEXP ?',
      'last_name REGEXP ?',
      'email REGEXP ?',
      'phone_number_1 REGEXP ?',
      'phone_number_2 REGEXP ?',
    ];

    // Query the database to search across multiple fields
    const [contacts] = await db.query(
      `SELECT id, first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address, created_at
       FROM contacts
       WHERE user_id = ? AND is_deleted = FALSE
       AND (${whereClause.join(' OR ')})
       ORDER BY created_at DESC`,
      [req.userId, regex, regex, regex, regex, regex, regex]
    );

    if (contacts.length === 0) {
      return res.status(404).json({ message: 'No contacts found matching your query' });
    }

    res.json({ contacts });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error occurred while searching contacts', error });
  }
};


// Get user profile with contacts
export const getUserProfile = async (req, res) => {
  const userId = req.userId; // Assuming userId is set by middleware

  if (!userId) {
    return res.status(400).json({ message: 'User ID is missing' });
  }

  try {
    // First, fetch the user's profile data (name, email, etc.)
    const [userProfile] = await db.query(
      'SELECT id, username, email, created_at, updated_at FROM users WHERE id = ?',
      [userId]
    );

    if (!userProfile || userProfile.length === 0) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Now fetch the user's contacts
    const [contacts] = await db.query(
      `SELECT id, first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address, created_at, updated_at 
       FROM contacts 
       WHERE user_id = ? AND is_deleted = FALSE 
       ORDER BY created_at DESC`,
      [userId]
    );

    // Combine user profile data and contacts
    const profileData = {
      user: userProfile[0],
      contacts: contacts || [],
    };

    res.json(profileData);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to fetch user profile', error });
  }
};

// Add a new contact
export const addContact = async (req, res) => {
  const { first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address } = req.body;
  const userId = req.userId; // This should be set by the middleware
  if (!userId) {
    return res.status(400).json({ message: "User ID is missing" });
  }

  try {
    const query = 'INSERT INTO contacts (user_id, first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)';
    const values = [userId, first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address];

    const [result] = await db.query(query, values);
    res.status(201).json({ message: 'Contact added successfully', contactId: result.insertId });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Failed to add contact', error: error.message });
  }
};


// Edit an existing contact
export const editContact = async (req, res) => {
  const { id } = req.params;
  const { first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address } = req.body;

  try {
    const result = await db.query(
      `UPDATE contacts 
           SET first_name = ?, middle_name = ?, last_name = ?, email = ?, phone_number_1 = ?, phone_number_2 = ?, address = ? 
           WHERE id = ? AND user_id = ? AND is_deleted = FALSE`,
      [first_name, middle_name || null, last_name, email || null, phone_number_1 || null, phone_number_2 || null, address || null, id, req.userId]
    );

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Failed to update contact', error });
  }
};

// Get editable contact data
export const getEditableContact = async (req, res) => {
  const { id } = req.params;

  try {
    const [contact] = await db.query(
      `SELECT first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address 
           FROM contacts 
           WHERE id = ? AND user_id = ? AND is_deleted = FALSE`,
      [id, req.userId]
    );

    if (!contact) {
      return res.status(404).json({ message: 'Contact not found or not authorized' });
    }

    res.json({ contact });
  } catch (error) {
    res.status(500).json({ message: 'Failed to retrieve contact', error });
  }
};


// View all contacts (paginated)
export const getAllContacts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 10) || 5; // Default to 5 contacts per page
    const offset = parseInt(req.query.offset, 10) || 0;

    // Query to retrieve contacts sorted by full name (first_name, middle_name, last_name)
    const [rows] = await db.query(
      `SELECT id, first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address, created_at, updated_at 
       FROM contacts 
       WHERE user_id = ? AND is_deleted = FALSE 
       ORDER BY CONCAT_WS(' ', first_name, middle_name, last_name) ASC
       LIMIT ? OFFSET ?`,
      [req.userId, limit, offset]
    );

    // Query to get the total number of contacts
    const [[{ total }]] = await db.query(
      `SELECT COUNT(*) as total 
       FROM contacts 
       WHERE user_id = ? AND is_deleted = FALSE`,
      [req.userId]
    );

    res.json({ contacts: rows, total });
  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contacts', error });
  }
};



// Search contacts
export const getOneContact = async (req, res) => {
  const { id } = req.params;
  try {
    const [contact] = await db.query(
      `SELECT id, first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address, created_at, updated_at 
       FROM contacts 
       WHERE id = ? AND user_id = ? AND is_deleted = FALSE`,
      [id, req.userId]
    );

    if (!contact || contact.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    res.json({ contact: contact[0] });

  } catch (error) {
    res.status(500).json({ message: 'Failed to fetch contact', error });
  }
};
// Soft delete a contact
export const softDeleteContact = async (req, res) => {
  const contactId = req.params.id;
  const user_id = req.userId; // Assuming user is authenticated and userId is set by middleware

  try {

    const [contact] = await db.query(
      'SELECT * FROM contacts WHERE id = ? AND user_id = ? AND is_deleted = FALSE',
      [contactId, user_id]
    );

    if (!contact || contact.length === 0) {
      return res.status(404).json({ message: 'Contact not found or already processed' });
    }


    await db.query(
      'UPDATE contacts SET is_deleted = TRUE, deleted_at = CURRENT_TIMESTAMP WHERE id = ?',
      [contactId]
    );


    res.json({ message: 'Contact soft deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

export const restoreSoftDeletedContact = async (req, res) => {
  const contactId = req.params.id;
  const user_id = req.userId;

  try {
    const [contact] = await db.query(
      'SELECT * FROM contacts WHERE id = ? AND user_id = ? AND is_deleted = TRUE',
      [contactId, user_id]
    );

    if (!contact || contact.length === 0) {
      return res.status(404).json({ message: 'Contact not found or already processed' });
    }

    // Restore the contact by unmarking it as deleted
    await db.query(
      'UPDATE contacts SET is_deleted = FALSE, deleted_at = NULL WHERE id = ?',
      [contactId]
    );

    res.json({ message: 'Contact restored successfully', contactId });
  } catch (error) {
    console.error('Error restoring contact:', error);  // Add error logging
    res.status(500).json({ message: 'Server error', error });
  }
};

export const getOnlyDeletedContacts = async (req, res) => {
  const user_id = req.userId; // The ID of the logged-in user
  try {
    // Fetch deleted contacts from the database
    const result = await db.query(
      'SELECT id, first_name, last_name, email FROM contacts WHERE user_id = ? AND is_deleted = TRUE',
      [user_id]
    );

    // The result might contain both the data and schema/metadata
    const contacts = result[0]; // Get the first element, which contains the contact data

    // Map through the contacts to return only necessary fields
    const deletedContacts = contacts.map(contact => ({
      id: contact.id,
      first_name: contact.first_name,
      last_name: contact.last_name,
      email: contact.email
    }));

    // Send the contacts back as a response
    res.json(deletedContacts);
  } catch (error) {
    console.error('Error fetching deleted contacts:', error);
    res.status(500).json({ message: 'Server error' });
  }
};
