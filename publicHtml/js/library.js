function sendReq() {
  const myUser = localStorage.getItem("userId")
  const url = "/sets?userId=" + myUser
  fetch(url)
  .then(function(res) {
    return res.json()
  })
  .then (function(data){
    loadLibrary(data.userSets)
  })
  .catch(function(err) {
    console.log(err)
  })
}




function checkLength(cards) {
    if (cards.length == 1) {
        return " Card"
    }
    return " Cards"
}


function loadLibrary(userSets) {
  console.log(userSets)
    let container = document.getElementById("setsList")
    container.innerHTML = ""
    for (let i = 0; i < userSets.length; i++) {
        let currCard = userSets[i]
        console.log('this is my card:')
        console.log(currCard)
        
        const cardDiv = document.createElement('div');
        cardDiv.className = "cardBox"

        const row = document.createElement('div');
        row.className = "cardRow";

        let termCount = document.createElement('p')
        termCount.innerText = currCard.cards.length + checkLength(currCard.cards)

        let cardHeader = document.createElement('h3');
        cardHeader.innerText = currCard.name

        const buttonRow = document.createElement('div');
        buttonRow.className = "buttonRow";

        let quizButton = document.createElement('button')
        quizButton.innerText = "Quiz Me"
        quizButton.className = "quiz"

        let editButton = document.createElement('button')
        editButton.innerText = "Edit"
        editButton.className = "edit"

        buttonRow.appendChild(quizButton)
        buttonRow.appendChild(editButton)

        row.appendChild(termCount);
        row.appendChild(buttonRow);

        cardDiv.appendChild(row);
        cardDiv.appendChild(cardHeader);
        
        container.appendChild(cardDiv);
    }
}

sendReq();