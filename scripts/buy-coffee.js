// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat");

//// HELPER FUNCTIONS ////

// Get balance of an address
async function getBalance(address) {
  const balance = await hre.ethers.provider.getBalance(address)
  return hre.ethers.utils.formatEther(balance)
}

// Log balances of multiple addresses
async function printBalances(addresses) {
  console.log(`Total number of addresses: ${addresses.length}`)
  for (const address of addresses) {
    console.log(`${address}: ${await getBalance(address)}`)
  }
}

// Log all received coffees with memos
async function printMemos(memos) {
  console.log(`Total number of memos: ${memos.length}`)
  for (const memo of memos) {
    console.log(`At ${memo.timestamp}, ${memo.name} (Address: ${memo.from}) sent ${memo.message}`)
  }
}

async function main() {
  // Get a few sample accounts (+ owner as first)
  const [owner, acnt1, acnt2, acnt3] = await ethers.getSigners()

  // Deploy our sol contract
  const BuyMeACoffeeContract = await hre.ethers.getContractFactory("BuyMeACoffee");
  const CoffeeCon = await BuyMeACoffeeContract.deploy();
  await CoffeeCon.deployed();
  console.log('BuyMeACoffee deployed at:', CoffeeCon.address)

  // Check balances of all signers
  const addresses = [owner.address, acnt1.address, acnt2.address, acnt3.address, CoffeeCon.address]
  await printBalances(addresses)

  // Buy me coffees!
  console.log("... Buying coffees ...")
  await CoffeeCon.connect(acnt1).buyCoffee('Acnt 1', 'Here you go!', {value: hre.ethers.utils.parseEther('1')})
  await CoffeeCon.connect(acnt2).buyCoffee('Acnt 2', 'Here you go!', {value: hre.ethers.utils.parseEther('1')})
  await CoffeeCon.connect(acnt3).buyCoffee('Acnt 3', 'Here you go!', {value: hre.ethers.utils.parseEther('1')})

  // Check balances again
  await printBalances(addresses)

  // Print the owner
  console.log("Owner:", await CoffeeCon.connect(acnt3).getOwner())
  console.log("Owner:", await CoffeeCon.owner())

  // Withdraw tips
  console.log("... Withdrawing tips ...")
  await CoffeeCon.withdrawTips()
  await printBalances(addresses)

  // Check all memos
  const memos = await CoffeeCon.getMemos()
  await printMemos(memos)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
