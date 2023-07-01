import { cssObj } from '@fuel-ui/css';
import { Box, Button } from '@fuel-ui/react';

import { EcosystemTagsLoading } from './EcosystemTagsLoading';

type EcosystemTagsProps = {
  tags?: string[];
  onPressTag?: (tag: string) => void;
  activeTag?: string;
  onPressAllCategories?: () => void;
  isLoading?: boolean;
};

export const EcosystemTags = ({
  tags,
  onPressTag,
  activeTag,
  onPressAllCategories,
  isLoading,
}: EcosystemTagsProps) => {
  if (isLoading) return <EcosystemTagsLoading />;
  return (
    <Box.Flex justify="flex-start" align="center" gap="$3" wrap="wrap">
      <Button
        variant="outlined"
        onPress={onPressAllCategories}
        css={!activeTag ? styles.active : styles.default}
        size="sm"
      >
        All Categories
      </Button>
      <Box css={styles.divider} />
      {(tags || []).map((tag) => (
        <Button
          variant="outlined"
          key={tag}
          onPress={() => onPressTag?.(tag)}
          css={activeTag === tag ? styles.active : styles.default}
          size="sm"
        >
          {tag}
        </Button>
      ))}
    </Box.Flex>
  );
};

const styles = {
  default: cssObj({
    color: '$intentsBase12',
  }),
  active: cssObj({
    borderColor: '$intentsPrimary10',
    color: '$intentsBase12',
  }),
  divider: cssObj({
    width: '1px',
    height: '$4',
    backgroundColor: '$intentsBase9',
  }),
};

EcosystemTags.Loading = EcosystemTagsLoading;
