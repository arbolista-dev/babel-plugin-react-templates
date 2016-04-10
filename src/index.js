import { parse } from 'babylon';
import reactTemplates from 'react-templates/src/reactTemplates';
import url  from 'url';
import fs from 'fs';
import path from 'path';

const DEFAULT_RT_OPTIONS = {
  targetVersion: '0.14.0',
  modules: 'es6'
};

/*
 * Take template relative path, read the file, and write the compiled JS template
 */

function fnCompiledTemplate(node_path, plugin, opts){
  var base_path = path.dirname(plugin.file.opts.filename),
    absolute_path = path.resolve(base_path, opts.relative_path),
    rt_options = Object.assign(DEFAULT_RT_OPTIONS, plugin.opts),
    source = fs.readFileSync(absolute_path, {encoding: 'utf8'}),
    compiled_template = reactTemplates.convertTemplateToReact(source, rt_options),
    compiled_filename = '_' + path.basename(opts.relative_path).replace(opts.reg_ext, '.rt.js'),
    compiled_path = path.resolve(base_path, compiled_filename);
  fs.writeFileSync(compiled_path, compiled_template, 'utf8');
  return compiled_path
}

module.exports = function ({types: t}) {
	return {
		visitor: {

      /*
       * Catch Template import declarations
       */

			ImportDeclaration: {
        enter(node_path, plugin) {
          let relative_path = node_path.node.source.value,
            ext = plugin.opts.ext || '.rt.html',
            reg_ext = new RegExp(ext + '$');
          if (reg_ext.test(relative_path)){
            let compiled_path = fnCompiledTemplate(node_path, plugin, {
              relative_path: relative_path,
              ext: ext,
              reg_ext: reg_ext
            });
            node_path.node.source.value = compiled_path;
          }
        }
    	},

      /*
       * Catch Template require calls
       */

      CallExpression: {
        enter(node_path, plugin){
          if (node_path.node.callee.name === 'require'){
            let args = node_path.node.arguments
            if (args.length && t.isStringLiteral(args[0])){
              var ext = plugin.opts.ext || '.rt.html',
                reg_ext = new RegExp(ext + '$'),
                relative_path = args[0].value;
              if (reg_ext.test(relative_path)){
                let compiled_path = fnCompiledTemplate(node_path, plugin, {
                  ext: ext,
                  reg_ext: reg_ext,
                  relative_path: relative_path
                });
                // React Templates exports templates in ES6 as export default
                node_path.replaceWithSourceString(`require('${compiled_path}').default`)
              }
            }
          }
        }
      }
    }
  };
};
