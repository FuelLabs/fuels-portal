import { cssObj } from '@fuel-ui/css';
import {
  Box,
  ButtonLink,
  Card,
  Tag,
  Text,
  Icon,
  Tooltip,
  CardFooter,
} from '@fuel-ui/react';
import { motion } from 'framer-motion';
import { type FC } from 'react';
import { animations } from '~/systems/Core';

import type { Project } from '../../types';
import { ProjecImage } from '../ProjectImage';

import { ProjectItemLoader } from './ProjectItemLoader';

const MotionCard = motion(Card);

export type ProjectItemProps = Project & {
  onPress?: () => void;
  onSelect?: (project: Project) => void;
};

type ProjectItemComponent = FC<ProjectItemProps> & {
  Loader: typeof ProjectItemLoader;
};

export const ProjectItem: ProjectItemComponent = ({
  name,
  description,
  image,
  url,
  twitter,
  discord,
  status,
  github,
  isLive,
  onSelect,
  tags,
}: ProjectItemProps) => {
  const onCardPress = () => {
    if (onSelect) {
      onSelect({
        name,
        description,
        image,
        url,
        twitter,
        discord,
        status,
        github,
        isLive,
        tags,
      });
    }
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
        <ProjecImage name={name} image={image} />
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
                {twitter && (
                  <Tooltip content={twitter}>
                    <ButtonLink
                      as="a"
                      href={twitter}
                      color="intentsBase12"
                      size="sm"
                    >
                      <Icon icon="BrandX" size={20} stroke={1} />
                    </ButtonLink>
                  </Tooltip>
                )}
                {discord && (
                  <Tooltip content={discord}>
                    <ButtonLink
                      as="a"
                      href={discord}
                      color="intentsBase12"
                      size="sm"
                    >
                      <Icon icon="BrandDiscord" size={20} stroke={1} />
                    </ButtonLink>
                  </Tooltip>
                )}
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
                  <ButtonLink as="a" href={url} color="intentsBase12" size="sm">
                    <Icon
                      icon="ExternalLink"
                      color="intentsBase8"
                      size={20}
                      stroke={1}
                    />
                  </ButtonLink>
                </Tooltip>
              </Box.Flex>
            </Box.Flex>
            <Text fontSize="sm"> {description}</Text>
          </Box.Stack>
          <Box.Flex align="center" justify="space-between" wrap="wrap">
            {isLive ? (
              <Tag intent="base" size="xs" css={styles.tag} variant="ghost">
                <Box css={styles.dot} />
                {'Live'}
              </Tag>
            ) : null}
          </Box.Flex>
        </Box.Stack>
      </Card.Body>
      <CardFooter css={styles.cardFooter}>
        <Box.Flex
          align="center"
          justify="flex-start"
          wrap="wrap"
          css={styles.statusContainer}
        >
          {status &&
            status.map((s, index) => (
              <Tag
                key={index}
                intent="base"
                size="xs"
                css={styles.tag}
                variant="ghost"
              >
                {s}
              </Tag>
            ))}
        </Box.Flex>
      </CardFooter>
    </MotionCard>
  );
};

const styles = {
  card: cssObj({
    transition: 'transform 0.2s ease-in-out, border 0.2s ease-in-out',
    '&:hover': {
      cursor: 'pointer',
      border: '1px solid #00F58C',
      transform: 'scale(1.02)',
    },
  }),
  cardFooter: cssObj({
    //maxHeight: '10px',
  }),
  details: cssObj({
    flex: 1,
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
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
    marginRight: '8px',
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
  statusContainer: cssObj({
    display: 'flex',
    alignItems: 'flex-start',
    justifyContent: 'flex-start',
    flexWrap: 'wrap',
    marginTop: 'auto',
  }),
};

ProjectItem.Loader = ProjectItemLoader;
