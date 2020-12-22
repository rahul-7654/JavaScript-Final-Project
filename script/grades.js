$(document).ready(function() {
    // Local Storage and Session Storge Data
    var users = localStorage.getItem('Users');
    users = JSON.parse(users);

    var loggedInUser = sessionStorage.getItem('LoggedInUser');
    loggedInUser = JSON.parse(loggedInUser);

    var index = users.findIndex(u => u.email == loggedInUser.email);
    var grades = users[index].grading;

    $('#logout').click(function(e) {
        sessionStorage.removeItem('LoggedInUser');
        location.href= './index.html';
    })

    // Check if user has grades
    if(grades.length > 0) {
        // Loop through each grade item in list and creat table row with columns
        grades.forEach(g => {
            // Get category's full name
            var cat = getCategoryName(g.category);
            var trHtml = `<tr>
            <td>${cat}</td>
            <td>${capitalize(g.level)}</td>
            <td>${new Date(g.submittedOn).toDateString()}</td>
            <td>${g.grade}/10</td>
            </tr>`;

            // Append created row in table's body
            $("table tbody").append(trHtml);
        });
    } else {
        $("table tbody").append('<tr class="text-center"><td colspan="4">No quiz is attmepted yet.</tr>');
    }

    /*
    name - getCategoryName
    params - string
    returns category full name corresponding to its id
    */
    function getCategoryName (cat) {
        var name = '';
        switch(cat) {
            case '9': name = 'General Knowledge'; break;
            case '10': name = 'Entertain: Books'; break;
            case '11': name = 'Entertain: Film'; break;
            case '12': name = 'Entertain: Music'; break;
            case '13': name = 'Entertain: Musicals & Theatre'; break;
            case '14': name = 'Entertain: Television'; break;
            case '15': name = 'Entertain: Video Games'; break;
            case '16': name = 'Entertain: Board Games'; break;
            case '17': name = 'Science & Nature'; break;
            case '18': name = 'Science: Computers'; break;
            case '19': name = 'Science: Mathematics'; break;
            case '20': name = 'Mythology'; break;
            case '21': name = 'Sports'; break;
            case '22': name = 'Geography'; break;
            case '23': name = 'History'; break;
            case '24': name = 'Politics'; break;
            case '25': name = 'Arts'; break;
            case '26': name = 'Celeberties'; break;
            case '27': name = 'Animals'; break;
            case '28': name = 'Vehicals'; break;
            case '30': name = 'Science Gadgets'; break;
            default: name = 'Any';
        }
        return name;
    }

    /*
    name - capitalize
    params - string
    capitalize first char of word
    */
    function capitalize (name) {
        if (typeof name !== 'string') return ''
        return name.charAt(0).toUpperCase() + name.slice(1)
    }
});