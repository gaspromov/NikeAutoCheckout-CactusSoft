// made by Gaspromov & Cactus-web

 
const ids = [                                                                         // id полей, которые нужно заполнить
    'firstName', 'middleName', 'lastName', 'addressLine1',
    'addressLine2', 'city', 'region', 'postCode', 'phone', 'email',                 //continue
    'cardNumber-input', 'cardExpiry-input', 'cardCvc-input'                         //continue
];


const paramDispatch = {bubbles: true}; 
let currentInput;                                                                   // current Input for setting Value
let continueButton;                                                                 // current button for next step to filling
let newCardIframe;
 

function setCurrentInput(id){                                                       // set current input by id
    if (id !== 'phone')
        currentInput = document.getElementById(id);
    else 
        currentInput = document.querySelector('#phone input');
}


function focus(elem){                                                               // focus to input
    if (elem)
        elem.focus();
}

function setValue(elem, value){                                                     // setting value for input
    if (elem && value)
        elem.value = value;
}
 
function dispatchEventFor(elem, param){                                             // do some event with input
    if (elem)
        elem.dispatchEvent(new Event( param, this.paramDispatch ));
}

function blur(elem){                                                                // blur or unfocus to input
    if (elem)
        elem.blur();
}


function setValueInput(value){                                                      // all for good setting value to input

    focus(currentInput);
    // setTimeout(dispatchEventFor, 500, currentInput, 'keydown')
    setTimeout(() => {
        dispatchEventFor(currentInput, 'keydown');
        setValue(currentInput, value);
        dispatchEventFor(currentInput, 'change');                                       // event on change smth
        dispatchEventFor(currentInput, 'input');                                        // event on input
    }, 200);
    setTimeout(blur, 500, currentInput);
}

async function doFilling(start, end, profile){                                                     // filling inputs from start to end input
    for (let i=start; i <= end; i++){
            if (i !=6)
                setTimeout(() => {
                    setCurrentInput(ids[i]);
                    setValueInput(profile[i]);
                }, i*800);
            else{
                setCurrentInput(ids[i]);
                setValueInput(profile[i]);
            }
    }
}
 
function clickContinue(){                                                           // clicking continue for new step to filling
    if (document.querySelector('button.button-continue')){
        continueButton = document.querySelector('button.button-continue');
        continueButton.click();
    }
}
 
function setNewCard(){                                                              // setting new card
    if (document.querySelector('div.new-card-link'))
        document.querySelector('div.new-card-link').click();
}

// function iframeInputs(){
//     newCardIframe = document.querySelector(`iframe.newCard`).contentWindow.document;
// }

function clickCheckBox(){
    if (!document.querySelector('.gdpr-consent input').checked)
        document.querySelector('.gdpr-consent span.checkmark').click();
}
 
 
 function doFillingAll(profile){
    if (!profile[13]){
        setTimeout(doFilling, 1000, 0, 9, profile);
        setTimeout(clickContinue, 9000);
        setTimeout( setNewCard, 9500);
        setTimeout(doFilling, 9500, 10, 12, profile);
        setTimeout(clickContinue, 14000);
    
        setTimeout(clickCheckBox, 15000);
    }
    else{
        setTimeout(doFilling, 1000, 1, 1, profile);
        setTimeout(clickContinue, 3000);
        setTimeout( setNewCard, 4000);
        setTimeout(doFilling, 1000, 10, 12, profile);
        setTimeout(clickContinue, 14000);
    
        setTimeout(clickCheckBox, 15000);
    }
 }

 function check(profile){
     if (document.getElementById('firstName')) doFillingAll(profile);
     else timeOutCheck(profile);
 }
 
 function timeOutCheck(profile){
     setTimeout(check, 50, profile);
 }


 function doFillingIframe(profile){
    setTimeout(doFilling, 1000, 10, 12, profile);
 }

 function checkIframe(profile){
     if (document.getElementById('cardNumber-input')) doFillingIframe(profile);
     else timeOutCheckIframe(profile);
 }

 function timeOutCheckIframe(profile){
     setTimeout(checkIframe, 100, profile);
 }
 
function doCheck(h, m, s, ms){
    now = new Date();
    try{
    if (now.getHours() == h && now.getMinutes() == m && now.getSeconds() == s && now.getMilliseconds() >= ms || now.getHours() > h){
        chrome.storage.local.set( {'TGFzdGNoZWNrb3V0VGltZQ': `${h}:${m}:${s}:${ms}`}, () => {
            let btn = document.querySelector("div.buttonContainer > button.button-submit");
            if ( btn )
                btn.click();
        });
    }else if (now.getHours() == h && now.getMinutes() == m && now.getSeconds() > (s-2)){
        timeout(10, h, m, s, ms);
    }else {
        timeout(500, h, m, s, ms);
    }
    }
    catch(e) {}
 
}
    
function timeout(t, h, m, s, ms){
    setTimeout(doCheck, t, h, m, s, ms);
}
    

 function start(profile){
    timeOutCheck(profile);
    timeOutCheckIframe(profile);
 }

 try{
    chrome.storage.local.get( 'bGljZW5zZV9rZXk=', (lic) => {
        if (lic['bGljZW5zZV9rZXk='])
            chrome.storage.local.get( 'currentProfile', (result) => {
                let currentProfile = result.currentProfile;
                if (currentProfile){
                    
                   chrome.storage.local.get ( currentProfile, async (result) => {
                       if (result[currentProfile]){
                        currentProfile = await result[currentProfile];
                        let curr = [currentProfile.firstName, currentProfile.middleName, currentProfile.lastName, currentProfile.addressLine1,
                            currentProfile.addressLine2, currentProfile.city, currentProfile.region, currentProfile.postCode, currentProfile.phone, currentProfile.email,
                            currentProfile.cardNumber, currentProfile.cardExpiry, currentProfile.cardCvc, currentProfile.isExpress
                        ];
                        start(curr);
                       }
                   })
               }
            })
    })
 }
 catch(e){
 }

 try{
    chrome.storage.local.get( 'time', (result) => {
        chrome.storage.local.get('secondTime', (res) =>{
            if (res.secondTime){
                let randomTime = generateRandomeTime(result.time, res.secondTime);
                console.log(randomTime);
                doCheck(randomTime.hours, randomTime.minutes, randomTime.seconds, randomTime.milliseconds);
            }
            else{
                let h = result.time.hours;
                let m = result.time.minutes;
                let s = result.time.seconds;
                let ms = result.time.milliseconds;
                doCheck(h, m, s, ms);
            }
        })
    } )
 }
 catch(e){}

function getRandomeInt(min, max){
    min = Number(min);
    max = Number(max);
    return Math.floor(Math.random() * (max - min+1) ) + min;
}


function generateRandomeTime(firstTime, secondTime){
    
    let firstH = Number(firstTime.hours);
    let firstM = Number(firstTime.minutes);
    let firstS = Number(firstTime.seconds);
    let firstMS = Number(firstTime.milliseconds);

    let secondH = Number(secondTime.hours);
    let secondM = Number(secondTime.minutes);
    let secondS = Number(secondTime.seconds);
    let secondMS = Number(secondTime.milliseconds);

    let newH; let newM; let newS; let newMS;

    if (firstH == secondH && firstM == secondM && firstS == secondS && firstMS < secondMS){
        newH = firstH;
        newM = firstM;
        newS - firstS;
        newMS = getRandomeInt(firstMS, secondMS);
    }else 

    if (firstH == secondH && firstM == secondM && firstS < secondS){
        newH = firstH;
        newM = firstM;
        newS = getRandomeInt(firstS, secondS);
        if (firstS == newS)
            newMS = getRandomeInt(firstMS, 999);
        else if (secondS == newS)
            newMS = getRandomeInt(0, secondMS);
        else newMS = getRandomeInt(0, 999);
    }else

    if (firstH == secondH && firstM < secondM){
        newH = firstH;
        newM = getRandomeInt(firstM, secondM);
        if (firstM == newM)
            newS = getRandomeInt(firstS, 59);
        else if (secondM == newM)
            newS = getRandomeInt(0, secondS);
        else newS = getRandomeInt(0, 59);

        if (firstS == newS)
            newMS = getRandomeInt(firstMS, 999);
        else if (secondS == newS)
            newMS = getRandomeInt(0, secondMS);
        else newMS = getRandomeInt(0, 999);
    }else 

    if (firstH < secondH){
        newH = getRandomeInt(firstH, secondH);
        if (firstH == newH)
            newM = getRandomeInt(firstM, 59);
        else if (secondH == newH)
            newM = getRandomeInt(0, secondM);
        else newM = getRandomeInt(0, 59);

        if (firstM == newM)
            newS = getRandomeInt(firstS, 59);
        else if (secondM == newM)
            newS = getRandomeInt(0, secondS);
        else newS = getRandomeInt(0, 59);

        if (firstS == newS)
            newMS = getRandomeInt(firstMS, 999);
        else if (secondS == newS)
            newMS = getRandomeInt(0, secondMS);
        else newMS = getRandomeInt(0, 999);
    }

    return {hours: newH, minutes: newM, seconds: newS, milliseconds: newMS};
}