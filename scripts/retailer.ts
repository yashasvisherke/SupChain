// scripts/retailer.ts
import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const retailer = provider.getSigner(2);

  const supplyChainAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; // replace
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(supplyChainAddress);

  const tx1 = await supplyChain.connect(retailer).recordRetailEvent(1, "Sold 50 units");
  await tx1.wait();
  console.log("Product 1 sale recorded");

  const tx2 = await supplyChain.connect(retailer).recordRetailEvent(2, "Sold 70 units");
  await tx2.wait();
  console.log("Product 2 sale recorded");

  // Print product histories
  for (let id = 1; id <= 2; id++) {
    const history = await supplyChain.getProductHistory(id);
    console.log(`\nProduct ${id} history:`);
    history.forEach((event: string, index: number) => console.log(`${index + 1}. ${event}`));
  }
}

main().catch(console.error);
