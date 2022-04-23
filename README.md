Successfully verified contract Voting on Etherscan.
https://kovan.etherscan.io/address/0x93C33eD4Fb48C2f1693B6652d863609f137c410c#code

Site Url: https://depoly-task3-phi.vercel.app/

#This is a voting smart contract

An ERCToken ZuriToken was developed to be used with this ballot voting smart Contract.
Various stakeholders:

- Chairman (Owner)
- Teachers(Admin(s))
- Student (General Public)

Various access controls have been implemented as such,
-The Chairman is able to give voting rights to any stakeHolder,
-Chairman can add or romve teachers(Admins)
- Chairman can enable or disable voting, likewise only the chairmain that publishes or release the result to the public
- Chairman & Admins can setUp an election, add candidates and calculate results.
- Everyone can view the election result once it is published

When a new Election is setup, the storage of the smart contract is reset to the defaults and all voting rights are removed.
