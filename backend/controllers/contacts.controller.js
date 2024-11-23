import db from '../models/';

// Add a new contact
export const addContact = async (req, res) => {
  const { first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address } = req.body;
  const user_id = req.user.id; // Assuming user is authenticated

  try {
    const result = await db.query('INSERT INTO contacts (user_id, first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address) VALUES (?, ?, ?, ?, ?, ?, ?, ?)', 
                                  [user_id, first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address]);

    res.status(201).json({ message: 'Contact added successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Edit an existing contact
export const editContact = async (req, res) => {
  const contactId = req.params.id;
  const { first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address } = req.body;
  const user_id = req.user.id; // Assuming user is authenticated

  try {
    const [contact] = await db.query('SELECT * FROM contacts WHERE id = ? AND user_id = ?', [contactId, user_id]);

    if (contact.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await db.query('UPDATE contacts SET first_name = ?, middle_name = ?, last_name = ?, email = ?, phone_number_1 = ?, phone_number_2 = ?, address = ? WHERE id = ?', 
                   [first_name, middle_name, last_name, email, phone_number_1, phone_number_2, address, contactId]);

    res.json({ message: 'Contact updated successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// View all contacts (paginated)
export const getContacts = async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const user_id = req.user.id; // Assuming user is authenticated

  try {
    const offset = (page - 1) * limit;
    const [contacts] = await db.query('SELECT * FROM contacts WHERE user_id = ? LIMIT ?, ?', [user_id, offset, limit]);

    res.json({ contacts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Search contacts
export const searchContacts = async (req, res) => {
  const query = req.query.query;
  const user_id = req.user.id; // Assuming user is authenticated

  try {
    const [contacts] = await db.query('SELECT * FROM contacts WHERE user_id = ? AND (first_name LIKE ? OR last_name LIKE ? OR email LIKE ? OR phone_number_1 LIKE ? OR phone_number_2 LIKE ?)', 
                                      [user_id, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`, `%${query}%`]);

    res.json({ contacts });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Soft delete a contact
export const deleteContact = async (req, res) => {
  const contactId = req.params.id;
  const user_id = req.user.id; // Assuming user is authenticated

  try {
    const [contact] = await db.query('SELECT * FROM contacts WHERE id = ? AND user_id = ?', [contactId, user_id]);

    if (contact.length === 0) {
      return res.status(404).json({ message: 'Contact not found' });
    }

    await db.query('UPDATE contacts SET is_deleted = TRUE WHERE id = ?', [contactId]);

    res.json({ message: 'Contact deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};

// Restore a soft-deleted contact
export const restoreContact = async (req, res) => {
  const contactId = req.params.id;
  const user_id = req.user.id; // Assuming user is authenticated

  try {
    const [contact] = await db.query('SELECT * FROM contacts WHERE id = ? AND user_id = ? AND is_deleted = TRUE', [contactId, user_id]);

    if (contact.length === 0) {
      return res.status(404).json({ message: 'Contact not found or not deleted' });
    }

    await db.query('UPDATE contacts SET is_deleted = FALSE WHERE id = ?', [contactId]);

    res.json({ message: 'Contact restored successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error });
  }
};
