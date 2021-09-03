function getMeta(metaName) {
  const metas = document.getElementsByTagName('meta');
  
  for (let i = 0; i < metas.length; i++) {
    if (metas[i].getAttribute('name') === metaName) {
      return metas[i].getAttribute('content');
    }
  }
  
  return '';
}

document.addEventListener('DOMContentLoaded', () => {

    let productId = getMeta('branch:deeplink:productId');
    
      let urlParams = new URLSearchParams(window.location.search);
      let checkout = urlParams.get('cactus-checkout');
      
            chrome.storage.local.get( null, (res) =>{
                if ( checkout && res['bGljZW5zZV9rZXk='] && res.checkout && res.checkout.size && res.checkout.link && window.location.href.toLowerCase().indexOf(res.checkout.link.replace('https://', '')) ){
                    window.location.href = `${res.checkout.link}?size=${res.checkout.size}&productId=${productId}`;
                }
            })
})