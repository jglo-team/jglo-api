const WebServerHelper = require('./helpers/WebServerHelper');
const SocketHelper = require('./helpers/SocketHelper');

let webServerHelper = new WebServerHelper();
let socketHelper = new SocketHelper(webServerHelper.server);
webServerHelper.setSocketHelper(socketHelper);
webServerHelper.setRoutes();