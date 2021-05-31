import Web3 from 'web3';

//get the provider from metamask - asuming web3 got injected by metamask
//window is not defined on the browser side
//const web3 = new Web3(window.web3.currentProvider);

let web3;
if (typeof window !== 'undefined' && typeof window.web3 !== 'undefined') {//browser or server
    //in browser with metamask running
    //hijack metamask provider 
    web3 = new Web3(window.web3.currentProvider);//use same version of web3 provided by metamask
} else{ //need to complete this
    //we on on server OR the user is not running metamask
    //create our own provider. ie. infura/rinkeby
    const provider = new Web3.providers.HttpProvider(
        'https://rinkeby.infura.io/v3/74350a5ba1f54747afc762924d48a402'
    );
    console.log('not in browser');

    web3 = new Web3(provider);
}

export default web3;