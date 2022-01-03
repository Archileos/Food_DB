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
    let sql = "select food.food_name from food_nutrient as f0"
    let where = " where "
    let dict = {0: 'f0'}
    for (let i = 1; i < limits.length; i++) {
        sql += ` join food_nutrient as f${i}`
        where += `f0.fdc_id=f${i}.fdc_id and `
        dict[i] = `f${i}`
    }
    sql += " ,food"
    sql += where
    for (let i = 0; i < limits.length; i++) {
        sql += `${dict[i]}.nutrient_id = ${limits[i].nutrient_id} and ${dict[i]}.amount < ${limits[i].total_amount} and `
    }
    sql += "food.id=f0.fdc_id limit 100;"
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

exports.getnutoffood = function (food_name, callback) {
    let sql = `select nutrient.id, nutrient.name, food_nutrient.amount, nutrient.unit_name from food_nutrient, food, nutrient where food_nutrient.fdc_id=food.id and nutrient_id=nutrient.id and food_name=\"${food_name}\";`
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result)
    });
}

// function selectMax(limits, looking_for, callback) {
//     let sql = `select food_name from food, food_nutrient where food.id=fdc_id and nutrient_id = ${limits[looking_for].nutrient_id} and amount = `
//     sql += `(select MAX(f${looking_for}.amount) from food_nutrient as f0`
//     let where = " where "
//     let dict = {0: 'f0'}
//     for (let i = 1; i < limits.length; i++) {
//         sql += ` join food_nutrient as f${i}`
//         where += `f0.fdc_id=f${i}.fdc_id and `
//         dict[i] = `f${i}`
//     }
//     sql += " ,food"
//     sql += where
//     for (let i = 0; i < limits.length; i++) {
//         sql += `${dict[i]}.nutrient_id = ${limits[i].nutrient_id} and ${dict[i]}.amount < ${limits[i].total_amount} and `
//     }
//     sql += "food.id=f0.fdc_id) limit 1;"
//     con.query(sql, function (err, result) {
//         if (err) callback(err, null);
//         else callback(null, result);
//     });
// }

// exports.fill = function (limits, callback) {
//     let food_list = [];
//     let looking_for = 0;
//     for (let i = 0; i < limits.length; i++) {
//         if (limits[i].total_amount < 0.01) {
//             callback(null, food_list);
//             return;
//         }
//         for (let j = 0; j < limits.length; j++) {
//             if (limits[j].total_amount > limits[looking_for].total_amount) {
//                 looking_for = j;
//             }
//         }
//         selectMax(limits, looking_for, function (err, result) {
//             console.log(result);
//             if (err) callback(err, null);
//             else{
//                 food_list.push(result.food_name);
//                 getnutoffood(food_list[food_list.length - 1], function (err, result) {
//                     console.log(result);
//                     if (err) callback(err, null);
//                     else{
//                         for (let j = 0; j < limits.length; j++) {
//                             for (let i = 0; i < result.length; i++) {
//                                 if (limits[j].nutrient_id === result[i].id) {
//                                     limits[j].total_amount -= result[i].amount;
//                                 }
//                             }
//                         }
//                     }
//                 })
//             }
//         })
//         console.log(food_list)
//         console.log(limits)
//     }
// }

exports.getlimits = function (plan_name, callback) {
    let sql = `select nutrient_id, total_amount from food_plan_limits_nutrient where food_plan_name=\'${plan_name}\';`
    con.query(sql, function (err, result) {
        if (err) callback(err, null);
        else callback(null, result);
    });
}

exports.listnutrients = function (callback) {
    let sql = "select name, unit_name from nutrient where id<>1003 and id<>1004 and id<>1005 and id<>1008"
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
        if (amount < 0.01) amount = 0.1;
        let sql2 = "INSERT INTO food.food_plan_limits_nutrient (food_plan_name, nutrient_id, total_amount)\n" +
            `select \'${plan_name}\' ,id, ${amount} from nutrient where name=\'${nut_name}\';`
        con.query(sql2, function (err) {
            if (err) callback(err);
        });
    }
}