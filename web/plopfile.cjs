module.exports = function (plop) {
  plop.setGenerator('component-with-plot', {
    description: 'Generate a new component scaffold',
    prompts: [
      {
        type: 'input',
        name: 'name',
        message: 'Component name: (ex. test-component)',
      }
    ],
    actions: [
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/src/{{pascalCase name}}.jsx',
        templateFile: 'templates/Component.jsx.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/src/{{pascalCase name}}.styles.css',
        templateFile: 'templates/Component.styles.css.hbs',
      },
      {
        type: 'add',
        path: 'src/components/{{kebabCase name}}/index.js',
        templateFile: 'templates/Index.js.hbs',
      }
    ],
  });
};
