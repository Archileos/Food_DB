$(document).ready(function () {

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
                    alert(data.find(({ food_plan_name }) => food_plan_name === $(this).val()).food_plan_description)
                });
            }
        },
        error: function () {
            alert('Failed to load plans')
        }
    })

    function update_limits(food) {

    }
    
    function create_table(limits) {
        let data = {limits: limits}
        $.ajax({
            url: 'http://localhost:8080/getTable',
            contentType: "application/json",
            method: 'post',
            data: JSON.stringify(data),
            success: function (data) {
                if (data.length > 0) {
                    for (let index = 0; index < data.length; index++) {
                        const newRow = $("<tr>");
                        newRow.append('<td class="tooltip"><p class="text">' + data[index].food_name + '</p><span class="tooltiptext">' + 'TEXT' + '</span>'+ '</td>');
                        $("#table1 tbody").append(newRow);
                        newRow.on("click", function () {
                            const cloneRow = $("<tr>");
                            cloneRow.append('<td class="tooltip"> ' + $(this).find(' .text').text() +'<span class="tooltiptext2">' + 'TEXT' + '</span>'+ '</td>');
                            $("#table2 tbody").append(cloneRow)
                            cloneRow.on("click", function () {
                                $(this).remove()
                            });
                        });
                    }
                }
            },
            error: function () {
                alert('failed')
            }
        })
    }

    $('#done_button').on('click', function () {
        $("#table1").css('visibility', 'visible')
        $("#table2").css('visibility', 'visible')
        $("#name_diet").css('visibility', 'visible')
        $("#complete").css('visibility', 'visible')
        $("#p11").css('visibility', 'visible')
        let data = {plan_name: $('#format').find(":selected").val()}
        console.log(data)
        $.ajax({
            url: 'http://localhost:8080/getLimits',
            contentType: "application/json",
            method: 'post',
            data: JSON.stringify(data),
            success: function (data) {
                if (data.length > 0) {
                    create_table(data)
                }
            },
            error: function () {
                alert('failed')
            }
        })
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
        window.location.href="http://localhost:8080/plan_create.html";
    })
});
