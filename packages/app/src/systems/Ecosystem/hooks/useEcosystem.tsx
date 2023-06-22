import { useEffect } from 'react';

import type { EcosystemInputs, EcosystemMachineState } from '../machines';

import { Services, store } from '~/store';

const selectors = {
  context: (state: EcosystemMachineState) => state.context,
  filteredProjects: (state: EcosystemMachineState) =>
    state.context?.filteredProjects,
  tags: (state: EcosystemMachineState) => state.context?.tags,
  filter: (state: EcosystemMachineState) => state.context?.filter,
  search: (state: EcosystemMachineState) => state.context?.search,
  isLoading: (state: EcosystemMachineState) => state.hasTag('isLoading'),
};

export function useEcosystem() {
  const tags = store.useSelector(Services.ecosystem, selectors.tags);
  const filteredProjects = store.useSelector(
    Services.ecosystem,
    selectors.filteredProjects
  );
  const filter = store.useSelector(Services.ecosystem, selectors.filter);
  const search = store.useSelector(Services.ecosystem, selectors.search);
  const isLoading = store.useSelector(Services.ecosystem, selectors.isLoading);

  const context = store.useSelector(Services.ecosystem, selectors.context);

  useEffect(() => {
    store.send(Services.ecosystem, {
      type: 'FETCH_PROJECTS_AND_TAGS',
      input: null,
    });
  }, []);

  const filterProjects = (input: EcosystemInputs['filter']) => {
    store.send(Services.ecosystem, { type: 'FILTER', input });
  };

  const searchProjects = (input: EcosystemInputs['search']) => {
    store.send(Services.ecosystem, { type: 'SEARCH', input });
  };

  const clearFilters = () => {
    store.send(Services.ecosystem, { type: 'CLEAR_FILTER', input: null });
  };

  return {
    filteredProjects,
    tags,
    filter,
    search,
    isLoading,
    context,
    handlers: {
      filterProjects,
      searchProjects,
      clearFilters,
    },
  };
}
