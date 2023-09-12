import { cssObj } from '@fuel-ui/css';
import { Box, Dialog, Icon, IconButton, Text } from '@fuel-ui/react';

import { useConnector } from '../../components';

import { ConnectInstall } from './ConnectInstall';
import { ConnectList } from './ConnectList';

export const Connect = ({ theme }: { theme: string }) => {
  const {
    connectors,
    cancel,
    _internal: { isOpen, connector, connect, back },
  } = useConnector();

  return (
    <Dialog isOpen={isOpen} isBlocked={isOpen}>
      <Dialog.Content css={styles.content}>
        <Dialog.Heading css={styles.header}>
          <Box css={styles.headerAction}>
            {connector && (
              <IconButton
                icon={Icon.is('ChevronLeft')}
                aria-label="back"
                variant="link"
                onPress={back}
              />
            )}
          </Box>
          <Text fontSize="sm">Connect Wallet</Text>
          <Box css={styles.headerAction}>
            <IconButton
              icon={Icon.is('X')}
              aria-label="close"
              variant="link"
              onPress={cancel}
            />
          </Box>
        </Dialog.Heading>
        {!connector ? (
          <ConnectList
            connectors={connectors}
            theme={theme}
            onPress={connect}
          />
        ) : (
          <ConnectInstall connector={connector} />
        )}
      </Dialog.Content>
    </Dialog>
  );
};

const styles = {
  headerAction: cssObj({
    with: '$2',
  }),
  header: cssObj({
    display: 'flex',
    justifyContent: 'space-between',
  }),
  content: cssObj({
    maxWidth: 300,
  }),
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
