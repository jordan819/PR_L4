let preQuestions;

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let questionNumber = document.getElementById('index');
let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');
let list = document.querySelector('.list');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 18;
let points = 0;
let gamesCount = 0;

let timer = document.getElementById('timer');
let timerClass = document.querySelector('.timer');
let timeLeft = 10;
let elem = document.getElementById("myBar");
let progressBar;
let myProgress = document.getElementById("myProgress");

let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let averageScore = document.querySelector('.average');

let report = document.querySelector('.report');
let report_question = document.querySelectorAll('.report-question');
let report_answers = document.querySelectorAll('.report-list-group-item');
let report_answers_group = document.querySelectorAll('.report-list-group');

let usersAnswers = [];

fetch('https://quiztai.herokuapp.com/api/quiz')
    	.then(resp => resp.json())
    	.then(resp => {
        	   preQuestions = resp;

			   setQuestion(index);
    	});

function setQuestion(index) {
	question.innerHTML = preQuestions[index].question;

   if (preQuestions[index].answers.length === 2) {
       answers[2].style.display = 'none';
       answers[3].style.display = 'none';
   } else {
       answers[2].style.display = 'block';
       answers[3].style.display = 'block';
   }

	answers[0].innerHTML = preQuestions[index].answers[0];
	answers[1].innerHTML = preQuestions[index].answers[1];
	answers[2].innerHTML = preQuestions[index].answers[2];
	answers[3].innerHTML = preQuestions[index].answers[3];

	questionNumber.innerHTML = index+1;
	activateAnswers();
	cleanAnswers();
	timeLeft = 10;
	
	move();
	
	countdown();
	timeLeft--;
	myVar = window.setInterval(function (){
		countdown();
		timeLeft--;
	}, 1000);
}

function activateAnswers(){
	for (let i=0; i<answers.length; i++){
		answers[i].addEventListener('click', doAction);
	}
}

function disableAnswers(){
	for (let i=0; i<answers.length; i++){
		answers[i].removeEventListener('click', doAction);
		answers[i].classList.add('no-hover');
	}
}

function cleanAnswers(){
	for (let i=0; i<answers.length; i++){
		answers[i].classList.remove('correct');
		answers[i].classList.remove('incorrect');
		answers[i].classList.remove('no-hover');
	}
}

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    usersAnswers[index] = event.target.innerHTML;
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
	
    disableAnswers();
	
	clearInterval(myVar);
	clearInterval(progressBar);
	setTimeout(nextQuestion, 1000);
}

function markCorrect(elem){
	elem.classList.add('correct');
}

function markInCorrect(elem){
	elem.classList.add('incorrect');
}


restart.addEventListener('click', function (event) {
	console.log('RESTART button clicked');
	//myVar = window.setInterval(countdown, 1000);

    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);

	list.style.display = 'block';
	timer.style.display = 'block';
	timerClass.style.display = 'block';
	myProgress.style.display = 'block';
    results.style.display = 'none';
});

function nextQuestion() {
	console.log('NEXT question');
	clearInterval(myVar);
	index++;
	if (index >= preQuestions.length){
		list.style.display = 'none';
		myProgress.style.display = 'none';
		timer.style.display = 'none';
		timerClass.style.display = 'none';
		results.style.display = 'block';
		userScorePoint.innerHTML = points;
		let gamesCount = localStorage.getItem('gamesCount');
		let average;



        for(let i=0; i<report_answers_group.length; i++){

            report_question[i].innerHTML = preQuestions[i].question;

            for(let j=0; j<report_answers_group[i].childElementCount; j++){

               if (preQuestions[i].answers.length === 2) {
                   report_answers_group[i].children[2].style.display = 'none';
                   report_answers_group[i].children[3].style.display = 'none';
               } else {
                   report_answers_group[i].children[2].style.display = 'block';
                   report_answers_group[i].children[3].style.display = 'block';
               }

                report_answers_group[i].children[j].innerHTML = preQuestions[i].answers[j];


                if(usersAnswers[i] === report_answers_group[i].children[j].innerHTML){
                    if(usersAnswers[i] === preQuestions[i].correct_answer){
                        report_answers_group[i].children[j].classList.add('correct');
                        console.log(i + ' ' + j + ' correct');
                    }
                    else{
                        report_answers_group[i].children[j].classList.add('incorrect');
                        console.log(i + ' ' + j + ' incorrect');
                    }
                }
                else if(report_answers_group[i].children[j].innerHTML === preQuestions[i].correct_answer){
                    report_answers_group[i].children[j].classList.add('correct');
                    console.log(i + ' ' + j + ' correct');
                }

            }
        }




		if (gamesCount != null){
			average = localStorage.getItem('average');
			average = (average * gamesCount + points) / ++gamesCount;
			average = average.toFixed(2);
		}else{
			gamesCount = 1;
			average = points;
		}
		localStorage.setItem('gamesCount', gamesCount);
		localStorage.setItem('average', average);
		averageScore.innerHTML = average;
	} else{
		setQuestion(index);
	}
}

function countdown(){
	
	if(timeLeft < 0){
		nextQuestion();
		timeLeft = 10;
	}
	timer.innerText = timeLeft;
}




function move() {
    var width = 100;
    progressBar = setInterval(frame, 10);
    function frame() {
      if (width <= 0) {
        clearInterval(progressBar);
      } else {
        width-=0.1;
        elem.style.width = (timeLeft+1)*10 + "%";
      }
    }
}

function showReport(){
	
}