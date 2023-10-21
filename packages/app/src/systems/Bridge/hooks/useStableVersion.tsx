/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from 'react';

async function fetchJsonUrl({ url }: { url: string }) {
  try {
    const response = await fetch(url);
    const packageJson = await response.json();
    return packageJson;
  } catch (error) {
    console.error(`Error fetching package version: ${error}`);
    return '';
  }
}

const REPOS = [
  {
    name: 'fuel-core',
    version: '0.20.7',
    isCorrect: true,
  },
  {
    name: 'sway',
    version: '0.46.0',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.20.7',
      },
    ],
  },
  {
    name: 'fuels-ts',
    version: '0.63.0',
    dependencies: [
      {
        name: 'fuel-core',
        version: '0.20.7',
      },
      {
        name: 'sway',
        version: '0.46.0',
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
    name: 'fuel-bridge',
    dependencies: [
      {
        name: 'fuel-core',
      },
      {
        name: 'fuels-ts',
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
    ],
  },
];

export const useStableVersion = () => {
  const [repos, setRepos] = useState<any>([]);
  useEffect(() => {
    const getRepos = async () => {
      const repos = await Promise.all(
        REPOS.map(async (repo) => {
          if (repo.version) return repo;

          if (repo.name === 'fuels-ts') {
            const packageJson = await fetchJsonUrl({
              url: `https://raw.githubusercontent.com/FuelLabs/fuels-ts/master/packages/fuels/package.json`,
            });

            const dependencies = await Promise.all(
              (repo.dependencies || []).map(async (dependency: any) => {
                if (dependency.version) return dependency;

                if (dependency.name === 'fuel-core') {
                  const response = await fetch(
                    `https://raw.githubusercontent.com/FuelLabs/fuels-ts/master/packages/fuel-core/VERSION`
                  );
                  const version = (await response.text()).trim();
                  return { ...dependency, version };
                }

                if (dependency.name === 'sway') {
                  const response = await fetch(
                    `https://raw.githubusercontent.com/FuelLabs/fuels-ts/master/packages/forc/VERSION`
                  );
                  const version = (await response.text()).trim();
                  return { ...dependency, version };
                }

                return dependency;
              })
            );

            return {
              ...repo,
              dependencies,
              version: packageJson.version,
            };
          }

          if (repo.name === 'fuels-wallet') {
            const packageJson = await fetchJsonUrl({
              url: `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/master/packages/app/package.json`,
            });

            const dependencies = await Promise.all(
              (repo.dependencies || []).map(async (dependency: any) => {
                if (dependency.version) return dependency;
                // 'fuel-core' 'sway' 'fuels-ts'
                if (dependency.name === 'fuel-core') {
                  const response = await fetch(
                    `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/master/docker/fuel-core/Dockerfile`
                  );
                  const dockerfile = (await response.text()).trim();
                  const regex = /FROM ghcr\.io\/fuellabs\/fuel-core:v([\d\.]+)/;
                  const match = dockerfile.match(regex);

                  if (match && match[1]) {
                    const version = match[1];
                    return { ...dependency, version };
                  }
                }

                if (dependency.name === 'sway') {
                  const response = await fetch(
                    `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/master/fuel-toolchain.toml`
                  );
                  const toolchain = (await response.text()).trim();
                  const regex = /forc\s*=\s*"([\d\.]+)"/;
                  const match = toolchain.match(regex);

                  if (match && match[1]) {
                    const version = match[1];
                    return { ...dependency, version };
                  }
                }

                if (dependency.name === 'fuels-ts') {
                  const packageJson = await fetchJsonUrl({
                    url: `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/master/packages/app/package.json`,
                  });
                  const version = packageJson.dependencies.fuels;
                  return { ...dependency, version };
                }

                return dependency;
              })
            );

            return {
              ...repo,
              dependencies,
              version: packageJson.version,
            };
          }

          if (repo.name === 'fuels-portal') {
            const packageJson = await fetchJsonUrl({
              url: `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/packages/app/package.json`,
            });

            const dependencies = await Promise.all(
              (repo.dependencies || []).map(async (dependency: any) => {
                if (dependency.version) return dependency;
                // 'fuel-core' 'sway' 'fuels-ts'
                if (dependency.name === 'fuel-core') {
                  const response = await fetch(
                    `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/docker/fuel-core/Dockerfile`
                  );
                  const dockerfile = (await response.text()).trim();
                  const regex = /FROM ghcr\.io\/fuellabs\/fuel-core:v([\d\.]+)/;
                  const match = dockerfile.match(regex);

                  if (match && match[1]) {
                    const version = match[1];
                    return { ...dependency, version };
                  }
                }

                if (dependency.name === 'fuels-ts') {
                  const packageJson = await fetchJsonUrl({
                    url: `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/packages/app/package.json`,
                  });
                  const version = packageJson.dependencies.fuels;
                  return { ...dependency, version };
                }

                if (dependency.name === 'fuels-wallet') {
                  const packageJson = await fetchJsonUrl({
                    url: `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/packages/app/package.json`,
                  });
                  const version = packageJson.dependencies['@fuel-wallet/sdk'];
                  return { ...dependency, version };
                }

                if (dependency.name === 'fuel-bridge') {
                  const packageJson = await fetchJsonUrl({
                    url: `https://raw.githubusercontent.com/FuelLabs/fuels-portal/master/packages/app/package.json`,
                  });
                  const version =
                    packageJson.dependencies['@fuel-bridge/message-predicates'];
                  return { ...dependency, version };
                }

                return dependency;
              })
            );

            return {
              ...repo,
              dependencies,
              version: packageJson.version,
            };
          }

          if (repo.name === 'fuel-bridge') {
            const packageJson = await fetchJsonUrl({
              url: `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/master/packages/message-predicates/package.json`,
            });

            const dependencies = await Promise.all(
              (repo.dependencies || []).map(async (dependency: any) => {
                if (dependency.version) return dependency;
                // 'fuel-core' 'sway' 'fuels-ts'
                if (dependency.name === 'fuel-core') {
                  const response = await fetch(
                    `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/master/docker/fuel-core/Dockerfile`
                  );
                  const dockerfile = (await response.text()).trim();
                  const regex = /FROM ghcr\.io\/fuellabs\/fuel-core:v([\d\.]+)/;
                  const match = dockerfile.match(regex);

                  if (match && match[1]) {
                    const version = match[1];
                    return { ...dependency, version };
                  }
                }

                if (dependency.name === 'fuels-ts') {
                  const packageJson = await fetchJsonUrl({
                    url: `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/master/packages/integration-tests/package.json`,
                  });
                  const version = packageJson.devDependencies.fuels;
                  return { ...dependency, version };
                }

                return dependency;
              })
            );

            return {
              ...repo,
              dependencies,
              version: packageJson.version,
            };
          }

          return repo;
        })
      );

      const analyzedRepos = repos.reduce<(typeof repos)[0][]>(
        (prev: any, repo) => {
          if (repo.isCorrect) return [...prev, repo];

          const dependencies = repo.dependencies?.map((dependency) => {
            if (dependency.isCorrect) return dependency;

            const rootRepo: any = prev.find(
              (prevRepo: any) => prevRepo.name === dependency.name
            );

            return {
              ...dependency,
              isCorrect:
                dependency.version === rootRepo?.version && rootRepo.isCorrect,
            };
          });

          const isRepoCorrect = dependencies?.every(
            (dependency) => dependency.isCorrect
          );

          return [
            ...prev,
            {
              ...repo,
              isCorrect: isRepoCorrect,
              dependencies,
            },
          ];
        },
        []
      );

      setRepos(analyzedRepos);
    };

    getRepos();
  }, []);

  return { repos };
};
