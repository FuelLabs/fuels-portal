const { Client } = require('@notionhq/client');
const fs = require('fs');

require('../../../../load.envs.js');

const {
  ECOSYSTEM_PROJECTS_NOTION_TOKEN,
  ECOSYSTEM_PROJECTS_NOTION_DATABASE_ID,
} = process.env;

const ECOSYSTEM_PROJECTS_FILE_PATH = __dirname + '/../data/projects.json';

const fetchEcosystemProjects = async () => {
  const notion = new Client({
    auth: ECOSYSTEM_PROJECTS_NOTION_TOKEN,
  });

  const database = await notion.databases.query({
    database_id: ECOSYSTEM_PROJECTS_NOTION_DATABASE_ID,
  });

  const data = database.results.map((response) => {
    if ('properties' in response) {
      const { Name, Description, URL, Tags, Status } = response.properties;
      return {
        name: Name?.title[0]?.plain_text,
        description: Description?.rich_text[0]?.plain_text,
        url: URL?.url,
        tags: Tags?.multi_select?.map((tag) => tag?.name),
        status: Status?.status?.name,
      };
    }
    return {};
  });

  return data;
};

const saveDataToJSON = (data) => {
  return fs.writeFile(
    ECOSYSTEM_PROJECTS_FILE_PATH,
    JSON.stringify(data),
    (err) => {
      if (err) {
        console.error(err);
        return;
      }
      console.log('Ecosystem Projects File saved');
    }
  );
};

const main = async () => {
  const data = await fetchEcosystemProjects();
  await saveDataToJSON(data);
};

main();
