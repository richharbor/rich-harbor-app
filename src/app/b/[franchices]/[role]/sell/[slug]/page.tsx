import SharePage from '@/pages/Users/Buying/SharePage/SharePage';
import AddSharePage from '@/pages/Users/Selling/AddShare/AddShare';
import { FC } from 'react';

interface SharePageProps {
  params: {
    slug: string;
  };
}

const page: FC<SharePageProps> = ({ params }) => {
  const { slug } = params;

  const isNumeric = /^\d+$/.test(slug);

  if (isNumeric) {
    return <SharePage id={String(slug)} owner = {true} />;
  }

  return <AddSharePage shareName={slug} />;
};

export default page;