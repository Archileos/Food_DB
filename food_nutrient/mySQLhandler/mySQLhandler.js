const mysql = require('mysql');

var con = mysql.createConnection({
    host: "localhost",
    user: "root",
    password: "savchenko2k",
    database: "food"
});

exports.connect = function () {
    con.connect(function (err) {
        if (err) throw err;
        console.log("connected");
    });
}

exports.adduser = function (username, password, callback) {
    let sql = `INSERT INTO users (username, password) VALUES (\'${username}\',\'${password}\');`
    con.query(sql, function (err) {
        if (err) callback(err, null);
        callback(null);
    });
}

exports.checkregister = function (username, callback) {
    let sql = "SELECT * FROM users WHERE username=\'" + username + "\';"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result)
    });
}

exports.checklogin = function (username, password, callback) {
    let sql = "SELECT * FROM users WHERE username=\'" + username + "\' and password=\'" + password + "\';"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result)
    });
}

function build_query(sql, limits) {
    let where = " WHERE "
    let dict = {0: 'f0'}
    for (let i = 1; i < limits.length; i++) {
        sql += ` JOIN food_nutrient AS f${i}`
        where += `f0.fdc_id=f${i}.fdc_id and `
        dict[i] = `f${i}`
    }
    sql += " ,food"
    sql += where
    for (let i = 0; i < limits.length; i++) {
        sql += `${dict[i]}.nutrient_id = ${limits[i].nutrient_id} and ${dict[i]}.amount < ${limits[i].total_amount} and `
    }
    return sql;
}

exports.entrylist = function (limits, callback) {
    let sql = "SELECT food.food_name FROM food_nutrient as f0"
    sql = build_query(sql, limits);
    sql += "food.id=f0.fdc_id LIMIT 100;"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.listplans = function (callback) {
    let sql = "SELECT food_plan_name, food_plan_description FROM food_plans ORDER BY is_user_created;"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.getnutoffood = function (food_name, callback) {
    let sql = `SELECT nutrient.id, nutrient.name, food_nutrient.amount, nutrient.unit_name FROM food_nutrient, food, nutrient 
                WHERE food_nutrient.fdc_id=food.id and nutrient_id=nutrient.id and food_name=\"${food_name}\";`
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result)
    });
}

exports.selectMax = function (limits, looking_for, callback) {
    let sql = `SELECT food_name FROM food, food_nutrient WHERE food.id=fdc_id and nutrient_id = ${limits[looking_for].nutrient_id} and amount = `
    sql += `(SELECT MAX(f${looking_for}.amount) FROM food_nutrient as f0 `
    sql = build_query(sql, limits);
    sql += "food.id=f0.fdc_id) LIMIT 1;"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.getlimits = function (plan_name, callback) {
    let sql = `SELECT nutrient_id, total_amount FROM food_plan_limits_nutrient WHERE food_plan_name=\'${plan_name}\';`
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.listnutrients = function (callback) {
    let sql = "SELECT name, unit_name FROM nutrient WHERE id<>1003 and id<>1004 and id<>1005 and id<>1008"
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.getdiets = function (username, callback) {
    let sql = `SELECT id, diet_name, from_plan FROM users_diet WHERE user=\'${username}\';`
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.getdietfood = function (diet_id, callback) {
    let sql = `SELECT food_name, counted from food.food, (SELECT id_diet,food_id,COUNT(*) AS counted FROM diet_includes_food GROUP BY id_diet,food_id) 
                as diets WHERE diets.id_diet = \'${diet_id}\' and diets.food_id = food.id;`
    console.log(sql)
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.uploadUserDiet = function (username, diet_name, plan_name, food_list, callback) {
    let sql1 = `INSERT INTO users_diet (user, diet_name, from_plan) VALUES (\'${username}\', \'${diet_name}\', \'${plan_name}\');`
    con.query(sql1, function (err) {
        if (err) callback(err);
    });
    for (let i = 0; i < food_list.length; i++) {
        let food_name = food_list[i];
        let sql2 = "INSERT INTO diet_includes_food (id_diet, food_id)\n" +
            `SELECT users_diet.id, food.id FROM users_diet, food WHERE diet_name=\'${diet_name}\' and food_name=\'${food_name}\';`
        con.query(sql2, function (err) {
            if (err) callback(err);
        });
    }
}

exports.uploadUserPlan = function (plan_name, description, limits_nutrients, callback) {
    let sql1 = `INSERT INTO food_plans (food_plan_name, food_plan_description, is_user_created) VALUES (\'${plan_name}\', \'${description}\', 1);`
    con.query(sql1, function (err) {
        if (err) callback(err);
    });
    for (let i = 0; i < limits_nutrients.length; i++) {
        let nut_name = limits_nutrients[i][0];
        let amount = limits_nutrients[i][1];
        if (amount < 0.01) amount = 0.1;
        let sql2 = "INSERT INTO food.food_plan_limits_nutrient (food_plan_name, nutrient_id, total_amount)\n" +
            `SELECT \'${plan_name}\' ,id, ${amount} FROM nutrient WHERE name=\'${nut_name}\';`
        con.query(sql2, function (err) {
            if (err) callback(err);
        });
    }
}