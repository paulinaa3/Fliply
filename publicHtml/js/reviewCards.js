// for testing load cards
let sample = {
    "name": "DNS",
    "cards": [
        {
            "cardId": 0,
            "front": "DNS",
            "back": "Domain Name System"
        },
        {
            "cardId": 1,
            "front": "gateway",
            "back": "router connecting networks"
        }
    ]
}

let rotation = 0;
function flipCard() {
    rotation += 180
    document.getElementById('cardContainer').style.transform = `rotateX(${rotation}deg)`
}

let cardNumber = 0;
let cards = [];
function loadCards(cardSet) {
    document.getElementById('setName').innerText = cardSet.name
    cards = cardSet.cards
    updateDisplays()
}

function changeCard(direction) {
    if (direction == 'next') {
        cardNumber++
        if (cardNumber >= cards.length) { cardNumber = 0 }
    } else {
        cardNumber--
        if (cardNumber < 0) { cardNumber = cards.length - 1 }
    }
    cardNumber %= cards.length

    // immediately flip card to front before switching
    if (rotation % 360 != 0) {
        let cardContainer = document.getElementById('cardContainer')
        cardContainer.style.transition = 'none'
        cardContainer.offsetHeight;
        flipCard()
        setTimeout(() => {
            cardContainer.style.transition = 'transform 1.0s';
        }, 0);
    }
    updateDisplays()
}

function updateDisplays() {
    document.getElementById('cardFront').innerText = cards[cardNumber].front
    document.getElementById('cardBack').innerText = cards[cardNumber].back
    document.getElementById('cardCount').innerText = (cardNumber + 1) + ' / ' + (cards.length)
}

loadCards(sample)