// cartModel.js

const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true
  },
  quantity: {
    type: Number,
    default: 1
  },
  image: {
    type: String
  },
  email:{
    type:String,
    required : true
  }
});

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;
