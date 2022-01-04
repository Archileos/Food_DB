$(document).ready(function () {

    let selected_foods = {};
    let curr_limits = {};

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
            }
        },
        error: function () {
            alert('Failed to load plans')
        }
    })

    function verify_limits(limits) {
        for (let i = 0; i < limits.length; i++) {
            if (limits[i].total_amount < 0.01)
                return false;
        }
        return true;
    }

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

    function write_elms(nutrient_data) {
        let result = "";
        for (let i = 0; i < nutrient_data.length; i++) {
            result += nutrient_data[i].name + " " + nutrient_data[i].amount + " " + nutrient_data[i].unit_name + "<br>";
        }
        return result;
    }

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

    function create_table(limits) {
        let table1 = $("#table1");
        let forward = $("#forward");
        forward.off("click");
        let backward = $("#backward");
        backward.off("click");
        console.log(limits);
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
                                console.log(index_on);
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

    $('#done_button').on('click', function () {
        let table2 = $("#table2");
        $("#table1").css('visibility', 'visible')
        table2.css('visibility', 'visible')
        $("#name_diet").css('visibility', 'visible')
        $("#complete").css('visibility', 'visible')
        $("#p11").css('visibility', 'visible')
        $("#p12").css('visibility', 'visible')
        table2.find('tbody').detach()
        table2.append($('<tbody>'));
        let data = {plan_name: $('#format').find(":selected").val()}
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
        })
    })

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
                        console.log(data);
                        let food = data[0].food_name;
                        select_food(food, curr_limits);
                    }
                },
                error: function () {
                    alert('failed')
                }
            })
        }
    })

    $('#dialog').dialog({
        modal: true,
        autoOpen: false,
        title: "Name your diet",
        buttons: {
            "Done": function () {
                alert($('#diet_name').val())
                $(this).dialog("close");
            }
        }
    });

    $('#name_diet').on('click', function () {
        $("#dialog").dialog('open');
    });

    $('#create_button').on('click', function () {
        window.location.href = "http://localhost:8080/plan_create.html";
    })
});
