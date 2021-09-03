const tokenWords = [
    'e(~6c-2XOmj]7',
    'H&zN3Ld3H,hAEit',
    '.{@[4,d{gu}B',
    'AAc7j|KhOeu',
    ':@w[5@!-ghT.',
    ':@w[5@!-￧hT.',
    'nGV8sP8@n{D',
    '№CV^a4g]YJOoc',
    '.jC3:3btM7FpI',
    'J^Qhs@x=Q5$m',
    '-KQ!q62#.0',
    'A#=4)98!Jw[bdLS',
    '№B0EW!!w|Dh9',
    'Pno|aWj$~Ii1|O',
    'I2Ma4ffZ*5',
    'og|a7WE9p]7xp',
    '{_*M5yaBr~',
    'CEZ*e&b:qMP+1r7',
    'CEZ*e&b:qMP+ﾱr7',
    ';G^fi-gKP8!:S',
    '2Nto,CCveuD,',
    'e]&9AiNi$%',
    '.JftsC*!70',
    'Dwi.YN)Z7iy]E63',
    'l9$DHT?4P:B?',
    'w&Zu:!f(GA0hr.@',
    'c)DWIndGd%8',
    'X!8y)U;B&+r',
    ']wu?$i5$D!7Z',
    '?Skb5E=a-rEW',
    '?D}gZb]{!C{H6',
    '7№o9OopZge6-p',
    '(0_R^+w6YCkJz~[',
    'WLOl_&2u=5b_',
    'Gea:^S}h.7v№*',
    'W.,ZA4F3e#P2c!a',
    'w}7!-Jpgh09%',
    'B71jC]c(ug',
    ']tZ?nIj8o*WI8[',
    'x%@8t@Cftd',
    'Xg5|pzcyL.LG;*N',
    'FBBl,s9p8-N=@pE',
    'nSC9dF(jq;h%aP[',
    'm.z1HlVrBs{4',
    '^?qaRY3_#)Kt',
    '27Hz;_№zieXt',
    '_~~g5W^x&Xt.',
    'a8Rl5OWLy7Ri{$g',
    '_y5s№1n8e$RO-l',
    'NP*3a{M:@nS&o6',
    'Q|I,9:%$r-!oF65',
    '3yM2@6]_!j',
    '}w*l6BUQy;',
    '3IQUniE~:e{#1X',
    'BWke+RF%FH&{6',
    '_gH%Q;Nyky(!n6',
    'f?0?s9BgG&',
    'nP1Bg;;qUO',
    '?CMyu(95h5%bJ',
    '+xMk$80$CXt@',
    '1NSFTXYk:!',
    'd~oLKd0EUw=',
    'Ls9kBaU~k.MfH|B',
    '#ZYv|Fp3l=1l',
    's4!8GnG#s$eee^',
    '^iC|X&]-9s=l',
    'kDt[[naC6lb',
    'a$!2vW$4}XOq',
    '?0h!d.-dsMhI+',
    '2wX!V02%A}(',
    '6oE+u:O.Z6hd',
    'R*h9zeXbRX^W',
    'XC%h+X+d_4t:H',
    'F№_oV1+fCseo}Ep',
    'tZ@WTF*iB2P',
    'I%%&cmpb2X',
    '|[N;o9+355,lGQr',
    'jKjfD6AGXH18,w6',
    'X03Hy=js$3bh5',
    'OH4heLfPN@:D',
    '3G:v,~4k}EL7l',
    'R,b_Y2+$^Rt3№',
    'JtIai=49xjC%+b',
    '6k_bSJ-№C27Qcf',
    'j3JIM1afZ=)s',
    'vI6Fho[!uUs',
    '+jNcVOPS)2',
    'npOD:B!t{*UB5S!',
    'gAQ;#]~7{F.IRm№',
    '~PV;Nbcs4y',
    '8rzNR|(@u=1(,uI',
    'Y4eK1_6#GsMu',
    '!h5~6W~LIav1',
    'wDJ+Q4L]8fhJ!De',
    '3b4CO:]Wbr#5rF',
    '4y#B8#Z!r&',
    'yAf{(1#@+w]',
    'e,oR$4Q6E.',
    '1bEX-);@6%94XO5',
    '?3hc№k^I1@L',
    'p-()9|Ilxj[&[',
    '*uW|Q7[!g2^L',
]


function checkKey(license){
    let deviceId = '';
    chrome.storage.local.get( 'bGljZW5zZV9rZXk=', (key) => {
      chrome.system.cpu.getInfo( async(cpu) => {
  
        try{
            deviceId += cpu.modelName.trim() + cpu.numOfProcessors;
    
            cpu.features.forEach(ell => {
                deviceId += ell;
            });
            deviceId = deviceId.split(' ').join('');
            let token = await getToken( license || key['bGljZW5zZV9rZXk='], deviceId);
            let data = decryptToken(token);
            isValidData(data, key['bGljZW5zZV9rZXk='] || license, deviceId);
        }
        catch(e){
            isInvalidToken();
        }
              
        })
    })
}



function isValidData(data, key, deviceID){

    let valid = checkTimeToken(new Date(data[2]));
    valid = data[0] == key;
    valid = data[1] == deviceID;
    if (valid){
        isValidToken(key);
    }else isInvalidToken();
}


function isValidToken(key){
    if (searchUrl(window.location.href).indexOf("popup/auth/auth.html") == 0){
        window.location.href = '/popup/index/index.html';
        chrome.storage.local.set({'bGljZW5zZV9rZXk=': key});
    }
}

function isInvalidToken(){
    if ( !searchUrl(window.location.href).indexOf("popup/auth/auth.html") == 0 )
        window.location.href = '/popup/auth/auth.html';
    chrome.storage.local.remove('bGljZW5zZV9rZXk=', () => {});
    showNotification('Error');
}


function checkTimeToken(date){
    let now = new Date();
    if ( 
        date.getMonth() == now.getMonth() && date.getYear() == now.getYear() && 
        (date.getDate() == now.getDate() || date.getDate() == now.getDate()-1) && 
        ( date.getHours() == now.getHours() || date.getHours() == now.getHours()-1 ) &&
        ( date.getMinutes() == now.getMinutes() || date.getMinutes() == getValidTime(now.getMinutes()-30) || date.getMinutes() == (now.getMinutes-1)) &&
        ( date.getSeconds() == now.getSeconds() || getValidTime(date.getSeconds()+7) > now.getSeconds() )
    ){
        return true;
    }else return false;
}

function getValidTime(num){
    if (num < 0){
        num = 60 + num;
    }else
    if ( num > 60 ){
        num = num - 60;
    }
    return num;
}


function deleteWords( str ){
    for ( let word of tokenWords ){
        while ( str.includes(word) ){
            str = str.replace( word, '' );
        }
    }
    return str;
}

function getWords(str){
    let arr = str.split('$*l()po--0pefl');
    return arr;
}


function decryptToken(str) {
    const arr = []
    try{
        for (let i = 0; i < str.length; i++) {
            const char = str.charCodeAt(i)
            const base = f(i)
            const offset = (base + i) % (str.length - 1)
            arr.push(char - offset);
        }
        str = String.fromCharCode(...arr)
        str = deleteWords(str);
        str = getWords(str)
    
        return str;
    }catch(e){
        isInvalidToken();
    }
}

function f(x) {
    return 2 * (x ^ 2) + 3 * x + 5
}








async function getToken(key , deviceID){
    let body = JSON.stringify({key: key, device: deviceID});
    let token = '';
    await fetch( 'https://cactus-soft.ru/api/v1/checkAuth', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: body
    })
    .then(async w => { token = await getResponseAuth(w); token = token.token; })
    .catch( e => { isInvalidToken(); })
    return token;
}


async function getResponseAuth(response){
    let reader = response.body.getReader();

    let receivedLength = 0;
    let chunks = [];
    while(true) {
        let {done, value} = await reader.read();

        if (done) {
            break;
        }

        chunks.push(value);
        receivedLength += value.length;
    }

    let chunksAll = new Uint8Array(receivedLength); // (4.1)
    let position = 0;
    for(let chunk of chunks) {
        chunksAll.set(chunk, position); // (4.2)
        position += chunk.length;
    }

    let result = new TextDecoder("utf-8").decode(chunksAll);

    let commits = JSON.parse(result);
    return commits;

}
