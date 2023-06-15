const Room = require("../model/Room");
const User = require("../model/User");
const Controller = require("../model/Controller");

const updateController = async (req, res) => {
  if (!req?.body?.secure)
    return res.status(400).json({ message: "Controller secure is requred." });

  const controllerSecure = req.body.secure;

  const controller = await Controller.findOne({
    secure: controllerSecure,
  }).exec();
  if (!controller)
    return res.status(204).json({ message: `No any registered controller` });

  if (req?.body?.settingState == 1) {
    if (req?.body?.minTemp) controller.state.minTemp = req.body.minTemp;
    if (req?.body?.maxTemp) controller.state.maxTemp = req.body.maxTemp;
    if (req?.body?.isOn != null) controller.state.isOn = req.body.isOn == 1 ? true : false;
  }
  
  if (req?.body?.isWorking != null) controller.state.isWorking = req.body.isWorking == 1 ? true : false;
  if (req?.body?.insideTemperature)
    controller.sensors.inside.temperature = req.body.insideTemperature;
  if (req?.body?.insideHumidity)
    controller.sensors.inside.humidity = req.body.insideHumidity;
  if (req?.body?.outsideTemperature)
    controller.sensors.outside.temperature = req.body.outsideTemperature;
  if (req?.body?.outsideHumidity)
    controller.sensors.outside.humidity = req.body.outsideHumidity;
    controller.lastConnection =  new Date();

  if (req?.body?.settingState == 0) {
    if (controller.state.setings == true) {
      controller.state.setings = false;
      const result = await controller.save();
      res.status(201).json({
        "isOn": controller.state.isOn == true ? 1 : 0,
        "minTemp": controller.state.minTemp,
        "maxTemp": controller.state.maxTemp,
      });
      
    }else{
        const result = await controller.save();
        res.status(201).json('');
    }
  } else {
    const result = await controller.save();
    res.status(201).json('');
  }
};

module.exports = {
  updateController,
};
