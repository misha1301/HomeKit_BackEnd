const express = require('express');
const router = express.Router();
const sensorController = require('../../controllers/sensorController');
const ROLES_LIST = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles');
//const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    //.get(verifyJWT, sensorController.getAllSensors)
    .get(verifyRoles(ROLES_LIST.Admin), sensorController.getAllSensors)
    .post(sensorController.addNewSensor)
    .put(sensorController.updateSensor)
    .delete(verifyRoles(ROLES_LIST.Admin), sensorController.deleteSensor);

router.route('/:id')
    .get(sensorController.getSensor);

module.exports = router;