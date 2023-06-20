import type { InterpreterFrom, StateFrom } from 'xstate';
import { assign, createMachine } from 'xstate';

import type { Project } from '../components/ProjectItem';
import PROJECTS from '../data/projects.json';

import { FetchMachine } from '~/systems/Core';


export type EcosystemInputs = {
  filter: {
    tag?: string;
    projects?: Project[];
  };
  search: {
    query?: string;
    projects?: Project[];
  };
};

type MachineContext = {
  projects: Project[];
  filteredProjects: Project[];
  search: string;
  tags: string[];
  filter: string;
};

type MachineServices = {
  fetchProjectsAndTags: {
    data: {
      projects: Project[];
      tags: string[];
    };
  };
  searchProjects: {
    data: Project[];
  };
  filterProjects: {
    data: Project[];
  };
};

type EcosystemMachineEvents =
  | {
      type: 'FILTER';
      input: { tag?: string; projects?: Project[] };
    }
  | {
      type: 'SEARCH';
      input: { query?: string; projects?: Project[] };
    }
  | {
      type: 'FETCH_PROJECTS_AND_TAGS';
      input: null;
    }
  | {
      type: 'CLEAR_FILTER';
      input: null;
    }
  | {
      type: 'CLEAR_SEARCH';
      input: null;
    }
  | {
      type: 'CLEAR_SEARCH_AND_FILTER';
      input: null;
    };

const initialState: MachineContext = {
  projects: [],
  filteredProjects: [],
  search: '',
  tags: [],
  filter: '',
};
export const ecosystemMachine = createMachine(
  {
    // eslint-disable-next-line @typescript-eslint/consistent-type-imports
    tsTypes: {} as import('./ecosystemMachine.typegen').Typegen0,
    schema: {
      context: initialState as MachineContext,
      services: {} as MachineServices,
      events: {} as EcosystemMachineEvents,
    },
    predictableActionArguments: true,
    id: '(machine)',
    initial: 'idle',
    states: {
      idle: {
        on: {
          FETCH_PROJECTS_AND_TAGS: {
            target: 'fetching',
          },
          FILTER: {
            target: 'filtering',
            actions: ['assignFilter'],
          },
          SEARCH: {
            target: 'searching',
            actions: ['assignSearch'],
          },
          CLEAR_FILTER: {
            actions: ['clearFilter'],
          },
          CLEAR_SEARCH: {
            actions: ['clearSearch'],
          },
          CLEAR_SEARCH_AND_FILTER: {
            actions: ['clearSearchAndFilter'],
          },
        },
      },
      fetching: {
        invoke: {
          src: 'fetchProjectsAndTags',
          onDone: {
            target: 'idle',
            actions: ['assignProjectsAndTags', 'clearSearchAndFilter'],
          },
        },
      },
      filtering: {
        invoke: {
          src: 'filterProjects',
          data: {
            input: (_: MachineContext, ev: EcosystemMachineEvents) => ({
              ...ev.input,
              projects: _.projects,
            }),
          },
          onDone: {
            target: 'idle',
            actions: ['assignFilteredProjects'],
          },
        },
      },
      searching: {
        invoke: {
          src: 'searchProjects',
          data: {
            input: (_: MachineContext, ev: EcosystemMachineEvents) => ({
              ...ev.input,
              projects: _.projects,
            }),
          },
          onDone: {
            target: 'idle',
            actions: ['assignFilteredProjects'],
          },
        },
      },
    },
  },
  {
    services: {
      fetchProjectsAndTags: FetchMachine.create<
        null,
        { projects: Project[]; tags: string[] }
      >({
        showError: true,
        maxAttempts: 1,
        async fetch() {
          const projects = PROJECTS as Project[];
          const tags = new Set<string>('');
          projects.map((project) => project.tags.map((tag) => tags.add(tag)));
          return {
            projects,
            tags: Array.from(tags),
          };
        },
      }),
      filterProjects: FetchMachine.create<EcosystemInputs['filter'], Project[]>(
        {
          showError: true,
          maxAttempts: 1,
          async fetch({ input }) {
            if (!input?.projects) throw new Error('Invalid projects');
            if (!input?.tag) return input.projects;
            const { tag, projects } = input;
            const filteredProjects = projects.filter((project) => {
              return project.tags.includes(tag);
            });
            return filteredProjects ?? [];
          },
        }
      ),
      searchProjects: FetchMachine.create<EcosystemInputs['search'], Project[]>(
        {
          showError: true,
          maxAttempts: 1,
          async fetch({ input }) {
            if (!input?.projects) throw new Error('Invalid projects');
            if (!input?.query) return input.projects;
            const { query, projects } = input;
            const filteredProjects = projects.filter((project) => {
              return project.name.toLowerCase().includes(query.toLowerCase());
            });
            return filteredProjects ?? [];
          },
        }
      ),
    },
    actions: {
      assignFilter: assign((ctx, ev) => ({
        ...ctx,
        filter: ev.input.tag,
      })),
      assignSearch: assign((ctx, ev) => ({
        ...ctx,
        search: ev.input.query,
      })),
      assignFilteredProjects: assign((ctx, ev) => ({
        ...ctx,
        filteredProjects: ev.data,
      })),
      assignProjectsAndTags: assign((ctx, ev) => ({
        ...ctx,
        projects: ev.data.projects,
        tags: ev.data.tags,
        filteredProjects: ev.data.projects,
      })),
      clearFilter: assign((ctx) => ({
        ...ctx,
        filter: '',
        filteredProjects: ctx.projects,
      })),
      clearSearch: assign((ctx) => ({
        ...ctx,
        search: '',
        filteredProjects: ctx.projects,
      })),
      clearSearchAndFilter: assign((ctx) => ({
        ...ctx,
        search: '',
        filter: '',
        filteredProjects: ctx.projects,
      })),
    },
  }
);

export type EcosystemMachine = typeof ecosystemMachine;
export type EcosystemMachineService = InterpreterFrom<EcosystemMachine>;
export type EcosystemMachineState = StateFrom<EcosystemMachine>;
