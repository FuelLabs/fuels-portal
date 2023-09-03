import { cssObj } from '@fuel-ui/css';
import {
  Box,
  Dialog,
  Icon,
  IconButton,
  Text,
  useFuelTheme,
} from '@fuel-ui/react';
import { useConnect, useFuel } from '@fuels-portal/sdk-react';
import { useState } from 'react';

import { ConnectInstall } from './ConnectInstall';
import { ConnectList } from './ConnectList';
import type { ConnectProps, Connector } from './defs';

export const Connect = ({ connectors, children }: ConnectProps) => {
  const { current } = useFuelTheme();
  const { fuel } = useFuel();
  const { connect } = useConnect();
  const [connector, setConnector] = useState<Connector | null>(null);
  const [open, setOpen] = useState(false);

  const handleConnect = async (connector: Connector) => {
    if (!fuel) return setConnector(connector);

    const connectors = await fuel.listConnectors();
    const hasConnector = connectors.find((c) => c.name === connector.name);

    if (hasConnector) {
      connect(connector.name);
      handleClose();
    } else {
      setConnector(connector);
    }
  };

  const handleClose = () => {
    setConnector(null);
    setOpen(false);
  };

  const handleBack = () => {
    setConnector(null);
  };

  return (
    <Dialog
      isOpen={open}
      isBlocked={open}
      onOpenChange={(s) => {
        if (s) setOpen(true);
      }}
    >
      <Dialog.Trigger>{children}</Dialog.Trigger>
      <Dialog.Content css={styles.content}>
        <Dialog.Heading css={styles.header}>
          <Box css={styles.headerAction}>
            {connector && (
              <IconButton
                icon={Icon.is('ChevronLeft')}
                aria-label="back"
                variant="link"
                onPress={handleBack}
              />
            )}
          </Box>
          <Text fontSize="sm">Connect Wallet</Text>
          <Box css={styles.headerAction}>
            <IconButton
              icon={Icon.is('X')}
              aria-label="close"
              variant="link"
              onPress={handleClose}
            />
          </Box>
        </Dialog.Heading>
        {!connector ? (
          <ConnectList
            connectors={connectors}
            theme={current}
            onPress={handleConnect}
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
