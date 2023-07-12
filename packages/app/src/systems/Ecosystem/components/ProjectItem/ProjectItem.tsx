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

import { ProjectItemLoader } from './ProjectItemLoader';

import { animations, getUrlHostName } from '~/systems/Core';

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
  isLive,
}: ProjectItemProps) => {
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
      <Card.Body css={styles.body}>
        <IconButton
          intent="error"
          variant="ghost"
          icon="Bolt"
          aria-label="project-icon"
          iconSize={20}
          css={styles.projectIcon}
        />
        <Box.Stack gap="$1" justify="space-between" css={styles.details}>
          <Box.Stack align="flex-start" gap="$1">
            <Box.Flex
              align="flex-start"
              justify="space-between"
              css={styles.title}
            >
              <Text fontSize="base" color="intentsBase12">
                {name}
              </Text>
              <Icon
                icon="ArrowUpRight"
                color="intentsBase8"
                size={20}
                stroke={1}
              />
            </Box.Flex>
            <Text fontSize="sm"> {description}</Text>
          </Box.Stack>
          <Box.Flex align="center" justify="space-between" wrap="wrap">
            <ButtonLink
              variant="link"
              css={styles.link}
              href={url}
              color="intentsBase12"
              size="xs"
            >
              {getUrlHostName(url)}
            </ButtonLink>
            {isLive ? (
              <Tag intent="base" size="xs" css={styles.tag} variant="ghost">
                <Box css={styles.dot} />
                {'Live on mainnet'}
              </Tag>
            ) : null}
          </Box.Flex>
        </Box.Stack>
      </Card.Body>
    </MotionCard>
  );
};

const styles = {
  card: cssObj({
    border: '1px solid $semanticOutlinedBaseBorder',
    '&:hover': {
      cursor: 'pointer',
    },
  }),
  details: cssObj({
    flex: 1,
    height: '100%',
  }),
  link: cssObj({
    textDecoration: 'underline',
    color: '$intentsBase12',
    padding: '0',
  }),
  dot: cssObj({
    width: '$1',
    height: '$1',
    borderRadius: '50%',
    border: '1px solid #A9F6D5',
    background: '#00F58C',
    boxShadow: '0px 0px 4px 0px #00F58C',
  }),
  tag: cssObj({
    color: '$intentsBase12',
    borderRadius: '$sm',
    padding: '0 $1',
    backgroundColor: '$gray5',
  }),
  projectIcon: cssObj({
    padding: '$3 $2',
    '& svg': {
      strokeWidth: '1.5px',
    },
  }),
  title: cssObj({
    width: '100%',
  }),
  body: cssObj({
    height: '100%',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '$4',
    justifyContent: 'flex-start',
    padding: '$6',
  }),
};

ProjectItem.Loader = ProjectItemLoader;
