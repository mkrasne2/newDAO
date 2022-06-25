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

export default function Aboutus () {





  return (
    <>
    <Navbar
  title="About This DAO"
  message="A little bit about the specifications of this test DAO" />
  <br></br>
    <p >
    I built this test DAO as a means of teaching myself the basics of React.js 
    for use as a basic interface to read and write transactions to a decentralized 
    autonomous organization (DAO).  <br></br>

    Here are a few specifications I used to enable DAO participation, as well as how I chose to connect my frontend to the blockchain:
    <br></br>
    <br></br>
    <ul> <strong>Contract Specifications:</strong>
    <li>My contract utilizes an interface with OpenSea's ERC-1155 token contract on Polygon Mumbai testnet.
      As such, my DAO operates off a membership model of a total of 15 limited-supply tokens, each enabling
      DAO members 1 vote per token.
    </li>
    <li>My contract allows a given token holder to submit votes both in favor and disapproval of proposals 
      (in the event that the token holder has more than 1 token). This might be a little strange, but I 
      wanted token holders to have full autonomy over their decision-making behavior, regardless of how odd they 
      might be. 
    </li>
    <li>My DAO contract utilizes SafeMath for added security, though not entirely necessary given that the
      contract has no payable functions.
    </li>
    <li>The contract requires that proposal submissions come with a deadline that gives token owners at least
      1 full day to vote, but no more than 4 weeks.
    </li>
    <li>The contract also allows the owner of the contract the ability to add additional tokens in the future.
    </li>
    <li>I deployed the contract to the Polygon Mumbai testnet using HardHat on my local device.
    </li>
    </ul>
    <br></br>
    <br></br>

    <ul> <strong>Frontend Specifications:</strong>
    <li>I chose to use Ethers.js to enable the frontend to talk to the blockchain.
    </li>
    <li>Given MetaMask phasing out certain functions that previously made it easier to
      detect if a user was already connected to the app, I found it difficult to 
      automatically render blockchain data to users who were already connected without
      auto-prompting users who are not signed in to sign in. I unfortunately settled for 
      the auto-prompt option.
    </li>
    <li>I had originally toyed with using an Infura or Moralis free node to serve data 
      through the RPC provider option, but I found myself running out of API bandwidth 
      using the free options. 
    </li>
    
    </ul>
  </p>
  
  </>
  )

}