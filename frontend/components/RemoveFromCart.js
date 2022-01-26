import styled from 'styled-components';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import gql from 'graphql-tag';

const BigButton = styled.button`
  font-size: 3rem;
  background: none;
  border: 0;
  &:hover {
    color: var(--red);
    cursor: pointer;
  }
`;

const DELETE_CARTITEM_MUTATION = gql`
  mutation DELETE_CARTITEM_MUTATION($id: ID!) {
    deleteCartItem(id: $id) {
      id
    }
  }
`;

function update(cache, payload) {
  cache.evict(cache.identify(payload.data.deleteCartItem));
}

export default function RemoveFromCart({ id }) {
  const [removeFromCart, { loading }] = useMutation(DELETE_CARTITEM_MUTATION, {
    variables: { id },
    update,
    // optimisticResponse: {
    //  deleteCartItem: {
    //    __typename: 'CartItem',
    //    id,
    //  },
    // },
  });

  return (
    <BigButton
      type="button"
      title="Remove this item form cart"
      onClick={removeFromCart}
      disabled={loading}
    >
      &times;
    </BigButton>
  );
}

RemoveFromCart.propTypes = {
  id: PropTypes.string,
};
