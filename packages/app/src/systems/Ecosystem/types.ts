export type Project = {
  name: string;
  description: string;
  tags: string[];
  url: string;
  status: ProjectStatus;
};

export type ProjectStatus = 'live' | 'testnet' | 'in-development';

export const STATUS_TEXT: Record<ProjectStatus, string> = {
  live: 'Live on Mainnet',
  testnet: 'Live on Testnet',
  'in-development': 'In development',
};
