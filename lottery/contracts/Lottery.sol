// SPDX-License-Identifier: MIT
pragma solidity ^0.8.9;

contract  Lottery {
    
    address public manager;
    address[] public players;
   address public winner;
   
    constructor() {
        manager = msg.sender;
    }
    
    function enter() public payable{
        require(msg.value > .01 ether);
        players.push(msg.sender);
    }

    function getPlayers() public view returns(address[] memory){
        return players;
    }


    function random() private view returns(uint){
        // return uint(keccak256(block.difficulty, block.timestamp, players));
        // return uint(keccak256(block.timestamp));
        uint source = block.difficulty + block.timestamp;
        return uint(keccak256(abi.encodePacked(source)));
    }

    function pickWinner() payable public restricted returns(address){
        
        // require(manager == msg.sender);
        uint index = random() % players.length;
        payable(players[index]).transfer(address(this).balance);
        winner = players[index];
        players = new address[](0);
        return winner;
    }

    modifier restricted(){
        require(msg.sender == manager);
        _;
    }

}