import * as ProjectImages from '../data/images';

import { useTheme } from '~/systems/Settings';

export const useProjectImage = (image?: string) => {
  const { theme } = useTheme();

  const imageSuffix = theme === 'light' ? 'Dark' : 'Light';

  return ProjectImages[`${image}${imageSuffix}`] || ProjectImages[image || ''];
};
