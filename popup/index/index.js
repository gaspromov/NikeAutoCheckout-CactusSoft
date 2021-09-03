var profilesArr = [];
if (searchUrl(window.location.href).indexOf("popup/index/index.html") == 0){
    let currentProf = '';

    var isAccurate = true;

    let  profiles = document.querySelector('header ul li#profiles'); 
    let  release = document.querySelector('header ul li#release');
    let  settings = document.querySelector('header ul li#settings');
    let  time = document.querySelector('.checkoutTime form button');
    let  saveCheckout = document.querySelector('.item #saveCheckout');
    let  exportBtn = document.querySelector('.export button');
    let  importBtn = document.querySelector('.import button');
    let  webhook = document.querySelector('.webhook button');
    let  logoutBtn = document.querySelector('#logout');
    let  checkoutBtn = document.querySelector('#checkout');

// listen button and show/hide tabs
    profiles.addEventListener('click', () => {showTab('profiles')});
    release.addEventListener('click', () => {showTab('release')});
    settings.addEventListener('click', () => {showTab('settings'); });


    this.randomTime.addEventListener( 'click', () => {
        isAccurate = false;
        this.timeSecond.classList.remove('accurate'); 
        this.timeMinus.classList.remove('accurate'); 
        this.randomTime.classList.add('active'); 
        this.accurateTime.classList.remove('active') 
    })
     
    this.accurateTime.addEventListener( 'click', () => { 
        isAccurate = true;
        this.timeSecond.classList.add('accurate'); 
        this.timeMinus.classList.add('accurate'); 
        this.randomTime.classList.remove('active'); 
        this.accurateTime.classList.add('active') } )

    logoutBtn.addEventListener('click', () =>{
        logout();
    })

    time.addEventListener('click', () => { 
        let pattern = /^([0-1]?[0-9]|[2][0-3]):([0-5][0-9]):([0-5][0-9]):([0-9]{3})$/;
        if ( !isAccurate && pattern.test(this.time.value) && pattern.test(this.timeSecond.value)){
            document.querySelector('#time').classList.remove('error');
            document.querySelector('#timeSecond').classList.remove('error');
        }else if ( !pattern.test(this.time.value) ){
            document.querySelector('#time').classList.add('error');
            return;
        }else if ( !isAccurate && !pattern.test(this.timeSecond.value) ){
            document.querySelector('#time').classList.remove('error');
            document.querySelector('#timeSecond').classList.add('error');
            return;
        }
        
        let arrTimeFirst = this.time.value.split(':'); 
        setCheckoutTime(arrTimeFirst[0], arrTimeFirst[1], arrTimeFirst[2], arrTimeFirst[3]);
        if (isAccurate)
            chrome.storage.local.remove( 'secondTime', () => {});
        else{
            let arrTimeSecond = this.timeSecond.value.split(':'); 
            chrome.storage.local.set( { 'secondTime': { hours: arrTimeSecond[0], minutes: arrTimeSecond[1], seconds: arrTimeSecond[2], milliseconds: arrTimeSecond[3] } } );
        }
        outputSettedTime(); 
        showNotification('Saved!');
    });

    saveCheckout.addEventListener('click', () => {
        setRelease(this.checkoutLink.value, this.size.value);
        showNotification('Saved!')
        outputCheckoutLink();
    })
    webhook.addEventListener('click', () =>{
        setWebhook(this.webhook.value);
        outputWebhook();
        showNotification('Saved!')
    })
    exportBtn.addEventListener('click', () => {
        if (exportData()) showNotification('Copied!');
        else showNotification('Error!');
    
    })
    importBtn.addEventListener('click', () =>{
        if (importData(JSON.parse(this.import.value))){
            showNotification('Success!');
            outputAll();
        }
        else showNotification('Error!');
    })
    checkoutBtn.addEventListener('click', () => {
        chrome.storage.local.get('checkout', (res) =>{
            if (res.checkout && res.checkout.link && res.checkout.size){
                chrome.storage.local.set({checkoutNow: true}, () =>{
                    window.open(res.checkout.link + '?cactus-checkout=true', '_blank');
                })
            }else showNotification('Error!');
        })
    })

    this.search.addEventListener('input', () => {
        outputProfiles(searchProfile(profilesArr, this.search.value));
    })
    this.time.addEventListener('input', () => {
        setInputValue(this.time, mask(this.time.value, 9, 0, ':', 2, null, 3));
    })
    this.timeSecond.addEventListener( 'input', () => {
        setInputValue(this.timeSecond, mask(this.timeSecond.value, 9, 0, ':', 2, null, 3));
    })

}











function currentTab(){
    let urlParams = new URLSearchParams(window.location.search);
    let tab = urlParams.get('tab');
    let type = urlParams.get('type')
    if (tab){
        showTab(tab);
        if (type)
        showNotification(type);
    }
}

function outputSettedTime(){
    chrome.storage.local.get( null, (res) => {
        if (res.time)
            this.time.value = `${res.time.hours}:${res.time.minutes}:${res.time.seconds}:${res.time.milliseconds}`;
        if ( res.secondTime ){
            this.timeSecond.value = `${res.secondTime.hours}:${res.secondTime.minutes}:${res.secondTime.seconds}:${res.secondTime.milliseconds}`;
            this.randomTime.click();
        }
    })
}

function outputCheckoutLink(){
    chrome.storage.local.get( 'checkout', (res) => {
        if (res.checkout && res.checkout.link){
            this.checkoutLink.value = res.checkout.link;
            this.size.value = res.checkout.size;
        }
    })
}

function outputWebhook(){
    chrome.storage.local.get( 'webhook', (res) => {
        if (res.webhook)
            this.webhook.value = res.webhook;
    })
}

function outputProfiles(array){
    if (!array){
        chrome.storage.local.get( null, (items) =>{
            let keys = Object.keys(items);
            document.querySelector('#profiles .profiles .others').innerHTML = '';
            document.querySelector('#profiles .profiles .activeProfile').innerHTML = '';
            if (keys)
                for ( key of keys){
                    let current = items.currentProfile == key ? true : false;
                    if ( key != 'currentProfile' && key != 'checkoutNow' && key != 'TGFzdGNoZWNrb3V0VGltZQ' && key != 'secondTime' && key != 'bGljZW5zZV9rZXk=' && key != 'checkout' && key != 'webhook' && key != 'time' && key != 'edittingProfile' ){
                        outputProfile(key, current, items[key].isExpress);
                        profilesArr.push(items[key]);
                    }else if (key== 'currentProfile'){
                        currentProf = items[key];
                    }
                }
            setEventListenersProfiles();
        })
    }else{

        document.querySelector('#profiles .profiles .others').innerHTML = '';
        document.querySelector('#profiles .profiles .activeProfile').innerHTML = '';

        for ( key of array){
            let current = currentProf == key.profileName ? true : false;
            outputProfile(key.profileName, current);
        }
        setEventListenersProfiles();
    }
}

function outputProfile(profileName, active, isExpress){
    let div = document.querySelector('#profiles .profiles .others');
    let head = document.querySelector('#profiles .profiles .activeProfile');
    let targetDiv = active ? head : div;
    let express = isExpress ? `<span class="express">E</span>` : '';
    targetDiv.innerHTML += `
        <div class="profile" id="${profileName}">
            <span id="${profileName}">
                ${express}
                <h4 class="name">${profileName}</h4>
            </span>
            <div class="action">
                <svg xmlns="http://www.w3.org/2000/svg" alt="copy" id="copy" width="13" height="16" viewBox="0 0 13 16" fill="none">
                    <path d="M8.83069 2.79828H1.28338C0.575192 2.79828 0 3.36514 0 4.06308V14.7352C0 15.4331 0.575192 16 1.28338 16H8.83069C9.53887 16 10.1141 15.4331 10.1141 14.7352V4.06308C10.1107 3.36514 9.53555 2.79828 8.83069 2.79828ZM9.21304 14.7319C9.21304 14.9416 9.04015 15.112 8.82737 15.112H1.28005C1.06726 15.112 0.894373 14.9416 0.894373 14.7319V4.06308C0.894373 3.85337 1.06726 3.68298 1.28005 3.68298H8.82737C9.04015 3.68298 9.21304 3.85337 9.21304 4.06308V14.7319Z" fill="#AAAAAA"/>
                    <path d="M11.7166 0H4.16931C3.46113 0 2.88593 0.566865 2.88593 1.2648C2.88593 1.51055 3.08542 1.70715 3.33478 1.70715C3.58414 1.70715 3.78363 1.51055 3.78363 1.2648C3.78363 1.05509 3.95652 0.884702 4.16931 0.884702H11.7166C11.9294 0.884702 12.1023 1.05509 12.1023 1.2648V11.9369C12.1023 12.1466 11.9294 12.317 11.7166 12.317C11.4673 12.317 11.2678 12.5136 11.2678 12.7594C11.2678 13.0051 11.4673 13.2017 11.7166 13.2017C12.4248 13.2017 13 12.6349 13 11.9369V1.2648C13 0.566865 12.4248 0 11.7166 0Z" fill="#AAAAAA"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" alt="edit" id="edit" width="16" height="16" viewBox="0 0 16 16" fill="none">
                    <path d="M15.502 1.94684L14.0521 0.496839C13.3896 -0.165629 12.3118 -0.165597 11.6493 0.496839C11.0256 1.12062 1.49887 10.6481 0.862216 11.2848C0.794403 11.3526 0.748966 11.4427 0.732778 11.5308L0.00784109 15.4458C-0.0202527 15.5976 0.0281223 15.7535 0.137279 15.8627C0.24656 15.972 0.402497 16.0202 0.554091 15.9922L4.46875 15.2671C4.55922 15.2502 4.64815 15.2044 4.71484 15.1377L15.502 4.34974C16.166 3.68574 16.1661 2.61093 15.502 1.94684ZM1.05378 14.9461L1.49231 12.5778L3.42187 14.5075L1.05378 14.9461ZM4.3834 14.1432L1.85656 11.6163L11.0819 2.39024L13.6087 4.91727L4.3834 14.1432ZM14.8391 3.68683L14.2716 4.25436L11.7447 1.72734L12.3122 1.15981C12.6091 0.862869 13.0922 0.862838 13.3892 1.15981L14.8391 2.6098C15.1367 2.90746 15.1367 3.38915 14.8391 3.68683Z" fill="#AAAAAA"/>
                </svg>
                <svg xmlns="http://www.w3.org/2000/svg" alt="delete" id="delete" width="13" height="16" viewBox="0 0 13 16" fill="none">
                    <path d="M8.71164 5.79687C8.5046 5.79687 8.33679 5.96461 8.33679 6.17158V13.2535C8.33679 13.4604 8.5046 13.6282 8.71164 13.6282C8.91869 13.6282 9.0865 13.4604 9.0865 13.2535V6.17158C9.0865 5.96461 8.91869 5.79687 8.71164 5.79687Z" fill="#AAAAAA"/>
                    <path d="M4.28836 5.79687C4.08131 5.79687 3.91351 5.96461 3.91351 6.17158V13.2535C3.91351 13.4604 4.08131 13.6282 4.28836 13.6282C4.49541 13.6282 4.66322 13.4604 4.66322 13.2535V6.17158C4.66322 5.96461 4.49541 5.79687 4.28836 5.79687Z" fill="#AAAAAA"/>
                    <path d="M1.06464 4.76335V13.9953C1.06464 14.541 1.26481 15.0534 1.61447 15.4211C1.96253 15.7898 2.44691 15.9991 2.95384 16H10.0462C10.5532 15.9991 11.0376 15.7898 11.3855 15.4211C11.7352 15.0534 11.9354 14.541 11.9354 13.9953V4.76335C12.6304 4.57893 13.0809 3.90768 12.9879 3.19471C12.8947 2.48189 12.2872 1.94867 11.568 1.94852H9.64876V1.48014C9.65096 1.08626 9.49516 0.708039 9.21622 0.42979C8.93727 0.151688 8.55832 -0.0031709 8.16429 4.92333e-05H4.83571C4.44168 -0.0031709 4.06273 0.151688 3.78379 0.42979C3.50484 0.708039 3.34904 1.08626 3.35124 1.48014V1.94852H1.43203C0.712778 1.94867 0.105254 2.48189 0.0121267 3.19471C-0.0808542 3.90768 0.369554 4.57893 1.06464 4.76335ZM10.0462 15.2506H2.95384C2.31293 15.2506 1.81435 14.7002 1.81435 13.9953V4.79629H11.1857V13.9953C11.1857 14.7002 10.6871 15.2506 10.0462 15.2506ZM4.10094 1.48014C4.09846 1.28503 4.17518 1.09724 4.3137 0.959502C4.45208 0.821768 4.64038 0.746095 4.83571 0.749461H8.16429C8.35962 0.746095 8.54792 0.821768 8.6863 0.959502C8.82482 1.09709 8.90154 1.28503 8.89905 1.48014V1.94852H4.10094V1.48014ZM1.43203 2.69793H11.568C11.9406 2.69793 12.2427 2.99989 12.2427 3.3724C12.2427 3.74491 11.9406 4.04688 11.568 4.04688H1.43203C1.05937 4.04688 0.757292 3.74491 0.757292 3.3724C0.757292 2.99989 1.05937 2.69793 1.43203 2.69793Z" fill="#AAAAAA"/>
                    <path d="M6.5 5.79687C6.29295 5.79687 6.12515 5.96461 6.12515 6.17158V13.2535C6.12515 13.4604 6.29295 13.6282 6.5 13.6282C6.70705 13.6282 6.87485 13.4604 6.87485 13.2535V6.17158C6.87485 5.96461 6.70705 5.79687 6.5 5.79687Z" fill="#AAAAAA"/>
                </svg>
            </div>
        </div>
        ` 
}

function setEventListenersProfiles(){
    let profiles = document.querySelectorAll('#profiles .profiles .profile')
    for (profile of profiles){
        profile.querySelector('span').addEventListener('click', (params) => {  if(params.path[1].id || params.path[0] == 'h4.name'){setCurrentProfile(params.path[1].id ); outputProfiles(); showNotification('Setted!');}})
        profile.querySelector('.action #copy').addEventListener('click', (params) => { copyProfile(params.path[2].id); setTimeout(outputProfiles, 50); showNotification('Copied!'); })
        profile.querySelector('.action #edit').addEventListener('click', (params) => { setEditProfile(params.path[2].id);
             window.location.href = '../profile/newProfile.html'; 
            })
        profile.querySelector('.action #delete').addEventListener('click', (params) => { deleteProfile(params.path[2].id); outputProfiles(); showNotification('Deleted!'); })
    }
}


function isInvalidAuthIndex(){
    if ( !searchUrl(window.location.href).indexOf("popup/auth/auth.html") == 0 )
        window.location.href = '/popup/auth/auth.html';
    chrome.storage.local.remove('bGljZW5zZV9rZXk=', () => {});
}

function outputAll(){
    try{
        checkKey();
    }
    catch(e){
        isInvalidAuthIndex();
    }
    setInterval( () => {
        try{
            checkKey();
        }
        catch(e){
            isInvalidAuthIndex();
        }
    }, 5000 )
    outputSettedTime();
    outputWebhook();
    outputProfiles();
    outputCheckoutLink();
}

if (searchUrl(window.location.href).indexOf("popup/index/index.html") == 0){

    currentTab();
    outputAll();
}