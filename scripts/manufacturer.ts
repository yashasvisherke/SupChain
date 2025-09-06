// scripts/manufacturer.ts
import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const manufacturer = provider.getSigner(0); // first account

  const supplyChainAddress = "0x5FbDB2315678afecb367f032d93F642f64180aa3"; // replace with deployed address
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(supplyChainAddress);

  const tx1 = await supplyChain.connect(manufacturer).createProduct("Product A", 100, "BATCH001");
  await tx1.wait();
  console.log("Product A created");

  const tx2 = await supplyChain.connect(manufacturer).createProduct("Product B", 200, "BATCH002");
  await tx2.wait();
  console.log("Product B created");
}

main().catch(console.error);
