const { expect } = require("chai");
// const { console } = require("hardhat");
// const { ethers } = require("ethers");
const { ethers } = require("hardhat");


const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

const ID = 1;
const NAME = "Shoes"
const CATEGORY = "Clothing"
const IMAGE = "https://ipfs.io/ipfs/QmTYEboq8raiBs7GTUg2yLXB3PMz6HuBNgNfSZBx5Msztg/drone.jpg"
const COST = tokens(1)
const RATING = 4
const STOCK = 5

describe("Bstore", () => {

    let bstore;
    let deployer, buyer;
    let Bstore;

    beforeEach(async() => {

        //  setup accounts 
        [deployer, buyer] = await ethers.getSigners();
        // console.log(deployer, buyer)


        // deploy contracts 
        const Bstore = await ethers.getContractFactory("Bstore");
        bstore = await Bstore.deploy();

    })

    describe("deployment", () => {

        it("Sets the owner", async() => {
            expect(await bstore.owner()).to.equal(deployer.address);
        })

        it('has a name', async() => {

            expect(await bstore.name()).to.equal("Bstore");
        })

    })

    describe("listing", () => {
        let transaction

        beforeEach(async() => {
            transaction = await bstore.connect(deployer).list(
                ID,
                NAME,
                CATEGORY,
                IMAGE,
                COST,
                RATING,
                STOCK
            )
            await transaction.wait();
        })

        it("returns Items attribute", async() => {
            const item = await bstore.items(ID);
            expect(item.id).to.equal(ID)
            expect(item.name).to.equal(NAME)
            expect(item.category).to.equal(CATEGORY)
            expect(item.image).to.equal(IMAGE)
            expect(item.cost).to.equal(COST)
            expect(item.rating).to.equal(RATING)
            expect(item.stock).to.equal(STOCK)
        })

        it("Emits list events", () => {
            expect(transaction).to.emit(bstore, "List")
        })

    })

    describe("buying", () => {
        let transaction;
        beforeEach(async() => {

            //  list an item
            transaction = await bstore.connect(deployer).list(
                ID,
                NAME,
                CATEGORY,
                IMAGE,
                COST,
                RATING,
                STOCK
            )
            await transaction.wait();

            // buy an item 
            transaction = await bstore.connect(buyer).buy(ID, { value: COST })

        })

        it("Updates the Contract Balance", async() => {
            const results = await ethers.provider.getBalance(bstore.getAddress());
            // console.log(results)
            expect(results).to.equal(COST)
        })

        it("Updates buyer's order count", async() => {
            const results = await bstore.orderCount(buyer.address);

            expect(results).to.equal(1)
        })

        it("Adds the order", async() => {
            const order = await bstore.orders(buyer.address, 1);
            // console.log(results)
            expect(order.time).to.be.greaterThan(0)
            expect(order.item.name).to.equal(NAME)
        })

        it("Updates the Contract Balance", async() => {
            const results = await ethers.provider.getBalance(bstore.getAddress());
            // console.log(results)
            expect(results).to.equal(COST)
        })

        it("Emits a buy event", async() => {
            // const results = await ethers.provider.getBalance(dappazon.address);
            expect(transaction).to.emit(bstore, "Buy");
        })

    })

    describe("withdrawal", () => {
        let balanceBefore

        beforeEach(async() => {
            //  list an item 
            let transaction = await bstore.connect(deployer).list(
                ID,
                NAME,
                CATEGORY,
                IMAGE,
                COST,
                RATING,
                STOCK)
            await transaction.wait();

            // buy an item 
            transaction = await bstore.connect(buyer).buy(ID, { value: COST })
            await transaction.wait();

            // get deployer balance before 
            balanceBefore = await ethers.provider.getBalance(deployer.address)

            // withdraw
            transaction = await bstore.connect(deployer).withdraw()

            it("Updates the owner balance", async() => {
                const balanceAfter = await ethers.provider.getBalance(deployer.address)
                expect(balanceAfter).to.be.greaterThan(balanceBefore)
            })

            it("updates the contract balance", async() => {

                const result = await ethers.provider.getBalance(bstore.getAddress());
                expect(result).to.equal(0)
            })

        })
    })
})