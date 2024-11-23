import express from 'express' 
import { verifyToken } from '../middlewares/verifyToken.js'
import { addContact, dummyRequest, editContact, getAllContacts, getOneContact, getUserProfile, restoreSoftDeletedContact, searchContacts, softDeleteContact } from '../controllers/contacts.controller.js'

const router = express.Router()

router.get('/profile', verifyToken, getUserProfile)
router.get('/search-query', verifyToken, searchContacts)
router.post('/add',verifyToken, addContact)
router.put('/edit/:id', verifyToken, editContact)
router.get('/search-all', verifyToken, getAllContacts)
router.get('/search-one/:id', verifyToken, getOneContact)
router.put('/delete/:id', verifyToken, softDeleteContact)
router.put('/restore/:id', verifyToken, restoreSoftDeletedContact)
router.get('/dummy/', verifyToken, dummyRequest)

export default router;
