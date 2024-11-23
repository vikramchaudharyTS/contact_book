import express from 'express' 
import { verifyToken } from '../middlewares/verifyToken.js'
import { addContact, editContact, getAllContacts, getOneContact, getUserProfile, restoreSoftDeletedContact, softDeleteContact } from '../controllers/contacts.controller.js'

const router = express.Router()

router.get('/profile', verifyToken, getUserProfile)
router.post('/add',verifyToken, addContact)
router.put('/edit/:id', verifyToken, editContact)
router.get('/search-all', verifyToken, getAllContacts)
router.get('/search-one/:id', verifyToken, getOneContact)
router.put('/delete/:id', verifyToken, softDeleteContact)
router.put('/restore/:id', verifyToken, restoreSoftDeletedContact)

export default router;
