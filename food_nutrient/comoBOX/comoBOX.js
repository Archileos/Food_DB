$(document).ready(function () {

    $('#done_button').on('click', function () {
        $("#table1").css('visibility', 'visible')
        $("#table2").css('visibility', 'visible')
        $.ajax({
            url: 'http://localhost:8080/list',
            method: 'get',
            success: function (data) {
                if (data.length > 0) {
                    for (let index = 0; index < data.length; index++) {
                        const newRow = $("<tr>");
                        newRow.append('<td> ' + data[index].food_name + '</td>');
                        newRow.append('<td> ' + data[index].amount + '</td>');
                        $("#table1 .tbody").append(newRow);
                        $("#table2 .tbody").append(newRow);
                        newRow.click(function () {
                            let value = ""
                            $(this).children('td').each(function () {
                                value += $(this).html() + " "
                            })
                            alert(value);
                        });
                    }
                }
            },
            error: function () {
                alert('failed')
            }
        })
    })
});

