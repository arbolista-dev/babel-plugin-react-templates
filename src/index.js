import { parse } from 'babylon';
import reactTemplates from 'react-templates/src/reactTemplates';
import url  from 'url';
import fs from 'fs';
import path from 'path';

const DEFAULT_RT_OPTIONS = {
  targetVersion: '0.14.0',
  modules: 'es6'
};

function fnCompiledTemplate(relative_path, node_path, plugin){
  console.log('~~~~')
  console.log(JSON.stringify(plugin.opts))
  console.log(JSON.stringify(plugin.file))
  var ext = plugin.opts.ext || ".rt.html$",
    reg_ext = new RegExp(ext),
    base_path = path.dirname(plugin.file.opts.filename),
    absolute_path = path.resolve(base_path, relative_path),
    assignment = node_path.node.specifiers[0].local.name,
    rt_options = Object.assign(DEFAULT_RT_OPTIONS, plugin.opts, {name: assignment}),
    source = fs.readFileSync(absolute_path, {encoding: 'utf8'}),
    compiled_template = reactTemplates.convertTemplateToReact(source, rt_options);

  var compiled_filename = '_' + path.basename(relative_path).replace(reg_ext, '.rt.js'),
    compiled_path = path.resolve(base_path, compiled_filename);
  fs.writeFileSync(compiled_path, compiled_template, 'utf8');
  node_path.node.source.value = compiled_path;
}

module.exports = function ({types: t}) {
	return {
		visitor: {
			ImportDeclaration: {
        enter(node_path, plugin) {
          var relative_path = node_path.node.source.value,
            ext = plugin.opts.ext || ".rt.html$",
            reg_ext = new RegExp(ext);
          if (reg_ext.test(relative_path)){
            console.log('compiling import')
            fnCompiledTemplate(relative_path, node_path, plugin);
          }
        }
    	},
      CallExpression: {
        enter(node_path, plugin){
          var args = node_path.node.arguments;
          if (node_path.node.callee.name === 'require' && args.length && t.isStringLiteral(args[0])){
            var ext = plugin.opts.ext || ".rt.html$",
              reg_ext = new RegExp(ext),
              relative_path = args[0].value;
            if (reg_ext.test(relative_path)){
              console.log('compiling require')
              console.log(JSON.stringify(plugin.file.opts.filename))
              fnCompiledTemplate(relative_path, node_path, plugin);
            }
          }
        }
      }
    }
  };
};
