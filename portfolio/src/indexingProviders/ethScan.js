import web3 from '../web3';
import Txn from '../Txn';

//api key : ckey_26bd928343894ff78fb3511f791
async function etherScanFetch (chainId, address){
    let txnArray = [{}];
    const baseUrl = 'http://api.etherscan.io/api?module=account&action=txlist&address='+address+'&startblock=0&endblock=99999999&sort=asc&apikey=NR12MJIAB81EDU684N9DXIYNR2ETGPHC53'

    //console.log("transaction url:"+transactionsUrl);
    const jsonStr = await fetch(baseUrl);
    const json = await jsonStr.json();

    console.log("Alt txns from ethscan: "+json);
    //console("type of variable json:",typeof(json));
    const g = json.result.map((txn) => {
        console.log(txn.to + "-" + txn.from);
        let t = {
            from  : txn.from,
            to    : txn.to,
            value : txn.value,
            gasFee: '',
            hash  : '',
            currentBalance : 0,
            direction: 'in',
            time  : ''
        }
        txnArray.push(t);
    });
    txnArray.map((tt, index) => {
        console.log("new array covalent:",tt.from,tt.to);
    });
    return txnArray;
}

//matic mainnet 137, mumbai : 80001

export default etherScanFetch;