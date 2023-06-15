const Room = require("../model/Room");
const User = require("../model/User");
const Controller = require("../model/Controller");

const addNewRoom = async (req, res) => {
  const { roomName } = req.body;
  if (!roomName)
    return res.status(400).json({ message: "roomName are reqiured." });
  // check for duplicate usernames in the db
  console.log(`username: ${req.username}`);
  const username = req.username;
  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  try {
    //create and store the new user
    const result = await Room.create({
      userID: foundUser._id,
      roomName: roomName,
    });
    console.log(result);

    res.status(201).json({ success: `New room ${roomName} created` });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

const getAllUserRooms = async (req, res) => {
  const username = req.username;
  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  const rooms = await Room.find({ userID: foundUser._id });
  if (!rooms) return res.status(204).json({ message: "No rooms" });
  res.json(rooms);
};

const updateRoom = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID room is requred." });

  const roomID = req.body.id;
  const username = req.username;

  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  const room = await Room.findOne({ _id: roomID });
  if (!room)
    return res.status(204).json({ message: `No any rooms witn ID: ${roomID}` });

  if (room.userID != foundUser._id)
    return res.status(403).json({ message: `No permition` });

  if (req?.body?.roomName) room.roomName = req.body.roomName;
  const result = await room.save();
  res.status(201).json(result);
};

const deleteRoom = async (req, res) => {
  if (!req?.body?.id)
    return res.status(400).json({ message: "ID room is requred." });

  const roomID = req.body.id;
  const username = req.username;

  const foundUser = await User.findOne({ username: username }).exec();
  if (!foundUser) return res.sendStatus(401); //Unauthorized

  const room = await Room.findOne({ _id: roomID });
  if (!room) {
    return res.status(204).json({ message: `No any rooms witn ID: ${roomID}` });
  }

  if (room.userID != foundUser._id)
    return res.status(403).json({ message: `No permition` });

  const controller = await Controller.findOne({ roomID: roomID });
  if (controller) {
    controller.deleteOne({ _id: controller._id });
  }

  const result = await room.deleteOne({ _id: roomID });
  res.json(result);
};

module.exports = { addNewRoom, getAllUserRooms, updateRoom, deleteRoom };
