import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import { CURRENT_USER_QUERY } from './User';
import { useCart } from '../lib/cartState';

const ADD_TO_CART_MUTATION = gql`
  mutation ADD_TO_CART_MUTATION($id: ID!) {
    addToCart(productId: $id) {
      id
    }
  }
`;

export default function AddToCart({ id }) {
  const { toggleCart } = useCart();
  const [addToCart, { data, error, loading }] = useMutation(
    ADD_TO_CART_MUTATION,
    {
      variables: { id },
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    }
  );

  async function addAndOpenCart() {
    await addToCart();
    // toggleCart();
  }

  return (
    <button disabled={loading} type="button" onClick={addAndOpenCart}>
      Add{loading && 'ing'} to Cart
    </button>
  );
}

AddToCart.propTypes = {
  id: PropTypes.any,
};
