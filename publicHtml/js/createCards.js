window.addEventListener("DOMContentLoaded", function () {
    loadSet()
        .then(function (cardSet) {
            if (cardSet) {
                loadCards(cardSet)
            };
        });
});

// used in ids for created elements
count = 0;

// adds elements for creating a card, including a button to remove card
function addCard() {
    // Create div wrapper element
    let div = document.createElement('div')
    div.setAttribute('id', 'div' + count)
    div.setAttribute('class', 'card')

    // Create front div element (id format 'frontDiv0')
    let frontDiv = document.createElement('div')
    frontDiv.setAttribute('id', 'frontDiv' + count)
    frontDiv.setAttribute('class', 'cardSide')

    // Create front input (id format 'frontInput0')
    let frontInput = document.createElement('textarea')
    frontInput.setAttribute('id', 'frontInput' + count)
    frontInput.setAttribute('class', 'cardFront inputArea')
    frontInput.setAttribute('name', 'frontInput' + count)
    frontInput.setAttribute('type', 'text')
    frontInput.setAttribute('placeholder', 'Front')
    frontInput.setAttribute('rows', 2)
    frontInput.setAttribute("oninput", "autoGrow(this); setSaveBtn(true)")

    // Append front elements to div
    frontDiv.appendChild(frontInput)

    // Create back div element (id format 'backDiv0')
    let backDiv = document.createElement('div')
    backDiv.setAttribute('id', 'backDiv' + count)
    backDiv.setAttribute('class', 'cardSide')

    // Create back input (id format 'backInput0')
    let backInput = document.createElement('textarea')
    backInput.setAttribute('id', 'backInput' + count)
    backInput.setAttribute('class', 'cardBack inputArea')
    backInput.setAttribute('name', 'backInput' + count)
    backInput.setAttribute('type', 'text')
    backInput.setAttribute('placeholder', 'Back')
    backInput.setAttribute("oninput", "autoGrow(this); setSaveBtn(true)")

    // Append back elements to div
    backDiv.appendChild(backInput)

    // Create back div element (id format 'removeDiv0')
    let removeDiv = document.createElement('div')
    removeDiv.setAttribute('id', 'removeDiv' + count)
    removeDiv.setAttribute('class', 'removeDiv')

    // Create remove button
    let removeBtn = document.createElement('button')
    removeBtn.innerHTML = '<img src="imgs/trash.png" alt="Remove" class="trashIcon" width="25">'
    removeBtn.setAttribute('class', 'removeBtn')
    removeBtn.setAttribute('onclick', 'removeCard("div' + count + '")')

    // Append back elements to div
    removeDiv.appendChild(removeBtn)

    // Append all elements to div
    div.appendChild(frontDiv)
    div.appendChild(backDiv)
    div.appendChild(removeBtn)
    let wrapper = document.getElementById('createCardsDiv')
    wrapper.appendChild(div)

    // Increase row id count for use with remove button
    count += 1
}

// Remove a row based on its id
function removeCard(id) {
    let numCards = document.getElementsByClassName('card')
    if (numCards.length > 1) {
        document.getElementById(id).remove()
        setSaveBtn(true)
    }
}

// adjust the height of a text area based on input
function autoGrow(area) {
    area.style.height = "auto"
    area.style.height = area.scrollHeight + "px";
}

function setSaveBtn(shouldSave) {
    let btn = document.getElementById('saveCards')
    if (shouldSave) {
        btn.classList.remove('saveInactive');
        btn.classList.add('saveActive');
        btn.innerHTML = 'Save'
        btn.disabled = false;
    } else {
        btn.classList.remove('saveActive');
        btn.classList.add('saveInactive');
        btn.innerHTML = 'Saved'
        btn.disabled = true;
    }
}


function checkExist() {
    const setId = localStorage.getItem("setId")
    if (setId) {
        editCards(setId)
    }
    else {
        saveCards()
    }
}


async function saveCards() {
    setSaveBtn(false)
    const obj = createObject();
    fetch("/saveCards", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(obj)
    })
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            let myId = data.setId
            localStorage.setItem("setId", myId)
        })
        .catch(function (err) {
            console.log(err)
        })
}

async function editCards(setId) {
    setSaveBtn(false)
    const obj = createObject();
    //add id, to edit
    obj.setId = setId
    try {
        await fetch("/editCards", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(obj)
        })
    } catch (err) {
        console.log(err)
    }
}

function createObject() {
    let setName = document.getElementById('setName').value.trim()
    let cardFronts = document.getElementsByClassName('cardFront')
    let cardBacks = document.getElementsByClassName('cardBack')
    const myUser = localStorage.getItem("userId")
    console.log('my user: ' + myUser)

    let obj = {
        name: setName,
        owner: myUser,
        cards: []
    }

    for (let i = 0; i < cardFronts.length; i++) {
        obj.cards.push({
            front: cardFronts[i].value.trim(),
            back: cardBacks[i].value.trim()
        });
    }

    return obj
}

function loadSet() {
    const setId = localStorage.getItem("setId");
    const url = "/set?setId=" + setId;

    return fetch(url)
        .then(function (res) {
            return res.json()
        })
        .then(function (data) {
            console.log("Loaded set:", data.set);
            return data.set;
        })
        .catch(function (err) {
            console.log(err);
            return null;
        });
}


function updateScreen() {
    const setId = localStorage.getItem("setId");
    if (setId) {
        loadSet()
            .then(function (cardSet) {
                if (cardSet) {
                    loadCards(cardSet);
                }
            });
    }
}

function loadCards(cardSet) {
    document.getElementById('setName').value = cardSet.name
    for (let i = 0; i < cardSet.cards.length; i++) {
        const currentCard = cardSet.cards[i]
        if (i > 0) {
            addCard()
        }
        document.getElementById('frontInput' + i).value = currentCard.front
        document.getElementById('backInput' + i).value = currentCard.back
    }
}

function logout(){
    localStorage.removeItem('userId');
  }


addCard()