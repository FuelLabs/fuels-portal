/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

import { getReposAndDependencies } from '../utils/dependencies';

const REPOS = [
  {
    name: 'fuel-core',
    version: '0.22.0',
    isCorrect: false,
  },
  {
    name: 'sway',
    dependencies: [
      {
        name: 'fuel-core',
      },
    ],
  },
  {
    name: 'fuels-ts',
    dependencies: [
      {
        name: 'fuel-core',
      },
      {
        name: 'sway',
      },
    ],
  },
  {
    name: 'fuels-wallet',
    dependencies: [
      {
        name: 'fuel-core',
      },
      {
        name: 'sway',
      },
      {
        name: 'fuels-ts',
      },
    ],
  },
  {
    name: 'fuel-block-committer',
    dependencies: [
      {
        name: 'fuel-core',
      },
      {
        name: 'sway',
      },
    ],
  },
  {
    name: 'fuel-bridge',
    dependencies: [
      {
        name: 'fuel-core',
      },
      {
        name: 'fuels-ts',
      },
      {
        name: 'fuel-block-committer',
      },
    ],
  },
  {
    name: 'fuels-portal',
    dependencies: [
      {
        name: 'fuel-core',
      },
      {
        name: 'fuels-ts',
      },
      {
        name: 'fuel-bridge',
      },
      {
        name: 'fuels-wallet',
      },
      {
        name: 'fuel-block-committer',
      },
    ],
  },
];

export const useCurrentVersion = () => {
  const [repos, setRepos] = useState<any>([]);
  useEffect(() => {
    const getRepos = async () => {
      const analyzedRepos = await getReposAndDependencies(REPOS);

      setRepos(analyzedRepos);
    };

    getRepos();
  }, []);

  return { repos };
};
