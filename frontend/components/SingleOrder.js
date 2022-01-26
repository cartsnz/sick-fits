/* eslint-disable array-callback-return */
import { useQuery } from '@apollo/client';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';
import Head from 'next/head';
import formatMoney from '../lib/formatMoney';
import DisplayError from './ErrorMessage';
import OrderStyles from './styles/OrderStyles';

const SINGLE_ORDER_QUERY = gql`
  query SINGLE_ORDER_QUERY($id: ID!) {
    Order(where: { id: $id }) {
      id
      user {
        id
        name
        email
      }
      total
      items {
        name
        price
        description
        photo {
          image {
            publicUrlTransformed
          }
        }
      }
    }
  }
`;

export default function SingleOrder({ id }) {
  const { data, loading, error } = useQuery(SINGLE_ORDER_QUERY, {
    variables: {
      id,
    },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <DisplayError error={error} />;

  const { Order } = data;

  console.log(Order.items);

  Order.items.map((item) => {
    console.log(item.name);
  });

  return (
    <OrderStyles>
      <Head>
        <title>Sick Fits - Order #{Order.id}</title>
      </Head>
      <p>
        <span>Order id:</span>
        <span>{Order.id}</span>
      </p>
      <p>
        <span>Charge:</span>
        <span>{Order.charge}</span>
      </p>
      <p>
        <span>Total:</span>
        <span>{formatMoney(Order.total)}</span>
      </p>
      <p>
        <span>Item count:</span>
        <span>{Order.items.length}</span>
      </p>
      {Order.items.map((item) => {
        <span>Order: {item.name}</span>;
      })}
      <div className="items">
        {Order.items.map((item) => (
          <div className="order-item" key={item.id}>
            <img src={item.photo.image.publicUrlTransformed} alt={item.name} />
            <h2>{item.name}</h2>
            <p>Qty: {item.quantity}</p>
            <p>Each: {formatMoney(item.price)}</p>
            <p>Subtotal: {formatMoney(item.price * item.quantity)}</p>
            <p>{item.description}</p>
          </div>
        ))}
      </div>
    </OrderStyles>
  );
}

SingleOrder.propTypes = {
  id: PropTypes.string,
};
