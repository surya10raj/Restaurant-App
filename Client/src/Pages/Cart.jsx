import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Cart() {
  const [cartItems, setCartItems] = useState([]);
  const storedUser = JSON.parse(sessionStorage.getItem('user'));

  useEffect(() => {
    if (storedUser && storedUser.email) {
      axios
        .get(`http://localhost:4000/api/cartItems/${storedUser.email}`)
        .then((response) => {
          setCartItems(response.data);
        })
        .catch((error) => {
          console.error('Error fetching cart items:', error);
        });
    } else {
      console.error('User not found in session storage');
    }
  }, [storedUser]);

  const calculateTotalPrice = () => {
    let totalPrice = 0;
    cartItems.forEach((item) => {
      totalPrice += item.price;
    });
    return totalPrice;
  };

  const removeItem = (itemId) => {
    axios
      .delete(`http://localhost:4000/api/cartItems/${itemId}`)
      .then((response) => {
        const updatedCartItems = cartItems.filter((item) => item._id !== itemId);
        setCartItems(updatedCartItems);
      })
      .catch((error) => {
        console.error('Error removing item:', error);
      });
  };

  const placeOrder = () => {
    alert('Your order has been placed. Thank you!');
    // Additional logic for order placement can be added here
  };

  return (
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-4 bg-orange-950 text-center">Cart</h1>
      {cartItems.map((item) => (
        <div key={item._id} className="flex items-center bg-gray-100 p-4 rounded-lg shadow-md">
          <img src={`/images/${item.image}`} alt={item.name} className="w-20 h-20 object-cover mr-4" />
          <div>
            <p className="text-xl font-bold">{item.name}</p>
            <p className="text-lg">₹ {item.price}</p>
          </div>
          <button 
            onClick={() => removeItem(item._id)}
            className="ml-auto bg-red-500 text-white px-4 py-2 rounded-md"
          >
            Remove
          </button>
        </div>
      ))}
      <div className="text-center mt-8">
        <p className="text-2xl font-bold bg-white">Total Price: ₹ {calculateTotalPrice()}</p>
        <button 
          className="mt-4 bg-green-500 text-white px-4 py-2 rounded-md"
          onClick={placeOrder}
        >
          Proceed to Buy
        </button>
      </div>
    </div>
  );
}
