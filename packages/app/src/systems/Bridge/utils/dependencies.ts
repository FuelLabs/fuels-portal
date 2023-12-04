/* eslint-disable no-useless-escape */
/* eslint-disable @typescript-eslint/no-explicit-any */
export async function fetchJsonUrl({ url }: { url: string }) {
  try {
    const response = await fetch(url);
    const packageJson = await response.json();
    return packageJson;
  } catch (error) {
    console.error(`Error fetching package version: ${error}`);
    return '';
  }
}

export function getVersionTag(version?: string) {
  return version ? `v${version}` : 'master';
}

export async function getFuelsTsDependencies(repo: any) {
  const tag = getVersionTag(repo?.version);
  const packageJson = await fetchJsonUrl({
    url: `https://raw.githubusercontent.com/FuelLabs/fuels-ts/${tag}/packages/fuels/package.json`,
  });

  const dependencies = await Promise.all(
    (repo?.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;

      if (dependency.name === 'fuel-core') {
        const response = await fetch(
          `https://raw.githubusercontent.com/FuelLabs/fuels-ts/${tag}/packages/fuel-core/VERSION`
        );
        const version = (await response.text()).trim();
        return { ...dependency, version };
      }

      if (dependency.name === 'sway') {
        const response = await fetch(
          `https://raw.githubusercontent.com/FuelLabs/fuels-ts/${tag}/packages/forc/VERSION`
        );
        const version = (await response.text()).trim();
        return { ...dependency, version };
      }

      return dependency;
    })
  );

  return { packageJson, dependencies };
}

export async function getFuelsWalletDependencies(repo: any) {
  const tag = getVersionTag(repo?.version);

  const packageJson = await fetchJsonUrl({
    url: `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/${tag}/packages/app/package.json`,
  });

  const dependencies = await Promise.all(
    (repo.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;
      if (dependency.name === 'fuel-core') {
        const response = await fetch(
          `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/${tag}/docker/fuel-core/Dockerfile`
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
          `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/${tag}/fuel-toolchain.toml`
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
          url: `https://raw.githubusercontent.com/FuelLabs/fuels-wallet/${tag}/packages/app/package.json`,
        });
        const version = packageJson.dependencies?.fuels;
        return { ...dependency, version };
      }

      return dependency;
    })
  );

  return { packageJson, dependencies };
}

export async function getFuelsPortalDependencies(repo: any) {
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

  return { packageJson, dependencies };
}

export async function getFuelBridgeDependencies(repo: any) {
  const tag = getVersionTag(repo?.version);

  const packageJson = await fetchJsonUrl({
    url: `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/${tag}/packages/message-predicates/package.json`,
  });

  const dependencies = await Promise.all(
    (repo.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;
      // 'fuel-core' 'sway' 'fuels-ts'
      if (dependency.name === 'fuel-core') {
        const response = await fetch(
          `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/${tag}/docker/fuel-core/Dockerfile`
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
          url: `https://raw.githubusercontent.com/FuelLabs/fuel-bridge/${tag}/packages/integration-tests/package.json`,
        });
        const version = packageJson.devDependencies.fuels;
        return { ...dependency, version };
      }

      return dependency;
    })
  );

  return { packageJson, dependencies };
}

export async function getSwayDependencies(repo: any) {
  const tag = getVersionTag(repo?.version);

  const response = await fetch(
    `https://raw.githubusercontent.com/FuelLabs/sway/${tag}/forc/Cargo.toml`
  );
  const toolchain = (await response.text()).trim();
  const regex = /version\s*=\s*"([^"]+)"/;
  const match = toolchain.match(regex);

  let repoVersion: string = '';
  if (match && match[1]) {
    const version = match[1];
    repoVersion = getVersionTag(version);
  }
  const dependencies = await Promise.all(
    (repo.dependencies || []).map(async (dependency: any) => {
      if (dependency.version) return dependency;
      // 'fuel-core' 'sway' 'fuels-ts'
      if (dependency.name === 'fuel-core') {
        const response = await fetch(
          `https://raw.githubusercontent.com/FuelLabs/sway/${repoVersion}/test/src/sdk-harness/Cargo.toml`
        );
        const tomlFile = (await response.text()).trim();
        const regex = /fuel-core\s*=\s*\{[^}]*version\s*=\s*"([^"]+)"/;
        const match = tomlFile.match(regex);

        if (match && match[1]) {
          const version = match[1];

          return { ...dependency, version };
        }
      }
    })
  );

  return { version: repoVersion, dependencies };
}

export async function getReposAndDependencies(rawRepos: any) {
  const repos = await Promise.all(
    rawRepos.map(async (repo: any) => {
      if (repo.name === 'sway') {
        const { version, dependencies } = await getSwayDependencies(repo);

        return {
          ...repo,
          dependencies,
          version,
        };
      }

      if (repo.name === 'fuels-ts') {
        const { packageJson, dependencies } = await getFuelsTsDependencies(
          repo
        );

        return {
          ...repo,
          dependencies,
          version: packageJson.version,
        };
      }

      if (repo.name === 'fuels-wallet') {
        const { packageJson, dependencies } = await getFuelsWalletDependencies(
          repo
        );

        return {
          ...repo,
          dependencies,
          version: repo.version || packageJson.version,
        };
      }

      if (repo.name === 'fuels-portal') {
        const { packageJson, dependencies } = await getFuelsPortalDependencies(
          repo
        );

        return {
          ...repo,
          dependencies,
          version: packageJson.version,
        };
      }

      if (repo.name === 'fuel-bridge') {
        const { packageJson, dependencies } = await getFuelBridgeDependencies(
          repo
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

  const analyzedRepos = repos.reduce<(typeof repos)[0][]>((prev: any, repo) => {
    if (repo.isCorrect) return [...prev, repo];

    const dependencies = repo.dependencies?.map((_dependency: any) => {
      const dependency = _dependency || {};
      if (dependency.isCorrect) return dependency;

      const rootRepo: any = prev.find(
        (prevRepo: any) => prevRepo.name === dependency.name
      );

      return {
        ...dependency,
        isCorrect:
          dependency.version === rootRepo?.version && rootRepo?.isCorrect,
      };
    });

    const isRepoCorrect = dependencies?.every(
      (dependency: any) => dependency.isCorrect
    );

    return [
      ...prev,
      {
        ...repo,
        isCorrect: isRepoCorrect,
        dependencies,
      },
    ];
  }, []);

  return analyzedRepos;
}
