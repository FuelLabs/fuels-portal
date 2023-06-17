import { lightColors, darkColors } from '@fuel-ui/css';
import { Box, ContentLoader } from '@fuel-ui/react';

import { useTheme } from '~/systems/Settings';

export const BridgeTxItemsLoading = () => {
  const { theme } = useTheme();
  return (
    <Box.Stack justify="center" gap="$4">
      <ContentLoader
        speed={2}
        height="24px"
        width="100%"
        backgroundColor={
          theme === 'light' ? lightColors.intentsBase3 : darkColors.intentsBase3
        }
        foregroundColor={
          theme === 'light' ? lightColors.intentsBase3 : darkColors.intentsBase3
        }
      >
        <ContentLoader.Rect width="100%" height="24" rx="4" />
      </ContentLoader>
      <ContentLoader
        speed={2}
        height="24px"
        width="100%"
        backgroundColor={
          theme === 'light' ? lightColors.intentsBase2 : darkColors.intentsBase2
        }
        foregroundColor={
          theme === 'light' ? lightColors.intentsBase2 : darkColors.intentsBase2
        }
      >
        <ContentLoader.Rect width="100%" height="24" rx="4" />
      </ContentLoader>
      <ContentLoader
        speed={2}
        height="24px"
        width="100%"
        backgroundColor={
          theme === 'light' ? lightColors.intentsBase1 : darkColors.intentsBase1
        }
        foregroundColor={
          theme === 'light' ? lightColors.intentsBase1 : darkColors.intentsBase1
        }
      >
        <ContentLoader.Rect width="100%" height="24" rx="4" />
      </ContentLoader>
    </Box.Stack>
  );
};
