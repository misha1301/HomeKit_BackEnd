const User = require('../model/User');

const handleLogout = async (req, res) => {
    //On client, also delete the accessToken

    const cookies = req.cookies;
    if(!cookies?.jwt) return res.sendStatus(401); //no content
    const refreshToken = cookies.jwt;
    if(!refreshToken || refreshToken === '') return res.sendStatus(401);
    // is refresh token in db?
    const foundUser = await User.findOne({refreshToken}).exec();
    if(!foundUser){
        res.clearCookie("jwt", {httpOnly: true, sameSite: 'None'}); //secure: true - only an https
        return res.sendStatus(403);
    }
    
    //Delete refreshToken in the db
    foundUser.refreshToken = '';
    const result = await foundUser.save();
    console.log(result);

    res.clearCookie("jwt", {httpOnly: true, sameSite: 'None'}); //secure: true - only an https
    res.sendStatus(204);
}

module.exports = {handleLogout}