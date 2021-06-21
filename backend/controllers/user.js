const User = require('../models/User');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const maskData = require('maskdata');


exports.signup = (req, res, next) => {
    const email = req.body.email;
    const emailMask2Option = {
        maskWith : '*',
        unmaskedStartCharactersBeforeAt : 0 ,
        unmaskedEndCharactersAfterAt : 0 ,
        maskAtTheRate : true 
    }
    const emailMasked = maskData.maskEmail2(email, emailMask2Option);
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: emailMasked,
                    password: hash
            })
                user.save()
                    .then(() => res.status(201).json({message: 'Utilisateur crée'}))
                    .catch(error => res.status(400).json({error}));
            })

            .catch(error => res.status(500).json({error}));
};

exports.login =  (req, res, next) => {
    const emailMask2Option = {
        maskWith : '*',
        unmaskedStartCharactersBeforeAt : 0 ,
        unmaskedEndCharactersAfterAt : 0 ,
        maskAtTheRate : true
    }
    User.findOne({email: maskData.maskEmail2(req.body.email, emailMask2Option)})
        .then(user => {
            if(!user){
                return res.status(401).json({error: 'Utilisateur inconnu'})
            }
            bcrypt.compare(req.body.password, user.password)
                .then(valid => {
                    if(!valid){
                        return res.status(401).json({error: 'Mot de passe erroné'})
                    }
                    res.status(200).json({
                        userId: user._id,
                        token: jwt.sign(
                            { userId: user._id },
                            'PLATES_CONTINUE_PRIME_LOCKER_MUSIC_COMPANY',
                            { expiresIn: '6h'}
                        )
                    });
                })
                .catch(error => res.status(500).json({error}));
        })
        .catch(error => res.status(500).json({error}));

};