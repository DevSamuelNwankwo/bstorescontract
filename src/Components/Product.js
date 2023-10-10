import { useEffect, useState } from 'react'
import { ethers } from 'ethers'

// Components
import Rating from './Rating'

import close from '../assets/close.svg'



const Product = ({ item, provider, account, bstore, togglePop }) => {

  const [order, setOrder] =useState(null);

  const [hasBought, setHasBought] = useState(false)

  const fetchDetails = async ()=>{
     const events = await bstore.queryFilter("Buy")

     const orders=events.filter(
       (event)=>event.args.buyer===account&&event.args.itemId.toString()===item.id.toString()
     )

     if(orders.length===0) return

     const order = await bstore.orders(account, orders[0].args.orderId)
     setOrder(order)
  }

  const buyHandler = async () =>{
    const signer = await provider.getSigner();
      let transaction = await bstore.connect(signer).buy(item.id,{alue:item.cost});

      await transaction.wait()

      setHasBought(true)
  }

  useEffect(()=>{
    fetchDetails()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hasBought]);



  return (
    <div className="product">

      <div className='product__details'> 

          <div className='product__image'> 
                <img src={item.image} alt="product" />

          </div>

          <div className='product__overview'>

            <h1> {item.name}</h1>
            <Rating value={item.rating}/>

            <hr />
             
            <p>{item.address}</p>

            <h2>{ethers.formatUnits(item.cost.toString(), 'ether')} ETH</h2>
            
            <hr />

            <h2> Overview</h2>

            <p> 
              Lorem ipsum dolor sit amet consectetur adipisicing elit. Obcaecati, iusto, amet dolor suscipit nemo excepturi quam hic magni provident, minus nulla repudiandae itaque sequi aliquid et perferendis tempora quasi. Sed.
              Ipsam dolorem, alias expedita ad hic reprehenderit tempora voluptas voluptatum numquam quibusdam illo porro quis a doloremque amet illum incidunt aut eaque voluptates mollitia minus pariatur cum? Dicta, tempore delectus!
             
            </p>

          
          </div>

          <div className="product__order">
            {/* <h1>{ethers.formatUnits(item.cost.toString(), 'ether')} ETH</h1> */}

            <p>
              FREE DELIVERY <br />

              <strong>
                {new Date(Date.now()+345600000).toLocaleDateString(undefined, {weekday:'long', month:'long', day:'numeric'})}
              </strong>
            </p>

            {
              item.stock > 0 ? (
                <p>In stock.</p>
              ):(
                <p> Out of stock.</p>
              )
            }

            <button className='product__buy' onClick={buyHandler}>
                Buy Now
            </button>

            <p> <small> shipped from </small> Bstore </p>
            <p> <small> sold by</small>  Bstore</p>


            {
              order && (
                <div className='product__bought'>
                       item bought on <br />
                       <strong>
                         {
                           new Date(Number(order.time.toString()+'000')).toLocaleDateString(
                             undefined, {
                               weekday:'long',
                               hour:'numeric',
                               minute:'numeric',
                               second:'numeric'
                             }
                           )
                         }
                       </strong>
                </div>
              )
            }


            <button onClick={togglePop} className="product__close">
              <img src={close} alt="Close" />
            </button>

          </div>


      </div>

    </div >
  );
}

export default Product;