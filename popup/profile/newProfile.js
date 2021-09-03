if (searchUrl(window.location.href).indexOf("popup/profile/newProfile.html") == 0){
    let edittingName = '';
    let saveBtn = document.querySelector('.profileName button');


    this.firstName.addEventListener('keyup', () =>{
        setInputValue(this.firstName, mask(this.firstName.value, null, 'A', '', null));
    })
    this.middleName.addEventListener('keyup', () =>{
        setInputValue(this.middleName, mask(this.middleName.value, null, 'A', '', null));
    })
    this.lastName.addEventListener('keyup', () =>{
        setInputValue(this.lastName, mask(this.lastName.value, null, 'A', '', null));
    })
    this.postCode.addEventListener('keyup', () =>{
        setInputValue(this.postCode, mask(this.postCode.value, 6, '0', '-', 3));
    })
    this.phone.addEventListener('keyup', () =>{
        setInputValue(this.phone, mask(this.phone.value, 10, '0', null, null, '+7'));
    })
    this.cardNumber.addEventListener('keyup', () =>{
        setInputValue(this.cardNumber, mask(this.cardNumber.value, 16, '0', ' ', 4));
    })
    this.cardExpiry.addEventListener('keyup', () =>{
        setInputValue(this.cardExpiry, mask(this.cardExpiry.value, 4, '0', '/', 2));
    })
    this.cardCvc.addEventListener('keyup', () =>{
        setInputValue(this.cardCvc, mask(this.cardCvc.value, 3, '0', null, null));
    })


    this.express.addEventListener( 'change', () => {
        outputInputsProfile();
    } )


    saveBtn.addEventListener('click', () =>{

        if (checkValidInputs(document.querySelectorAll('input, select'), 'no-valid')){
            let data;
            if ( !this.express.checked )
                data = {
                    firstName: this.firstName.value,
                    lastName: this.lastName.value,
                    middleName: this.middleName.value,
                    addressLine1: this.addressLine1.value,
                    addressLine2: this.addressLine2.value,
                    city: this.city.value,
                    region: this.region.value,
                    postCode: this.postCode.value.replace('-', ''),
                    phone: this.phone.value.replace('+7', ''),
                    email: this.email.value,
                    cardNumber: this.cardNumber.value.trim(),
                    cardExpiry: this.cardExpiry.value.replace('/', ''),
                    cardCvc: this.cardCvc.value,
                    profileName: this.profileName.value,
                    isExpress: false,
                }
            else 
                data = {
                    middleName: this.middleName.value, 
                    cardNumber: this.cardNumber.value.trim(),
                    cardExpiry: this.cardExpiry.value.replace('/', ''),
                    cardCvc: this.cardCvc.value,
                    isExpress: true
                };

            setProfile(this.profileName.value, data, edittingName);
            if (edittingName != '')
                window.location.href = '../index/index.html?tab=profiles&type=Edit!';
            else 
                window.location.href = '../index/index.html?tab=profiles&type=Added!';
        }
        else {
            showStep('payment', true);
            showStep('delivery', true);
        }
    })
}




function outputInputsProfile(){
    let middleName = this.middleName.value;
    if (this.express.checked)
        this.inputs.innerHTML = `
        <input type="text" class="standart-input" name="middleName" id="middleName" placeholder="Отчество" required>
        `;
    else
        this.inputs.innerHTML = `
                    <div class="columns-2">
                    <input type="text" class="standart-input" name="firstName" id="firstName" placeholder="Имя " required>
                    <input type="text" class="standart-input" name="middleName" id="middleName" placeholder="Отчество" required>
                    </div>
                    
                    <input type="text" class="standart-input" name="lastName" id="lastName" placeholder="Фамилия" required>
                    
                    <input type="text" class="standart-input" name="addressLine1" placeholder="Строка адреса 1 " id="addressLine1" required>
            
                    <input type="text" class="standart-input" name="addressLine2" placeholder="Строка адреса 2 " id="addressLine2">

                    <input type="text" class="standart-input" name="city" id="city" placeholder="Город/населенный пункт" required>

                    <div class="columns-2 postCode">
                        <select name="region"  class="standart-input" id="region" required>
                            <option value="" disabled selected hidden>Область</option> <option  value="3: RU-MOW">Москва</option><option  value="4: RU-SPE">Санкт-Петербург</option><option  value="5: RU-STA">Ставропольский</option><option  value="6: RU-AL">Алтайский</option><option  value="7: RU-BA">Башкортостан</option><option  value="8: RU-BEL">Белгородская</option><option  value="9: RU-CHE">Челябинская</option><option  value="10: RU-DA">Дагестан</option><option  value="11: RU-KHA">Хабаровский</option><option  value="12: RU-KHM">Ханты-Мансийский Автономный округ - Югра</option><option  value="13: RU-YAR">Ярославская</option><option  value="14: RU-IRK">Иркутская</option><option  value="15: RU-KLU">Калужская</option><option  value="16: RU-KEM">Кемеровская</option><option  value="17: RU-KDA">Краснодарский</option><option  value="18: RU-KYA">Красноярский</option><option  value="19: RU-LEN">Ленинградская</option><option  value="20: RU-MO">Мордовия</option><option  value="21: RU-MOS">Московская</option><option  value="22: RU-NIZ">Нижегородская</option><option  value="23: RU-NGR">Новгородская</option><option  value="24: RU-NVS">Новосибирская</option><option  value="25: RU-OMS">Омская</option><option  value="26: RU-ORE">Оренбургская</option><option  value="27: RU-ORL">Орловская</option><option  value="28: RU-PER">Пермский</option><option  value="29: RU-PRI">Приморский</option><option  value="30: RU-RYA">Рязанская</option><option  value="31: RU-ROS">Ростовская</option><option  value="32: RU-SA">Саха (Якутия)</option><option  value="33: RU-SAM">Самарская</option><option  value="34: RU-SAR">Саратовская</option><option  value="35: RU-SMO">Смоленская</option><option  value="36: RU-SVE">Свердловская</option><option  value="37: RU-TA">Татарстан</option><option  value="38: RU-TYU">Тюменская</option><option  value="39: RU-TOM">Томская</option><option  value="40: RU-TUL">Тульская</option><option  value="41: RU-TVE">Тверская</option><option  value="42: RU-UD">Удмуртская</option><option  value="43: RU-VLA">Владимирская</option><option  value="44: RU-VGG">Волгоградская</option><option  value="45: RU-VOR">Воронежская</option>
                        </select>
        
                        <input type="text" class="standart-input" name="postCode" id="postCode" placeholder="Индекс" required>
                    </div>
    
                    <div class="columns-2">

                        <input type="text" class="standart-input" name="phone" placeholder="Телефон" id="phone" value="+7" pattern=".{12}" required>
        
                        <input type="email"  class="standart-input" name="email" placeholder="Почта " id="email" required>

                    </div>
        `;
    this.middleName.value = middleName;
}



// function hideStep(step){
//         document.querySelector(`.${step} .head img`).src="/src/assets/img/expand.svg";
//         document.querySelector(`.${step} .inputs`).classList.add('none');
// }
// function showStep(step, noValid){
//     if (document.querySelector(`.${step} .inputs.none`)){
//         document.querySelector(`.${step} .head img`).src="/src/assets/img/overturn.svg";
//         document.querySelector(`.${step} .inputs`).classList.remove('none');
//     }
//     else if (!noValid) hideStep(step);
// }

function getEdditingProfile(){
    chrome.storage.local.get('edittingProfile', (res) => {
        if (res.edittingProfile){
            edittingProfile = res.edittingProfile;

            chrome.storage.local.get( edittingProfile, (item) =>{
                if (item[edittingProfile] && !item[edittingProfile].isExpress){
                    edittingName = edittingProfile;
                    this.profileName.value = edittingProfile;
                    this.firstName.value = mask(item[edittingProfile].firstName, null, 'A', '', null);
                    this.lastName.value = mask(item[edittingProfile].lastName, null, 'A', '', null);
                    this.middleName.value = mask(item[edittingProfile].middleName, null, 'A', '', null);
                    this.addressLine1.value = item[edittingProfile].addressLine1;
                    this.addressLine2.value = item[edittingProfile].addressLine2;
                    this.city.value = item[edittingProfile].city;
                    this.region.value = item[edittingProfile].region;
                    this.postCode.value = mask(item[edittingProfile].postCode, 6, '0', '-', 3);
                    this.phone.value = mask(item[edittingProfile].phone, 10, '0', null, null, '+7');
                    this.email.value = item[edittingProfile].email;
                    this.region.value = item[edittingProfile].region;
                    this.cardNumber.value = mask(item[edittingProfile].cardNumber, 16, '0', ' ', 4);
                    this.cardExpiry.value = mask(item[edittingProfile].cardExpiry, 4, '0', '/', 2);
                    this.cardCvc.value = mask(item[edittingProfile].cardCvc, 3, '0', null, null);
                    console.log(edittingName)
                    unsetEditProfile();
                }else
                if (item[edittingProfile] && item[edittingProfile].isExpress){
                    this.express.click();
                    edittingName = edittingProfile;
                    this.profileName.value = edittingProfile;
                    this.middleName.value = mask(item[edittingProfile].middleName, null, 'A', '', null);
                    this.cardNumber.value = mask(item[edittingProfile].cardNumber, 16, '0', ' ', 4);
                    this.cardExpiry.value = mask(item[edittingProfile].cardExpiry, 4, '0', '/', 2);
                    this.cardCvc.value = mask(item[edittingProfile].cardCvc, 3, '0', null, null);
                    unsetEditProfile();
                }
            } )
        }
        outputInputsProfile();
    })
}


function isInvalidAuthProfile(){
    if ( !searchUrl(window.location.href).indexOf("popup/auth/auth.html") == 0 )
        window.location.href = '/popup/auth/auth.html';
    chrome.storage.local.remove('bGljZW5zZV9rZXk=', () => {});
}


if (searchUrl(window.location.href).indexOf("popup/profile/newProfile.html") == 0){
    
    try{
        checkKey();
    }
    catch(e){
        isInvalidAuthIndex();
    }
    getEdditingProfile()
    setInterval(() => {
        try{
            checkKey();
        }
        catch(e){
            isInvalidAuthProfile();
        }
    }, 5000);

}