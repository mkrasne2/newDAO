
import React, { Component, useEffect, useState } from 'react';
import {
  MDBRow,
  MDBCol,
  MDBInput,
  MDBCheckbox,
  MDBBtn,
  MDBTextArea
} from 'mdb-react-ui-kit';
import { ethers } from "ethers";
import abi from "./abi.json";
import DateTimePicker from 'react-datetime-picker';
import Navbar from './Navbar.js';
import LoadingSpin from "react-loading-spin";
import detectEthereumProvider from '@metamask/detect-provider';



const defaultValues = {
  ReactDatepicker: new Date()
}


export default function Form() {

  const [propName, setPropName] = useState('');
  const [propDescription, setPropDescription] = useState('');
  const [transaction, setTransactionSuccess] = useState('');
  const [propDate, setPropDate] = useState(new Date());
  

  React.useEffect(() => {
    
    async function checkProvider() {
      const provider = await detectEthereumProvider();
      if(provider){
        console.log('hello');
        
      }
      else{
        alert('Install Metamask to continue')
      }
    }
    
    checkProvider();
  }, []);

  const submit = event => {
    if(propName.replace(/[^a-zA-Z\s]/gi, '') !== propName) {
      alert('Your input most be composed of alphabetic characters only.')
      window.location.reload(false);
    }
    if(propName.length > 50){
      alert('Your input must be 50 characters or less')
      window.location.reload(false);
    }
    if(propDescription.length > 500){
      alert('Your description input must be 500 characters or less')
      window.location.reload(false);
    }

    

    const DEPLOYED_ADDRESS = '0x1eC7b4E7AD7BEa7371e849F4c31f267b95380055';
    async function connect() {
      await window.ethereum.request({
        method: "eth_requestAccounts",
      });
    }
    connect();
    setTransactionSuccess(1);
    const thisProvider = new ethers.providers.Web3Provider(window.ethereum);
    const signer = thisProvider.getSigner();
    let writeContract = new ethers.Contract(DEPLOYED_ADDRESS, abi, signer);

    console.log(signer);

    if(!(value.getTime() > Date.now() + 259200)){
      alert('You must choose a date that is at least 3 days in the future.');
    }

    async function submitProp(name, description, deadline) {
      
      let txResponse = await writeContract.createProposal(name, description, deadline);
      let txReceipt = await txResponse.wait();
      if(txReceipt.blockNumber > 0){
        setTransactionSuccess(txReceipt.blockNumber);
      } else if (!(txReceipt.blockNumber > 0)){
        alert('Your submission was unsuccessful');
        window.location.reload(false);
      }
    }
    const time = Math.floor(value.getTime() / 1000);
    submitProp(propName, propDescription, time);
    event.preventDefault();

    
  }

  
  
  const [value, onChange] = useState(new Date());
  
  if (transaction == 1){
    return (
      <>
      <LoadingSpin />
      </>
    )
  }
  
  else if(!(transaction > 1)){
  return (
    <>
    <Navbar
      title="Submit a Proposal"
      message="If you hold a governance token you can submit a proposal here" />
      
    <form onSubmit={submit}>
      <br></br>
      <MDBInput wrapperClass='mb-4' id='propName' label='Proposal Name' onChange={event => setPropName(event.target.value)} value={propName} />
      <MDBRow className='mb-4'>
        <MDBCol>
          <MDBTextArea label='Description' id='propDescription' onChange={event => setPropDescription(event.target.value)} value={propDescription} rows={4} />
        </MDBCol>
        
      </MDBRow>
      <div>
      <p>Deadline (must leave at least a 3 days window):</p>
      <DateTimePicker onChange={onChange} value={value} id='dateSubmit' />
      </div>
      <br></br>


      <MDBBtn className='mb-4' type='submit' id='globalSubmit' block>
        Submit Proposal
      </MDBBtn>
    </form>
    </>
  );
}


else if (transaction > 1){
  return (
    <>
    <Navbar
      title="Submit a Proposal"
      message="Your proposal submission was successful" />
      <p>Success!</p>
      <MDBBtn className='mb-4' href='/submit-proposal'>
        Go Back
      </MDBBtn>
      </>
  );
}

}