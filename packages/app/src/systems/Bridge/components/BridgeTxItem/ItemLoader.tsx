import { ContentLoader } from '@fuel-ui/react';

export const ItemLoader = () => {
  return (
    <ContentLoader speed={2} height="18" width="70">
      <ContentLoader.Rect width="170" height="18" rx="4" />
    </ContentLoader>
  );
};
