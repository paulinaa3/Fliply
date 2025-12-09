// Author: David Herring, Paulina Aguirre, Eman Ayaz
// File Name:reviewCards.js 
// Purpose: This code handles the display of flashcards and navigation with in the flashcard set

// loads the card set on page load based on the set id stored in memory
window.addEventListener("DOMContentLoaded", function () {
    loadSet().then(function (cardSet) {
        if (cardSet) {
            loadCards(cardSet);
        }
    });
});

// flips the card
let rotation = 0;
function flipCard() {
    rotation += 180
    document.getElementById('cardContainer').style.transform = `rotateX(${rotation}deg)`
}

// checks for an id in local storage to load the cards from the database
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

// adds the cards to an array to be used in the the displayed cards
let cardNumber = 0;
let cards = [];
function loadCards(cardSet) {
    document.getElementById('setName').innerText = cardSet.name
    cards = cardSet.cards
    updateDisplays()
}

// moves through the cards in either direction based on the parameter, called from arrow the buttons
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

// helper to display the cards and update the counter
function updateDisplays() {
    document.getElementById('cardFront').innerText = cards[cardNumber].front
    document.getElementById('cardBack').innerText = cards[cardNumber].back
    document.getElementById('cardCount').innerText = (cardNumber + 1) + ' / ' + (cards.length)
}

// logs a user out
function logout(){
    localStorage.removeItem('userId');
  }
