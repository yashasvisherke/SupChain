// scripts/deploy.ts
import { ethers } from "hardhat";

async function main() {
  // Get the default signer (manufacturer)
  const [manufacturer] = await ethers.getSigners();
  const distributor = "0x0000000000000000000000000000000000000000"; // placeholder, will replace in next step
  const retailer = "0x0000000000000000000000000000000000000000"; // placeholder

  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy(distributor, retailer);
  await supplyChain.deployed();

  console.log("SupplyChain deployed to:", supplyChain.address);
  console.log("Manufacturer address:", manufacturer.address);
}
main().catch(console.error);
