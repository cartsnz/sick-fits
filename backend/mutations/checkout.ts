/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput, OrderCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';
import stripeConfig from '../lib/stripe';
import { CartItem } from '../schemas/CartItem';

const graphql = String.raw;

async function checkout(
  root: any,
  { token }: { token: string },
  context: KeystoneContext
): Promise<OrderCreateInput> {
  // Make sure user is signed in
  const sesh = context.session as Session;
  const userId = sesh.itemId;
  if (!userId) {
    throw new Error('You must be logged in to do this');
  }
  const user = await context.lists.User.findOne({
    where: { id: userId },
    resolveFields: graphql`
      id
      name
      email
      cart {
        id
        quantity
        product {
          name
          price
          description
          id
          photo {
            id
            image {
              id
              publicUrlTransformed
            }
          }
        }
      }   
    `
  })
  // Filter out removed products
  const cartItems = user.cart.filter(cartItem => cartItem.product);
  // Calculate total price
  const amount = cartItems.reduce(function(tally: number, cartItem: CartItemCreateInput) {
    return tally + (cartItem.quantity * cartItem.product.price);
  }, 0);
  
  // Create the charge with the stripe library
  const charge = await stripeConfig.paymentIntents.create({
    amount: amount,
    currency: 'USD',
    confirm: true,
    payment_method: token
  }).catch(err => {
    console.log(err);
    throw new Error(err.message);
  })

  console.log(charge);
  // Convert the CartItems to OrderItems
  const orderItems = cartItems.map(cartItem => {
    const orderItem = {
      name: cartItem.product.name,
      description: cartItem.product.description,
      price: cartItem.product.price,
      quantity: cartItem.quantity,
      photo: { connect: { id: cartItem.product.photo.id}},
    }
    return orderItem;
  })
  // Create the order and return it
  const order = await context.lists.Order.createOne({
    data: {
      total: charge.amount,
      charge: charge.id,
      items: { create: orderItems},
      user: { connect: {id: userId}}
    }
  })
  // Clean up any old cart items
  const cartItemIds = user.cart.map(cartItem => cartItem.id);
  await context.lists.CartItem.deleteMany({
    ids: cartItemIds
  })
  return order;
}

export default checkout;
