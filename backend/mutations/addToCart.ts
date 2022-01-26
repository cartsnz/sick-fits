/* eslint-disable */
import { KeystoneContext } from '@keystone-next/types';
import { CartItemCreateInput } from '../.keystone/schema-types';
import { Session } from '../types';

async function addToCart(
  root: any,
  { productId }: { productId: string },
  context: KeystoneContext
): Promise<CartItemCreateInput> {
  console.log('Adding to cart...');
  // 1. Query user to see if they are signed in
  const sesh = context.session as Session;
  if (!sesh.itemId) {
    throw new Error('You must be logged in to do this');
  }
  // 2. Query the current users cart
  const allCartItems = await context.lists.CartItem.findMany({
    where: { user: { id: sesh.itemId }, product: { id: productId } },
    resolveFields: 'id,quantity'
  });
  console.log(allCartItems);
  const [existingCartItem] = allCartItems;
  // 3. See if current item is in cart - if it is increment by one
  if (existingCartItem) {
    console.log('This item is already in the cart, increment by 1');
    return await context.lists.CartItem.updateOne({
      id: existingCartItem.id,
      data: { quantity: existingCartItem.quantity + 1 },
    });
  }
  // 4. Create new cart item
  return await context.lists.CartItem.createOne({
    data: {
      product: { connect: {id: productId}},
      user: { connect: {id: sesh.itemId}}
    }
  })
}

export default addToCart;
