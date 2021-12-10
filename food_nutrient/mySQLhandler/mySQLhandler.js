const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "",
    database: "food"
});

exports.connect = function () {
    con.connect(function (err) {
        if (err) throw err;
        console.log("connected");
    });
}

exports.entrylist = function (callback) {
    con.query("SELECT * FROM food LIMIT 20", function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}