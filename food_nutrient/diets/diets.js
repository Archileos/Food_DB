$(document).ready(function () {

    /*
    * This code is present at the start of every js file, and is intended to handle loading.
    */
    $(document).ajaxStart(function () {
        $(document.body).css({'cursor': 'wait'});
        $(document.body).prepend($("<div id=\"loading-overlay\">"));
    }).ajaxStop(function () {
        $(document.body).css({'cursor': 'default'});
        $(document.body).find("#loading-overlay").remove();
    });

    let diet = '';
    let plan = '';

    /*
     * If user has arrived to this point without a login, they will be redirected back to login.
     */
    if (sessionStorage.getItem("user") === null) {
        window.location.href = "http://localhost:8080/";
    }

    /*
     * Before the screen loads, insert usage statistics into the page to make it more lively.
     */
    $.ajax({
        url: 'http://localhost:8080/dietStats',
        method: 'get',
        success: function (data) {
            $("#stats0").text("Few important indices about the Whole site:");
            $("#stats").text("- The plan that contains the most amount of diets: " + data[0].from_plan + " (" + data[0].num + ")");
            $("#stats2").text("- The plan that contains the least amount of diets: " + data[1].from_plan + " (" + data[1].num + ")");
        },
        error: function () {
            alert("Failed to load stats");
        }
    })

    /*
     * This function writes nutrient data as a neat hover pop-up.
     */
    function write_elms(nutrient_data) {
        let result = "";
        for (let i = 0; i < nutrient_data.length; i++) {
            result += nutrient_data[i].name + " " + nutrient_data[i].amount + " " + nutrient_data[i].unit_name + "<br>";
        }
        return result;
    }

    /*
     * This function finds the index in data that contains all gives parameters.
     */
    function findIndex(data, diet, plan) {
        for (let index = 0; index < data.length; index++) {
            if (data[index].diet_name === diet && data[index].from_plan === plan)
                return index;
        }
        return -1;
    }

    /*
     * This sequence of post calls is responsible for the entire visual functionality of the tables on the screen.
     */
    $.ajax({
        url: 'http://localhost:8080/getDiets',
        method: 'post',
        contentType: "application/json",
        data: JSON.stringify({'user_name': sessionStorage["user"]}),
        success: function (data) {
            if (data.length > 0) {
                for (let i = 0; i < data.length; i++) {
                    const newRow = $("<tr>");
                    let diet_name = '<p class="diet">' + data[i].diet_name + '</p>';
                    let from_plan = '<p class="plan">' + data[i].from_plan + '</p>';
                    newRow.append('<td> ' + diet_name + '</td>');
                    newRow.append('<td> ' + from_plan + '</td>');
                    $("#table tbody").append(newRow);
                    newRow.on("click", function () {
                        let table3 = $("#table3")
                        table3.find('tbody').detach()
                        table3.append($('<tbody>'));
                        table3.css('visibility', 'visible')
                        $('#table tr').each(function () {
                            $(this).css('backgroundColor', '')
                            $(this).removeClass('selected');
                        })
                        $(this).css('backgroundColor', 'yellow')
                        $(this).addClass('selected');
                        diet = $(this).find(".diet").text();
                        plan = $(this).find(".plan").text();
                        let json = {'diet_name': data[findIndex(data, diet, plan)].diet_name, user_name: sessionStorage["user"]}
                        $.ajax({
                            url: 'http://localhost:8080/getDietFood',
                            method: 'post',
                            contentType: "application/json",
                            data: JSON.stringify(json),
                            success: function (data) {
                                if (data.length > 0) {
                                    for (let j = 0; j < data.length; j++) {
                                        const newRow = $("<tr>");
                                        let food_name = '<p class="diet">' + data[j].food_name + '</p>';
                                        let amount = '<p class="amount">' + data[j].counted * 100 + '</p>';
                                        let json = {'food_name': data[j].food_name}
                                        $.ajax({
                                            url: 'http://localhost:8080/getnutoffood',
                                            contentType: "application/json",
                                            method: 'post',
                                            data: JSON.stringify(json),
                                            success: function (data) {
                                                let tooltip = '<span class="tooltiptext2">' + write_elms(data) + '</span>';
                                                newRow.append('<td class="tooltip"> ' + food_name + tooltip + '</td>');
                                                newRow.append('<td> ' + amount + '</td>');
                                                $("#table3").append(newRow)
                                            }
                                        })
                                    }
                                }
                            },
                            error: function () {
                                alert("Failed to load food of diet")
                            }
                        })
                    });
                }
            }
        },
        error: function () {
            alert('Failed to load diets')
        }
    })

    /*
     * Call comobox screen on create mode.
     */
    $('#create_diet_button').on('click', function () {
        sessionStorage.removeItem("diet");
        sessionStorage.removeItem("plan");
        window.location.href = "http://localhost:8080/comoBOX.html";
    })
    /*
     * Call comobox screen on update mode.
     */
    $('#update_diet_button').on('click', function () {
        sessionStorage["diet"] = diet;
        sessionStorage["plan"] = plan;
        window.location.href = "http://localhost:8080/comoBOX.html";
    })
})
;