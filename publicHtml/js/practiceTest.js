//var deckName = 'Russian Folklore'
var array



// Quickstart: https://platform.openai.com/docs/quickstart


let cards = [];
let noOfQuestions = 10;

async function sendRequest() {
    //do loading and hide the quiz

    var loadingPage = document.getElementById('loadingScreen')
    var quizArea = document.getElementById('quizArea')

    loadingPage.style.display = 'flex';
    quizArea.style.display = 'none';

    //get the cardSet
    var cardSet = await loadSet();
    if (!cardSet) {
        console.log("Card Set was not found");
        return;
    }
    cards = cardSet.cards

    //assign deck name as quiz title
    var title = document.getElementById('quizTitle')
    title.innerText = 'Practice Test for ' +  cardSet.name
   
    const userText=generatePrompt();


    // const userText = `
    // Generate 10 question answer pairs in comma separated format: q1,ans1,q2,ans2,...,q10,ans10 using given flashcards
    // Keep questions and answers short and only about the information given and make sure no commas inside answer
    // (Flipcard 1 Front: Baba Yaga Back: Witch-like forest spirit who lives in a hut on chicken legs; may help or harm travelers.
    // Flipcard 2 Front: Koschei the Deathless Back: Evil sorcerer who hides his soul inside nested objects, making him nearly impossible to kill. 
    // Flipcard 3 Front: Firebird Back: Magical glowing bird whose feathers bring fortune but also danger; central to many heroic quests. 
    // Flipcard 4 Front: Vasilisa the Beautiful Back: Clever heroine who survives Baba Yaga’s trials with help from a magical doll given by her mother. 
    // Flipcard 5 Front: Leshy Back: Forest guardian who leads travelers astray or protects the woods depending on his mood
    // Flipcard 6 Front: Morozko Back: Frost spirit who rewards kindness and punishes cruelty. 
    // Flipcard 7 Front: Domovoi Back: Household guardian spirit that protects the home but causes mischief when offended. 
    // Flipcard 8 Front: Zmey Gorynych Back: Three headed dragon often battled by heroes like Dobrynya Nikitich. 
    // Flipcard 9 Front: Rusalka Back: Water spirit sometimes helpful sometimes dangerous associated with rivers and lakes. 
    // Flipcard 10 Front: Alkonost Back: Magical bird with a womans face whose voice brings bliss or forgetfulness),
    // i want you to generate 10 questions and answers in comma seperated format like but don't literally write q1 and ans1 : q1,ans1,q2,ans2,q3,ans3,q4,ans4..`
     var output = ""

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

    array = output.split('*')
    console.log(output)//remove later

    //create required questions
    createQuestions(noOfQuestions);

    //var divs = document.getElementsByTagName('div')
    //assign the text for each Question
    var spans = document.getElementsByTagName("span")
    for (var i = 0; i < spans.length; i++) {
        spans[i].innerText = array[i * 2]
    }

    //assign the answer for each question
    // function displayAnswer(qNumber) { 
    //   var divAns = document.getElementById(qNumber)
    //   divAns.innerText=array[qNumber]
    // }
    for (var i = 1; i < array.length; i += 2) {
        var divAns = document.getElementById(i)
        divAns.innerText = array[i]
    }


    //hide loading page and now show the answers

    loadingPage.style.display = 'none';
    quizArea.style.display = 'block';


}

//this retrieves the deck of cards
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


function generatePrompt() {
    var noOfCards = cards.length
    var  chosenCards
    if (noOfCards>10){//pick 10 random cards
        //chosenCards = getRandomCards()
        chosenCards = getRandomCards()
        //noOfQuestions = 10
    }
    else {//6 cards = 6 questions
        chosenCards=cards
        noOfQuestions = noOfCards
    }

    var prompt= "Generate high-level "+noOfQuestions+" question answer pairs in asterisk separated format: "
    + "q1*ans1*q2*ans2*...*qN*ansN drawing upon information in given flashcards. Keep questions and answers short "
    + "and only about the information given and make sure no * inside the answer itself and add '?' at the end if needed and do not "
    +"literally write q6 but rather the actual 6th question ("


    // var prompt= "Generate "+noOfQuestions+" question answer pairs in asterisk separated format: "
    // + "q1*ans1*q2*ans2*...*qN*ansN using given flashcards. Keep questions and answers short "
    // + "and only about the information given and make sure no * inside the answer itself and add '?' at the end if needed ("



    //[ { front: "Baba Yaga", back: "Witch-like forest spirit..." }, 
    // { front: "Koschei", back: "Deathless sorcerer..." },...]
    for (var i=0;i<chosenCards.length;i++){
        prompt += "Flipcard "+(i+1)+" Front:" + chosenCards[i].front + " Back:" + chosenCards[i].back + ". "
    }
    prompt +=")"
    return prompt

}


//picks 10 cards at random
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





function createQuestions(n) {
    //var body = document.getElementsByTagName('body')[0]
    var body = document.getElementById('quizContainer')
    var idTracker = 1
    var qTracker = 1
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
        var spanQ = document.createElement('span')
        spanQ.setAttribute('class', "quizSpan")

        //create division element for answer
        var divAns = document.createElement('div')
        var divAnsId = idTracker
        divAns.setAttribute('id', divAnsId)
        divAns.setAttribute('class', "answer")
        idTracker += 2

        //create button
        var ansButton = document.createElement('button')
        var ansButtonId = "btn" + i
        ansButton.setAttribute('id', ansButtonId)
        ansButton.setAttribute('class', "quizButton")
        ansButton.innerText = "Reveal"

        //adding button's onclick function: onclick="toggleAnswer('0', 'btn0')"
        ansButton.setAttribute('onclick', "toggleAnswer(" + divAnsId + ",'" + ansButtonId + "')")

        //<button id="btn0" onclick="toggleAnswer('0', 'btn0')">Reveal</button>

        divQ.appendChild(spanQ)
        enclosingBox.appendChild(divQ)
        enclosingBox.appendChild(divAns)
        enclosingBox.appendChild(ansButton)

        body.appendChild(enclosingBox)
    }

}

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

function logout() {
    localStorage.removeItem('userId');
}