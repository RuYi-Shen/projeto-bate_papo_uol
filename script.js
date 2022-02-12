let username = "";
let user = {};  //object that contains the username
let message = {};   //object that contains the user message info

let messages = {};  //object that contains all the messages and their infos

/** promises for each type of axios acquisition*/
let promiseStatus;
let promiseParticipants;
let promiseMessagesGet;
let promiseMessagesPost;

reloadMessages();   //to improve user experience, ask beforehand for messages

function logar(){
    username = document.querySelector(".login-screen input").value;
    user = {
        name: username
    }
    promiseParticipants = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", user);
    promiseParticipants.then(enterChat);
    promiseParticipants.catch(verifyError);
}

function enterChat(){
    stayOnline();
    document.querySelector(".login-screen").classList.add("hide");
}

function stayOnline(){
    setInterval(function(){
        promiseStatus = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", user);
        promiseStatus.catch(getError);
        }, 5000);
}

function reloadMessages(){
    setInterval(function(){
        promiseMessagesGet = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
        promiseMessagesGet.then(showMessages);
        promiseMessagesGet.catch(getError);
        }, 3000);
}

function showMessages(answer) {
    messages = answer.data;
    document.querySelector("main").innerHTML = "";
    messages.forEach(showMessage);
}

function showMessage(message){
    const container = document.querySelector("main");
    container.innerHTML += `
    <p class="infos ${message.type}" data-identifier="message"><small>(${message.time})</small> &nbsp;&nbsp; <b>${message.from}</b> &nbsp; para &nbsp; <b>${message.to}</b>: &nbsp; ${message.text}</p>
    `
    container.scrollIntoView(false);
}

function sendMessage(){
    message = {
        from: username,
        to: "Todos",
        text:  document.querySelector("footer input").value,
        type: "message"
    }
    document.querySelector("footer input").value = "";
    promiseMessagesPost = axios.post("https://mock-api.driven.com.br/api/v4/uol/messages", message);
    promiseMessagesPost.then(reloadMessages);
    promiseMessagesPost.catch(reloadPage);
}

function verifyError(error){
    getError(error);
    if (error.response.status === 400) alert("Nome de usuário já existente ou inválido, tente novamente");
}

function reloadPage(error){
    getError(error);
    if (error.response.status === 400) window.location.reload();
}

function getError(error){
    console.log(error.response);
}

function showParticipants(){
    document.querySelector(".black-screen").classList.remove("hide");
    document.querySelector("aside").classList.remove("hide");
}

function hideParticipants(){
    document.querySelector(".black-screen").classList.add("hide");
    document.querySelector("aside").classList.add("hide");
}