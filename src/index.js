import { parse } from 'babylon';
import reactTemplates from 'react-templates/src/reactTemplates';
import url  from 'url';
import fs from 'fs';
import path from 'path';

const DEFAULT_RT_OPTIONS = {
  targetVersion: '0.14.0',
  modules: 'none'
};

module.exports = function ({types: t}) {
	return {
		visitor: {
			ImportDeclaration: {
        enter(node_path, plugin) {
          var relative_path = node_path.node.source.value,
            ext = plugin.opts.ext || ".template.html$";
          if (new RegExp(ext).test(relative_path)){
            var base_path = path.dirname(plugin.file.opts.filename),
              absolute_path = path.resolve(base_path, relative_path),
              assignment = node_path.node.specifiers[0].local.name,
              rt_options = Object.assign(DEFAULT_RT_OPTIONS, plugin.opts, {name: assignment}),
              source = fs.readFileSync(absolute_path, {encoding: 'utf8'});
            var compiled_template = reactTemplates.convertTemplateToReact(source, rt_options);
              //declaration = `let ${assignment} = ` + requireFromString(compiled_template, absolute_path);
            node_path.replaceWith(parse(compiled_template));
          }
        }
    	}
    }
  };
};
