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
     * If user has arrived to this point without a login, they will be redirected back to login
     */
    if (sessionStorage.getItem("user") === null) {
        window.location.href = "http://localhost:8080/";
    }

    /*
     * Handle click on advanced, this will give the full list of nutrients and not just the 4 presented, cannot be
     * clicked twice.
     */
    let advanced_clicked = false;
    let loaded = false;

    $('#Advanced_button').on("click", function () {
        if(!loaded) {
            loaded = true;
            $.ajax({
                url: 'http://localhost:8080/nutrients',
                method: 'get',
                success: function (data) {
                    let ul_num = Math.ceil(data.length / 32)
                    if (data.length > 0) {
                        for (let index = 0; index < ul_num; index++) {
                            $("#div1").append($("<ul2 id=\'ul2" + index + "\' style=\"display:\" inline-block; width:60px\">"));
                            let newUl = $("#div1 #ul2" + index);
                            newUl.hide()
                            for (let jndex = 0; jndex < 32 && (index * 32 + jndex) < data.length; jndex++) {
                                const newList = $("<li1>");
                                newList.append('<input type="checkbox" name="myCheckbox">');
                                let place = jndex + index * 32;
                                let food_name = "<p class=\"text\" style=\"display:inline\">" + data[place].name + "</p>";
                                newList.append(food_name + " " + data[place].unit_name);
                                newList.append(' <input type="number" style="display: inline-block; width:60px">');
                                newUl.append(newList);
                            }
                        }
                    }
                    let index_on = 0
                    $("#div1 #ul2" + index_on).show();
                    $("#forward").click(function () {
                        if (index_on < ul_num - 1) {
                            $("#div1 #ul2" + index_on).hide()
                            index_on++
                            $("#div1 #ul2" + index_on).show()
                        }
                    });
                    $("#backward").click(function () {
                        if (index_on > 0) {
                            $("#div1 #ul2" + index_on).hide()
                            index_on--
                            $("#div1 #ul2" + index_on).show()
                        }
                    });
                },
                error: function () {
                    alert('failed')
                }
            })
        }
        if(advanced_clicked) {
            advanced_clicked = false;
            $("#div1").css('visibility', 'hidden')
            $("#links").css('visibility', 'hidden')
        }
        else {
            advanced_clicked = true;
            $("#div1").css('visibility', 'visible')
            $("#links").css('visibility', 'visible')
        }
    });

    /*
     * Dialog that opens when the user finished creating their plan, allows the user to name their plan and describe it.
     */
    $('#dialog').dialog({
        modal: true,
        autoOpen: false,
        title: "Plan details",
        buttons: {
            "Done": function () {
                let checked = []
                let send = true
                $("#div0").children('ul').children('li').each(function () {
                    if ($(this).children()[0].checked) {
                        if ($(this).children()[2].value.length > 0) {
                            checked.push([$(this).find(".text").text(), $(this).children()[2].value])
                        } else {
                            alert("Please fill the limit of " + $(this).find(".text").text())
                            $('#dialog').dialog("close");
                            send = false;
                        }
                    }
                })
                $("#div1").children('ul2').children('li1').each(function () {
                    if ($(this).children()[0].checked) {
                        if ($(this).children()[2].value.length > 0) {
                            checked.push([$(this).find(".text").text(), $(this).children()[2].value])
                        } else {
                            alert("Please fill the limit of " + $(this).find(".text").text())
                            $('#dialog').dialog("close");
                            send = false;
                        }
                    }
                })
                if(checked.length === 0) {
                    alert("Please choose a nutrient")
                    send = false;
                }
                if (send) {
                    let data = {
                        plan_name: $('#plan_name').val(),
                        description: $('#description_name').val(),
                        limits_nutrient: checked
                    }
                    $.ajax({
                        url: 'http://localhost:8080/uploadPlan',
                        method: 'post',
                        contentType: "application/json",
                        data: JSON.stringify(data),
                        error: function () {
                            alert("Failed to create your plan, please try again");
                        }
                    });
                    $(this).dialog('close');
                    // In the end the user is redirected back to the comobox screen.
                    window.location.href = "http://localhost:8080/comoBOX.html";
                }
            }
        }
    })

    // When done is clicked open the above dialog.
    $('#done').click(function () {
        $("#dialog").dialog('open');
    })
});