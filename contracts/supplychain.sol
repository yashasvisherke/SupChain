// SPDX-License-Identifier: MIT
pragma solidity ^0.8.20;

// This is the main contract for your Supply Chain Security project.
// It manages product tracking on the blockchain.

contract SupplyChain {
    // === 1. Data Structures ===
    // This sruct represents a product batch and its journey through the supply chain.
    struct ProductBatch {
        string batchId;
        string manufacturer;
        string location;
        uint256 timestamp;
        string status;
    }

    // A mapping to store all product batches. The key is the unique batchId.
    mapping(string => ProductBatch) public products;
    
    // An event to log whenever a new product batch is created.
    event ProductCreated(
        string indexed batchId,
        string manufacturer,
        string location
    );
    
    // An event to log whenever a product's status is updated.
    event ProductStatusUpdated(
        string indexed batchId,
        string newStatus,
        string updatedBy
    );

    // === 2. Role-Based Functions ===
    // This function allows a manufacturer to create a new product batch.
    // The "require" statement ensures that only the manufacturer can call this function.
    function createProductBatch(
        string memory _batchId,
        string memory _manufacturer,
        string memory _location
    ) public {
        // You would typically use a role-based access control system here.
        // For this example, we'll assume the caller is authorized.
        
        // Ensure the batch ID does not already exist to prevent duplicates.
        require(bytes(products[_batchId].batchId).length == 0, "Product batch already exists.");
        
        // Create the new product batch.
        products[_batchId] = ProductBatch(
            _batchId,
            _manufacturer,
            _location,
            block.timestamp,
            "Manufactured"
        );
        
        // Emit an event to log the creation on the blockchain.
        emit ProductCreated(_batchId, _manufacturer, _location);
    }
    
    // This function allows a logistics partner or retailer to update a product's status.
    function updateProductStatus(
        string memory _batchId,
        string memory _newStatus
    ) public {
        // Again, you would add a "require" statement for role-based access.
        // For example: require(isLogisticsPartner(msg.sender) || isRetailer(msg.sender), "Not authorized.");

        // Ensure the product batch exists before updating it.
        require(bytes(products[_batchId].batchId).length > 0, "Product batch does not exist.");
        
        // Update the status of the product.
        products[_batchId].status = _newStatus;
        
        // Emit an event to log the status change.
        emit ProductStatusUpdated(_batchId, _newStatus, "Some Role"); // You would use a dynamic role here
    }
}
