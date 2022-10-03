import 'destyle.css';
import '~/styles/app.scss';

import { GlobalHeader } from '~/components/GlobalHeader';

function MyApp({ Component, pageProps }) {
  return (
    <>
      <GlobalHeader />
      <Component {...pageProps} />
    </>
  );
}

export default MyApp;
