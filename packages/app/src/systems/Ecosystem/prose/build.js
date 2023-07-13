const jdown = require('jdown');
const projectsFolder = __dirname + '/_projects';
const projectsDataFile = __dirname + '/generated/projects.json';

jdown(projectsFolder)
  .then((content) => {
    const projects = Object.keys(content)
      .map((key) => {
        const project = content[key];
        project.id = key;
        return project;
      })
      // Filter out the empty project
      .filter((project) => project.id !== '');
    return projects;
  })
  .then((projects) => {
    const fs = require('fs');
    fs.writeFileSync(projectsDataFile, JSON.stringify(projects, null, 2));
    console.log('Projects data built successfully!');
  });
