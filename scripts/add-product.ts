// scripts/add-product.ts
import { ethers } from "hardhat";
import * as readline from "readline";

async function main() {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
  });

  function question(query: string) {
    return new Promise<string>((resolve) => rl.question(query, resolve));
  }

  const name = await question("Enter product name: ");
  const quantityStr = await question("Enter quantity: ");
  const batch = await question("Enter batch number: ");
  rl.close();

  const quantity = parseInt(quantityStr);

  // ✅ Get manufacturer signer from Hardhat (local accounts)
  const [manufacturer] = await ethers.getSigners();

  // ✅ Attach your deployed contract
  const supplyChainAddress = "0xCf7Ed3AccA5a467e9e704C703E8D87F634fB0Fc9"; // Replace with your deployed contract address
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChainContract = SupplyChain.attach(supplyChainAddress);

  // ✅ Create product on blockchain
  const tx = await supplyChainContract.connect(manufacturer).createProduct(name, quantity, batch);
  await tx.wait();

  console.log(`✅ Product "${name}" created on blockchain with quantity ${quantity}`);
}

main().catch((err) => {
  console.error("Error:", err);
  process.exit(1);
});
