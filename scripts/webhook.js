// const sendWb = document.querySelector('header #release');

var error = false;
let intervalCheckAnswere;
let whSended = false;

// sendWb.addEventListener('click', () =>{
//   getUrl_send();
// })

body = {
  "username": "CactusWeb",
  "avatar_url": "https://sun9-50.userapi.com/FHg3gfpQCmtgygpjK-kE3cOI93-TR3CBPD1fsw/1FOHstfEEMY.jpg",
  "embeds": [
    {
      "title": "Dashboard",
      "url": "https://dashboard.cactusweb.io/604797da082e6751f73ed5c3/dashboard",
      "description": "Text message. You can use Markdown here. *Italic* **bold** __underline__ ~~strikeout~~ [hyperlink](https://google.com) `code`",
      "color": 1938152,
      "fields": [
        {
          "name": "Time",
          "value": "randomTime",
          "inline": true
        },
        {
          "name": "Profile",
          "value": "profileName",
          "inline": true
        }
      ],
      "footer": {
        "text": "Have a good day!",
      }
    }
  ]
}




document.addEventListener('DOMContentLoaded', () => {
  chrome.storage.local.get( 'bGljZW5zZV9rZXk=', (lic) => {
    if (lic['bGljZW5zZV9rZXk=']){
      intervalCheckAnswere = setInterval(() => {
        getUrlParams();
      }, 500);
    }
      
  })

})







async function sendWh(){

  if ( !whSended ){
    whSended = true;

    chrome.storage.local.get('webhook', async (res) => {

      if ( res.webhook )
        await fetch(res.webhook, {
          method: 'POST',
          headers: {
           'Content-Type': 'application/json;charset=utf-8'
          },
          body: JSON.stringify(body)
        })
          .then( () => {})
          .catch( () => {})

    })
  }


} 

function getUrlParams(){
  let urlParams = new URLSearchParams(window.location.search);
  let launchEntryId = urlParams.get('launchEntryId');
  // LAUNCH_NOT_ACTIVE

  if (
    window.location.href.toLocaleLowerCase().includes('launch') && window.location.href.toLocaleLowerCase().includes('not') && window.location.href.toLocaleLowerCase().includes('active')
      || window.location.href.toLocaleLowerCase().includes('error')
  ){
    chrome.storage.local.get( null, async (res) => {
      if (res.currentProfile){
          clearInterval( intervalCheckAnswere );
          setDataMessage(res.currentProfile, res['TGFzdGNoZWNrb3V0VGltZQ'], '**`Status: Error`**.\nЧто-то пошло не так - ошибка входа в очередь.\n\n', true);
          await sendWh();
      }
    })
  }
  else if (launchEntryId)
    checkAnswere();
}

// bGljZW5zZV9rZXk=

function setDataMessage(profile, time, message, error){
  body.embeds[0].fields[0].value = time ? time : 'Undefined';
  body.embeds[0].fields[1].value = profile ? profile : 'Undefined';
  body.embeds[0].description = message;
  body.embeds[0].color = error ? 12010055 : 367212;
}


function checkAnswere(){
  if (document.querySelector('.ncss-row .ncss-row h3.headline-3')){
    let head = document.querySelector('.ncss-row .ncss-row h3.headline-3').innerHTML;
    let message = head.toLocaleLowerCase() == 'они твои' ? 'Поздравляю! Успешная покупка.' : 'К сожалению, в этот раз не повезло.';
    let status = head.toLocaleLowerCase() == 'они твои' ? false : true;
    message = '**`Status: ' + head + '`**\n' + message + '\n\n';

    chrome.storage.local.get( null, async (res) => {
      if (res.currentProfile){
            setDataMessage(res.currentProfile, res['TGFzdGNoZWNrb3V0VGltZQ'], message , status)
            await sendWh();
      }
    })

  }else setTimeout(checkAnswere, 1000);
}

