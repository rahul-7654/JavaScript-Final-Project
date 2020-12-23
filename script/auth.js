$(document).ready(function() {
    // Global variables
    var SESSION_KEY = 'LoggedInUser';
    var LOC_STORAGE_KEY = 'Users';
    var EMAIL_PATTERN = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;

    // Registered users
    var users = localStorage.getItem(LOC_STORAGE_KEY);
    if(users) users = JSON.parse(users);
    else users = [];

    // Focus on first input box on load of page
    $('#loginEmail').focus();
    $('#fName').focus();

    // Remove validation error class on click in inputs
    var inputArr = [
        $('#loginEmail'),
        $('#loginPwd'),
        $('#fName'),
        $('#lName'),
        $('#signupEmail'),
        $('#signupPwd')
    ];
    removeErrorClass(inputArr);

    // Sign up form's submit event
    $('#signupForm').submit(function(e) {
        // Prevent default action
        e.preventDefault();

        isValid = true;

        // Get input values
        var firstName = $('#fName').val();
        var lastName = $('#lName').val();
        var email = $('#signupEmail').val();
        var password = $('#signupPwd').val();

        // Check validations for each input
        if(firstName == "") {
            $("#fName").addClass('error');
            isValid = false;
        } else {
            $("#fName").removeClass('error');
        }
        
        if(lastName == "") {
            $("#lName").addClass('error');
            isValid = false;
        } else {
            $("#lName").removeClass('error');
        }
  
        if(email == "" || !EMAIL_PATTERN.test(email)) {
            $("#signupEmail").addClass('error');
            isValid = false;
        } else {
            $("#signupEmail").removeClass('error');
        }

        if(password == "") {
            $("#signupPwd").addClass('error');
            isValid = false;
        } else {
            $("#signupPwd").removeClass('error');
        }

        // If validations are passed, register user
        if(isValid) {
            // Check if this email id is already present, then dont create it
            var index = users.findIndex(u => u.email == email);

            // If index is -1, that means that email is not registered yet.
            if(index > -1) {
                $('.errorMessage').text('Email already exist. Choose another');
            } else {
                // Create new user object
                var newUser = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    grading: []
                }

                // Push it to users array
                users.push(newUser);

                // Finally save updated array to local storage
                localStorage.setItem(LOC_STORAGE_KEY, JSON.stringify(users));

                // Also save that user in session storage to identify loggedin user
                sessionStorage.setItem(SESSION_KEY, JSON.stringify({email, firstName, lastName}));

                // Redirect user to application's home page
                location.href = './home.html';
            }            
        }
    })

    // Login form's submit event
    $('#loginForm').submit(function(e) { 
        // Prevent default action
        e.preventDefault();

        // Get input values
        var email = $('#loginEmail').val();
        var password = $('#loginPwd').val();

        // Flag to check form validations
        var isValid = true;

        // Check validations for each input
        if(email == "" || !EMAIL_PATTERN.test(email)) {
            $('#loginEmail').addClass("error");
            isValid = false;
        } else {
            $('#loginEmail').removeClass("error");
        }

        if(password == "") {
            $("#loginPwd").addClass("error");
            isValid = false;
        } else {
            $("#loginPwd").removeClass("error");
        }

        // If inputs are passes validation check, submit form
        if(isValid) {
            if(users.length > 0) {
                // Find user in local storage
                var index = users.findIndex(u => u.email == email && u.password == password);

                /* index -1 means specified user is not in array i.e either it is not 
                    registered or credentials entered are incorrect */ 
                if(index > -1) {
                    var user = users[index];

                    // Set that user in session storage
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));

                    // Empty inputs
                    $('#loginEmail').val();
                    $('#loginPwd').val();

                    // Redirect use to application's home page
                    location.href= './home.html';
                } else {
                    // Show error message if user is not found
                    $('.errorMessage').text('User not found or incorrect credentials');
                }
            } else {
                // Show error message if user is not found
                $('.errorMessage').text('User not found or incorrect credentials');
            }
        }
    });

    /**
    name - removeErrorClass
    params - array of inputs
    do -  bind click event and remove 'error' named class on click of that input
    */
    function removeErrorClass(inputs) {
        inputs.forEach(input => {
            input.click(() => input.removeClass('error'))
        });
    }
})