// Author:Eman Ayaz,David Herring, Paulina Aguirre
// File Name:practiceTest.js 
// Purpose: This code handles the dynamic creation of the practice test by generating
// questions and answerss by utilizing API calls to AI

let array
let cards = [];
let noOfQuestions = 10;

//This function is called when the page is loaded and is responsible for populating its contents and doing API calls to AI
//  return: None
async function sendRequest() {
    //show loading and hide the quiz

    let loadingPage = document.getElementById('loadingScreen')
    let quizArea = document.getElementById('quizArea')

    loadingPage.style.display = 'flex';
    quizArea.style.display = 'none';

    //get the cardSet from the backend
    var cardSet = await loadSet();
    if (!cardSet) {
        console.log("Card Set was not found");
        return;
    }
    cards = cardSet.cards

    //assign deck name as quiz title
    let title = document.getElementById('quizTitle')
    if (cardSet.name==""){
        title.innerText = 'Practice Test'
    }
    else {
          title.innerText = 'Practice Test for ' +  cardSet.name
    }
  
   
   const userText=generatePrompt(); //this function decides the prompt for AI based on number of cards

   let output = ""

    try {
        const response = await fetch("/api/generateQuiz", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ userText }),
        });
        const data = await response.json();
        output = data.output;
    }
    catch (err) {
        console.log(err)
        return
    }

    //AI returns Questions and Answers seperated by asterisks
    array = output.split('*')
   
    //create required questions
    createQuestions(noOfQuestions);

 
    //assign the text for each Question
    let spans = document.getElementsByTagName("span")
    for (let i = 0; i < spans.length; i++) {
        spans[i].innerText = array[i * 2]
    }

    //assign the answer for each question

    for (let i = 1; i < array.length; i += 2) {
        let divAns = document.getElementById(i)
        divAns.innerText = array[i]
    }

    //hide loading page and now show the answers
    loadingPage.style.display = 'none';
    quizArea.style.display = 'block';

}

//This function retrieves the deck of cards using the setId from localStorage
// returns: a cardDeck (if found)
function loadSet() {
    const setId = localStorage.getItem("setId");
    const url = "/set?setId=" + setId;

    return fetch(url)
        .then(res => res.json())
        .then(data => {
            console.log("Loaded set:", data.set);
            return data.set;
        })
        .catch(err => {
            console.log(err);
            return null;
        });
}

//This function generates the AI prompt that includes  'specifying the requirements and sending
//  each flashcard that will be used for the test generation'
//  return: a string 
function generatePrompt() {
    var noOfCards = cards.length
    var  chosenCards
    if (noOfCards>10){//pick 10 random cards
        chosenCards = getRandomCards()
    }
    else {//6 cards = 6 questions
        chosenCards=cards
        noOfQuestions = noOfCards
    }

    var prompt= "Generate high-level "+noOfQuestions+" question answer pairs in asterisk separated format: "
    + "q1*ans1*q2*ans2*...*qN*ansN drawing upon information in given flashcards. Keep questions and answers short "
    + "and only about the information given and make sure no * inside the answer itself and add '?' at the end if needed and do not "
    +"literally write q6 but rather the actual 6th question ("


    // format is like
    //[ { front: "Baba Yaga", back: "Witch-like forest spirit..." }, 
    // { front: "Koschei", back: "Deathless sorcerer..." },...]
    for (var i=0;i<chosenCards.length;i++){
        prompt += "Flipcard "+(i+1)+" Front:" + chosenCards[i].front + " Back:" + chosenCards[i].back + ". "
    }
    prompt +=")"
    return prompt

}



//This function picks 10 cards at random from the card deck
//  return: 10 selected cards
function getRandomCards() {
    var chosenCards=[];
    while(chosenCards.length<10){
       var i = Math.floor(Math.random() * cards.length); // for 11 cards: 0–10
       if (!chosenCards.includes(cards[i])){//so we pick unique cards
        chosenCards.push(cards[i])
       }
       
    }
    return chosenCards
}




//This function creates n questions for the practice Test page
//  return: None
function createQuestions(n) {
    let body = document.getElementById('quizContainer')
    let idTracker = 1
    let qTracker = 1
    for (var i = 0; i < n; i++) {
        //create outer box to hold Q & Ans
        var enclosingBox = document.createElement('div')
        enclosingBox.setAttribute('class', "outerBox")

        //create division element for question
        var divQ = document.createElement('div')
        divQ.innerText = "Q" + qTracker + ": "
        qTracker += 1
        divQ.setAttribute('class', "question")

        //create span element for question's text
        let spanQ = document.createElement('span')
        spanQ.setAttribute('class', "quizSpan")

        //create division element for answer
        let divAns = document.createElement('div')
        let divAnsId = idTracker
        divAns.setAttribute('id', divAnsId)
        divAns.setAttribute('class', "answer")
        idTracker += 2

        //create button
        let ansButton = document.createElement('button')
        let ansButtonId = "btn" + i
        ansButton.setAttribute('id', ansButtonId)
        ansButton.setAttribute('class', "quizButton")
        ansButton.innerText = "Reveal"

        //adding button's onclick function: onclick="toggleAnswer('0', 'btn0')"
        ansButton.setAttribute('onclick', "toggleAnswer(" + divAnsId + ",'" + ansButtonId + "')")

        divQ.appendChild(spanQ)
        enclosingBox.appendChild(divQ)
        enclosingBox.appendChild(divAns)
        enclosingBox.appendChild(ansButton)

        body.appendChild(enclosingBox)
    }

}

//This function toggles the visibility of the answer
//  return: None
function toggleAnswer(divAnsId, btnID) {
    let divAns = document.getElementById(divAnsId);
    let ansBtn = document.getElementById(btnID);
    let enclosingBox = divAns.parentElement;

    //toggle visibility of answer by altering the classList
    if (enclosingBox.classList.contains('open')) {//visible->hidden
        enclosingBox.classList.remove('open');
    } else {//hidden->visible
        enclosingBox.classList.add('open');
    }

    //change text of button to match
    if (ansBtn.innerText == "Reveal") {
        ansBtn.innerText = "Hide";
    } else {
        ansBtn.innerText = "Reveal";
    }
}

window.sendRequest = sendRequest;
window.createQuestions = createQuestions;
window.toggleAnswer = toggleAnswer;

//This function allows user to logout
//  return: None
function logout() {
    localStorage.removeItem('userId');
}