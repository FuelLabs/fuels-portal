import { Box, ButtonLink, Text } from '@fuel-ui/react';

type ProjectListEmptyProps = {
  onShowAll: () => void;
};

export const ProjectListEmpty = ({ onShowAll }: ProjectListEmptyProps) => (
  <Box.Flex justify="center">
    <Text> There are no projects that match your search. </Text>
    {onShowAll && (
      <ButtonLink onClick={() => onShowAll?.()}>Show all projects.</ButtonLink>
    )}
  </Box.Flex>
);
