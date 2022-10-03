import { client } from '~/lib/cms';
import { PageIndex } from '~/components/PageIndex';

export default function Index(props) {
  return <PageIndex {...props} />;
}

export const getStaticProps = async () => {
  const data = await client.getEntries({ content_type: 'product' });

  return {
    props: { posts: data.items },
  };
};
