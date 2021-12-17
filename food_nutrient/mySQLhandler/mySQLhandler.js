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

exports.entrylist = function (callback) {
    let sql = "select food_name, amount from food, food_nutrient where food_nutrient.fdc_id=food.fdc_id and nutrient_id=1003 limit 20;"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.checklogin = function (username, password, callback) {
    let sql = "select * from users where username=\'" + username + "\' and password=\'" + password + "\';"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result)
    });
}

exports.checkregister = function (username, callback) {
    let sql = "select * from users where username=\'" + username + "\';"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result)
    });
}

exports.adduser = function (username, password, callback) {
    let sql = "insert into users (username, password) values (\'" + username + "\',\'" + password + "\');"
    con.query(sql, function (err) {
        if (err) callback(err, null);
        callback(null);
    });
}