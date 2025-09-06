// scripts/get-products.ts
import { ethers } from "hardhat";
import * as readline from "readline";

// replace this with your actual deployed contract address from deploy.ts
const CONTRACT_ADDRESS = "0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512";

async function main() {
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = SupplyChain.attach(CONTRACT_ADDRESS);

  // Get total products
  const count = await supplyChain.productCount();
  console.log(`Total products: ${count.toString()}`);

  // Fetch each product
  for (let i = 1; i <= count; i++) {
    const product = await supplyChain.products(i);
    console.log(`\nProduct ${i}:`);
    console.log(`  Name: ${product.name}`);
    console.log(`  Quantity: ${product.quantity.toString()}`);
    console.log(`  Batch No: ${product.batchNumber}`);
    console.log(`  Owner: ${product.owner}`);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
