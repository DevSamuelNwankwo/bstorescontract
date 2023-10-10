
import './App.css';
import { ethers } from 'ethers';
import { useState, useEffect } from 'react';
import { Footer } from './Components/Footer';

// commponentsg
import Navigation from "./Components/Navigation";
import Product from "./Components/Product";
import Section from "./Components/Section";

// abis
import Bstore from './abis/Bstore.json';


// config file
// import config from "./Config.json";


function App() {
   
  const [provider, setProvider] = useState(null);

   const [account, setAccount] = useState(null);

   const [electronics, setElectronics] = useState(null);
   
   const [clothing, setClothing] = useState(null);

   const [toys, setToys] = useState(null);

   const [bstore, setBstore] = useState(null);

   const [item, setItem] = useState({});

   const [toggle, setToggle] = useState(false);

       const togglePop = (item) => {
           setItem(item)
           
           toggle ? setToggle(false) : setToggle(true);

          }

   const loadBlockchainData = async () => {
    // connect to  blockchain
     const provider =  new ethers.BrowserProvider(window.ethereum)
    
     setProvider(provider);

     const network = await provider.getNetwork();
     console.log(network);

     // connect to smart contract

    const bstore = new ethers.Contract("0xF67Da7FFBA3f52c98AE9Fe59f66ac046Cb9d0D9E", Bstore, provider);
    setBstore(bstore);

    // load products
    const items = [];
    for (var i = 1; i < 10; i++) {
      const item = await bstore.items(i);
        items.push(item);
      //  console.log (items)
    }
    

    const electronics =  items.filter((item)=>item.category === "electronics");
    const clothing =  items.filter((item)=>item.category === "clothing");
    const toys =  items.filter((item)=>item.category === "toys")
    
    setClothing(clothing);
    setElectronics(electronics);
    setToys(toys);

  }

  useEffect(()=>{
    loadBlockchainData()
  }, [])


  return (
    <div className="App">
            <Navigation account={account} setAccount={setAccount}/>
            {/* <h2> welcome to Bstore !</h2> */}

            <h1> Welcome To Bstore!</h1>

            {electronics && clothing && toys && (
             <>
                 <Section title={"Clothing & Jewelry"} items={clothing} togglePop={togglePop}/>
                 <Section title={"Electronics & Gadgets"} items={electronics} togglePop={togglePop}/>
                 <Section title={"Toys & Gaming"} items={toys} togglePop={togglePop}/>
             </>

            )}

            {
              toggle && (
              <Product item={item} provider={provider} bstore={bstore} account={account} togglePop={togglePop}/>
              )
            }

            <Footer/>
    </div>
  );
}

export default App;
