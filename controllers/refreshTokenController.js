const User = require('../model/User');
const jwt = require('jsonwebtoken');
//require('dotenv').config();

const handleRefreshToken = async (req, res) => {
    const cookies = req.cookies;
    if(!cookies?.jwt)
        return res.status(401);
    console.log(cookies?.jwt);
    const refreshToken = cookies.jwt;
    console.log(refreshToken );
    // check for duplicate usernames in the db
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser)
        return res.sendStatus(403); //Forbidden
    //evaluate jwt
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err, decoded) => {
            if(err || foundUser.username !== decoded.username)
                return res.sendStatus(403);

            const roles = Object.values(foundUser.roles);
            const username = decoded.username;
            const accessToken = jwt.sign(
                {
                    "UserInfo":{
                        "username": decoded.username,
                        "roles": roles
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn: '600s'}
            );
            res.json({roles, username, accessToken});
        }
    );
}

module.exports = {handleRefreshToken};