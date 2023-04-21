// TODO: this component should be removed when we have a better way to configure theming

import { Card } from '@fuel-ui/react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const PortalCard = ({ children, ...props }: any) => {
  return <Card {...props}>{children}</Card>;
};
