import { ethers } from "hardhat";

async function main() {
  // Get local accounts
  const [manufacturer, distributor, retailer] = await ethers.getSigners();

  console.log("Manufacturer:", manufacturer.address);
  console.log("Distributor:", distributor.address);
  console.log("Retailer:", retailer.address);

  // Deploy the SupplyChain contract
  const SupplyChain = await ethers.getContractFactory("SupplyChain");
  const supplyChain = await SupplyChain.deploy(distributor.address, retailer.address);
  await supplyChain.deployed();
  console.log("SupplyChain deployed to:", supplyChain.address);

  // ---- Step 1: Manufacturer creates products ----
  const products = [
    { name: "Product A", qty: 100, batch: "BATCH001" },
    { name: "Product B", qty: 200, batch: "BATCH002" },
  ];

  for (const p of products) {
    const tx = await supplyChain.connect(manufacturer).createProduct(p.name, p.qty, p.batch);
    await tx.wait();
    console.log(`Created ${p.name} with quantity ${p.qty}`);
  }

  // ---- Step 2: Manufacturer transfers to Distributor ----
  for (let id = 1; id <= products.length; id++) {
    const tx = await supplyChain.connect(manufacturer).transferProduct(id, distributor.address, "Shipped to distributor");
    await tx.wait();
    console.log(`Product ID ${id} shipped to distributor`);
  }

  // ---- Step 3: Distributor transfers to Retailer ----
  for (let id = 1; id <= products.length; id++) {
    const tx = await supplyChain.connect(distributor).transferProduct(id, retailer.address, "Shipped to retailer");
    await tx.wait();
    console.log(`Product ID ${id} shipped to retailer`);
  }

  // ---- Step 4: Retailer records sales ----
  for (let id = 1; id <= products.length; id++) {
    const tx = await supplyChain.connect(retailer).recordRetailEvent(id, "Sold 50 units");
    await tx.wait();
    console.log(`Retail event recorded for Product ID ${id}`);
  }

  // ---- Step 5: Print full product histories ----
  for (let id = 1; id <= products.length; id++) {
    const history = await supplyChain.getProductHistory(id);
    console.log(`\nProduct ID ${id} history:`);
    history.forEach((event: string, index: number) => {
      console.log(`${index + 1}. ${event}`);
    });
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
