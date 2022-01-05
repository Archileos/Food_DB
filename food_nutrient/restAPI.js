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
            console.log('POST request received at /login');
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
            console.log('POST request received at /register');
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

        app.post('/getDiets', function (request, response) {
            let username = request.body.user_name;
            console.log('POST request received at /getDiets');
            mySqlHandler.getdiets(username, function (err, data) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.send(data)
                }
            })
        })

        app.get('/dietStats', function (request, response) {
            console.log('GET request received at /dietStats');
            mySqlHandler.findMaxMin(function (err, data) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.send(data)
                }
            })
        })

        app.post('/getDietFood', function (request, response) {
            console.log('POST request received at /getDietFood');
            let diet_name = request.body.diet_name;
            console.log(diet_name)
            mySqlHandler.getdietfood(diet_name, function (err, data) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.send(data)
                }
            })
        })

        app.post('/getnutoffood', function (request, response) {
            let food_name = request.body.food_name;
            console.log('POST request received at /getnutoffood');
            mySqlHandler.getnutoffood(food_name, function (err, data) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.send(data)
                }
            })
        })

        app.post('/complete', function (request, response) {
            console.log('POST request received at /complete');
            let limits = request.body.limits;
            let looking_for = request.body.max_nutrient;
            mySqlHandler.selectMax(limits, looking_for, function (err, data) {
                if (err) {
                    console.log(err)
                    response.status(500).send()
                } else {
                    response.send(data)
                }
            })
        })

        app.post('/getTable', function (request, response) {
            let limits = request.body.limits;
            console.log('POST request received at /getTable');
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
            console.log('GET request received at /foodPlans');
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
            console.log('POST request received at /getLimits');
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

        app.post('/delete', function (request, response) {
            console.log('POST request received at /delete');
            let diet_name = request.body.diet_name;
            mySqlHandler.deleteFromDiet(diet_name, function (err) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.sendStatus(200)
                }
            })
        })

        app.post('/insert', function (request, response) {
            console.log('POST request received at /insert');
            let diet_name = request.body.diet_name;
            let chosen_foods = request.body.chosen_foods;
            mySqlHandler.insertIntoDiet(diet_name, chosen_foods, function (err) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.sendStatus(200)
                }
            })
        })

        app.post('/update', function (request, response) {
            console.log('POST request received at /update');
            let diet_name = request.body.diet_name;
            let plan_name = request.body.plan_name;
            let user_name = request.body.user_name;
            mySqlHandler.updateInDiets(user_name, diet_name, plan_name, function (err) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.sendStatus(200)
                }
            })
        })

        app.post('/uploadDiet', function (request, response) {
            console.log('POST request received at /uploadDiet');
            let username = request.body.user;
            let diet_name = request.body.diet_name;
            let plan_name = request.body.food_plan;
            let food_list = request.body.chosen_foods;
            mySqlHandler.uploadUserDiet(username, diet_name, plan_name, food_list, function (err) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.sendStatus(200)
                }
            })
        })

        app.post('/uploadPlan', function (request, response) {
            console.log('POST request received at /uploadPlan');
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