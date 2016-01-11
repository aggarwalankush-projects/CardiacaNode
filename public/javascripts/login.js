// setting notify theme
PNotify.prototype.options.styling = "fontawesome";

var $addAlert=$('#addAlert');

//clear modal
$('#addUserModal').on('hidden.bs.modal', function () {
    $(this).find('form')[0].reset();
    $addAlert.hide();
});


//add new user
$("#addUserForm").submit(function (e) {
    e.preventDefault();
    document.getElementById("addUserBtn").disabled = true;
    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: $(this).serialize(),
        success: function (data) {
            if (data.isSuccess) {
                $('#addUserModal').modal('hide');
                new PNotify({
                    title: 'Success',
                    text: data.info,
                    type: 'success',
                    delay: 2000
                });
            } else {
                $addAlert.html(data.info);
                $addAlert.show();
            }
            document.getElementById("addUserBtn").disabled = false;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

});

var rowIndex;
var role;
var name;
var action;

$("button").click(function () {
    action = $(this).val();
});

//edit user details
$("#editUserForm").submit(function (e) {
    e.preventDefault();
    document.getElementById("updateUserBtn").disabled = true;
    document.getElementById("deleteUserBtn").disabled = true;
    var $table = $('#usersTable');

    var serializeForm = $(this).serializeArray();
    var dataToSend = {
        action: action,
        username: name
    };
    for (var i = 0; i < serializeForm.length; i++) {
        var obj = serializeForm[i];
        dataToSend[obj.name] = obj.value;
    }
    dataToSend.action = action;
    dataToSend.username = name;

    $.ajax({
        type: "POST",
        url: $(this).attr('action'),
        data: dataToSend,
        success: function (data) {
            if (data.isSuccess) {
                $table.bootstrapTable('updateRow', {
                    index: rowIndex - 1,
                    row: {
                        username: name,
                        role: data.role
                    }
                });
                if (action === 'delete') {
                    console.log('inside delete');
                    $table.bootstrapTable('remove', {
                        field: 'username',
                        values: [name]
                    });
                }
                $('#editUserModal').modal('hide');
                new PNotify({
                    title: 'Success',
                    text: data.info,
                    type: 'success',
                    delay: 2000
                });
            } else {
                console.log(data);
            }
            document.getElementById("updateUserBtn").disabled = false;
            document.getElementById("deleteUserBtn").disabled = false;
        },
        error: function (jqXHR, textStatus, errorThrown) {
            console.log(jqXHR);
            console.log(textStatus);
            console.log(errorThrown);
        }
    });

});


$('#usersTable').find('tbody').on('click', 'tr', function () {
    rowIndex = this.rowIndex;
    name = $('td', this).eq(0).text();
    role = $('td', this).eq(1).text();
    console.log(name + " " + role);
    $('#uname').val(name);
    $('#pass').val('');
    $("#" + role).prop("checked", true);
});


// handle manager users dropdown
$(function () {
    $(".dropdown").hover(
        function () {
            $('.dropdown-menu', this).stop(true, true).fadeIn("fast");
            $(this).toggleClass('open');
            $('b', this).toggleClass("caret caret-up");
        },
        function () {
            $('.dropdown-menu', this).stop(true, true).fadeOut("slow");
            $(this).toggleClass('open');
            $('b', this).toggleClass("caret caret-up");
        });
});
