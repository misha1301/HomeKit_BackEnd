const express = require('express');
const router = express.Router();
const roomController = require('../../controllers/roomController');
const ROLES_LIST = require('../../config/rolesList');
const verifyRoles = require('../../middleware/verifyRoles');
//const verifyJWT = require('../../middleware/verifyJWT');

router.route('/')
    //.get(verifyJWT, sensorController.getAllSensors)
    .get(verifyRoles(ROLES_LIST.User),roomController.getAllUserRooms)
    .post(verifyRoles(ROLES_LIST.User),roomController.addNewRoom)
    .put(verifyRoles(ROLES_LIST.User),roomController.updateRoom)
    .delete(verifyRoles(ROLES_LIST.User),roomController.deleteRoom);

router.route('/:id')
    .get(roomController.addNewRoom);

module.exports = router;