function passwordToggle() {
    const showPassword = document.getElementById('showPassword')
    const passwordField = document.getElementById('password')

    showPassword.addEventListener('click', function() {
        this.classList.toggle('fa-eye-slash')
        let type = passwordField.getAttribute('type')
        if (type == 'password') {
            type = 'text'
        }
        else {
            type = 'password'
        }
        passwordField.setAttribute('type',type)
    })
}
passwordToggle()


function loginError() {
    const errorMsg = document.getElementById('errorMsg')
    if (errorMsg) {
        errorMsg.style.color = "red"
        errorMsg.innerText = "Incorrect email or password!"
    }
}


function registerError() {
    const authMsg = document.getElementById('authMsg')
    if (authMsg) {
        authMsg.style.color = "red"
        authMsg.innerText = "User already exists or invalid!"
    }
}


function sendReq(url) {
    const email = document.getElementById('email').value.trim()
    const password = document.getElementById('password').value

    const userObj = {'email':email, 'password':password}
    fetch(url, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(userObj)
    })
    .then(function (res) {
        return res.json()
    })
    .then(function(data) {
        if (data.message == "Success") {
            const authMsg = document.getElementById('authMsg')
            //then we're in register page
            //so send to login
            if (authMsg) {
                authMsg.style.color = "green"
                authMsg.innerText = "User successfully created!"
                //wait a little, so user knows account was successfully created
                setTimeout(() => {
                    window.location.href = "login.html";
                }, 1200);
            }
            else {
                //we're in login, so sends to home page
                window.location.href = "home.html";
            }
        }
        else {
            loginError()   
            registerError()      
        }
    })
    .catch(function(err) {
        console.log(err)
    })
}