import db from '../models/schema.js';

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

// View all contacts (paginated)
export const getAllContacts = async (req, res) => {
  try {
    const limit = parseInt(req.query.limit, 5) || 5; // Default to 10 contacts per page
    const offset = parseInt(req.query.offset, 5) || 0;

    const [rows] = await db.query(
      `SELECT id, first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address, created_at, updated_at 
   FROM contacts 
   WHERE user_id = ? AND is_deleted = FALSE 
   ORDER BY created_at DESC 
   LIMIT ? OFFSET ?`,
      [req.userId, limit, offset]
    );

    res.json({ contacts: rows, limit, offset });

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

// Restore a soft-deleted contact
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

    res.json({ message: 'Contact restored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
