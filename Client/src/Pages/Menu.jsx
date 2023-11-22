import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function Menu(){
  const [menuItems, setMenuItems] = useState([]);
  const storedUser = JSON.parse(sessionStorage.getItem("user"));
  const sampleMenuItems = [
    { id: 1, name: 'Veg Burger', price: 60, image: 'Veg-Burger.jpg' },
    { id: 2, name: 'Chicken Burger', price: 80, image: 'Chicken-Burger.jpg' },
    { id: 3, name: 'Cheese Burger', price: 70, image: 'Cheese-Burger.jpg' },
    { id: 4, name: 'Cheese Pizza', price: 70, image: 'Cheese-Pizza.jpg' },
    { id: 5, name: 'Chicken Pizza', price: 90, image: 'Chicken-Pizza.jpg' },
    { id: 6, name: 'Item 3', price: 8.99, image: 'Veg-Burger.jpg' },
    { id: 7, name: 'Item 3', price: 8.99, image: 'Veg-Burger.jpg' },
    { id: 8, name: 'Item 3', price: 8.99, image: 'Veg-Burger.jpg' },
    { id: 9, name: 'Item 3', price: 8.99, image: 'Veg-Burger.jpg' },
  ];

  useEffect(() => {
    // Replace this with API call to fetch menu items
    setMenuItems(sampleMenuItems);
  }, []);

  const addToCart = (item) => {
    const storedUser = JSON.parse(sessionStorage.getItem("user"));
    if (storedUser && storedUser.email) {
      const data = {
        ...item,
        email: storedUser.email
      };

      axios.post('http://localhost:4000/api/addToCart', data)
        .then(response => {
          console.log('Item added to cart:', response.data);
          toast.success("Added To Cart Successfully");
        })
        .catch(error => {
          console.error('Error adding item to cart:', error);
        });
    } else {
      console.error('User not found in session storage');
    }
  };

  return (
    <>
            <ToastContainer position="bottom-right" theme="dark" draggable autoClose={5000} />

 
    <div className="container mx-auto">
      <h1 className="text-3xl font-bold my-4 text-center bg-orange-950">Menu</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {menuItems.map((item) => (
          <div key={item.id} className="bg-gray-100 p-4 rounded-lg shadow-md">
           <center> <img
              src={`/images/${item.image}`}
              alt={item.name}
              className="mb-4 max-h-48 max-w-xl rounded-md"
            />
            <p className="text-xl font-bold">{item.name}</p>
            <p className="text-lg">₹ {item.price}</p>
            <button
              onClick={() => addToCart(item)}
              className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md"
            >
              Add to Cart
            </button>
            </center>
          </div>
        ))}
      </div>
    </div>
    </>
  );
};


