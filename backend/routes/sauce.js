const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce');
const auth = require('../middleware/auth');
const multer = require('../middleware/multer-config');

//* route correspondant à la création d'une sauce *//
router.post('/', auth, multer, sauceController.createSauce);
//* route correspondant à la préférence d'une sauce du User *//
router.post('/:id/like', auth, sauceController.likeSauce);
//* route correspondant à la récupération de toutes les sauces *//
router.get('/', sauceController.getAllSauce);
//* route correspondant à la récupération à une sauce spécifique *//  
router.get('/:id',  sauceController.getOneSauce);
//* route correspondant à la modification d'une sauce spécifique *//
router.put('/:id', auth, multer, sauceController.modifySauce);
//* route correspondant à la suppression d'une sauce spécifique *//
router.delete('/:id', auth, sauceController.deleteSauce);


module.exports = router;
