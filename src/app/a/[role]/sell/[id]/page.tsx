import SharePage from '@/pages/Users/SharePage/SharePage';
import AddSharePage from '@/pages/Users/Selling/AddShare/AddShare';
import React from 'react';

interface PageProps {
  params: {
    id: string;
  };
}

const Page = ({ params }: PageProps) => {
  return <SharePage id={params.id} owner = {true} />;
};

export default Page;