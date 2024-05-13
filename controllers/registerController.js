const User = require("../model/User");
const bcrypt = require("bcryptjs");

const handleNewUser = async (req, res) => {
  const { username, password } = req.body;
  if (!username || !password)
    return res
      .status(400)
      .json({ message: "Username and password are reqiured." });

  // check for duplicate usernames in the db
  const duplicate = await User.findOne({ username: username }).exec();
  if (duplicate) return res.sendStatus(409);
  try {
    //encrypt the password
    const hashPwd = await bcrypt.hash(password, 10);

    //create and store the new user
    const result = await User.create({
      username: username,
      password: hashPwd,
    });
    console.log(result);

    res.status(201).json({ success: `New user ${username} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

module.exports = { handleNewUser };
