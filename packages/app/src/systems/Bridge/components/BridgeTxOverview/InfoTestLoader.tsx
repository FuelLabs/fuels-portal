import { ContentLoader } from '@fuel-ui/react';

export const InfoTestLoader = () => {
  return (
    <ContentLoader speed={2} height="18" width="70">
      <ContentLoader.Rect width="70" height="18" rx="4" />
    </ContentLoader>
  );
};
