const Room = require("../model/Room");
const User = require("../model/User");
const Controller = require("../model/Controller");

// const data = {
//     sensors: require('../model/sensors.json'),
//     setSensors: function (data) {this.sensors = data}
// };

// const getAllSensors  = (req, res) => {
//     res.json(data.sensors);
// }

const getAllUserControllers = async (req, res) => {
    const username = req.username;
    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized
  
    const controllers = await Controller.find({ userID: foundUser._id });
    if (!controllers) return res.status(204).json({ message: "No controllers" });
    res.json(controllers);
};

const getRoomControllers = async (req, res) => {
    const roomId = req.params.id;
    if (!roomId )
      return res.status(400).json({ message: "Some data are reqiured." });
   
    const username = req.username;
    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized
      
    const controllers = await Controller.find({ roomID: roomId });
    if (!controllers) return res.status(204).json({ message: "No controllers" });
    res.json(controllers);
};

const addNewSensor = async (req, res) => {
    const { roomID, name, secure } = req.body;
    if (!roomID || !name || !secure)
      return res.status(400).json({ message: "Some data are reqiured." });
    // check for duplicate usernames in the db
    console.log(`username: ${req.username}`);
    const username = req.username;
    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized
  
    try {
      //create and store the new user
      const result = await Controller.create({
        userID: foundUser._id,
        roomID: roomID,
        name: name,
        secure: secure,
      });
      console.log(result);
  
      res.status(201).json({ success: `New controller ${name} created` });
    } catch (err) {
      res.status(500).json({ message: err.message });
    }
};

// const addNewSensor = (req, res) => {
//     const newSensor = {
//         id: data.sensors[data.sensors.length - 1].id + 1 || 1,
//         name: req.body.name,
//         data: req.body.data,
//         location: {
//             place: req.body.place,
//             description: req.body.description
//         },
//         type: req.body.type,
//         range: req.body.range,
//         connecting: req.body.connecting
//     }

//     if(!newSensor.name || !newSensor.data){
//         return res.status(400).json({"message": "Inputs data are required."});
//     }

//     data.setSensors([...data.sensors, newSensor]);
//     res.status(201).json(data.sensors);
// }

// const updateSensor = (req, res) => {
//     const sensor = data.sensors.find(sen => sen.id === parseInt(req.body.id));
//     if(!sensor){
//         return res.status(400).json({"message": `Sensors ID ${req.body.id} not found`});
//     }
//     if(req.body.name)sensor.name = req.body.name;
//     if(req.body.data)sensor.data = req.body.data;
//     const fileredArray = data.sensors.filter(sen => sen.id !== parseInt(req.body.id));
//     const unsortedArray = [...fileredArray, sensor];
//     data.setSensors(unsortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
//     res.json(data.sensors);
// }

const updateSensor = async (req, res) => {
    if (!req?.body?.id)
      return res.status(400).json({ message: "Controller ID is requred." });
  
    const controllerID = req.body.id;
    const username = req.username;
  
    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized
  
    const controller = await Controller.findOne({ _id: controllerID });
    if (!controller)
      return res.status(204).json({ message: `No any controller witn ID: ${controllerID}` });
  
    if (controller.userID != foundUser._id)
      return res.status(403).json({ message: `No permition` });
  
    if (req?.body?.controllerName) controller.name = req.body.controllerName;
    if (req?.body?.minTemp) controller.state.minTemp = req.body.minTemp;
    if (req?.body?.maxTemp) controller.state.maxTemp = req.body.maxTemp;
    if (req?.body?.isOn != null) controller.state.isOn = req.body.isOn;
    if (req?.body?.settingState) controller.state.setings = req.body.settingState;

    const result = await controller.save();
    res.status(201).json(result);
  };

// const deleteSensor = (req, res) => {
//     const sensor = data.sensors.find(sen => sen.id === parseInt(req.body.id));
//     if(!sensor){
//         return res.status(400).json({"message": `Sensors ID ${req.body.id} not found`});
//     }
//     const fileredArray = data.sensors.filter(sen => sen.id !== parseInt(req.body.id));
//     data.setSensors([...fileredArray]);
//     res.json(data.sensors);
// }

const deleteSensor = async (req, res) => {
    if (!req?.body?.id)
      return res.status(400).json({ message: "Controller ID is requred." });
  
    const controllerID = req.body.id;
    const username = req.username;
  
    const foundUser = await User.findOne({ username: username }).exec();
    if (!foundUser) return res.sendStatus(401); //Unauthorized
  
    const controller = await Controller.findOne({ _id: controllerID });
    if (!controller){
      return res.status(204).json({ message: `No any controller witn ID: ${controllerID}` });
    }
  
    if (controller.userID != foundUser._id)
      return res.status(403).json({ message: `No permition` });
  
    const result = await controller.deleteOne({ _id: controllerID });
    res.json(result);
  };

// const getSensor = (req, res) => {
//     const sensor = data.sensors.find(sen => sen.id === parseInt(req.params.id));
//     if(!sensor){
//         return res.status(400).json({"message": `Sensors ID ${req.body.id} not found`});
//     }
//     res.json(sensor);
// }

module.exports = {
    getAllUserControllers,
    addNewSensor, 
    updateSensor, 
    deleteSensor,
    getRoomControllers
}