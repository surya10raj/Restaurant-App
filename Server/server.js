const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');
const User = require('./userModel'); 
const Cart = require('./cartModel'); 
const bcrypt = require('bcrypt');

const app = express();
const port = 4000;

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cors());

mongoose.connect('mongodb+srv://surya:jfz7LH62vFRWlenG@cluster0.snlqnuh.mongodb.net/?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
}).then(() => console.log('Mongodb Connected'));



// Define the POST endpoint for user registration
app.post('/api/newuser', async (req, res) => {
  try {
    const { username, password, email, balance } = req.body.newUser;
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10); // 10 is the number of salt rounds

    const newUser = new User({ username, password: hashedPassword, email, balance });
    await newUser.save();

    res.status(201).json({ success: true, message: 'User created successfully' });
  } catch (error) {
    console.error('Error creating user:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});



app.post('/api/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(400).json({ success: false, message: 'User does not exist' });
    }

    const passwordMatch = await bcrypt.compare(password, user.password);

    if (!passwordMatch) {
      return res.status(401).json({ success: false, message: 'Invalid password' });
    }


    res.status(200).json({ success: true, message: 'Login successful' });
  } catch (error) {
    console.error('Error logging in:', error);
    res.status(500).json({ success: false, message: 'Internal server error' });
  }
});




app.get('/api/activeuser', async (req, res) => {
  try {
    const userEmail = req.query.userEmail;

    // Use await to wait for the User.findOne promise to resolve
    const user = await User.findOne({ email: userEmail });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    const username = user.username;

    res.status(200).json({ username }); // Send the username in the response
  } catch (error) {
    console.error("Error Fetching Active user", error);
    res.status(500).json({ error: 'Server error' });
  }
});

// server.js

// ... (previous code)

app.post('/api/addToCart', async (req, res) => {
  try {
    const { id, name, price, image } = req.body;
    const userEmail = req.body.email; 
    const userfind = await User.findOne({ email: userEmail },{_id:0});
    const user = userfind.username;
    const newItem = new Cart({
      name: name,
      price: price,
      image: image,
      email: userEmail, // Add the email to the cart item
      // Add other fields as needed
    });

    await newItem.save();
    res.status(200).send('Item added to cart');
  } catch (error) {
    console.error('Error adding to cart:', error);
    res.status(500).send('Error adding to cart');
  }
});



app.get('/api/cartItems/:userEmail', async (req, res) => {
  try {
    const userEmail = req.params.userEmail;
    const cartItems = await Cart.find({ email: userEmail }); // Modify the query to use userEmail
    res.status(200).json(cartItems);
  } catch (error) {
    console.error('Error fetching cart items:', error);
    res.status(500).send('Error fetching cart items');
  }
});


// DELETE request to remove an item from the cart
app.delete('/api/cartItems/:id', async (req, res) => {
  try {
    const itemId = req.params.id;
    await Cart.deleteOne({ _id: itemId });
    res.status(200).json({ message: 'Item removed from the cart' });
  } catch (error) {
    console.error('Error deleting item from cart:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});



app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
