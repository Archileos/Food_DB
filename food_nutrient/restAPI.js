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

        app.get('/plan_create.html', function (request, response) {
            console.log('GET request received at /plan_create');
            response.sendFile('plan_create.html', {root: __dirname + "/plan_create"});
        })

        app.get('/plan_create.js', function (request, response) {
            response.sendFile('plan_create.js', {root: __dirname + "/plan_create"});
        })

        app.post('/login', function (request, response) {
            let username = request.body.username
            let password = request.body.password
            mySqlHandler.checklogin(username, password, function (err, data) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    if (data.length > 0) {
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

        app.post('/getnutoffood', function (request, response) {
            let food_name = request.body.food_name
            console.log('GET request received at /getnutoffood');
            mySqlHandler.getnutoffood(food_name, function (err, data) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.send(data)
                }
            })
        })

        // app.post('/complete', function (request, response) {
        //     console.log('GET request received at /complete');
        //     let limits = request.body.limits
        //     mySqlHandler.fill(limits, function (err, data) {
        //         if (err) {
        //             console.log(err)
        //             response.status(500).send()
        //         } else {
        //             response.send(JSON.stringify(data))
        //         }
        //     })
        // })

        app.post('/getTable', function (request, response) {
            let limits = request.body.limits;
            console.log('GET request received at /getTable');
            mySqlHandler.entrylist(limits, function (err, data) {
                    if (err) {
                        console.log(err);
                        response.status(500).send();
                    } else {
                        response.send(data)
                    }
                }
            )
        })

        app.get('/foodPlans', function (request, response) {
            console.log('GET request received at /food_plans');
            mySqlHandler.listplans(function (err, data) {
                if (err) {
                    console.log(err)
                    response.status(500).send()
                } else {
                    response.send(data)
                }
            })
        })

        app.post('/getLimits', function (request, response) {
            console.log('GET request received at /getLimits');
            let plan_name = request.body.plan_name
            mySqlHandler.getlimits(plan_name, function (err, data) {
                if (err) {
                    console.log(err)
                    response.status(500).send()
                } else {
                    response.send(data)
                }
            })
        })

        app.get('/nutrients', function (request, response) {
            console.log('GET request received at /nutrients');
            mySqlHandler.listnutrients(function (err, data) {
                if (err) {
                    console.log(err)
                    response.status(500).send()
                } else {
                    response.send(data)
                }
            })
        })

        app.post('/uploadPlan', function (request, response) {
            console.log('GET request received at /uploadPlan');
            let plan_name = request.body.plan_name
            let description = request.body.description
            let limits_nutrients = request.body.limits_nutrient
            mySqlHandler.uploadUserPlan(plan_name, description, limits_nutrients, function (err) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.sendStatus(200)
                }
            })
        })

        app.listen(8080, function () {
            console.log('Connected to port 8080');
        })
    }
}