window.addEventListener("DOMContentLoaded", function () {
  sendReq();
  localStorage.removeItem("setId");
});


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


//set id of card clicked
//and renavigate to another page
function setCard(setId, page) {
  localStorage.setItem("setId", setId)
  window.location.href = page;
}


function checkLength(cards) {
    if (cards.length == 1) {
        return " Card"
    }
    return " Cards"
}


function loadLibrary(userSets) {
    let container = document.getElementById("setsList")
    container.innerHTML = ""
    for (let i = 0; i < userSets.length; i++) {
        let currCard = userSets[i]
        
        const cardDiv = document.createElement('div');
        cardDiv.className = "cardBox"

        //sets card id and does a fetch to reviewCards page 
        cardDiv.addEventListener("click", () => setCard(userSets[i]._id, 'reviewCards.html'));

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
        quizButton.addEventListener("click", (event) => {
          event.stopPropagation(); 
          setCard(userSets[i]._id, 'practiceTest.html');
        });
        


        let editButton = document.createElement('button')
        editButton.innerText = "Edit"
        editButton.className = "edit"
        editButton.addEventListener("click", (event) => {
          event.stopPropagation(); 
          setCard(userSets[i]._id, 'createCards.html');
        });

        

        buttonRow.appendChild(quizButton)
        buttonRow.appendChild(editButton)

        row.appendChild(termCount);
        row.appendChild(buttonRow);

        cardDiv.appendChild(row);
        cardDiv.appendChild(cardHeader);
        
        container.appendChild(cardDiv);
    }
}

function logout(){
  localStorage.removeItem('userId');
}