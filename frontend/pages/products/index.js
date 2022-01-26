import { useRouter } from 'next/dist/client/router';
import Products from '../../components/Products';
import Pagination from '../../components/Pagination';

export default function ProductPage() {
  const router = useRouter();
  // console.log(router.query);
  const { page } = router.query;
  // console.log(page);
  return (
    <>
      <Pagination page={parseInt(page) || 1} />
      <Products page={parseInt(page) || 1} />
      <Pagination page={parseInt(page) || 1} />
    </>
  );
}
