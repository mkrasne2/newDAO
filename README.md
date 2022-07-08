
# Basic DAO

This is a build of a very basic DAO setup that I used to teach myself both DAO and React fundamentals. 
Here are a few specifications I used to enable DAO participation, as well as how I chose to connect my frontend to the blockchain:

# Contract Specifications:
- My contract utilizes an interface with OpenSea's ERC-1155 token contract on Polygon Mumbai testnet. As such, my DAO operates off a membership model of a total of 15 limited-supply tokens, each enabling DAO members 1 vote per token.
- My contract allows a given token holder to submit votes both in favor and disapproval of proposals (in the event that the token holder has more than 1 token). This might be a little strange, but I wanted token holders to have full autonomy over their decision-making behavior, regardless of how odd they might be.
- My DAO contract utilizes SafeMath for added security, though not entirely necessary given that the contract has no payable functions.
- The contract requires that proposal submissions come with a deadline that gives token owners at least 1 full day to vote, but no more than 4 weeks.
- The contract also allows the owner of the contract the ability to add additional tokens in the future.
- I deployed the contract to the Polygon Mumbai testnet using HardHat on my local device.


# Frontend Specifications:
- I chose to use Ethers.js to enable the frontend to talk to the blockchain.
- Given MetaMask phasing out certain functions that previously made it easier to detect if a user was already connected to the app, I found it difficult to automatically render blockchain data to users who were already connected without auto-prompting users who are not signed in to sign in. I unfortunately settled for the auto-prompt option.
- I had originally toyed with using an Infura or Moralis free node to serve data through the RPC provider option, but I found myself running out of API bandwidth using the free options.

Try it out here: https://mkrasne2.github.io/newDAO/
