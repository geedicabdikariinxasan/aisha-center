const express = require('express');
const router = express.Router();
const { 
    getClasses, 
    addClass, 
    updateClass, 
    deleteClass, 
    deleteAllClasses 
} = require('../controllers/classController');

router.get('/', getClasses);
router.post('/', addClass);
router.delete('/delete-all', deleteAllClasses);
router.delete('/:id', deleteClass);
router.put('/:id', updateClass);

module.exports = router;