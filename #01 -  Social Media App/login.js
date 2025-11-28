    

let printer = document.getElementById("print");
let userName = JSON.parse(localStorage.getItem("theUserName")) || [] ;
let userEmail = JSON.parse(localStorage.getItem("theUserEmail")) || [] ;
let userPassword = JSON.parse(localStorage.getItem("theUserPassword")) || [] ;

   function signUp () {
let nameTaker = nameChecker();
let emailTaker = emailChecker();
let passwordTaker = passwordChecker();

let atCount = 0;
let error = false ;
    for(let i = 0; i < emailTaker.length; i++) {
        if(emailTaker[i] === "@") {
            atCount++ ;
        }
    } 
    for(let i = 0 ; i < emailTaker.length; i++) {
        if (emailTaker[i] === " " ){    
                error = true ;
            }
        }
    
    if(!nameTaker || !emailTaker || !passwordTaker) {
        printer.innerHTML = "Please Fill The Above All Requirements !" ;
        printer.style.color = "red" ;
        return ;
    }
    let userInfo = {
        Name : nameTaker ,
        Email : emailTaker , 
        Password : passwordTaker,
    }
    let x = localStorage.getItem("theUserName") ;
    let y = localStorage.getItem("theUserEmail") ;
    let z = localStorage.getItem("theUserPassword") ;

    if(x) {
        userName = JSON.parse(x) ;
    } 
    if(y) {
        userEmail = JSON.parse(y) ;
    } 
    if(z) {
        userPassword = JSON.parse(z);
    }

    if(atCount !== 1) {
        printer.innerHTML = "Please Use Valid Email !" ;
        return ;
    } 
    if(error === true) {
        printer.innerHTML = "Please Remove Spaces From Email !" ;
        return ;
    } 


    if(userName.includes(userInfo.Name)) {
        printer.innerHTML = "The Username Is Already Been Taken !" ;
        return ;
    } 
    if(userEmail.includes(userInfo.Email)) {
        printer.innerHTML = "This Email Is Already Been Registered !" ;
        return ;
    }
    if(userInfo.Password.length < 6) {
        printer.innerHTML = "Please Enter 6 Digits Password !" ;
        return ;
    }
    userName.push(nameTaker);
    userEmail.push(emailTaker) ;
    userPassword.push(passwordTaker);

    localStorage.setItem("theUserName" , JSON.stringify(userName)) ;
    localStorage.setItem("theUserEmail" , JSON.stringify(userEmail)) ;
    localStorage.setItem("theUserPassword" , JSON.stringify(userPassword)) ;

    printer.innerHTML = "Login Successfully !" ;
    printer.style.color = "green" ;

    document.getElementById("formField1").value = "" ;
    document.getElementById("formField2").value = "" ;
    document.getElementById("formField3").value = "" ;
    console.log(userName) ; console.log(userEmail) ; console.log(userPassword); 
}

function nameChecker () {
    let x = document.getElementById("formField1").value ;
    return x;
}
function emailChecker () {
    let y = document.getElementById("formField2").value ;
    return y;    
}
function passwordChecker () {
    let z = document.getElementById("formField3").value ;
    return z;
}

let printer2 = document.getElementById("priint");


function signIn () {
    window.location.href = "./signIn.html" ;
}
function login () {
    let nameTaker1 = takerName() ;
    let emailTaker1 = takerEmail() ;
    let passwordTaker1 = takerPassword() ;
    let matchedUsername = userName.indexOf(nameTaker1) ;

    if(!nameTaker1 || !emailTaker1 || !passwordTaker1) {
        printer2.innerHTML = "Please Fill The Above Required Fields !" ;
        return ;
    }
    
    if(matchedUsername === -1) {
        printer2.innerHTML = "User Doesn't Exist. " + "<br>" +  "You Should Check User Name !" ;
        return ; 
    }
    if(userEmail[matchedUsername] !== emailTaker1) {
        printer2.innerHTML = "Your Email Address Is Wrong !" ;
        return ;
    } 
    if(userPassword[matchedUsername] !== passwordTaker1) {
        printer2.innerHTML = "Incorrect Password !" ;
        return ;
    }
    printer2.innerHTML = "Welcome " + nameTaker1 + " Login Successfully !" ;
    document.getElementById("form1").value = "" ;
    document.getElementById("form2").value = "" ;
    document.getElementById("form3").value = "" ;
}

function takerName () {
    let a = document.getElementById("form1").value ;
    return a ;
}
function takerEmail () {
    let b = document.getElementById("form2").value ;
    return b ;
}
function takerPassword () {
    let c = document.getElementById("form3").value ; 
    return c ;
}

// setInterval(() => {
//     window.loca
// }, 500);