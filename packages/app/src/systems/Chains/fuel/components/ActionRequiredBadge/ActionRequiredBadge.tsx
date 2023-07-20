import { cssObj } from '@fuel-ui/css';
import { Badge } from '@fuel-ui/react';

export const ActionRequiredBadge = () => {
  return (
    <Badge css={styles.actionBadge} intent="error">
      Action Required
    </Badge>
  );
};

const styles = {
  actionBadge: cssObj({
    fontSize: '$xs',
    lineHeight: 1,
    padding: '$1',
    textTransform: 'none',
  }),
};
