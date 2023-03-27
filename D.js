$(document).ready(function () {
    
  
    // add click event listener to delete buttons
    $(document).on('click', '.delete-btn', function() {
      var row = $(this).closest('tr');
      var userId = row.index() + 1; // get user ID from row index (add 1 because table indices start at 0)
      $.ajax({
        type: 'DELETE',
        url: 'https://jsonplaceholder.typicode.com/users/' + userId,
        success: function() {
          row.remove(); // remove row from table on success
        },
        error: function(jqXHR, textStatus, errorThrown) {
          alert('Error deleting user: ' + textStatus + ' - ' + errorThrown);
        }
      });
    });
  });
  
  function appendUserToTable(user) {
    // append the table with the user data and delete button
    var newRow = '<tr><td>' + user.name + '</td><td>' + user.username + '</td><td>' + user.email + '</td><td>' + user.phone + '</td><td>' + user.website + '</td><td><button class="delete-btn">Delete</button></td></tr>';
    $('#myTable tbody').append(newRow);
  }
  
  function isValidEmail(email) {
    // validate email address
  }
  
  function isValidPhoneNumber(phone) {
    // validate phone number
  }
  
  function isValidWebsite(website) {
    // validate website URL
  }
  