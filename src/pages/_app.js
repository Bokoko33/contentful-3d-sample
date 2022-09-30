import 'destyle.css';
import '~/styles/app.scss';
import { SampleContextProvider } from '~/context/SampleContext';
import { GlobalHeader } from '~/components/GlobalHeader';

function MyApp({ Component, pageProps }) {
  return (
    <SampleContextProvider>
      <GlobalHeader />
      <Component {...pageProps} />
    </SampleContextProvider>
  );
}

export default MyApp;
