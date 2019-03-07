const io = require("socket.io");
const config = require('../config');


class SocketHelper {

    constructor(server) {
        this.io = io.listen(server);
        this.setRoutes();
    }

    setRoutes(){
        this.io.on("connection", (socket) => {

            console.log('Connected!');
            // when socket disconnects, remove it from the list:

            socket.on('token:set', (token) => {
                console.log('[SocketHelper] [token:set]', token);
                socket.join('token:' + token);
            });

            socket.on("disconnect", () => {
                console.info(`Client gone [id=${socket.id}]`);
            });
        })
    }

    sendToRoom(token, accessToken){
        this.io.to('token:' + token).emit('accessToken', accessToken);
    }

}

module.exports = SocketHelper;