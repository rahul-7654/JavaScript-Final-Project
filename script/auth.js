$(document).ready(function() {

    var SESSION_KEY = 'LoggedInUser';
    var emailPattern = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,4}\b/;

    // remove error class if added
    $('#loginEmail').click(() => $('#loginEmail').removeClass('error'))
    $('#loginPwd').click(() => $('#loginPwd').removeClass('error'))
    $('#fName').click(() => $('#fName').removeClass('error'))
    $('#lName').click(() => $('#lName').removeClass('error'))
    $('#signupEmail').click(() => $('#signupEmail').removeClass('error'))
    $('#signupPwd').click(() => $('#signupPwd').removeClass('error'))
    
    $('#signupForm').submit(function(e) {
        // prevent default action
        e.preventDefault();

        isValid = true;

        var firstName = $('#fName').val();
        var lastName = $('#lName').val();
        var email = $('#signupEmail').val();
        var password = $('#signupPwd').val();

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
  
        if(email == "" || !emailPattern.test(email)) {
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

        if(isValid) {
            // check if any user is already present in storage
            var users = localStorage.getItem('Users');

            if(users) users = JSON.parse(users);
            else users = [];

            // check if this email id is already present, then dont create it
            var index = users.findIndex(u => u.email == email);
            if(index > -1) {
                $('.errorMessage').text('Email already exist. Choose another');
            } else {
                // create new user object
                var newUser = {
                    firstName: firstName,
                    lastName: lastName,
                    email: email,
                    password: password,
                    grading: []
                }

                // push it to users array
                users.push(newUser);

                // finally save updated array to local storage
                localStorage.setItem('Users', JSON.stringify(users));

                sessionStorage.setItem(SESSION_KEY, JSON.stringify({email, firstName, lastName}));
                location.href = './home.html';
            }
                        
        }
    })

    $('#loginForm').submit(function(e) { 
        e.preventDefault();
        var email = $('#loginEmail').val();
        var password = $('#loginPwd').val();

        var isValid = true;
        if(email == "" || !emailPattern.test(email)) {
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

        if(isValid) {
            var users = localStorage.getItem('Users');
            if(users) users = JSON.parse(users);
            else users = [];

            if(users.length > 0) {
                var index = users.findIndex(u => u.email == email && u.password == password);

                // index -1 means specified user is not in array
                if(index > -1) {
                    var user = users[index];
                    sessionStorage.setItem(SESSION_KEY, JSON.stringify(user));

                    $('#loginEmail').val();
                    $('#loginPwd').val();

                    location.href= './home.html';
                } else {
                    $('.errorMessage').text('User not found or incorrect credentials');
                }
            } else {
                $('.errorMessage').text('User not found or incorrect credentials');
            }
        }
    });

})