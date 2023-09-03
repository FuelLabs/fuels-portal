import { cssObj } from '@fuel-ui/css';
import { Box, Button, Image, Text, useFuelTheme } from '@fuel-ui/react';

import type { ConnectInstallProps } from './defs';
import { getImageUrl } from './utils/getImageUrl';

export const ConnectInstall = ({ connector }: ConnectInstallProps) => {
  const { current } = useFuelTheme();

  return (
    <Box.Stack>
      <Box css={styles.connectorImage}>
        <Image
          src={getImageUrl(current, connector)}
          alt={`${connector.name} logo`}
        />
      </Box>
      <Text fontSize="lg" css={styles.connectorTitle}>
        Install {connector.name}
      </Text>
      <Text css={styles.connectorDescription}>
        To connect your {connector.name}, install the browser extension.
      </Text>
      <Box css={styles.connectorFooter}>
        <Button
          size="lg"
          variant="ghost"
          as="a"
          href={connector.install}
          target="_blank"
        >
          <b>Install</b>
        </Button>
      </Box>
    </Box.Stack>
  );
};

const styles = {
  connectorTitle: cssObj({
    mt: '$2',
    textAlign: 'center',
  }),
  connectorImage: cssObj({
    my: '$4',
    height: '$28',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    width: '$full',

    '& > img': {
      maxHeight: '$full',
      width: '$full',
    },
  }),
  connectorDescription: cssObj({
    fontWeight: '$normal',
    textAlign: 'center',
    color: '$intentsBase9',
    mt: '$4',
  }),
  connectorFooter: cssObj({
    mt: '$8',

    '& > .fuel_Button': {
      boxSizing: 'border-box',
      width: '$full',
    },
  }),
};
