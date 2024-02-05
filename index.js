
let pictures = [
    './img/blackforestcake.jpg',
    './img/lemonpie.jpeg',
    './img/redvelvetcake.jpg'
]


pictures.push(pictures[0]);
pictures.splice(0, 0, pictures[pictures.length-2]);

const HEIGHT = 200; //in px
const WIDTH = 200; //in px

var TIMING = 100;
var ANIM_DURATION = 50; //in ms

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
    let firstPartAnimation = setInterval(function(){
        spinAnimation(container, spinnerObj);
    }, TIMING)

    setTimeout(function(){
        clearInterval(firstPartAnimation);

        let result = Math.floor(Math.random() * 3);
        finalResult.push(result);

        let secondPartAnimation = setInterval(function(){
            spinAnimation(container, spinnerObj);
            console.log(container, spinnerObj.i-1, result);
            if(spinnerObj.i-1 === result){
                clearInterval(secondPartAnimation);
            }
        }, TIMING)
    },3000);

}

document.getElementById('test1').addEventListener('click', function(){
    spinAnimation('spinOne', spinnerOne);

});

var finalResult = [];

let spinnerOne = spinnerSetup('spinOne', pictures);
spin('spinOne', spinnerOne);

let spinnerTwo = spinnerSetup('spinTwo', pictures);
spin('spinTwo', spinnerTwo);

let spinnerThree = spinnerSetup('spinThree', pictures);
spin('spinThree', spinnerThree);

console.log(finalResult)

//Le code pour Javascript pour le jeu du spin

// il s'agit de la fonction qui renvoi les valeurs aleatoires  et qui est appelee a chaque tour de jeu.
