const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
    try{
        const token = req.headers.authorization.split(' ')[1];
        const decodedToken = jwt.verify(token, 'PLATES_CONTINUE_PRIME_LOCKER_MUSIC_COMPANY');
        const userId = decodedToken.userId
        if(req.body.userId && req.body.userId !== userId){
            return error;
        }else {
            next();
        }
    }catch (error) {
        return error
    }
}