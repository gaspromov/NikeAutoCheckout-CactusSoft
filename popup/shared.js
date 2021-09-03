
function mask(value, maxLength, type, symbol, interval, prefix, lastCount){

  let library = '';
  let newStr = '';
  if (symbol)
    value = value.split(symbol).join('');
  let length = 0;

  if (!lastCount) lastCount = 0;

  if (maxLength){
    maxLength > value.length ? length = value.length : length = maxLength;
  }
  else 
    length = value.length;
    
  if (prefix){
    value = value.indexOf(prefix.toString()) == 0 ? value.replace(prefix, '') : value;
  }

  if (type == 'a')
    library = "abcdefghijklmnopqrstuvwxyzABCDEFGHIQJKLMNOPWRSTUVWXYZ";
  else if (type == '0')
    library = '0123456789';
  else if (type == 'A')
    library = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯabcdefghijklmnopqrstuvwxyzABCDEFGHIJQKLMNOPWRSTUVWXYZ';
  else if (type == 'a0')
    library = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNQOPWRSTUVWXYZ0123456789';
  else if (type == '*')
    library = 'абвгдеёжзийклмнопрстуфхцчшщьыъэюяАБВГДЕЁЖЗИЙКЛМНОПРСТУФХЦЧШЩЬЫЪЭЮЯabcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMQNOPWRSTUVWXYZ0123456789'; 

  for (let i = 0; i < length; i++){
    if ( library.indexOf(value[i]) == -1 ){
      break;
    }
    newStr += value[i];
    if (symbol && (i+1) % interval == 0 && i != 0 && i+1 != length && i != length - lastCount+1){
      newStr += symbol;
    }
  }

  if (prefix){
    newStr = prefix.toString() + newStr;
  }
  

  return newStr;
}


function validFirstStr(str, value){
  if (value.indexOf(str) !== 0)
    return false;
  else return true;
}

function setInputValue(input, value){
  input.value = value;
  return;
}

function checkValid(input){
  let valid = input.checkValidity() ?  true : false;
  return valid;
}

function checkValidInputs(inputs, errorClass){
  let valid = true;
  for (let i = 0; i < inputs.length; i++){
    if (!checkValid(inputs[i])){
      valid = false;
      inputs[i].classList.add(errorClass.toString());
    }else{
      inputs[i].classList.remove(errorClass.toString());
    }
  }
  return valid;
}
const url = 'https:/cactus-manager.ru/api/v1/devices';
function showTab(idTab){
  hideTab();
  document.querySelector(`section#${idTab}`).classList.add("active");
  document.querySelector(`header ul li#${idTab}`).classList.add("active");
}

function hideTab(){
  document.querySelector(`section.active`).classList.remove("active");
  document.querySelector(`header ul li.active`).classList.remove('active');
}


function searchUrl(url){
  let start = url.indexOf('popup');
  return url.slice(start, url.length);
}

function importData(value){
  try{
    console.log(value)
    chrome.storage.local.set(value, () => {});
    return true;
  }
  catch(e){
    return false;
  }
}

function exportData(){
  try{
    chrome.storage.local.get( null, (result) => {
      this.dataExport.value = JSON.stringify(result);
      this.dataExport.select();
      document.execCommand("copy");
    })
    return true;
  }
  catch(e){
    return false;
  }
}

function setCheckoutTime(hours, minutes, seconds, milliseconds){
  chrome.storage.local.set( {
    'time': {
      hours: hours,
      minutes: minutes,
      seconds: seconds,
      milliseconds: milliseconds 
    }
  })
}

function setRelease(link, size){
  chrome.storage.local.remove('checkout', () => {})
  chrome.storage.local.set( {
    'checkout': {
      link: link,
      size: size
    }
  })
}

function setWebhook(link){
  chrome.storage.local.remove('webhook', () => {})
  chrome.storage.local.set( {
    'webhook': link
  })
}

function setProfile(name, data, edittingProfile){
  chrome.storage.local.remove(name.toString(), () => {})
  chrome.storage.local.remove(edittingProfile.toString(), () => {})
  chrome.storage.local.set({
    [name]: data
  })
  
}

function deleteProfile(name){
  chrome.storage.local.remove( name, () => {} );
}

function copyProfile(name, count){
  if (count)
    count++;
  else
    count = 1;
  newName = name + count.toString();
  valid = true;

  chrome.storage.local.get( null, (items) =>{
    let keys = Object.keys(items);
    if (keys)
        for ( key of keys){
            if ( key == newName ){
              valid = false;
              copyProfile(name, count);
              break;
            }
        }
  })
  if (valid){
    chrome.storage.local.get(name, (res) =>{
      res[name].profileName = newName;
      chrome.storage.local.set({
        [newName]: res[name]
      })
    })
    return true;
  }else return false;
}

function setCurrentProfile(name){
  chrome.storage.local.remove( 'currentProfile', () => {} );
  chrome.storage.local.set( {currentProfile: name} );
}

function setEditProfile(name){
  chrome.storage.local.set({ edittingProfile: name })
}

function unsetEditProfile(){
  chrome.storage.local.remove('edittingProfile')
}

function searchProfile(profiles, param){
  if (param != ''){
    let filter = profiles;
    filter = filter.filter(
      ell => {
        return ell.profileName.toLowerCase().indexOf(param.toLowerCase()) === 0

      }
    );
    return filter;
  }
  else return profiles;
}

function logout(){
  chrome.storage.local.clear(() => {
    window.location.href = '../auth/auth.html';
  });
}

function showNotification(message){
  this.notification.classList.add('show');
  this.notification.innerHTML = message;
  setTimeout(() => {
    this.notification.classList.remove('show');
  }, 2500);
}
