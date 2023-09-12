import { useCallback, useMemo, useState } from 'react';

import { useFuel } from '../components';
import type { ConnectorList, Connector } from '../types';

import { useConnect } from './useConnect';
import { useConnectorList } from './useConnectorList';

export type UseConnectorParams = {
  connectors: ConnectorList;
};

export type UseConnector = {
  isConnecting: boolean;
  connect: () => void;
  connectors: ConnectorList;
  connectProps: {
    isOpen: boolean;
    connector: Connector | null;
    connect: (connector: Connector) => void;
    close: () => void;
    back: () => void;
    connectors: ConnectorList;
  };
};

export function useConnector({
  connectors: initalConnectors,
}: UseConnectorParams): UseConnector {
  const { fuel } = useFuel();
  const { isLoading, connect } = useConnect();
  const [connector, setConnector] = useState<Connector | null>(null);
  const [isOpen, setOpen] = useState(false);
  const { connectors: connectorList } = useConnectorList();
  const connectors = useMemo(() => {
    return initalConnectors
      .map((connector) => ({
        ...connector,
        installed: connectorList.find((c) => c.name === connector.name),
      }))
      .sort((a) => (a.installed ? -1 : 1));
  }, [initalConnectors, connectorList]);

  const handleClose = () => {
    setConnector(null);
    setOpen(false);
  };

  const handleBack = () => {
    setConnector(null);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleConnect = useCallback(
    async (connector: Connector) => {
      if (!fuel) return setConnector(connector);

      const connectors = await fuel.listConnectors();
      const hasConnector = connectors.find((c) => c.name === connector.name);

      if (hasConnector) {
        connect(connector.name);
        handleClose();
      } else {
        setConnector(connector);
      }
    },
    [fuel]
  );

  return {
    isConnecting: isLoading,
    connectors,
    connect: handleOpen,
    connectProps: {
      isOpen,
      connector,
      connectors,
      connect: handleConnect,
      close: handleClose,
      back: handleBack,
    },
  };
}
