const data = {
    sensors: require('../model/sensors.json'),
    setSensors: function (data) {this.sensors = data}
};

const getAllSensors  = (req, res) => {
    res.json(data.sensors);
}

const addNewSensor = (req, res) => {
    const newSensor = {
        id: data.sensors[data.sensors.length - 1].id + 1 || 1,
        name: req.body.name,
        data: req.body.data,
        location: {
            place: req.body.place,
            description: req.body.description
        },
        type: req.body.type,
        range: req.body.range,
        connecting: req.body.connecting
    }

    if(!newSensor.name || !newSensor.data){
        return res.status(400).json({"message": "Inputs data are required."});
    }

    data.setSensors([...data.sensors, newSensor]);
    res.status(201).json(data.sensors);
}

const updateSensor = (req, res) => {
    const sensor = data.sensors.find(sen => sen.id === parseInt(req.body.id));
    if(!sensor){
        return res.status(400).json({"message": `Sensors ID ${req.body.id} not found`});
    }
    if(req.body.name)sensor.name = req.body.name;
    if(req.body.data)sensor.data = req.body.data;
    const fileredArray = data.sensors.filter(sen => sen.id !== parseInt(req.body.id));
    const unsortedArray = [...fileredArray, sensor];
    data.setSensors(unsortedArray.sort((a,b) => a.id > b.id ? 1 : a.id < b.id ? -1 : 0));
    res.json(data.sensors);
}


const deleteSensor = (req, res) => {
    const sensor = data.sensors.find(sen => sen.id === parseInt(req.body.id));
    if(!sensor){
        return res.status(400).json({"message": `Sensors ID ${req.body.id} not found`});
    }
    const fileredArray = data.sensors.filter(sen => sen.id !== parseInt(req.body.id));
    data.setSensors([...fileredArray]);
    res.json(data.sensors);
}

const getSensor = (req, res) => {
    const sensor = data.sensors.find(sen => sen.id === parseInt(req.params.id));
    if(!sensor){
        return res.status(400).json({"message": `Sensors ID ${req.body.id} not found`});
    }
    res.json(sensor);
}

module.exports = {
    getAllSensors,
    addNewSensor, 
    updateSensor, 
    deleteSensor, 
    getSensor
}