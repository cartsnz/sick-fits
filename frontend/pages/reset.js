import { useRouter } from 'next/router';
import RequestReset from '../components/RequestReset';
import Reset from '../components/Reset';

export default function ResetPage() {
  const router = useRouter();
  const { token } = router.query;

  if (!token) {
    return (
      <div>
        <RequestReset />
      </div>
    );
  }
  return (
    <div>
      <p>Reset your password</p>
      <Reset token={token} />
    </div>
  );
}
