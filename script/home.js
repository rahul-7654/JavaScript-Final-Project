$(document).ready(function() {
    // Global variables
    var questions = [];
    var category = '';
    var difficulty = '';

    // Get container divs for showing results
    var quizContainer = document.getElementById('quiz');
    var resultContainer = document.getElementById('result');

    // Get logged in user from session storage
    var loggedInUser = sessionStorage.getItem('LoggedInUser');
    loggedInUser = JSON.parse(loggedInUser);

    // Show logged in user's name
    $('h1').text(`Logged In as ${loggedInUser.firstName} ${loggedInUser.lastName}`);

    // Logout's click event
    $('#logout').click(function(e) {
        // Remove logged in user from session storage
        sessionStorage.removeItem('LoggedInUser');

        // redirect user to login screen
        location.href= './index.html';
    })

    // Start quiz button's click event
    $('#start').click(LoadQuiz);

    /**
     * LoadQuiz - loads 10 questions from open trivia(opentdb api) quiz api
     */
    function LoadQuiz() {
        questions = [];

        // empting few div before loading new quiz
        resultContainer.innerHTML = '';
        document.getElementById('noquiz').innerHTML = '';

        //showing loader while quiz is loading
        $('#loader').show();

        var apiURL = 'https://opentdb.com/api.php?amount=10&type=multiple';

        // get values from category and difficulty level dropdowns
        category = $('#categories').val();
        difficulty = $('#difficulty').val();

        // concating category to url if category is not 'any
        if(category != 'any') {
            apiURL = apiURL.concat(`&category=${category}`)
        }

        // concating diff level to url if level is not 'any
        if(difficulty != 'any') {
            apiURL = apiURL.concat(`&difficulty=${difficulty}`)
        }

        // create xmlhttprequest object
        var xhttp = new XMLHttpRequest();

        // assigning function to xmlhttprequest object's onreadystatechange event
        xhttp.onreadystatechange = function() {
            // check if status is 200 i.e request is succesfull
            if (this.readyState == 4 && this.status == 200) {
                var response = JSON.parse(this.response);
                // check if response contains list of questions
                if(response.results && response.results.length > 0) {
                    // if it contains questions - create quiz
                    createQuiz(response.results);

                    //bind click event to each answer to capture selected answer by user
                    bindAnswersEvent();
                } else {
                    // if result does not contains any questions, hide content not required
                    $('#submitQuiz').hide();
                    quizContainer.innerHTML = '';

                    // show message informing user that no quiz is found.
                    document.getElementById('noquiz').innerHTML = 'No quiz found! Choose another';
                }
            }
            //hide loader when request is done fetching results
            $('#loader').hide();
        };
        xhttp.open("GET", apiURL, true);
        xhttp.send();
    }

    /**
     * Builds questionaire having question and 4 choices
     * @param list 
     */
    function createQuiz(list) {
        try{
            
            quizContainer.innerHTML = '';
    
            // loop through each question
            for(var i=0; i < list.length; i++) {
                var item = list[i];
    
                // create choices - 3 incorrect and 1 correct
                item.incorrect_answers.push(item.correct_answer);

                // randomize choices
                var choices = randomizeArray(item.incorrect_answers);


                // build global array questions to keep track of answers selected by user
                questions.push({
                    id: i,
                    question: item.question,
                    incorrectAnswers: choices,
                    correctAnswer: item.correct_answer,
                    mark: 0 // this mark will change when user selects a choice
                });
    
                // creating text node for question statement
                var p = document.createElement("p");
                var node = document.createTextNode(item.question);
                p.appendChild(node);
    
                // question statement inserted into main div
                quizContainer.appendChild(p);
    
                // create choices list
                var ul = document.createElement('ul');
                choices.forEach((ans, index) => {
                    var name = `${i}`;
                    const li = document.createElement('li');
                    li.innerHTML = `<input type="radio" name=${name} value="${ans}">${ans}`;
    
                    ul.appendChild(li);
    
                    // appending choices into main div for a question
                    quizContainer.appendChild(ul);                    
                });
            }
            
        }
        catch(ex) {
            // logging error if caught
            console.log('Something went wrong. Try again.');
        }
        finally {
            // this code will run no matter if error comes or not
            $('#loader').hide();
        }
    }

    /**
     * binding change event to each answer choice to capture user's answer
     */
    function bindAnswersEvent () {
        $('input[type=radio]').change(function() {
            var index = questions.findIndex(q => q.id == Number(this.name))
            if(questions[index].correctAnswer == this.value) {
                questions[index].mark = 1;
            }
        })
        $('#submitQuiz').show();
        $('#submitQuiz').click(function() {
            var total = 0;

            // calculating grades for submitted quiz
            questions.forEach(question => {
                total = total + question.mark;
            }); 

            showResult(total);
        })
    }

    /**
     * randomize items in array using Math objects functions
     * @param array 
     */
    function randomizeArray(array){
        for (let i = array.length-1; i >=0; i--) {
         
            let randomIndex = Math.floor(Math.random()*(i+1)); 
            let itemAtIndex = array[randomIndex]; 
             
            array[randomIndex] = array[i]; 
            array[i] = itemAtIndex;
        }
        return array;
    }

    /**
     * this function show results after quiz is submitted
     * @param  total 
     */
    function showResult(total) {
        quizContainer.innerHTML = '';
        $('#submitQuiz').hide();
        var remark = '';
        if(total <= 4) {
            remark = 'Better Luck Next Time!';
        } else if (total >= 5 && total <= 7) {
            remark = 'Well Done!';
        } else {
            remark = 'Excellent!';
        }
        resultContainer.innerHTML  = `<p><span>${remark}</span> You scored ${total} out of 10.<h4>Play Again!</h4>`;
        saveUserResults(total);
    }

    /**
     * this function use grades for logged in user in local storage to show on grades page
     * @param  total 
     */
    function saveUserResults(total) {
        var users = localStorage.getItem('Users');
        users = JSON.parse(users);
        var index = users.findIndex(u => u.email == loggedInUser.email);
        
        users[index].grading.push({
            grade: total,
            category: category,
            level: difficulty,
            submittedOn: new Date()
        })

        localStorage.setItem('Users', JSON.stringify(users));
    }
})