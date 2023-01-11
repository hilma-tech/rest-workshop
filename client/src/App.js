import React, { useEffect, useState } from 'react';
import './App.css';
import { _ARRAY_OF_NUMBERS, _SERVER_ERROR } from './const';

function App() {
  // states that need to be updated when fetching data from server
  const [allFlavors, setAllFlavors] = useState([]);//[ { name: "", amount: 0 } ]
  const [customer, setCustomer] = useState();//{{name:'',favoriteFlavor:''}}


  // state for inputs
  const [newFlavor, setNewFlavor] = useState("");
  const [newStock, setNewStock] = useState(1);

  const [selectedFlavor, setSelectedFlavor] = useState();//string
  const [amountFlavor, setAmountFlavor] = useState(1);

  const [wantedAmount, setWantedAmount] = useState() //number | undifined
  const [filteredFlavors, setFilteredFlavors] = useState([]);//[ { name: "", amount: 0 } ]

  // handle functions for inputs
  const handleFlavorChange = (e) => {
    setSelectedFlavor(e.target.value);
  }
  const handleAmountChange = (e) => {
    setAmountFlavor(e.target.value);
  }
  const handleWantedAmountChange = (e) => {
    setWantedAmount(e.target.value);
  }

  const handleNewFlavorChange = (e) => {
    setNewFlavor(e.target.value);
  }
  const handleNewStockChange = (e) => {
    setNewStock(e.target.value);
  }

  // execute the fetch functions when the component is mounted
  useEffect(() => {
    getFilteredFlavors();

  }, [wantedAmount])

  useEffect(() => {

    getCustomer();
    getFlavors();
  }, [])

  // example fetch functions
  const getFlavors = async () => {
    try {
      const res = await fetch(`http://localhost:8000/api/flavor?${wantedAmount ? `amount=${wantedAmount}` : ""}`) // fetching the data from the server
      const data = await res.json(); // converting the data to json from stringJSON (string)
      setAllFlavors(data); // setting the data to the state
      setFilteredFlavors(data)

    } catch (error) {
      alert(_SERVER_ERROR)
    }
  }

  const getCustomer = async () => {
    // first mission: get the customer with id 2 from the server by including the id in the url as a parameter
    //setCostumer with the given data 

    try {
      const res = await fetch("http://localhost:8000/api/customer/2") // fetching the data from the server
      const data = await res.json(); // converting the data to json from stringJSON (string)
      setCustomer(data); //setting the data to the state

    } catch (error) {
      console.error('error: ', error);


    }
  }

  const buyAmountOfFlavor = async () => {
    // second mission: using selectedFlavor and amountFlavor, "buy" the wanted amount from the selected flavor 
    // update the the selected flavor amount in allFlavors state 
    try {
      const res = await fetch(`http://localhost:8000/api/flavor/${selectedFlavor}`,
        {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ amount: amountFlavor }),
        }) // fetching the data from the server
      const data = await res.json(); // converting the data to json from stringJSON (string)
      setAllFlavors(data)// setting the data to the state

    } catch (error) {
      console.log('error: ', error);

    }
  }

  const postFlavor = async () => {
    // third mission:using newFlavor and newStock add a new flavor - passing amount and flavor name using the body of the request
    // add the ne flavor and its amount in allFlavors state 
    try {
      const res = await fetch(`http://localhost:8000/api/flavor/`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ name: newFlavor, amount: newStock }),
        }) // fetching the data from the server
      const data = await res.json(); // converting the data to json from stringJSON (string)
      setAllFlavors(data)// setting the data to the state

    } catch (error) {
      console.log('error: ', error);

    }

  }

  const getFilteredFlavors = async () => {
    // fourth mission: 
    // PART 1:
    // using wantedAmount, get all the flavour that have the wanted amount is stock
    // update allFlavors state 
    // how to write a query: https://www.semrush.com/blog/url-parameters/

    const res = await fetch(`http://localhost:8000/api/flavor?${wantedAmount ? `amount=${wantedAmount}` : ""}`) // fetching the data from the server
    const data = await res.json(); // converting the data to json from stringJSON (string)
    console.log('data : ', data );
    setFilteredFlavors(data); // setting the data to the state



  }

  //fifth mission: create a delete flavor functionality
  //1. create in the client a component to select a flavor from stock
  //2. create a button that deletes a flavor
  //3. create a handleClick function that sends to server a fetch req to delete selected item
  //4. tip: use any one of the methods that was used during this exercise (param, query or body)
  const deleteFlavor = async () => {
  }


  return (
    <div className="App">
      <div className='welcome' >
        <h1>Welcome to our ice cream store</h1>
      </div>
      <div className="container">
        {allFlavors &&
          <div className="message">
            <h3 className='our-message'>Our stock right now:</h3>
            <div style={{ marginBottom: "1vw" }}>
              wanted amount
              <select className='search post-select' placeholder='amount' style={{ marginLeft: "1vw" }} value={wantedAmount} onChange={handleWantedAmountChange}>
                {_ARRAY_OF_NUMBERS.map(number => {
                  return <option value={number}>{number}</option>
                })}
              </select>
            </div>
            <div className='flavours'>
              {
                filteredFlavors.map(flavor => {
                  return <div className={`${flavor.name} flavor`}>{flavor.name} <br /> {flavor.amount}</div> // mapping the data to the screen
                })
              }


            </div>
            <div style={{ display: 'flex', justifyContent: 'space-evenly', marginTop: '5vh', color: 'black' }}>
              <button className='post-button' onClick={async () => { await postFlavor(); getFlavors() }}>Post data</button>
              <input className='post-input' type="text" placeholder="new flavor" value={newFlavor} onChange={handleNewFlavorChange} />
              <select className='post-select' placeholder='amount' value={newStock} onChange={handleNewStockChange}>
                {_ARRAY_OF_NUMBERS.map(number => {
                  return <option value={number}>{number}</option>
                })}
              </select>
            </div>
          </div >}



        {customer &&
          <div className="customers">
            <h4>Our customers:</h4>
            <div>[{customer.name}] We know that his favorite Flavor is: {customer.favoriteFlavor}</div>
          </div>
        }

        <div className="search-flavor">
          <h4>Buy ice cream:</h4>
          <div className='search-div'>
            <select className='search post-select' placeholder='amount' value={amountFlavor} onChange={handleAmountChange}>
              {_ARRAY_OF_NUMBERS.map(number => {
                return <option value={number}>{number}</option>
              })}
            </select>

            {allFlavors && <select className='search post-select' placeholder='flavor name' value={selectedFlavor} onChange={handleFlavorChange}>
              {allFlavors.map(flavor => {
                return <option value={flavor.name}>{flavor.name}</option>
              })}
            </select>}
            <button className='post-button' onClick={() => { buyAmountOfFlavor(); getFlavors() }}>update</button>
          </div>
        </div >
      </div>
    </div >
  );
}

export default App;
