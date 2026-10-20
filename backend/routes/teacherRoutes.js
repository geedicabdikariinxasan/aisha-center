const express = require('express');
const router = express.Router();
const { 
    getTeachers, 
    addTeacher, 
    updateTeacher, 
    deleteTeacher, 
    deleteAllTeachers 
} = require('../controllers/teacherController');

router.get('/', getTeachers);
router.post('/', addTeacher);
router.delete('/delete-all', deleteAllTeachers); // Waa inuu ka horreeyaa /:id
router.delete('/:id', deleteTeacher);
router.put('/:id', updateTeacher);

module.exports = router;