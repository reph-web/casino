let pictures = [
    './assets/img/bomb.png',
    './assets/img/ghost.png',
    './assets/img/champ.png',
    './assets/img/flow.png',
    './assets/img/star.png',
    './assets/img/7.png'
]


pictures.push(pictures[0]);
pictures.splice(0, 0, pictures[pictures.length-2]);

const HEIGHT = 200; //in px
const WIDTH = 200; //in px

var TIMING = 100;
var ANIM_DURATION = 50; //in ms
var isSpinning = false;

function spinnerSetup(targetName, pictures){
    let spinnerObj = {
        i : pictures.length - 1,
        pos : HEIGHT*(pictures.length - 1)
    }
    //set height,width and animation duration css var 
    document.documentElement.style.setProperty('--WIDTH', `${WIDTH}px`);
    document.documentElement.style.setProperty('--HEIGHT', `${HEIGHT}px`);
    document.documentElement.style.setProperty('--CHEIGHT', `${HEIGHT}px`);
    document.documentElement.style.setProperty('--ANIM_DURATION', `${ANIM_DURATION}ms`)

    //create pictures in the img-container
    for(pic in pictures){
        let img = document.createElement('img');
        //setup by start on index 1
        img.style.transform = `translateY(-${HEIGHT*(pictures.length - 2)-50}px)`;

        img.classList.add('frame');
        img.classList.add('t');
        img.setAttribute('src', pictures[pic]);

        let target = document.getElementById(targetName);
        target.appendChild(img);
    }

    return spinnerObj;
}

function spinAnimation(container, spinnerObj){
    //in ms
    let imgs = document.getElementById(container).getElementsByClassName('frame');
    spinnerObj.i--;
    spinnerObj.pos -= HEIGHT;


    if(spinnerObj.i === 0){
    //if it's the first element, we need to go back to index -2 (without transform-duration
    //for making it seamless)

    //last animation before reset
        for(elem of imgs){
            elem.style.transform = `translateY(0)`;
        }

        spinnerObj.i = pictures.length - 2;
        spinnerObj.pos = ((pictures.length - 2) * HEIGHT);

        //wait for end of transition and go to last picture without animation
        let regen = imgs[0].addEventListener('transitionend', function (){
            for(elem of imgs){
                elem.classList.remove('t');
                elem.style.transform = `translateY(-${spinnerObj.pos-50}px)`;
            }
            
            //re-add animation
            setTimeout(function(){
                for(elem of imgs){
                    elem.classList.add('t');
                }
            }, 0);
        })
        imgs[0].removeEventListener('transitionend', regen);
    }else{
        for(elem of imgs){
            elem.style.transform = `translateY(-${spinnerObj.pos-50}px)`;
        }
    }
}

function spin(container, spinnerObj){
    if(isBetIncorrect()){
        return;
    }
    let firstPartAnimation = setInterval(function(){
        spinAnimation(container, spinnerObj);
    }, TIMING)

    setTimeout(function(){
        clearInterval(firstPartAnimation);

        let result = Math.floor(Math.random() * 6);
        finalResult.push(result);

        let secondPartAnimation = setInterval(function(){
            spinAnimation(container, spinnerObj);
            if(spinnerObj.i-1 === result){
                clearInterval(secondPartAnimation);
            }
        }, TIMING)
    },3000);

}

let spinnerOne = spinnerSetup('spinOne', pictures);
let spinnerTwo = spinnerSetup('spinTwo', pictures);
let spinnerThree = spinnerSetup('spinThree', pictures);
var finalResult = [];


document.getElementById('spinBtn').addEventListener('click', function(){
    let credit = parseInt(document.getElementById("credit").innerText);
    let bet = parseInt(document.getElementById("bet").value);
    if(isBetIncorrect(bet, credit)){
        return;
    }
    isSpinning = true
    spin('spinOne', spinnerOne);

    setTimeout(function(){
        spin('spinTwo', spinnerTwo);
    }, 300);

    setTimeout(function(){
        spin('spinThree', spinnerThree);
    }, 600);

    setTimeout(function(){
        isSpinning = false
        calcCredit(bet, credit, finalResult);
        finalResult = [];
    }, 4000)
})

function calcCredit(bet, credit, finalResult){
    //var
    let modBet = -1;
    let s1 = finalResult[0];
    let s2 = finalResult[1];
    let s3 = finalResult[2];

    //winning condition
    console.log(s1, s2, s3);
    if(s1 === s2 && s2 === s3){ // calculate winning if 3 same symbols
        console.log("winning");
        switch(s1){
            case 0:
                modBet *= 2;
                break;
            case 1:
                modBet *= 3;
                break;
            case 3:
                modBet *= 4;
                break;
            case 4:
                modBet *= 5;
                break;
            case 5:
                modBet *= 10;
                break;
        }
    }else if(s1 === s2 || s2 === s3){
        console.log("winning"); // calculate  winning if 2 same symbole adjacent
        switch(s1 === s2 ? s2 : s3){
            case 0:
                modBet *= 0.5;
                break;
            case 1:
                modBet *= 0.75;
                break;
            case 3:
                modBet *= 1.25;
                break;
            case 4:
                modBet *= 1.5;
                break;
            case 5:
                modBet *= 1.75;
                break;
        }
    }

    gainSpan = document.getElementById(gain);
    if(modBet >= 1){
        gain.innerText = 'Gain: $' + (modBet*bet);
        gain.style.color = 'green';
    }else{
        gain.innerText = 'Loss: -$' + (-modBet*bet);
        gain.style.color = 'red';
    }
 
    

    let finalCredit = credit + bet*modBet;
    finalCredit < 0 ? 0 : finalCredit;
    if(!finalCredit){ //alert if you lose all your credit
        Swal.fire({
            text :'GAME OVER\nYou lose all your credit, please reload your balance'
            })
    }
    document.getElementById("credit").innerText = finalCredit;
}

function isBetIncorrect(bet, credit){
    var swalCustom = Swal.mixin({
        customClass: {
          confirmButton: "btn alert-btn",
          input: 'alert-input',
          text : 'alert-text',
          title : 'alert-title'
        },
        color: '#fff',
        background:'#181818',
        buttonsStyling: false
      });
    if(credit === 0 && bet !== 0){
        swalCustom.fire("Your balance is empty, please reload.");
        return true;
    }
    if(bet < 0 || bet > credit){
        swalCustom.fire({
            text : "Please make a bet between 0 and your current credit"
        });      
        return true;
    }
    return false;
}


// Refill button

document.getElementById('addBtn').addEventListener('click', function(){
    var swalCustom = Swal.mixin({
        customClass: {
          confirmButton: "btn alert-btn",
          input: 'alert-input',
          text : 'alert-text',
          title : 'alert-title'
        },
        color: '#fff',
        background:'#181818',
        buttonsStyling: false
      });

    swalCustom.fire({
        title: "Enter how much you want to refill:",
        input: "text"
    }).then((result) => {
        console.log(result);
        let isNull = !result ? true : false;
        let addedCredit = isNull ? 0 : parseFloat(result.value);

        if(addedCredit<0 || (isNaN(addedCredit) && !null)){
            addedCredit = 0
            swalCustom.fire({title : "Invalid value", text:"Enter Positive Number"}) 
        }
        
        let actualCredit = parseFloat(document.getElementById("credit").innerText);
        document.getElementById("credit").innerText = actualCredit + addedCredit; 
    })
})

// Increase et decrease button
document.getElementById('incBetBtn').addEventListener('click', function(){
    let betInput = document.getElementById('bet');
    betInput.value = parseFloat(betInput.value) + 1;
})
document.getElementById('decBetBtn').addEventListener('click', function(){

    let betInput = document.getElementById('bet');
    console.log(parseFloat(betInput));
    if(parseFloat(betInput.value) > 0){
        betInput.value = parseFloat(betInput.value) - 1;
    }
})