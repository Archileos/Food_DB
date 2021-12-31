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
    let sql = `insert into users (username, password) values (\'${username}\',\'${password}\');`
    con.query(sql, function (err) {
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

exports.entrylist = function (limits, callback) {
    let sql = "select food.id, food.food_name, food.food_description from food_nutrient"
    let where = " where "
    let dict = {0: 'food_nutrient'}
    for (let i = 1; i < limits.length; i++) {
        sql += ` join food_nutrient as f${i}`
        where += `food_nutrient.fdc_id=f${i}.fdc_id and `
        dict[i] = `f${i}`
    }
    sql += " ,food"
    sql += where
    for (let i = 0; i < limits.length; i++) {
        sql += ` ${dict[i]}.nutrient_id = ${limits[i].nutrient_id} and ${dict[i]}.amount < ${limits[i].total_amount} and `
    }
    sql += " food.id=food_nutrient.fdc_id group by food.food_name limit 20;"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.listplans = function (callback) {
    let sql = "select food_plan_name, food_plan_description from food_plans order by is_user_created;"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.getlimits = function (plan_name, callback) {
    let sql = `select nutrient_id, total_amount from food_plan_limits_nutrient where food_plan_name=\'${plan_name}\';`
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
    let sql1 = `INSERT INTO food_plans (food_plan_name, food_plan_description, is_user_created) VALUES (\'${plan_name}\', \'${description}\', 1);`
    con.query(sql1, function (err) {
        if (err) callback(err);
    });
    for (let i = 0; i < limits_nutrients.length; i++) {
        let nut_name = limits_nutrients[i][0];
        let amount = limits_nutrients[i][1];
        let sql2 = "INSERT INTO food.food_plan_limits_nutrient (food_plan_name, nutrient_id, total_amount)\n" +
            `select \'${plan_name}\' ,id, ${amount} from nutrient where name=\'${nut_name}\';`
        con.query(sql2, function (err) {
            if (err) callback(err);
        });
    }
}