import { cssObj } from '@fuel-ui/css';
import { Box, Button } from '@fuel-ui/react';

type EcosystemTagsProps = {
  tags?: string[];
  onTagClick?: (tag: string) => void;
};

export const EcosystemTags = ({ tags, onTagClick }: EcosystemTagsProps) => {
  const handleTagClick = (tag: string) => {
    if (onTagClick) {
      onTagClick(tag);
    }
  };
  return (
    <Box.Flex justify="flex-start" align="center" gap="$3" wrap="wrap">
      <Button
        variant="outlined"
        onPress={() => handleTagClick('all')}
        css={styles.active}
      >
        All Categories
      </Button>
      <Box css={styles.divider} />
      {(tags || []).map((tag) => (
        <Button
          variant="outlined"
          key={tag}
          onPress={() => handleTagClick(tag)}
        >
          {tag}
        </Button>
      ))}
    </Box.Flex>
  );
};

const styles = {
  active: cssObj({
    borderColor: '$intentsPrimary10',
  }),
  divider: cssObj({
    width: '1px',
    height: '$4',
    backgroundColor: '$gray6',
  }),
};
