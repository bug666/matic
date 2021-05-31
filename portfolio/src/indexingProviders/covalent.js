import web3 from '../web3';
import Txn from '../Txn';

//api key : ckey_26bd928343894ff78fb3511f791
async function covalentFetch (chainId, address){
    let txnArray = [{}];
    const apiKey='?key=ckey_26bd928343894ff78fb3511f791';
    const baseUrl = 'https://api.covalenthq.com/v1/'+chainId+'/address/'+address;
    //const balanceUrl = baseUrl + '/balances_v2/' + apiKey;
    const transactionsUrl = baseUrl + '/transactions_v2/' + apiKey;
    //console.log("transaction url:"+transactionsUrl);
    const jsonStr = await fetch(transactionsUrl);
    const json = await jsonStr.json();
    console.log("Alt txns from covalentFetch: "+json);
    const g = json.data.items.map((txn) => {
        console.log(txn.to_address + "-" + txn.from_address);
        let t = {
            from  : txn.from_address,
            to    : txn.to_address,
            value : txn.value,
            gasFee: txn.gas_spent,
            hash  : txn.hash,
            currentBalance : 0,
            direction: 'in',
            time  : txn.block_signed_at
        }
        txnArray.push(t);
    });
    txnArray.map((tt, index) => {
        console.log("new array covalent:",tt.from,tt.to);
    });
    return txnArray;
}

//matic mainnet 137, mumbai : 80001

export default covalentFetch;