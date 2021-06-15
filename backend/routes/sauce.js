const express = require('express');
const router = express.Router();
const sauceController = require('../controllers/sauce')

//* route correspondant à la création d'une sauce *//
router.post('/', sauceController.createSauce);
//* route correspondant à la préférence d'une sauce du User *//
router.post('/:id/like', sauceController.likeSauce);
//* route correspondant à la récupération de toutes les sauces *//
router.get('/', sauceController.getAllSauce);
//* route correspondant à la récupération à une sauce spécifique *//  
router.get('/:id', sauceController.getOneSauce);
//* route correspondant à la modification d'une sauce spécifique *//
router.put('/:id',sauceController.modifySauce);
//* route correspondant à la suppression d'une sauce spécifique *//
router.delete('/:id', sauceController.deleteSauce);

module.exports = router;