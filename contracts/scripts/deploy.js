const hre = require("hardhat");

async function main() {
  // Get the contract factory
  const SupplyChain = await hre.ethers.getContractFactory("SupplyChain");

  // Deploy the contract (no constructor arguments)
  const supplyChain = await SupplyChain.deploy();

  // ✅ Wait for deployment (ethers v6)
  await supplyChain.waitForDeployment();

  console.log("SupplyChain contract deployed to:", await supplyChain.getAddress());
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
