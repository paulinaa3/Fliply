
const sampleSets = [
    {
      _id: "1",
      name: "DNS",
      cards: [
        { cardId: 0, front: "DNS", back: "Domain Name System" },
        { cardId: 1, front: "gateway", back: "router connecting networks" }
      ]
    },
    {
      _id: "2",
      name: "Networking Basics",
      cards: [
        { cardId: 0, front: "IP", back: "Internet Protocol" }
      ]
    }]

function checkLength(cards) {
    if (cards.length == 1) {
        return " Card"
    }
    return " Cards"
}


function loadLibrary() {
    let container = document.getElementById("setsList")
    container.innerHTML = ""
    for (let i = 0; i < sampleSets.length; i++) {
        let currCard = sampleSets[i]
        
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

loadLibrary();