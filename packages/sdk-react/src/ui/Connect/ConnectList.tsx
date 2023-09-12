import { cssObj } from '@fuel-ui/css';
import { Box, Card, Image, Text } from '@fuel-ui/react';

import type { Connector, ConnectorList } from '../../types';

import { getImageUrl } from './utils/getImageUrl';

export type ConnectListProps = {
  theme: string;
  connectors: ConnectorList;
  onPress: (connector: Connector) => void;
};

export const ConnectList = ({
  connectors,
  theme,
  onPress,
}: ConnectListProps) => {
  return (
    <Box.Stack gap={'$2'}>
      {connectors.map((connector) => (
        <Card
          key={connector.connector}
          css={styles.connector}
          onPress={() => onPress(connector)}
          aria-label={`Connect to ${connector.name}}`}
        >
          <Text css={styles.connectorTitle}>{connector.name}</Text>
          <Box css={styles.connectorImage}>
            {getImageUrl(theme, connector) && (
              <Image
                src={getImageUrl(theme, connector)}
                alt={`${connector.name} logo`}
              />
            )}
          </Box>
        </Card>
      ))}
    </Box.Stack>
  );
};

const styles = {
  connector: cssObj({
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '$2 $4',
    fontWeight: '$bold',
    height: '$10',
    cursor: 'pointer',

    '&:hover': {
      backgroundColor: '$intentsBase3',
    },
  }),
  connectorImage: cssObj({
    height: '$8',
    width: '$8',

    '& > img': {
      maxHeight: '$full',
      width: '$full',
    },
  }),
  connectorTitle: cssObj({}),
};
