const express = require('express');
const router = express.Router();
const { 
    getStudents, 
    addStudent, 
    deleteStudent, 
    updateStudent,
    deleteAllStudents // Hubi inaa halkan ka soo dhex jiidhay
} = require('../controllers/studentController');

router.get('/', getStudents);
router.post('/', addStudent);

// WAA MUHIM: Inuu kan ka horreeyo router.delete('/:id')
router.delete('/delete-all', deleteAllStudents);

router.delete('/:id', deleteStudent);
router.put('/:id', updateStudent);

module.exports = router;