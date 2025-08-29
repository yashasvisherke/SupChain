// Import necessary modules
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const { ethers } = require('ethers');
const admin = require('firebase-admin');
require('dotenv').config();

// Initialize Firebase Admin SDK using a service account key
const serviceAccount = require('./blockchain-dapp-f321c-firebase-adminsdk-fbsvc-7d547dc6f9.json');


admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = admin.firestore();
const auth = admin.auth();

// Initialize Express app
const app = express();
const port = 3001;

// Middleware setup
app.use(cors());
app.use(bodyParser.json());

// --- Blockchain Setup ---
// Replace this with your deployed contract address
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

// Import ABI directly from Hardhat artifacts
const contract = require("../artifacts/contracts/supplychain.sol/SupplyChain.json");
const CONTRACT_ABI = contract.abi;

// Connect to Hardhat local network
const provider = new ethers.JsonRpcProvider("http://127.0.0.1:8545/");
const wallet = new ethers.Wallet(process.env.PRIVATE_KEY, provider);
const supplyChainContract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, wallet);

// --- API Endpoints ---

// ✅ Register user
app.post('/auth/register', async (req, res) => {
    try {
        const { email, password, role } = req.body;

        const userRecord = await auth.createUser({
            email: email,
            password: password,
        });

        await auth.setCustomUserClaims(userRecord.uid, { role });

        await db.collection('users').doc(userRecord.uid).set({
            email: email,
            role: role,
            createdAt: admin.firestore.FieldValue.serverTimestamp()
        });

        res.status(201).send({ message: 'User registered successfully!' });
    } catch (error) {
        console.error('Error during registration:', error);
        res.status(500).send({ error: error.message });
    }
});

// ✅ Login user
app.post('/auth/login', async (req, res) => {
    try {
        const { email } = req.body;
        const userRecord = await auth.getUserByEmail(email);
        const customToken = await auth.createCustomToken(userRecord.uid);
        res.status(200).send({ token: customToken });
    } catch (error) {
        console.error('Error during login:', error);
        res.status(401).send({ error: error.message });
    }
});

// ✅ Create new product batch
app.post('/products/create', async (req, res) => {
    try {
        const { batchId, manufacturer, location } = req.body;

        const tx = await supplyChainContract.createProductBatch(batchId, manufacturer, location);
        await tx.wait();

        await db.collection('products').doc(batchId).set({
            batchId,
            manufacturer,
            location,
            status: "Manufactured",
            createdAt: admin.firestore.FieldValue.serverTimestamp(),
            txHash: tx.hash
        });

        res.status(201).send({ message: "Product batch created successfully.", transactionHash: tx.hash });
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).send({ error: error.message });
    }
});

// ✅ Update product status
app.post('/products/update', async (req, res) => {
    try {
        const { batchId, newStatus, updatedBy } = req.body;

        const tx = await supplyChainContract.updateProductStatus(batchId, newStatus);
        await tx.wait();

        await db.collection('products').doc(batchId).update({
            status: newStatus,
            updatedBy,
            updatedAt: admin.firestore.FieldValue.serverTimestamp(),
            txHash: tx.hash
        });

        res.status(200).send({ message: "Product status updated successfully.", transactionHash: tx.hash });
    } catch (error) {
        console.error('Error updating product status:', error);
        res.status(500).send({ error: error.message });
    }
});

// ✅ Get product history by batchId
app.get('/products/history/:batchId', async (req, res) => {
    try {
        const { batchId } = req.params;

        // Fetch from smart contract
        const product = await supplyChainContract.products(batchId);

        // Fetch from Firestore
        const doc = await db.collection('products').doc(batchId).get();
        const firestoreData = doc.exists ? doc.data() : {};

        res.status(200).send({
            blockchain: {
                batchId: product[0],
                manufacturer: product[1],
                location: product[2],
                timestamp: product[3].toString(),
                status: product[4],
            },
            firestore: firestoreData
        });
    } catch (error) {
        console.error('Error fetching product history:', error);
        res.status(500).send({ error: error.message });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`🚀 Supply Chain backend running at http://localhost:${port}`);
});
