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
    <Box.Flex justify="flex-start" align="center" gap="$2" wrap="wrap">
      <Button
        variant="outlined"
        onPress={onPressAllCategories}
        css={{ ...styles.tag, ...(!activeTag && styles.active) }}
        size="xs"
      >
        All Categories
      </Button>
      <Box css={styles.divider} />
      {(tags || []).map((tag) => (
        <Button
          variant="outlined"
          key={tag}
          onPress={() => onPressTag?.(tag)}
          css={{ ...styles.tag, ...(activeTag === tag && styles.active) }}
          size="xs"
        >
          {tag}
        </Button>
      ))}
    </Box.Flex>
  );
};

const styles = {
  tag: cssObj({
    color: '$intentsBase12',
    padding: '$4 $3',
  }),
  active: cssObj({
    borderColor: '$intentsPrimary10',
    color: '$intentsBase12',
  }),
  divider: cssObj({
    width: '1px',
    height: '$3',
    backgroundColor: '$intentsBase6',
  }),
};

EcosystemTags.Loading = EcosystemTagsLoading;
