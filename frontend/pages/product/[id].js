import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import SingleProduct from '../../components/SingleProduct';

export default function SingleProductPage({ query }) {
  const router = useRouter();
  // console.log(router.query);
  // console.log(query);
  // return <p>Hey</p>;
  return <SingleProduct id={router.query.id} />;
}

SingleProductPage.propTypes = {
  query: PropTypes.any,
};
