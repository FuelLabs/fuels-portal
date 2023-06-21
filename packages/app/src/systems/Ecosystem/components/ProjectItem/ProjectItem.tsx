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
import { motion } from 'framer-motion';
import type { FC } from 'react';

import type { Project } from '../../types';
import { STATUS_TEXT } from '../../types';

import { ProjectItemLoader } from './ProjectItemLoader';

import { animations } from '~/systems/Core';

const MotionCard = motion(Card);

export type ProjectItemProps = Project & {
  onPress?: () => void;
};

type ProjectItemComponent = FC<ProjectItemProps> & {
  Loader: typeof ProjectItemLoader;
};

export const ProjectItem: ProjectItemComponent = ({
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

  const onCardPress = () => {
    window.open(url, '_blank');
  };

  return (
    <MotionCard
      withDividers
      css={styles.card}
      {...animations.slideInBottom({
        transition: { type: 'spring' },
      })}
      onClick={onCardPress}
    >
      <Card.Body>
        <Box.Flex align="flex-start" justify="flex-start" gap="$4">
          <IconButton
            intent="error"
            variant="ghost"
            icon="Bolt"
            aria-label="project-icon"
            iconSize={20}
            css={styles.projectIcon}
          />
          <Box.Stack gap="$2" css={styles.details}>
            <Box.Flex align="flex-start" justify="space-between">
              <Text fontSize="base" color="intentsBase12">
                {name}
              </Text>
              <Icon icon="ArrowUpRight" size={20} stroke={1} />
            </Box.Flex>
            <Text fontSize="sm"> {description}</Text>
            <Box.Flex align="center" justify="space-between" wrap="wrap">
              <ButtonLink
                variant="link"
                css={styles.link}
                href={url}
                color="intentsBase12"
                size="sm"
              >
                {hostname}
              </ButtonLink>
              <Tag intent="base" size="xs" css={styles.tag}>
                <Box css={{ ...styles.dot, ...styles[`dot-${status}`] }} />
                {STATUS_TEXT[status]}
              </Tag>
            </Box.Flex>
          </Box.Stack>
        </Box.Flex>
      </Card.Body>
    </MotionCard>
  );
};

const styles = {
  card: cssObj({
    border: '1px solid $semanticOutlinedBaseBorder',
    padding: '$4',
    '&:hover': {
      cursor: 'pointer',
    },
  }),
  details: cssObj({
    flex: 1,
  }),
  link: cssObj({
    textDecoration: 'underline',
    color: '$intentsBase12',
  }),
  dot: cssObj({
    width: '$2',
    height: '$2',
    borderRadius: '50%',
  }),
  'dot-live': cssObj({
    background: '$intentsPrimary6',
    border: '1px solid $intentsPrimary9',
    boxShadow: ' 0px 0px 4px #ffffff',
  }),
  'dot-testnet': cssObj({
    background: '$intentsInfo6',
    border: '1px solid $intentsInfo9',
    boxShadow: ' 0px 0px 4px #ffffff',
  }),
  'dot-in-development': cssObj({
    background: '$intentsWarning6',
    border: '1px solid $intentsWarning9',
    boxShadow: ' 0px 0px 4px #ffffff',
  }),
  tag: cssObj({
    color: '$intentsBase12',
    borderRadius: '$sm',
    padding: '0 $2',
    backgroundColor: '$gray5',
  }),
  projectIcon: cssObj({
    padding: '$3 $2',
    '& svg': {
      strokeWidth: '1.5px',
    },
  }),
};

ProjectItem.Loader = ProjectItemLoader;
