/*
* This is our restAPI, and it's used as a controller in our project, it'll receives request from the user and will
* force the mySQLHandler into action to fulfill the requests of the user, and will send an appropriate response.
*/
const mySqlHandler = require(__dirname + "\\mySQLhandler\\mySQLhandler.js");

// Constructor method for restAPI to be run on the server.
exports.createAPI = function (app) {
    return new RESTfulAPI(app);
};

class RESTfulAPI {
    constructor(app) {

        // Try connecting to mysql, in case of failure the code will abort as no action can be made without a connection.
        try {
            mySqlHandler.connect();
        } catch (err) {
            console.log('mysql failure')
            return;
        }

        // Below are getters for our 8 pages, these getter are required to allow the user to view our pages.
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

        /*
         * Post request from user, receives username and password and checks if the user exists in the db, returns
         * appropriate status.
         */
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

        /*
         * Post request from user, receives username and password and checks if the user exists in the db, if such a
         * user doesn't exist, the user is added to the db. Appropriate status code is sent.
         */
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

        /*
         * Post request from user, receives username and returns all the diets of that user, or error status in case
         * of failure.
         */
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

        /*
         * Get request from user, returns stats with trivia information about all existing diets.
         */
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

        /*
         * Post request from user, receives diet name and user name and returns all the diets of that user, or error
         * status in case of failure.
         */
        app.post('/getDietFood', function (request, response) {
            console.log('POST request received at /getDietFood');
            let diet_name = request.body.diet_name;
            let user_name = request.body.user_name
            mySqlHandler.getdietfood(diet_name, user_name, function (err, data) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.send(data)
                }
            })
        })

        /*
         * Post request from user, receives food name and returns all the nutrients inside of the given food,
         * or error status in case of failure.
         */
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

        /*
         * Post request from user, receives limits on nutrients and the nutrient with the biggest allowance and returns
         * the food that contains the most of the given nutrient, or error status in case of failure.
         */
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

        /*
         * Post request from user, receives limits on nutrients and returns a list of elements that align with the
         * limits, they are then used in table creation in the user side.
         */
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

        /*
         * Get request from user, returns all the food plans that are currently on the server.
         */
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

        /*
         * Post request from user, receives a plan name and returns the limits that are implied by the given plan.
         */
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

        /*
         * Get request from user, returns a list of all the nutrients with 4 exceptions.
         */
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

        /*
         * Post request from user, receives a diet name and a user name and removes the entry specified by them from the
         * table. Returns appropriate status.
         */
        app.post('/delete', function (request, response) {
            console.log('POST request received at /delete');
            let diet_name = request.body.diet_name;
            let user_name = request.body.user_name;
            console.log(user_name)
            mySqlHandler.deleteFromDiet(diet_name, user_name, function (err) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.sendStatus(200)
                }
            })
        })

        /*
         * Post request from user, receives a diet name and a user name and inserts an entry specified by them to the
         * table. Returns appropriate status.
         */
        app.post('/insert', function (request, response) {
            console.log('POST request received at /insert');
            let diet_name = request.body.diet_name;
            let user_name = request.body.user_name;
            let chosen_foods = request.body.chosen_foods;
            mySqlHandler.insertIntoDiet(diet_name, user_name, chosen_foods, function (err) {
                if (err) {
                    console.log(err)
                    response.sendStatus(500)
                } else {
                    response.sendStatus(200)
                }
            })
        })

        /*
         * Post request from user, receives a diet name and a user name and a plan name and updates the entry specified
         * by them to match the provided plan name. Returns appropriate status.
         */
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

        /*
         * Post request from user, receives a diet name and a user name and a plan name and a list of foods and inserts
         * the entries specified by them into the table. Returns appropriate status.
         */
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

        /*
         * Post request from user, receives a plan name, a description of said plan and the limits that the plan
         * imposes on nutrients returns the appropriate status code.
         */
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

        /*
         * Bind the server to accept request on the 8080 port.
         */
        app.listen(8080, function () {
            console.log('Connected to port 8080');
        })
    }
}