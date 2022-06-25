
import React, { Component, useEffect, useState } from 'react';
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBTextArea,
  MDBTable, 
  MDBTableHead, 
  MDBTableBody
} from 'mdb-react-ui-kit';
import { ethers } from "ethers";
import abi from "./abi.json";
import Navbar from './Navbar.js';
import LoadingSpin from "react-loading-spin";
import detectEthereumProvider from '@metamask/detect-provider';



export default function Submitvote() {
  
  const [displayProposals, setDisplayProposals] = useState('');
  const [transaction, setTransactionSuccess] = useState('');
  const [votesUp, setVotesUp] = useState('');
  const [votesDown, setVotesDown] = useState('');
  const [address, setAddress] = useState('');
  const [firstProp, setFirstProp] = useState('');
  const [secondProp, setSecondProp] = useState('');
  const [thirdProp, setThirdProp] = useState('');
  const [activeProp, setActiveProp] = useState('');

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
  

  
  

  const vote = event => {
    
    const DEPLOYED_ADDRESS = '0x1eC7b4E7AD7BEa7371e849F4c31f267b95380055';
    const thisProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = thisProvider.getSigner();
    let writeContract = new ethers.Contract(DEPLOYED_ADDRESS, abi, signer);
    setTransactionSuccess(1);

    async function submitVote(id, up, down) {
      
      let txResponse = await writeContract.voteOnProposal(id, up, down);
      let txReceipt = await txResponse.wait();
      if(txReceipt.blockNumber > 0){
        setTransactionSuccess(txReceipt.blockNumber);
        console.log('success');
      } else if (!(txReceipt.blockNumber > 0)){
        alert('Your submission was unsuccessful');
        window.location.reload(false);
      }
    }
    submitVote(activeProp[0], votesUp, votesDown);
    event.preventDefault();
  }


   

    async function connect()  {
      
        if (typeof window.ethereum == 'undefined') {
          alert('Please install Metamask to continue');
        }
        let provider = new ethers.providers.Web3Provider(web3.currentProvider);
        const accounts = await provider.send("eth_requestAccounts", []);
        let contract = new ethers.Contract('0x1eC7b4E7AD7BEa7371e849F4c31f267b95380055', abi, provider);
        let propNumbers = await contract.viewProposals();
        let numbers = await propNumbers[1]._hex;
        let tableNumber = parseInt(numbers, 16);
        let timeArr = [];
        let trackArr = [];
        
        

        for (let i = tableNumber; i >= 1; i--){
          let arr = [];
          let proposalOne = await contract.proposalToId(i);
          let deadline = await proposalOne.deadline;
          let myDate = await new Date(deadline * 1000);
          let finalDate = await myDate.toLocaleString();
          let readDate = await finalDate + ' UTC';
          let newDeadline = await deadline._hex;
          let values = await parseInt(newDeadline, 16);
          console.log(readDate);

          let voteAvailability = await contract.checkVoteAvailability(i, accounts[0]);
          let idea = await voteAvailability[0]._hex;
          let hVal = await parseInt(idea, 16);
          if (hVal == undefined){
            hVal = 0;
          }
          let eligible = await proposalOne.countConducted;
          let name = await proposalOne.name;
          let description = await proposalOne.description;
          let proposedBy = await proposalOne.proposedBy.toString();
          let timeRemaining = await values - Math.floor(Date.now()/1000);
          let votesUp = await proposalOne.votesUp.toString();
          let votesDown = await proposalOne.votesDown.toString();
          
          
          if((!eligible) && (deadline >= Math.floor(Date.now()/1000))){
            arr.push(i, values, name, description, proposedBy, timeRemaining, votesUp, votesDown, readDate, hVal);
            trackArr.push(values);
            trackArr.sort((a,b) => b - a);
            timeArr.push(arr);
          }
          
        }
        
        //console.log(Math.floor(Date.now()/1000));
        for (let i = 0; i < trackArr.length; i++){
          for (let j = 0; j < timeArr.length; j++){
            if(trackArr[i] == timeArr[j][1]){
              trackArr[i] = timeArr[j];
            }
          }
        }
        console.log(trackArr);
        

        setAddress(accounts[0]);
        
        

        for (let i = 0; i < 3; i++){
          
          let row = (
            <tr>
            <th scope='row'>{trackArr[i][0]}</th>
            <td>{trackArr[i][8]}</td>
            <td>{trackArr[i][2]}</td>
            <td>{trackArr[i][3]}</td>
            <td>{trackArr[i][4]}</td>
            <td>{trackArr[i][6]}</td>
            <td>{trackArr[i][7]}</td>
            <td><button className='mb-4' type='submit' onClick={e => submit(e.target.value)}  value = {i} block>
                Vote
              </button>
            </td>
          </tr>
          );
            if(i == 0){
              setFirstProp(row);
            } else if (i == 1) {
              setSecondProp(row);
            } else if (i == 2) {
              setThirdProp(row);
            }

        }
       

        async function submit(item) {
          console.log(trackArr[item]);
          setActiveProp(trackArr[item]);
        }
        
    }
    
   
    
  

  
  
  
  
  if(address.length > 0){

    if(activeProp){
      if (transaction == 1){
        return (
          <>
          <LoadingSpin />
          </>
        )
      } else if (transaction > 1){
        return (
          <>
          <Navbar
            title="Vote on Proposals"
            message="You have successfully cast your vote" />
            <p>Success!</p>
            <MDBBtn className='mb-4' href='/vote'>
              Go Back
            </MDBBtn>
            </>
        );
      }
      
      else {
        
      return(
        <>
        <Navbar
      title="Vote on Proposals"
      message="Read proposal details before committing your votes" />
        <form onSubmit={vote}>
        <br></br>
        <MDBRow className='mb-4' >
        <p className="font-weight-bold">Proposal Name</p>
        <p className="font-weight-normal">{activeProp[2]}</p>
        <p className="font-weight-bold">Description</p>
        <p className="font-weight-normal">{activeProp[3]}</p>
        <p className="font-weight-bold">Remaining Votes</p>
        <p className="font-weight-normal">You have <strong>{activeProp[9]}</strong> votes remaining to cast from address {address}</p>
        </MDBRow>
      <MDBRow className='mb-4'>
        <MDBCol>
        <div className="form-group">
        <label htmlFor="example3">Votes Up</label>
        <input type="number" id="upVotes" onChange={event => setVotesUp(event.target.value)} value={votesUp} className="form-control form-control-sm" />
        </div>
        </MDBCol>
        
      </MDBRow>
      <MDBRow className='mb-4'>
        <MDBCol>
        <div className="form-group">
        <label htmlFor="example3">Votes Down</label>
        <input type="number" id="downVotes" onChange={event => setVotesDown(event.target.value)} value={votesDown} className="form-control form-control-sm" />
        </div>
        </MDBCol>
        
      </MDBRow>


      <MDBBtn className='mb-4' type='submit' id='globalSubmit' block>
        Submit Votes
      </MDBBtn>
    </form>
    </>
      )
    }
    }

 else {
  
  return (
    
    <>
    <Navbar
      title="Vote on Proposals"
      message="Displaying the proposals with the fastest-approaching deadlines" />
      
      <MDBTable striped>
      <MDBTableHead>
        <tr>
          <th scope='col'>Proposal ID</th>
          <th scope='col'>Deadline</th>
          <th scope='col'>Name</th>
          <th scope='col'>Description</th>
          <th scope='col'>Proposed By</th>
          <th scope='col'>Votes Up</th>
          <th scope='col'>Votes Down</th>
          <th scope='col'>Vote on Proposal</th>
        </tr>
      </MDBTableHead>
      <MDBTableBody>
        {firstProp}
        {secondProp}
        {thirdProp}
      </MDBTableBody>
    </MDBTable>
    </>
  );
}
}

else {
  return (
  <>
<Navbar
      title="Vote on Proposals"
      message="If you hold a governance token you can vote on active proposals here" />
      <br></br>
<MDBBtn onClick={connect} outline rounded >
        Show Active Proposals
      </MDBBtn>
</>
  );
}

}

