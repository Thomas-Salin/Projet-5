const User = require('../models/User');

const bcrypt = require('bcrypt');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');


exports.signup = (req, res,next) => {
        bcrypt.hash(req.body.password, 10)
            .then(hash => {
                const user = new User({
                    email: req.body.email,
                    password: hash
            })
                user.save()
                    .then(() => res.status(201).json({message: 'Utilisateur crée'}))
                    .catch(error => res.status(400).json({error}));
            })

            .catch(error => res.status(500).json({error}));
};

exports.login =  (req, res, next) => {
    User.findOne({email: req.body.email})
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