import { cssObj } from '@fuel-ui/css';
import {
  Box,
  ButtonLink,
  Card,
  IconButton,
  Tag,
  Text,
  Icon,
  Image,
  Tooltip,
} from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { type FC } from 'react';

import { useProjectImage } from '../../hooks';
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
  image,
  url,
  github,
  isLive,
}: ProjectItemProps) => {
  const projectImage = useProjectImage(image);
  const onCardPress = () => {
    window.open(url, '_blank');
  };

  return (
    <MotionCard
      withDividers
      {...animations.appearIn({
        transition: { type: 'spring' },
      })}
      onClick={onCardPress}
      variant="outlined"
      css={styles.card}
    >
      <Card.Body css={styles.body}>
        {projectImage ? (
          <Image src={projectImage} alt={name} width={40} height={40} />
        ) : (
          <IconButton
            intent="error"
            variant="ghost"
            icon="Bolt"
            aria-label="project-icon"
            iconSize={20}
            css={styles.projectIcon}
          />
        )}
        <Box.Stack gap="$2" justify="space-between" css={styles.details}>
          <Box.Stack align="flex-start" gap="$1">
            <Box.Flex
              align="flex-start"
              justify="space-between"
              css={styles.title}
            >
              <Text fontSize="base" color="intentsBase12">
                {name}
              </Text>
              <Box.Flex>
                {github && (
                  <Tooltip content={github}>
                    <ButtonLink
                      as="a"
                      href={github}
                      color="intentsBase12"
                      size="sm"
                    >
                      <Icon icon="BrandGithub" size={20} stroke={1} />
                    </ButtonLink>
                  </Tooltip>
                )}
                <Tooltip content={url}>
                  <Icon
                    icon="ArrowUpRight"
                    color="intentsBase8"
                    size={20}
                    stroke={1}
                  />
                </Tooltip>
              </Box.Flex>
            </Box.Flex>
            <Text fontSize="sm"> {description}</Text>
          </Box.Stack>
          <Box.Flex align="center" justify="space-between" wrap="wrap">
            <ButtonLink
              as="a"
              css={styles.link}
              href={url}
              color="intentsBase10"
              size="sm"
            >
              {getUrlHostName(url)}
            </ButtonLink>
            {isLive ? (
              <Tag intent="base" size="xs" css={styles.tag} variant="ghost">
                <Box css={styles.dot} />
                {'Live on testnet'}
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
    transition: 'transform 0.2s ease-in-out, border 0.2s ease-in-out',
    '&:hover': {
      cursor: 'pointer',
      border: '1px solid $intentsBase12',
      transform: 'scale(1.02)',
    },
  }),
  details: cssObj({
    flex: 1,
    height: '100%',
  }),
  link: cssObj({
    textDecoration: 'underline',
    padding: '0',
    pointerEvents: 'none',
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
    pointerEvents: 'none',
    padding: '$3 $2',
    '& svg': {
      strokeWidth: '1.5px',
    },
  }),
  title: cssObj({
    width: '100%',
  }),
  body: cssObj({
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: '$4',
    justifyContent: 'flex-start',
    padding: '$6',
  }),
};

ProjectItem.Loader = ProjectItemLoader;
