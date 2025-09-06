// scripts/transfer-to-retailer.ts
import { ethers } from "hardhat";

async function main() {
  const provider = new ethers.providers.JsonRpcProvider("http://127.0.0.1:8545");
  const distributor = provider.getSigner(1);
  const retailer = provider.getSigner(2);

  const supplyChainAddress = "0x8A791620dd6260079BF849Dc5567aDC3F2FdC318"; // replace
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(supplyChainAddress);

  for (let id = 1; id <= 2; id++) {
    const tx = await supplyChain.connect(distributor).transferProduct(id, await retailer.getAddress(), "Shipped to retailer");
    await tx.wait();
    console.log(`Product ${id} shipped to retailer`);
  }
}

main().catch(console.error);
