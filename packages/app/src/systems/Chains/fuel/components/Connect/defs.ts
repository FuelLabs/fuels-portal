export type Connector = {
  name: string;
  image:
    | string
    | {
        light: string;
        dark: string;
      };
  connector: string;
  install: string;
};

export type ConnectorList = Array<Connector>;

export type ConnectProps = {
  connectors: ConnectorList;
  children: React.ReactNode;
};

export type ConnectListProps = {
  theme: string;
  connectors: ConnectorList;
  onPress: (connector: Connector) => void;
};

export type ConnectItemProps = {
  theme: string;
  connector: Connector;
  onPress: (connector: Connector) => void;
};

export type ConnectInstallProps = {
  connector: Connector;
};
