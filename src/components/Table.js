import React, { Component, useEffect, useState } from 'react';
import { MDBTable, MDBTableHead, MDBTableBody, MDBBtn } from 'mdb-react-ui-kit';
import { ethers } from "ethers";
import abi from "./abi.json";
import Navbar from './Navbar.js';
import detectEthereumProvider from '@metamask/detect-provider';


export default function Table () {

  const [selectedAddress, setSelectedAddress] = useState('');
  const [propOne, setPropOne] = useState('');
  const [propTwo, setPropTwo] = useState('');
  const [propThree, setPropThree] = useState('');

  React.useEffect(() => {
    
    async function checkProvider() {
      const provider = await detectEthereumProvider();
      if(provider){
        console.log('hello');
        connect();
      }
      
    }
    
    checkProvider();
  }, []);

  async function connect() {
    if (typeof window.ethereum == 'undefined') {
      alert('Please install Metamask to continue');
    }
    let provider = new ethers.providers.Web3Provider(web3.currentProvider);
    
    const accounts = await provider.send("eth_requestAccounts", []);
    
    
    
    let contract = new ethers.Contract('0x1eC7b4E7AD7BEa7371e849F4c31f267b95380055', abi, provider);
    let propNumbers = await contract.viewProposals();
    let numbers = await propNumbers[1]._hex;
    let tableNumber = parseInt(numbers, 16);
    console.log(tableNumber);

    for (let i = tableNumber; i >= 1; i--){
      let arr = [];
      let proposalOne = await contract.proposalToId(i);
      let description = await proposalOne.description;
      let name = await proposalOne.name;
      let proposedBy = await proposalOne.proposedBy.toString();
      let item = await proposalOne.deadline;
      let myDate = await new Date(item * 1000);
      let finalDate = await myDate.toLocaleString();
      let deadline = await finalDate + ' UTC';
      let votesUp = await proposalOne.votesUp.toString();
      let votesDown = await proposalOne.votesDown.toString();
      let passed = await proposalOne.passed.toString();
      arr.push(i.toString(), name, description, proposedBy, deadline, votesUp, votesDown, passed);
      
      if(i == tableNumber){
        setPropThree( arr );
      } else if(i == (tableNumber - 1)){
        setPropTwo( arr );
    } else if (i == (tableNumber - 2)){
      setPropOne( arr );
    }
  }
 
  setSelectedAddress(accounts[0]);
    
  
    
    
  }

  
    if (!selectedAddress) {
      return (
        <>
        <Navbar
      title="DAO Proposals"
      message="Please connect your wallet to view recent DAO proposals" />
      <br></br>
        <MDBBtn onClick={connect} outline rounded >
        Show Recent Proposals
      </MDBBtn>
      </>
      )
    } 
      else if (selectedAddress.toString().length > 3){
      console.log(selectedAddress);
      return (
        <>
        <Navbar
      title="DAO Proposals"
      message="You can view recent DAO proposals here" />
        <MDBTable striped>
      <MDBTableHead>
        <tr>
          <th scope='col'>Proposal ID</th>
          <th scope='col'>Name</th>
          <th scope='col'>Description</th>
          <th scope='col'>Proposed By</th>
          <th scope='col'>Deadline</th>
          <th scope='col'>Votes Up</th>
          <th scope='col'>Votes Down</th>
          <th scope='col'>Passed?</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        <tr>
          <th scope='row'>{propThree[0]}</th>
          <td> {propThree[1]}</td>
          <td>{propThree[2]}</td>
          <td>{propThree[3]}</td>
          <td>{propThree[4]}</td>
          <td>{propThree[5]}</td>
          <td>{propThree[6]}</td>
          <td>{propThree[7]}</td>
        </tr>
        <tr>
          <th scope='row'>{propTwo[0]}</th>
          <td> {propTwo[1]}</td>
          <td>{propTwo[2]}</td>
          <td>{propTwo[3]}</td>
          <td>{propTwo[4]}</td>
          <td>{propTwo[5]}</td>
          <td>{propTwo[6]}</td>
          <td>{propTwo[7]}</td>
        </tr>
        <tr>
          <th scope='row'>{propOne[0]}</th>
          <td>{propOne[1]}</td>
          <td>{propOne[2]}</td>
          <td>{propOne[3]}</td>
          <td>{propOne[4]}</td>
          <td>{propOne[5]}</td>
          <td>{propOne[6]}</td>
          <td>{propOne[7]}</td>
        </tr>
      </MDBTableBody>
    </MDBTable>
    </>
      );
    }
  

  
    
  
}

  
