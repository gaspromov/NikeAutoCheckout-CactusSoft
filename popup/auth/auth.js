if (searchUrl(window.location.href) == "popup/auth/auth.html"){
  let sendKey = document.getElementById('auth');
  let importBtn = document.querySelector('form#importWay button');
  let keyWay = document.querySelector('.way button#keyWay');
  let importWay = document.querySelector('.way button#importWay');

  sendKey.addEventListener( 'click', () =>{
      auth();
  })

  importBtn.addEventListener( 'click', () => {
      importData(this.importInput.value);
      switch(true){
          case 'key': showNotification(true); break;
          default: auth();
      }
  })

  keyWay.addEventListener('click', () => {
    hideWay('keyWay');
  })
  importWay.addEventListener('click', () => {
    hideWay('importWay');
  })


  this.key.addEventListener('input', () => {
    setInputValue(this.key, mask(this.key.value, 16, 'a0', '-', 4));
  })
}

function auth(){
  try{
      checkKey(this.key.value)
  }
  catch(e){}
}


function showWay(id){
  document.querySelector(`form#${id}`).classList.remove('none');
  document.querySelector(`form#${id}`).classList.add('active');
  document.querySelector(`.way button#${id}`).classList.add('active');
}

function hideWay(id){
  document.querySelector(`form.active`).classList.add("none");
  document.querySelector(`form.active`).classList.remove('active');
  document.querySelector(`.way button.active`).classList.remove('active');
  showWay(id);
}


if (searchUrl(window.location.href) == "popup/auth/auth.html"){
  auth();
}
