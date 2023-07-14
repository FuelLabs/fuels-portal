import * as ProjectImages from '../data/images';

export const useProjectImage = (image?: string) => {
  return ProjectImages[image || ''];
};
