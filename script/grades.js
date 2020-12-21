$(document).ready(function() {
    var users = localStorage.getItem('Users');
    users = JSON.parse(users);

    var loggedInUser = sessionStorage.getItem('LoggedInUser');
    loggedInUser = JSON.parse(loggedInUser);

    var index = users.findIndex(u => u.email == loggedInUser.email);
    var grades = users[index].grading;

    var CATEGORIES = [
        { key: 'any', value: 'any' },
        { key: 9, value: 'General Knowledge' },
        { key: 10, value: 'Entertain: Books' },
        { key: 11, value: 'Entertain: Film' },
        { key: 12, value: 'Entertain: Music' },
        { key: 13, value: 'Entertain: Musicals & Theatre' },
        { key: 14, value: 'Entertain: Television' },
        { key: 15, value: 'Entertain: Video Games' },
        { key: 16, value: 'Entertain: Board Games' },
        { key: 17, value: 'Science & Nature' },
        { key: 18, value: 'Science: Computers' },
        { key: 19, value: 'Science: Mathematics' },
        { key: 20, value: 'Mythology' },
        { key: 21, value: 'Sports' },
        { key: 22, value: 'Geography' },
        { key: 23, value: 'History' },
        { key: 24, value: 'Politics' },
        { key: 25, value: 'Arts' },
        { key: 26, value: 'Celeberties' },
        { key: 27, value: 'Animals' },
        { key: 28, value: 'Vehicals' },
        { key: 30, value: 'Science Gadgets' }
   ]

   var LEVELS = [
       { key: 'any', value: 'any' },
       { key: 'easy', value: 'Easy' },
       { key: 'medium', value: 'Medium' },
       { key: 'hard', value: 'Hard' },
   ]

    if(grades.length > 0) {
        grades.forEach(grade => {
            var trHtml = `<tr>
            <td>${grade.category}</td>
            <td>${grade.level}</td>
            <td>${grade.submittedOn}</td>
            <td>${grade.grade}</td>
            </tr>`;
            $("table tbody").append(trHtml);
        });
    } else {
        $("table tbody").append('<tr class="text-center"><td colspan="4">No quiz is attmepted yet.</tr>');
    }
});