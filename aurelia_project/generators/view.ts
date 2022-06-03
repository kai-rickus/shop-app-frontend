import { inject } from 'aurelia-dependency-injection';
import { Project, ProjectItem, CLIOptions, UI } from 'aurelia-cli';
import * as path from 'path';

@inject(Project, CLIOptions, UI)
export default class ElementGenerator {
  constructor(private project: Project, private options: CLIOptions, private ui: UI) { }

  async execute() {
    const name = await this.ui.ensureAnswer(
      this.options.args[0],
      'What would you like to call the view?'
    );

    const subFolders = await this.ui.ensureAnswer(
      this.options.args[1],
      'What sub-folder would you like to add it to?\nIf it doesn\'t exist it will be created for you.\n\nDefault folder is "." relative to the source folder src/views/', "."
    );

    let fileName = this.project.makeFileName(name);
    let className = this.project.makeClassName(name);

    this.project.root.add(
      ProjectItem.text(path.join("views/", subFolders, `${fileName}/`, fileName + '.ts'), this.generateJSSource(className)),
      ProjectItem.text(path.join("views/", subFolders, `${fileName}/`, fileName + '.html'), this.generateHTMLSource(fileName)),
      ProjectItem.text(path.join("views/", subFolders, `${fileName}/`, fileName + '.scss'), this.generateCSSSource(fileName))
    );

    await this.project.commitChanges();
    await this.ui.log(`Created ${name} in the '${path.join(this.project.root.name, "views/",subFolders)}' folder`);
  }

  generateJSSource(className) {
    return `export class ${className} {

}
`
  }

  generateHTMLSource(cssClassName) {
    return `<template>
<div class="${cssClassName}">

</div>

</template>
`
  }
  generateCSSSource(cssClassName) {
    return `
    .${cssClassName}{
    
    }
`
  }
}

