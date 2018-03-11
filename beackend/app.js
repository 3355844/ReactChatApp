const express = require('express');
const app = express();
const socket = require('socket.io');
const bodyParser = require('body-parser');
const mongo = require('mongodb');
const monk = require('monk');
const db = monk('mongodb://root:root@ds161136.mlab.com:61136/mydb');
const log4js = require('log4js');



app.use(bodyParser.json);


// Log4js
let logger = log4js.getLogger();
logger.level = 'error';
logger.level = 'info';

// MongoDB

app.use(function (req, res, next) {
    req.db = db;
    next();
});

const server = app.listen(8080, function () {
    logger.info('server is running on port 8080');
});

const io = socket(server);
io.on('connection', (socket) => {
    logger.info(socket.id);

    socket.on('SEND_MESSAGE', function (data) {
        console.log(data);
        let mess = db.get('mess');
        mess.insert(data);
        io.emit('RECEIVE_MESSAGE', data);
    })
});
