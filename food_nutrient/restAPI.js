const mySqlHandler = require(__dirname + "\\mySQLhandler\\mySQLhandler.js");

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
            response.sendFile('login.html', {root: __dirname + "/login"});
        })

        app.get('/login.js', function (request, response) {
            response.sendFile('login.js', {root: __dirname + "/login"});
        })

        app.get('/login.css', function (request, response) {
            response.sendFile('login.css', {root: __dirname + "/login"});
        })

        app.get('/register.html', function (request, response) {
            console.log('GET request received at /register');
            response.sendFile('register.html', {root: __dirname + "/register"});
        })

        app.get('/register.js', function (request, response) {
            response.sendFile('register.js', {root: __dirname + "/register"});
        })

        app.get('/register.css', function (request, response) {
            response.sendFile('register.css', {root: __dirname + "/register"});
        })

        app.get('/comoBOX.html', function (request, response) {
            console.log('GET request received at /comoBOX');
            response.sendFile('comoBOX.html', {root: __dirname + "/comoBOX"});
        })

        app.get('/comoBOX.js', function (request, response) {
            response.sendFile('comoBOX.js', {root: __dirname + "/comoBOX"});
        })

        app.get('/diets.html', function (request, response) {
            console.log('GET request received at /diets');
            response.sendFile('diets.html', {root: __dirname + "/diets"});
        })

        app.get('/diets.js', function (request, response) {
            response.sendFile('diets.js', {root: __dirname + "/diets"});
        })

        app.get('/list', function (request, response) {
            console.log('GET request received at /list');
            mySqlHandler.entrylist(function (err, data) {
                if (err) {
                    console.log(err)
                    response.status(500).send()
                } else {
                    response.send(data)
                }
            })
        })

        app.post('/login', function (request, response) {
            let username = request.body.username
            let password = request.body.password
            mySqlHandler.checklogin(username, password, function (err, data) {
                console.log(data.length)
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    if (data.length > 0) {
                        console.log("log")
                        response.sendStatus(200)
                    } else {
                        response.sendStatus(401)
                    }
                }
            })
        })

        app.post('/register', function (request, response) {
            let username = request.body.username
            let password = request.body.password
            mySqlHandler.checkregister(username, function (err, data) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    if (data.length > 0) {
                        response.sendStatus(403)
                    } else {
                        mySqlHandler.adduser(username, password, function (err) {
                            if (err) {
                                console.log(err)
                                response.sendStatus(500)
                            } else {
                                response.sendStatus(201)
                            }
                        })
                    }
                }
            })
        })

        app.listen(8080, function () {
            console.log('Connected to port 8080');
        })
    }
}