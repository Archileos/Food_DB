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

    /*
     * Identify on what mode we are.
     */
    let mode = (sessionStorage.getItem("diet") === null) ? 'create' : 'update';
    let curr_limits = {};

    /*
     * If user has arrived to this point without a login, they will be redirected back to login.
     */
    if (sessionStorage.getItem("user") === null) {
        window.location.href = "http://localhost:8080/";
    }

    /*
     * As the screen loads, load in the available plans and handle according to the mode we are on.
     */
    $.ajax({
        url: 'http://localhost:8080/foodPlans',
        method: 'get',
        success: function (data) {
            if (data.length > 0) {
                let format = $('#format')
                for (let index = 0; index < data.length; index++) {
                    const newPlan = $('<option value=\'' + data[index].food_plan_name + '\'>' + data[index].food_plan_name + '</option>');
                    format.append(newPlan);
                }
                format.on('change', function () {
                    alert(data.find(({food_plan_name}) => food_plan_name === $(this).val()).food_plan_description)
                });
                executeAfter();
            }
        },
        error: function () {
            alert('Failed to load plans')
        }
    })

    /*
     * If we are on create mode a pop-up dialog will be added, on update mode it'll be replaced by finish updating button.
     */
    function executeAfter() {
        if (mode === 'create') {
            let newDiv = $("<div id=\"dialog\">");
            $(document.body).append(newDiv);
            $("#name_diet").val("Name your diet");
            $("#demoObject").text("Choose a diet plan");
            $('#name_diet').on('click', function () {
                newDiv.append("<input type=\"text\" id=\"diet_name\" style=\"display: inline-block;\">").dialog(opt).dialog('open');
            });
        }
        else {
            $("#name_diet").val("Finish updating");
            $("#demoObject").text("Alter your diet plan");
            $('#format').val(sessionStorage["plan"]).change();
            create_ui(sessionStorage["plan"]);
            let json = {'diet_name': sessionStorage["diet"], 'user_name': sessionStorage["user"]}
            $.ajax({
                url: 'http://localhost:8080/getDietFood',
                method: 'post',
                contentType: "application/json",
                data: JSON.stringify(json),
                success: function (data) {
                    if (data.length > 0) {
                        for (let j = 0; j < data.length; j++) {
                            for (let i = 0; i < data[j].counted; i++)
                                select_food(data[j].food_name, curr_limits);
                        }
                    }
                },
                error: function () {
                    alert("Failed to load food of diet")
                }
            });
            // Handle switching of diet plan while updating.
            $('#name_diet').on('click', function () {
                let data = {'diet_name': sessionStorage["diet"], 'user_name': sessionStorage["user"]};
                $.ajax({
                    url: 'http://localhost:8080/delete',
                    contentType: "application/json",
                    method: 'post',
                    data: JSON.stringify(data),
                    error: function () {
                        alert('failed')
                    },
                    success: function () {
                        let chosen_foods = [];
                        getChosenFoods(chosen_foods);
                        data = {
                            'diet_name': sessionStorage["diet"],
                            'user_name': sessionStorage["user"],
                            'chosen_foods': chosen_foods
                        };
                        $.ajax({
                            url: 'http://localhost:8080/insert',
                            contentType: "application/json",
                            method: 'post',
                            data: JSON.stringify(data),
                            error: function () {
                                alert('failed')
                            }
                        });
                        window.location.href = "http://localhost:8080/diets.html";
                    }
                });
            });
        }
    }

    /*
     * Check if any of the limits have been reached.
     */
    function verify_limits(limits) {
        for (let i = 0; i < limits.length; i++) {
            if (limits[i].total_amount < 0.01)
                return false;
        }
        return true;
    }

    /*
     * Find the nutrient with the largest limit allowance.
     */
    function find_max_nutrient(limits) {
        let max = 0;
        let looking_for = 0;
        for (let i = 0; i < limits.length; i++) {
            if (limits[i].total_amount > max) {
                max = limits[i].total_amount;
                looking_for = i;
            }
        }
        return looking_for;
    }

    /*
     * Reduce limits according to a chosen food.
     */
    function reduce_limits(limits, nutrient_data) {
        for (let j = 0; j < limits.length; j++) {
            for (let i = 0; i < nutrient_data.length; i++) {
                if (limits[j].nutrient_id === nutrient_data[i].id) {
                    limits[j].total_amount -= nutrient_data[i].amount;
                }
            }
        }
        return limits;
    }

    /*
     * Increase limits according to a chosen food.
     */
    function increase_limits(limits, nutrient_data) {
        for (let j = 0; j < limits.length; j++) {
            for (let i = 0; i < nutrient_data.length; i++) {
                if (limits[j].nutrient_id === nutrient_data[i].id) {
                    limits[j].total_amount += nutrient_data[i].amount;
                }
            }
        }
        return limits;
    }

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
    * Handle food selection visually as well as physically in mysql using post requests.
    */

    let selected_foods = {};

    function select_food(food, limits) {
        let data = {'food_name': food}
        $.ajax({
            url: 'http://localhost:8080/getnutoffood',
            contentType: "application/json",
            method: 'post',
            data: JSON.stringify(data),
            success: function (data) {
                curr_limits = reduce_limits(limits, data);
                if (selected_foods.hasOwnProperty(food) && selected_foods[food] > 0) {
                    selected_foods[food]++;
                    let amount = selected_foods[food] * 100;
                    $("#table2 tbody tr").each(function () {
                        if ($(this).find(".text").text() === food) {
                            $(this).find(".amount").text(amount);
                            return false;
                        }
                    })
                } else {
                    const cloneRow = $("<tr>");
                    selected_foods[food] = 1;
                    let food_name = '<p class="text">' + food + '</p>';
                    let tooltip = '<span class="tooltiptext2">' + write_elms(data) + '</span>';
                    cloneRow.append('<td class="tooltip"> ' + food_name + tooltip + '</td>');
                    cloneRow.append('<td class="amount">' + 100 + '</td>');
                    $("#table2 tbody").append(cloneRow);
                    cloneRow.on("click", function () {
                        let food = $(this).find(' .text').text();
                        if (selected_foods[food] === 1) {
                            $(this).remove();
                        } else {
                            $(this).find(' .amount').text(selected_foods[food] * 100 - 100);
                        }
                        selected_foods[food] -= 1;
                        curr_limits = increase_limits(curr_limits, data);
                        create_table(curr_limits);
                    });
                }
                create_table(curr_limits);
            },
            error: function () {
                alert('failed');
            }
        })
    }

    /*
     * Handle table creation using provided limits and calls to get additional data.
     */
    function create_table(limits) {
        let table1 = $("#table1");
        let forward = $("#forward");
        forward.off("click");
        let backward = $("#backward");
        backward.off("click");
        if (verify_limits(limits)) {
            let data = {'limits': limits};
            $.ajax({
                url: 'http://localhost:8080/getTable',
                contentType: "application/json",
                method: 'post',
                data: JSON.stringify(data),
                success: function (data) {
                    if (data.length > 0) {
                        let num_tbody = Math.ceil(data.length / 20)
                        table1.find('tbody').detach();
                        for (let i = 0; i < num_tbody; i++) {
                            const newTbody = $("<tbody id=\'tbody" + i + "\'>");
                            table1.append(newTbody)
                            newTbody.hide();
                            for (let index = 0; index < 20; index++) {
                                let food = data[index + i * 20].food_name;
                                const newRow = $("<tr>");
                                let food_name = '<p class="text">' + food + '</p>';
                                newRow.append('<td>' + food_name + '</td>');
                                $("#table1 #tbody" + i).append(newRow);
                                newRow.on("click", function () {
                                    let food = $(this).find(' .text').text();
                                    select_food(food, curr_limits);
                                });
                            }
                        }
                        let index_on = 0;
                        $("#table1 #tbody" + index_on).show();
                        forward.click(function () {
                            if (index_on < num_tbody - 1) {
                                $("#table1 #tbody" + index_on).hide();
                                index_on++;
                                $("#table1 #tbody" + index_on).show();
                            }
                        });
                        backward.click(function () {
                            if (index_on > 0) {
                                $("#table1 #tbody" + index_on).hide();
                                index_on--;
                                $("#table1 #tbody" + index_on).show();
                            }
                        });
                    }
                },
                error: function () {
                    alert('failed');
                }
            });
        } else {
            table1.find('tbody').detach();
            table1.append($('<tbody>'));
        }
    }

    /*
     * Enable most of the visual aspects on screen.
     */
    function create_ui(plan) {
        let table2 = $("#table2");
        $("#table1").css('visibility', 'visible')
        table2.css('visibility', 'visible')
        $("#name_diet").css('visibility', 'visible')
        $("#complete").css('visibility', 'visible')
        $("#p11").css('visibility', 'visible')
        $("#p12").css('visibility', 'visible')
        table2.find('tbody').detach()
        table2.append($('<tbody>'));
        let data = {plan_name: plan}
        $.ajax({
            url: 'http://localhost:8080/getLimits',
            contentType: "application/json",
            method: 'post',
            data: JSON.stringify(data),
            success: function (data) {
                if (data.length > 0) {
                    curr_limits = data;
                    create_table(curr_limits);
                }
            },
            error: function () {
                alert('failed')
            }
        });
    }

    /*
     * Done button handling in accordance with the given mode.
     */
    let done = $('#done_button')
    done.off('click');
    done.on('click', function () {
        let selected = $('#format').find(":selected").val()
        if (mode === 'update') {
            let data = {'diet_name': sessionStorage["diet"], 'user_name': sessionStorage["user"]};
            $.ajax({
                url: 'http://localhost:8080/delete',
                contentType: "application/json",
                method: 'post',
                data: JSON.stringify(data),
                error: function () {
                    alert('failed')
                },
                success: function () {
                    data = {'user_name': sessionStorage["user"],'diet_name': sessionStorage["diet"] ,'plan_name': selected};
                    $.ajax({
                        url: 'http://localhost:8080/update',
                        contentType: "application/json",
                        method: 'post',
                        data: JSON.stringify(data),
                        error: function () {
                            alert('failed')
                        }
                    });
                    selected_foods = [];
                    create_ui(selected);
                }
            });
        } else if (selected === 'Choose a diet plan') {
                alert("Please choose a plan")
                return false;
        } else {
            create_ui(selected);
        }
    })

    /*
     * Complete for me button handling.
     */
    $("#complete").on('click', function () {
        if (verify_limits(curr_limits)) {
            let data = {'limits': curr_limits, 'max_nutrient': find_max_nutrient(curr_limits)};
            $.ajax({
                url: 'http://localhost:8080/complete',
                contentType: "application/json",
                method: 'post',
                data: JSON.stringify(data),
                success: function (data) {
                    if (data.length > 0) {
                        let food = data[0].food_name;
                        select_food(food, curr_limits);
                    }
                },
                error: function () {
                    alert('failed')
                }
            });
        }
    })

    /*
     * This function returns all the foods that have been chosen by the user.
     */
    function getChosenFoods(chosen_foods) {
        $("#table2 tbody tr").each(function () {
            if ($(this).find(".amount").text() > 100) {
                for (let i = 0; i < $(this).find(".amount").text() / 100; i++) {
                    chosen_foods.push($(this).find(".text").text());
                }
            } else {
                chosen_foods.push($(this).find(".text").text());
            }
        })
    }

    // Dialog settings.
    let opt = ({
        modal: true,
        autoOpen: false,
        title: "Name your diet",
        buttons: {
            "Done": function () {
                let diet_name = $('#diet_name').val();
                if(diet_name === '') {
                    alert("Please give your diet a name")
                } else {
                    let chosen_foods = [];
                    getChosenFoods(chosen_foods);
                    let data = {
                        'user': sessionStorage["user"],
                        'diet_name': diet_name,
                        'food_plan': $('#format').find(":selected").val(),
                        'chosen_foods': chosen_foods
                    };
                    $.ajax({
                        url: 'http://localhost:8080/uploadDiet',
                        method: 'post',
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        error: function () {
                            alert("Failed to create your diet");
                        }
                    })
                    $(this).dialog("close");
                    window.location.href = "http://localhost:8080/diets.html";
                }
            }
        }
    });

    // If a user wishes to create their own plan, they'll be redirected to plan create.
    $('#create_button').on('click', function () {
        window.location.href = "http://localhost:8080/plan_create.html";
    })
});
