//// deployment script

const hre = require("hardhat");

async function main() {
  // Get a few sample accounts (+ owner as first)


  // Deploy our sol contract
  const BuyMeACoffeeContract = await hre.ethers.getContractFactory("BuyMeACoffee");
  const CoffeeCon = await BuyMeACoffeeContract.deploy();
  await CoffeeCon.deployed();
  console.log('BuyMeACoffee deployed at:', CoffeeCon.address)
}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
