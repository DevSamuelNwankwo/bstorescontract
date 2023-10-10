// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

contract Bstore {
    // code goes below
    string public name;
    address public owner;

    struct Item {
        uint256 id;
        string name;
        string category;
        string image;
        uint256 cost;
        uint256 rating;
        uint256 stock;
    }

    struct Order {
        uint256 time;
        Item item;
    }

    mapping(uint256 => Item) public items;

    mapping(address => uint256) public orderCount;

    mapping(address => mapping(uint256 => Order)) public orders;

    event List(string name, uint256 cost, uint256 quantity);

    event Buy(address buyer, uint256 orderId, uint256 itemId);

    modifier onlyOwner() {
        require(msg.sender == owner);
        _;
    }

    constructor() {
        name = "Bstore";
        owner = msg.sender;
    }

    // list products

    function list(
        uint256 _id,
        string memory _name,
        string memory _category,
        string memory _image,
        uint256 _cost,
        uint256 _rating,
        uint256 _stock
    ) public onlyOwner {
        // create items struct
        Item memory item = Item(
            _id,
            _name,
            _category,
            _image,
            _cost,
            _rating,
            _stock
        );
        // save items struct to the blockchain
        items[_id] = item;

        //emit an event

        emit List(_name, _cost, _stock);
    }

    //  buy products

    function buy(uint256 _id) public payable {
        // fetch items
        Item memory item = items[_id];

        // require enough ether to buy the item
        require(msg.value >= item.cost);

        // require item is in stock
        require(item.stock > 0);

        //    create an order
        Order memory order = Order(block.timestamp, item);

        // add order for user

        orderCount[msg.sender]++; //order id
        orders[msg.sender][orderCount[msg.sender]] = order;

        // substrack
        items[_id].stock = item.stock - 1;

        // emit event
        emit Buy(msg.sender, orderCount[msg.sender], item.id);
    }

    // withdraw funds

    function withdraw() public onlyOwner {
        (bool success, ) = owner.call{value: address(this).balance}("");
        require(success);
    }
}
