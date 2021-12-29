const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "Alis12345",
    database: "food"
});

exports.connect = function () {
    con.connect(function (err) {
        if (err) throw err;
        console.log("connected");
    });
}

exports.adduser = function (username, password, callback) {
    let sql = "insert into users (username, password) values ?;"
    let values = [[username, password]]
    con.query(sql, [values], function (err) {
        if (err) callback(err, null);
        callback(null);
    });
}

exports.checkregister = function (username, callback) {
    let sql = "select * from users where username=\'" + username + "\';"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result)
    });
}

exports.checklogin = function (username, password, callback) {
    let sql = "select * from users where username=\'" + username + "\' and password=\'" + password + "\';"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result)
    });
}

exports.entrylist = function (callback) {
    let sql = "select food_name, amount from food, food_nutrient where food_nutrient.fdc_id=food.id and nutrient_id=1003 limit 20;"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.listnutrients = function (callback) {
    let sql = "select name from nutrient where id<>1003 and id<>1004 and id<>1005 and id<>1008"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.uploadUserPlan = function (plan_name, description, limits_nutrients, callback) {
    let sql1 = "insert into food_plans (food_plan_name, food_plan_description, is_user_created) values ?;"
    let values1 = [[plan_name, description, 1]]
    con.beginTransaction(function (err) {
        if (err) callback(err);
        con.query(sql1, [values1], function (err) {
            if (err) callback(err);
        });
        for (let i = 0; i < limits_nutrients.length; i++) {
            let plan_name = limits_nutrients[0];
            let nut_name = limits_nutrients[1];
            let amount = limits_nutrients[2];
            let sql2 = "INSERT INTO food.food_plan_limits_nutrient (food_plan_name, nutrient_id, total_amount)\n" +
                `select ${plan_name} ,id, ${amount} from nutrient where name=${nut_name};`
            con.query(sql2, function (err) {
                if (err) callback(err);
            });
        }

    })
}