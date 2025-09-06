import { ethers } from "hardhat";

async function main() {
  // Get local accounts
  const [manufacturer, distributor, retailer] = await ethers.getSigners();

  // Attach to the deployed SupplyChain contract
  const supplyChainAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with your deployed address
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(supplyChainAddress);

  console.log("Transferring product ID 1 along the supply chain...");

  // Manufacturer → Distributor
  let tx = await supplyChain.connect(manufacturer).transferProduct(1, distributor.address);
  await tx.wait();
  console.log(`Product 1 transferred to distributor: ${distributor.address}`);

  // Distributor → Retailer
  tx = await supplyChain.connect(distributor).transferProduct(1, retailer.address);
  await tx.wait();
  console.log(`Product 1 transferred to retailer: ${retailer.address}`);

  // Verify current owner
  const product = await supplyChain.products(1);
  console.log("Current owner of product 1:", product.currentOwner);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
