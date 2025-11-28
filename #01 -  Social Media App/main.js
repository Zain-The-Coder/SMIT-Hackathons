let postButton = document.getElementById("post-button");
let article = document.getElementById("article");

postButton.addEventListener("click" , () => { 
    elementGenerator()
});

function elementGenerator () {
    let usernameLogo = document.createElement("div");
    usernameLogo.setAttribute("class" , "avatar");

    let userName = document.createElement("div");
    let userNameSec = document.createElement("strong");
    userName.textContent = localStorage.getItem("theUserName");

    
}

function timeCreator () {
    let time = new Date();
    let hour = time.getHours();
    let minute = time.getMinutes();
    let second = time.getSeconds();

    let day = time.getDay();
    let month = time.getMonth();
    let year = time.getFullYear();

    if (hour < 10){
     hour = "0" + hour;
    }
    if (minute < 10) {
        minute = "0" + minute;
    }
    if (second < 10) {
        second = "0" + second;
    }
    let curruntTime = (`${hour} : ${minute} : ${second}`);
    let curruntDate = (`${day} ${month} ${year}`);
    console.log(curruntDate + "--" + curruntTime);
}
