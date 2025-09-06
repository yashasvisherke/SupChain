// SPDX-License-Identifier: MIT
pragma solidity ^0.8.28;

contract SupplyChain {
    // Roles
    address public manufacturer;
    address public distributor;
    address public retailer;

    // Product struct with lifecycle tracking
    struct Product {
        uint256 id;
        string name;
        uint256 quantity;
        address currentOwner;
        string batchNumber;
        uint256 productionDate;
        string[] history; // events like "Produced", "Shipped", "Received", "Sold"
    }

    uint256 public nextProductId = 1;
    mapping(uint256 => Product) private products; // made private, will expose getters

    // Events
    event ProductCreated(uint256 id, string name, uint256 quantity, address owner);
    event ProductUpdated(uint256 id, string action, address by);
    event ProductTransferred(uint256 id, address from, address to);

    // Constructor: deployer is manufacturer
    constructor(address _distributor, address _retailer) {
        manufacturer = msg.sender;
        distributor = _distributor;
        retailer = _retailer;
    }

    // Manufacturer creates a new product
    function createProduct(string memory _name, uint256 _quantity, string memory _batchNumber) external {
        require(msg.sender == manufacturer, "Only manufacturer can create products");

        Product storage product = products[nextProductId];
        product.id = nextProductId;
        product.name = _name;
        product.quantity = _quantity;
        product.currentOwner = manufacturer;
        product.batchNumber = _batchNumber;
        product.productionDate = block.timestamp;
        product.history.push("Produced by manufacturer");

        emit ProductCreated(nextProductId, _name, _quantity, manufacturer);
        nextProductId++;
    }

    // Transfer product to next entity
    function transferProduct(uint256 _productId, address _to, string memory _action) external {
        Product storage product = products[_productId];
        require(msg.sender == product.currentOwner, "Only current owner can transfer");
        require(_to == distributor || _to == retailer, "Invalid recipient");

        product.currentOwner = _to;
        product.history.push(_action);

        emit ProductTransferred(_productId, msg.sender, _to);
        emit ProductUpdated(_productId, _action, msg.sender);
    }

    // Retailer records sale or inventory update
    function recordRetailEvent(uint256 _productId, string memory _event) external {
        require(msg.sender == retailer, "Only retailer can record retail events");
        Product storage product = products[_productId];
        product.history.push(_event);
        emit ProductUpdated(_productId, _event, msg.sender);
    }

    // ===== New Helper Functions =====

    // Get product details
    function getProduct(uint256 _productId)
        external
        view
        returns (
            uint256 id,
            string memory name,
            uint256 quantity,
            address currentOwner,
            string memory batchNumber,
            uint256 productionDate,
            string[] memory history
        )
    {
        Product storage product = products[_productId];
        return (
            product.id,
            product.name,
            product.quantity,
            product.currentOwner,
            product.batchNumber,
            product.productionDate,
            product.history
        );
    }

    // Get number of products created
    function getProductCount() external view returns (uint256) {
        return nextProductId - 1;
    }

    // Get product history directly
    function getProductHistory(uint256 _productId) external view returns (string[] memory) {
        return products[_productId].history;
    }

    // Role getters
    function getManufacturer() external view returns (address) {
        return manufacturer;
    }

    function getDistributor() external view returns (address) {
        return distributor;
    }

    function getRetailer() external view returns (address) {
        return retailer;
    }
}
