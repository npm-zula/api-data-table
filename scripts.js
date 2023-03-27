$(document).ready(function () {
    fetchData()
});

$(document).ready(function () {
    $('#myForm').submit(function (event) {
        event.preventDefault();

        var name = $('#name').val();
        var username = $('#username').val();
        var email = $('#email').val();
        var phone = $('#phone').val();
        var website = $('#website').val();

        if (name === '') {
            alert('Please enter your name.');
        } else if (username === '') {
            alert('Please enter your username.');
        } else if (!isValidEmail(email)) {
            alert('Please enter a valid email address.');
        } else if (phone === '') {
            alert('Please enter a valid 10-digit phone number.');
        } else if (website === '') {
            alert('Please enter a valid website URL.');
        } else {
            // SUBMIT
            var user = {
                name: name,
                username: username,
                email: email,
                phone: phone,
                website: website
            };
            $.ajax({
                type: 'POST',
                url: 'https://jsonplaceholder.typicode.com/users',
                data: user,
                success: function (response) {
                    // append the table with the response data
                    var newRow = '<tr><td>' + response.id + '</td><td>' + response.name + '</td><td>' + response.username + '</td><td>' + response.email + '</td><td>' + response.phone + '</td><td>' + response.website + '</td><td><button class="btn btn-dark btn-sm delete-btn" data-id=' + response.id + '>Delete</button></td></tr>';
                    // $("<td></td>").append("<button class='btn btn-dark btn-sm delete-btn' data-id='" + value.id + "' '>Delete</button>").appendTo(newRow);
                    $('#table-body').append(newRow);

                    // reset the form
                    $('#myForm')[0].reset();

                    // $(".delete-btn").click(function () {
                    //     var id = $(this).data("id");
                    //     console.log(id)
                    //     deleteRecord(id, response);
                    // });
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error submitting form: ' + textStatus + ' - ' + errorThrown);
                }
            });

        }
    });

    // add click event listener to delete buttons
    $(document).on('click', '.delete-btn', function () {
        var confirmDelete = confirm("Are you sure you want to delete this record?");
        var row = $(this).closest('tr');
        var userId = row.index() + 1; // get user ID from row index (add 1 because table indices start at 0)
        if (confirmDelete) {
            $.ajax({
                type: 'DELETE',
                url: 'https://jsonplaceholder.typicode.com/users/' + userId,
                success: function () {
                    row.remove(); // remove row from table on success
                },
                error: function (jqXHR, textStatus, errorThrown) {
                    alert('Error deleting user: ' + textStatus + ' - ' + errorThrown);
                }
            });
        }
    });


    function isValidEmail(email) {
        var emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return emailPattern.test(email);
    }

    function isValidPhoneNumber(phone) {
        var phoneNumberPattern = /^\d{10}$/;
        return phoneNumberPattern.test(phone);
    }

    function isValidWebsite(website) {
        var websitePattern = /^(http|https):\/\/[^ "]+$/;
        return websitePattern.test(website);
    }
});


// toggle form on button click
$("#show-form").click(function () {
    $("#form-container").slideToggle();
    $(this).text(function (i, text) {
        return text === "Show Form" ? "Hide Form" : "Show Form";
    });
});




var sortedColumn = null;
var sortOrder = -1;

function sortTable(column, data) {
    sortedColumn = column;
    sortOrder = -sortOrder;
    data.sort(function (a, b) {
        var comparison = 0;
        if (a[column] > b[column]) {
            comparison = 1;
        } else if (a[column] < b[column]) {
            comparison = -1;
        }
        return sortOrder * comparison;
    });
}

function populateTable(data) {
    $("#table-body").empty();

    $.each(data, function (index, value) {
        var row = $("<tr>");
        $("<td></td>").text(value.id).appendTo(row);
        $("<td></td>").text(value.name).appendTo(row);
        $("<td></td>").text(value.username).appendTo(row);
        $("<td></td>").text(value.email).appendTo(row);
        $("<td></td>").text(value.phone).appendTo(row);
        $("<td></td>").text(value.website).appendTo(row);
        $("<td></td>").append("<button class='btn btn-dark btn-sm delete-btn' data-id='" + value.id + "' '>Delete</button>").appendTo(row);
        $("<td></td>").append("<button class='btn btn-success btn-sm edit-btn' data-id='" + value.id + "' '>Edit</button>").appendTo(row);
        $("#table-body").append(row);
    });

    $(".delete-btn").click(function () {
        var id = $(this).data("id");
        deleteRecord(id, data);
    });

    // // toggle form on button click
    // $(".edit-btn").click(function () {
    //     // $("#form-container-update").slideToggle();
    //     handleEditClick

    // });

    // $(".edit-btn").click(function () {
    //     var id = $(this).data("id");
    //     editRecord(id, data);
    // });

    $(document).on("click", ".edit-btn", handleEditClick);
    
}

$("#myForm-update").on("submit", handleEditSubmit);

function handleEditSubmit(event) {
    event.preventDefault();
    var formData = $(this).serialize();
    var id = $(this).find("input[name='id']").val();
    var url = "https://jsonplaceholder.typicode.com/users/" + id;

    $.ajax({
        url: url,
        type: "PUT",
        data: formData,
        success: function (data) {
            updateRowData(id, data);
            $("#myForm-update").slideToggle()
        },
        error: function () {
            alert("Failed to update data");
        }
    });
}

// function to update row data with new values
function updateRowData(id, data) {
    var row = $("button.edit-btn[data-id='" + id + "']").closest("tr");
    row.find("td:nth-child(2)").text(data.name);
    row.find("td:nth-child(3)").text(data.username);
    row.find("td:nth-child(4)").text(data.email);
    row.find("td:nth-child(5)").text(data.phone);
    row.find("td:nth-child(6)").text(data.website);
}



// function to handle edit button click event
function handleEditClick(event) {
    var id = $(this).data("id");
    var row = $(this).closest("tr");
    var name = row.find("td:nth-child(2)").text();
    var username = row.find("td:nth-child(3)").text();
    var email = row.find("td:nth-child(4)").text();
    var phone = row.find("td:nth-child(5)").text();
    var website = row.find("td:nth-child(6)").text();

    // fill form fields with row data
    $("#form-container-update input[name='id']").val(id);
    $("#form-container-update input[name='name']").val(name);
    $("#form-container-update input[name='username']").val(username);
    $("#form-container-update input[name='email']").val(email);
    $("#form-container-update input[name='phone']").val(phone);
    $("#form-container-update input[name='website']").val(website);

    // $("#form-container-update").submit(function (event) {
    //     event.preventDefault();
    //     handleEditSubmit(id);
    // });

    // show edit form
    $("#form-container-update").slideToggle();
}


function deleteRecord(id, data) {
    var confirmDelete = confirm("Are you sure you want to delete this record?");
    if (confirmDelete) {
        $.ajax({
            url: "https://jsonplaceholder.typicode.com/users/" + id,
            type: "DELETE",
            success: function (result) {
                data = data.filter(function (user) {
                    return user.id !== id;
                });
                populateTable(data);
            },
            error: function (jqXHR, textStatus, errorThrown) {
                console.log(textStatus + ": " + errorThrown);
            }
        });
    }
}

function fetchData() {
    $.ajax({
        url: "https://jsonplaceholder.typicode.com/users",
        dataType: "json",
        success: function (data) {
            // initial table population
            populateTable(data);

            // sort table on header click
            $("#id-header").click(function () {
                sortTable("id", data);
                populateTable(data);
            });
            $("#name-header").click(function () {
                sortTable("name", data);
                populateTable(data);
            });
            $("#username-header").click(function () {
                sortTable("username", data);
                populateTable(data);
            });
            $("#email-header").click(function () {
                sortTable("email", data);
                populateTable(data);
            });
            $("#phone-header").click(function () {
                sortTable("phone", data);
                populateTable(data);
            });
            $("#website-header").click(function () {
                sortTable("website", data);
                populateTable(data);
            });
        }
    });
}