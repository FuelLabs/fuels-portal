import { cssObj } from '@fuel-ui/css';
import {
  Box,
  ButtonLink,
  Card,
  IconButton,
  Tag,
  Text,
  Icon,
} from '@fuel-ui/react';

type ProjectStatus = 'live' | 'testnet' | 'in-development';

const STATUS_TEXT: Record<ProjectStatus, string> = {
  live: 'Live on Mainnet',
  testnet: 'Live on Testnet',
  'in-development': 'In development',
};

export type Project = {
  name: string;
  description: string;
  tags: string[];
  url: string;
  status: ProjectStatus;
};

export type ProjectItemProps = Project & {
  onClick?: () => void;
};

export const ProjectItem = ({
  name,
  description,
  url,
  status,
}: ProjectItemProps) => {
  let hostname = '';
  try {
    hostname = new URL(url || 'https://#').hostname;
  } catch (e) {
    hostname = '';
  }
  return (
    <Card withDividers css={styles.card}>
      <Card.Body>
        <Box.Flex align="flex-start" justify="flex-start" gap="$4">
          <IconButton
            intent="error"
            variant="ghost"
            icon="Star"
            aria-label="project-icon"
          />
          <Box.Stack gap="$2" css={styles.details}>
            <Box.Flex align="flex-start" justify="space-between">
              <Text fontSize="lg"> {name}</Text>
              <Icon icon="ArrowUpRight" size={20} />
            </Box.Flex>
            <Text> {description}</Text>
            <Box.Flex align="center" justify="space-between">
              <ButtonLink
                variant="link"
                css={styles.link}
                href={url}
                isExternal
              >
                {hostname}
              </ButtonLink>
              <Tag intent="base">
                <Box css={{ ...styles.dot, ...styles[`dot-${status}`] }} />
                {STATUS_TEXT[status]}
              </Tag>
            </Box.Flex>
          </Box.Stack>
        </Box.Flex>
      </Card.Body>
    </Card>
  );
};

const styles = {
  card: cssObj({
    borderColor: '$semanticOutlinedBaseBorder',
  }),
  details: cssObj({
    flex: 1,
  }),
  link: cssObj({
    textDecoration: 'underline',
  }),
  dot: cssObj({
    width: '8px',
    height: '8px',
    borderRadius: '50%',
  }),
  'dot-live': cssObj({
    background: '$intentsPrimary9',
    border: '1px solid $intentsPrimary11',
    boxShadow: ' 0px 0px 4px',
  }),
  'dot-testnet': cssObj({
    background: '$intentsInfo9',
    border: '1px solid $intentsInfo11',
    boxShadow: ' 0px 0px 4px',
  }),
  'dot-in-development': cssObj({
    background: '$intentsWarning9',
    border: '1px solid $intentsWarning11',
    boxShadow: ' 0px 0px 4px',
  }),
};
