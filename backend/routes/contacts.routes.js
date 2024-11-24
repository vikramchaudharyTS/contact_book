import express from 'express' 
import { verifyToken } from '../middlewares/verifyToken.js'
import { addContact, editContact, getAllContacts, getEditableContact, getOneContact, getOnlyDeletedContacts, getUserProfile, restoreSoftDeletedContact, searchContacts, softDeleteContact } from '../controllers/contacts.controller.js'

const router = express.Router()

router.get('/profile', verifyToken, getUserProfile)
router.get('/search-query', verifyToken, searchContacts)
router.post('/add',verifyToken, addContact)
router.put('/edit/:id', verifyToken, editContact)
router.get('/edit/:id', verifyToken, getEditableContact)
router.get('/search-all', verifyToken, getAllContacts)
router.get('/search-one/', verifyToken, getOneContact)
router.put('/delete/:id', verifyToken, softDeleteContact)
router.get('/deleted/', verifyToken, getOnlyDeletedContacts)
router.put('/restore/:id', verifyToken, restoreSoftDeletedContact)

export default router;
