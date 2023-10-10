// We require the Hardhat Runtime Environment explicitly here. This is optional
// but useful for running the script in a standalone fashion through `node <script>`.
//
// You can also run a script with `npx hardhat run <script>`. If you do that, Hardhat
// will compile your contracts, add the Hardhat Runtime Environment's members to the
// global scope, and execute the script.
const hre = require("hardhat")
const { items } = require("../src/items.json")

const parseUnits = require("ethers")

const tokens = (n) => {
    return ethers.parseUnits(n.toString(), 'ether')
}

async function main() {
    //  code goes here 

    // setup accounts 
    const [deployer] = await ethers.getSigners();

    // deploy Bstore
    const Bstore = await hre.ethers.getContractFactory("Bstore");
    const bstore = await Bstore.deploy();


    console.log(`Deployed Bstore Contract at:${ await bstore.getAddress()}\n`)

    // listing items 
    for (let i = 0; i < items.length; i++) {
        const transaction = await bstore.connect(deployer).list(
            items[i].id,
            items[i].name,
            items[i].category,
            items[i].image,
            tokens(items[i].cost),
            items[i].rating,
            items[i].stock
        )

        await transaction.wait();

        console.log(`listed items ${items[i].id}; ${items[i].name} ; ${items[i].cost}`);
    }

}

// We recommend this pattern to be able to use async/await everywhere
// and properly handle errors.
main().catch((error) => {
    console.error(error);
    process.exitCode = 1;
});