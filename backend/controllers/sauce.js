const Sauce = require('../models/Sauce');
const fs = require('fs');

exports.createSauce = (req, res, next) => {
    const sauceObject = JSON.parse(req.body.sauce)
    delete sauceObject._id
    const sauce = new Sauce({
      ...sauceObject,
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`,
      likes: 0,
      dislikes: 0
    });
    sauce.save()
      .then(() => res.status(201).json({message: 'La sauce a été crée !'}))
      .catch(error => res.status(400).json({error}));
};


exports.likeSauce = (req, res, next) => {
  const like = req.body.like;
  const userId = req.body.userId;
  let status = '500';
  let message;

  Sauce.findOne({_id: req.params.id})
    .then(sauce => {
      message = 'indice userLike : ' + sauce.userLiked.indexOf(userId) + ', indice dislike : ' + sauce.userDisliked.indexOf(userId);
      if(sauce.userLiked.indexOf(userId) >= 0 || sauce.userDisliked.indexOf(userId) >= 0){
        if(like === 0 ) {
          const posUserLike = sauce.userLiked.indexOf(userId);
          const posUserDislike = sauce.userDisliked.indexOf(userId);
          status = '200';

          if(posUserLike >= 0){
            sauce.userLiked.slice(posUserLike, 1);
            sauce.likes--;
            message = 'Like annulé';
          }
          if(posUserDislike >= 0){
            sauce.userDisliked.slice(posUserDislike, 1);
            sauce.dislikes--;
            message = 'Dislike annulé';
          }
        }else {
          status = '200';
          const posUserLike = sauce.userLiked.indexOf(userId);
          const posUserDislike = sauce.userDisliked.indexOf(userId);
          if( posUserLike >= 0 && like === -1){
            sauce.userLiked.slice(posUserLike, 1);
            sauce.likes--;
            sauce.userDisliked.push(userId);
            sauce.dislikes++;
            message = 'Like supprimé et Dislike ajouté';
          }
          if (posUserDislike >= 0 && like === 1){
            sauce.userDisliked.slice(posUserDislike, 1);
            sauce.dislikes--;
            sauce.userLiked.push(userId);
            sauce.likes++;
            message = 'Dislike supprimé et Like ajouté';
          }
        }
      }else{
        status = '200';
        if(like === 1){
          sauce.userLiked.push(userId);
          sauce.likes++;
          message = 'Like ajouté';

        }else if(like === -1) {
          sauce.userDisliked.push(userId);
          sauce.dislikes++;
          message = 'Dislike ajouté';
        }else{
          status = '501';
          message ='User sans avis';
        }
      }
      Sauce.findOneAndUpdate({_id: req.params.id}, sauce)
      .then(() => res.status(status).json({message: message}))
      .catch(error => res.status(500).json({error}));
    })


  

  
};

exports.modifySauce = (req, res, next) => {
    const sauceObject = req.file ?
    {
      ...JSON.parse(req.body.sauce),
      imageUrl: `${req.protocol}://${req.get('host')}/images/${req.file.filename}`
     } : { ...req.body };
    Sauce.updateOne({_id: req.params.id}, {...sauceObject, _id: req.params.id})
      .then(() => res.status(200).json({ message: 'Sauce modifiée !'}))
      .catch(error => res.status(400).json({error}));
};

exports.deleteSauce =  (req, res, next) => {
    Sauce.findOne({_id: req.params.id})
      .then(sauce => {
        const filename = sauce.imageUrl.split('/images/')[1];
        fs.unlink(`images/${filename}`, () => {
          Sauce.deleteOne({_id: req.params.id})
          .then(() => res.status(200).json({ message: 'Sauce suprimée !'}))
          .catch(error => res.status(400).json({error}));
        })
      })
      .catch(error => res.status(500).json({error}));
};

exports.getAllSauce =  (req, res, next) =>{
    Sauce.find()
      .then(sauces => res.status(200).json(sauces))
      .catch(error => res.status(400).json({error}));
};

exports.getOneSauce =  (req, res, next) =>{
    Sauce.findOne({_id: req.params.id})
      .then(sauce => res.status(200).json(sauce))
      .catch(error => res.status(404).json({error}));
};
