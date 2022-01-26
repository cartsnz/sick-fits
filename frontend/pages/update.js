import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import UpdateProduct from '../components/UpdateProduct';

export default function UpdatePage({ query }) {
  // console.log(query);
  const router = useRouter();
  // console.log(router.query);
  return (
    <div>
      <UpdateProduct id={router.query.id} />
    </div>
  );
}

UpdatePage.propTypes = {
  query: PropTypes.any,
};
