let username = "";
let user = {};  //object that contains the username
let message = {};   //object that contains the user message info

let messages = {};  //array of objects that contains all the messages and their infos
let participants = {}; //array of objects that contains all the participants names

/** promises for each type of axios acquisition*/
let promiseStatus;
let promiseMessagesGet;
let promiseMessagesPost;
let promiseParticipantsGet;
let promiseParticipantsPost;

loadMessages();   //to improve user experience, ask beforehand for messages
//loadParticipants(); //to improve user experience, ask beforehand for participants

function login(){
    username = document.querySelector(".login-screen input").value;
    user = {
        name: username
    }
    promiseParticipantsPost = axios.post("https://mock-api.driven.com.br/api/v4/uol/participants", user);
    promiseParticipantsPost.then(enterChat);
    promiseParticipantsPost.catch(verifyError);
}

function enterChat(){
    stayOnline();
    reloadMessages();
    //reloadParticipants();
    document.querySelector(".login-screen").classList.add("hide");
}

function stayOnline(){
    setInterval(function(){
        promiseStatus = axios.post("https://mock-api.driven.com.br/api/v4/uol/status", user);
        promiseStatus.catch(getError);
        }, 5000);
}

function reloadMessages(){
    setInterval(loadMessages, 3000);
}

function loadMessages(){
    promiseMessagesGet = axios.get("https://mock-api.driven.com.br/api/v4/uol/messages");
    promiseMessagesGet.then(showMessages);
    promiseMessagesGet.catch(getError);
}

function showMessages(answer) {
    messages = answer.data;
    document.querySelector("main").innerHTML = "";
    messages = messages.filter(filterMessages);
    messages.forEach(showMessage);
}

function filterMessages(message){
    if (message.from === username || message.to === username || message.to === "Todos") return true;
}

function showMessage(message){
    const container = document.querySelector("main");
    if(message.type === "status"){
        container.innerHTML += `
        <p class="infos ${message.type}" data-identifier="message"><small>(${message.time})</small> &nbsp;&nbsp; <b>${message.from}</b> &nbsp;&nbsp; ${message.text}</p>
        `
    }else{
        container.innerHTML += `
        <p class="infos ${message.type}" data-identifier="message"><small>(${message.time})</small> &nbsp;&nbsp; <b>${message.from}</b> &nbsp; para &nbsp; <b>${message.to}: </b> &nbsp; ${message.text}</p>
        `
    }
    container.scrollIntoView(false);
}

function reloadParticipants(){
    setInterval(loadParticipants, 10000);
}

function loadParticipants(){
    promiseParticipantsGet = axios.get("https://mock-api.driven.com.br/api/v4/uol/participants");
    promiseParticipantsGet.then(showParticipants);
    promiseParticipantsGet.catch(getError);
}

function showParticipants(answer) {
    participants = answer;
    console.log(answer);
    console.log(answer.data);
    document.querySelector("aside .contacts").innerHTML = "";
    participants.forEach(showParticipant);
}

function showParticipant(participant){
    const container = document.querySelector("aside .contacts");
    container.innerHTML += `
    <div class="contact">
        <ion-icon name="person-circle"></ion-icon>
        <p>${participant.name}</p>
    </div>
    `
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

document.querySelector("footer input").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) sendMessage();
    });

document.querySelector(".login-screen input").addEventListener("keyup", function(event) {
    if (event.keyCode === 13) login();
    });