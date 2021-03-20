let preQuestions;

let next = document.querySelector('.next');
let previous = document.querySelector('.previous');

let questionNumber = document.getElementById('index');
let question = document.querySelector('.question');
let answers = document.querySelectorAll('.list-group-item');
let list = document.querySelector('.list');

let pointsElem = document.querySelector('.score');
let restart = document.querySelector('.restart');
let index = 0;
let points = 0;
let gamesCount = 0;

let results = document.querySelector('.results');
let userScorePoint = document.querySelector('.userScorePoint');
let averageScore = document.querySelector('.average');


questionNumber.innerHTML = index+1;

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

	activateAnswers();
	cleanAnswers();
}

function activateAnswers(){
	for (let i=0; i<answers.length; i++){
		answers[i].addEventListener('click', doAction);
	}
}

function disableAnswers(){
	for (let i=0; i<answers.length; i++){
		answers[i].removeEventListener('click', doAction);
	}
}

function cleanAnswers(){
	for (let i=0; i<answers.length; i++){
		answers[i].classList.remove('correct');
		answers[i].classList.remove('incorrect');
	}
}

function doAction(event) {
    //event.target - Zwraca referencję do elementu, do którego zdarzenie zostało pierwotnie wysłane.
    if (event.target.innerHTML === preQuestions[index].correct_answer) {
        points++;
        pointsElem.innerText = points;
        markCorrect(event.target);
    }
    else {
        markInCorrect(event.target);
    }
    disableAnswers();
}

function markCorrect(elem){
	elem.classList.add('correct');
}

function markInCorrect(elem){
	elem.classList.add('incorrect')
}


restart.addEventListener('click', function (event) {
	console.log('RESTART button clicked');
	
    event.preventDefault();

    index = 0;
    points = 0;
    let userScorePoint = document.querySelector('.score');
    userScorePoint.innerHTML = points;
    setQuestion(index);
    activateAnswers();
	
	
	list.style.display = 'block';
    results.style.display = 'none';
});

next.addEventListener('click', function () {
	console.log('NEXT button clicked');
	index++;
	if (index >= preQuestions.length){
		list.style.display = 'none';
		results.style.display = 'block';
		userScorePoint.innerHTML = points;
		let gamesCount = localStorage.getItem('gamesCount');
		let average;
		
		if (gamesCount != null){
			average = localStorage.getItem('average');
			average = (average * gamesCount + points) / ++gamesCount;
			//gamesCount++;
		}else{
			gamesCount = 1;
			average = points;
		}
		localStorage.setItem('gamesCount', gamesCount);
		localStorage.setItem('average', average);
		averageScore.innerHTML = average;
	} else{
		setQuestion(index);
		questionNumber.innerHTML = index+1;
	}
});

previous.addEventListener('click', function () {
	console.log('PREVIOUS button clicked');
	if(index > 0){
		index--;
		setQuestion(index);
		questionNumber.innerHTML = index+1;
	}
});
		

			
	