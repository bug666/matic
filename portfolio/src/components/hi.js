import React, { Component } from 'react';
import web3 from '../web3';
//import Matic from '@maticnetwork/maticjs'
import covalentFetch from '../indexingProviders/covalent';
import etherScanFetch from '../indexingProviders/ethScan';
import {Table, Container} from 'semantic-ui-react';
import 'semantic-ui-css/semantic.min.css'

class Hi extends Component{

    constructor(props){
        super(props);
        //state can be defined outside of the constructor also. You don't need *this. then
        this.state = {
            act: '',
            actBalance: '',
            actBalanceMatic: '',
            txnCount: '',
            transactions: [{}],
        };
    }

    eth = async() => {
        console.log("IN ETH");
        try{
            const accounts = await web3.eth.getAccounts();
            this.setState({act: accounts[0]})

            const balance = await web3.eth.getBalance(accounts[0]);
            this.setState({actBalance: web3.utils.fromWei(balance, 'ether')})

            const actBalanceMatic = await web3.eth.getBalance(accounts[0]);
            this.setState({actBalanceMatic: web3.utils.fromWei(actBalanceMatic, 'ether')})

            const txnCount = await web3.eth.getTransactionCount(accounts[0])
            this.setState({txnCount});
            
            //trun this on later
            const chainId = await web3.eth.getChainId();
            const ethScan = await etherScanFetch(chainId, accounts[0]);
            //this.setState( {transactions: ethScan});

            //eth scan is only for certain networks
            //covalent api key ckey_26bd928343894ff78fb3511f791
            //const ethScanUrl = 'http://api.etherscan.io/api?module=account&action=txlist&address='+accounts[0]+'&startblock=0&endblock=99999999&sort=asc&apikey=NR12MJIAB81EDU684N9DXIYNR2ETGPHC53'
            //const t = await fetch(ethScanUrl);
            //const json = await t.json();
            
            /*const txns = json.result.map((txn) =>
                 <li>block#:{txn.blockNumber} value:  {web3.utils.fromWei(txn.value, 'ether')} from:{txn.from} to:{txn.to} </li>
            );*/
            //fetch from covelent
            const altTxns = await covalentFetch(chainId, accounts[0]);
            this.setState({transactions : altTxns});
        } catch (err){
            console.log("Error")
        }
    }

    componentDidMount() {
        console.log('Component did mount!')
        this.eth();
     }

    //got one bug where it does not print out all the requests
    renderRows(){
        let bal = 0;
        const toEther = 1000000000000000000;

        const { Row, Cell } = Table;
        console.log("i am in renderRows:"+this.state.transactions.length)
        const y = this.state.transactions.map((txn, index) => {
            console.log(index + ":" +txn.to_address+ ":"+txn.from_address);
        });
//      <Cell>{web3.utils.fromWei(String(txn.value), 'ether')}</Cell>
        return this.state.transactions.map((txn, index) => {
            let direction = 'out';

            if (txn.value == undefined){
                return;
            }
            if (txn.to.toLowerCase()   == this.state.act.toLowerCase()){
                direction = 'in';
            }
            let val = txn.value/toEther;
            let gas = txn.gasFee/toEther;
            if (direction == 'in'){
                bal = bal + val - gas;
            }
            else{
                bal = bal - val - gas;
            }
            return (
                <Row>
                    <Cell></Cell>
                    <Cell>{txn.from}</Cell>
                    <Cell>{txn.to}</Cell>
                    <Cell>{txn.time}</Cell>
                    <Cell>{txn.hash}</Cell>
                    <Cell>{val} eth</Cell>
                    <Cell>{gas}</Cell>
                    <Cell>{bal}</Cell>
                    <Cell>{direction}</Cell>
                </Row>
            );
        });    
    };


    render() {
        const { Row, Cell } = Table;
        return (
            <Container fixed>  
                <div>

                <p>hi {this.props.name}, you account number is: {this.state.act} and with a balance of {this.state.actBalance} units</p>
                <p>Matic API balance for the same account : {this.state.actBalanceMatic} units</p>
                <p>Txn Count : {this.state.txnCount}</p>
                    <Table striped compact>
                    <thead>
                        <tr>
                            <th>Token Address</th>
                            <th>From</th>
                            <th>To</th>
                            <th>Time</th>
                            <th>Txn Hash</th>
                            <th>Value</th>
                            <th>Gas Spent</th>
                            <th>bal</th>
                            <th>direction</th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.renderRows()}

                    </tbody>
                    </Table>
            </div>
        </Container>
          );
        };
    }

export default Hi;