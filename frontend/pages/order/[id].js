import { useRouter } from 'next/router';
import SingleOrder from '../../components/SingleOrder';

export default function SingleOrderPage(props) {
  const router = useRouter();
  console.log(router.query.id);
  return <SingleOrder id={router.query.id} />;
}
