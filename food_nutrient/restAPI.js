const mySqlHandler = require(__dirname + "\\mySQLhandler\\mySQLhandler");

exports.createAPI = function (app) {
    return new RESTfulAPI(app);
};

class RESTfulAPI {
    constructor(app) {

        try {
            mySqlHandler.connect();
        } catch (err) {
            console.log('mysql failure')
            return;
        }

        app.get('/', function (request, response) {
            console.log('GET request received at /');
            response.sendFile('comoBOX.html', {root: __dirname + "/comoBOX"});
        })

        app.get('/comoBOX.js', function (request, response) {
            console.log('GET request received at /comoBOX.js');
            response.sendFile('comoBOX.js', {root: __dirname + "/comoBOX"});
        })

        app.get('/list', function (request, response) {
            console.log('GET request received at /list');
            mySqlHandler.entrylist(function (err, data) {
                if (err) {
                    console.log(err)
                    response.status(500).send()
                } else {
                    console.log(data)
                    response.send(data)
                }
            })
        })

        app.listen(8080, function () {
            console.log('Connected to port 8080');
        })
    }
}