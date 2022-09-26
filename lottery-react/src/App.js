// import logo from './logo.svg';
// import './App.css';
// import web3 from "./web3";
import lottery from './lottery';
import { useEffect, useState, React } from 'react';
import web3 from './web3';
// import React, {Component} from "react";
function App() {
  // console.log(web3.version);

  // web3.eth.getAccounts()
  //   .then(console.log);

  const [manager, setManager] = useState(null);
  const [players, setPlayers] = useState([]);
  const [balance, setBalance] = useState("");

  const [value, setValue] = useState("");

  const [message, setMessage] = useState('');

  useEffect( ()=> {
    async function fetchManager() {
      const manager = await lottery.methods.manager().call();
      setManager(manager);
      const players = await lottery.methods.getPlayers().call();
      setPlayers(players);
      const balance = await web3.eth.getBalance(lottery.options.address);
      setBalance(balance);
    }
    fetchManager();
  });

  
  // function onSubmit(event) {
    // event.preventDefault();
  //   console.log("hello");
  // }

  const  onSubmit = async(event)=> {
    event.preventDefault();

    const accounts = await web3.eth.getAccounts();
    
    setMessage('Waiting on transaction sucess...');

    await lottery.methods.enter().send({
      from: accounts[0],
      value: web3.utils.toWei(value, 'ether')
    });

    // console.log(web3.utils.toWei(value,'ether'));

    setMessage("You have been entered!");
  }

  const onClick = async()=>{
    setMessage("Waiting on transaction sucess...");
    const accounts = await web3.eth.getAccounts();
    await lottery.methods.pickWinner().send({
      from: accounts[0]
    })
    setMessage("A winner has been picked");

    const winner = await lottery.methods.winner().call();

    setMessage("Winner is "+ winner);

  }



  return (
    <div>
      <h2>Lottery Contract</h2>
      <p>This contract is managed by {manager} .
         There are currently {players.length} people entered,
         competing to win {web3.utils.fromWei(web3.utils.toBN(balance), 'ether')} ether!
      </p>
      <hr />
      <form onSubmit={onSubmit}>
        <h4>want to try your luck</h4>
        <div>
          <label>Amount of ether to enter: </label>
          <input
            value={value}
            type='text'
            onChange={event => setValue(event.target.value)}/>
        </div>
        <button>Enter</button>
      </form>

      <hr />
      
      <h4>Ready to pick a winner!</h4>
      <button onClick={onClick}>Pick A winner!</button>

      <hr />
      <h1>{message}</h1>
    </div>
  );
}

export default App;


 
// class App extends Component {

//   state = {
//     manager: "",
//     players: [],
//     balance: "",
//     value: "",
//     message: "",
//   };

//   async componentDidMount() {
//     const manager = await lottery.methods.manager().call();
//     this.setState({ manager});
//     console.log(manager);
//   }

//   render() {
//     return (
//       <div>
//         <h2>Lottery Contract</h2>
//         <p>This contract is managed by {this.state.manager}</p>
//       </div>
//     );
//   }
// }
// export default App;
