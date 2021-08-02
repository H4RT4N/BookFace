const jwt = require('jsonwebtoken');

const auth = async(req, res, next) => {
    try {
        const token = req.headers.authorization.split(" ")[1];
        const isHomeBrew = token.length < 500; // check if custom token or google

        let decodedData;
        if(token && isHomeBrew) {
            decodedData = jwt.verify(token, 'temp');
            req.userId = decodedData?.id;
        }
        else {
            decodedData = jwt.decode(token);
            req.userId = decodedData?.sub;
        }
        next();
    } catch (err) {console.log(err)};
}

module.exports = auth;