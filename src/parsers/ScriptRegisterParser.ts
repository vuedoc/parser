import { Options } from './ScriptParser.js';
import { CompositionParser } from './CompositionParser.js';
import { clear } from '@b613/utils/lib/object.js';
import { Syntax } from '../lib/Enum.js';
import { Parser } from '../../types/Parser.js';
import { File } from '../../types/FileSystem.js';

import * as Babel from '@babel/types';

export type RegisterFactory = (source?: Required<Parser.Script>, file?: Readonly<File>) => ScriptRegisterParser;

export class ScriptRegisterParser extends CompositionParser {
  exposedScope: Parser.Scope;

  constructor(root: Parser.Interface, source: Required<Parser.Script>, file: Readonly<File>, options: Options, createRegister: RegisterFactory) {
    super(root, { ...source }, file, options, (source = this.file.script, file = this.file) => createRegister(source, file));

    this.exposedScope = {};
    this.shouldEmitOnDeclarations = false;
    this.features = []; // prevent entries emission
  }

  setValue(key: string, ref: Parser.Value<any>, node: Babel.Node) {
    super.setValue(key, ref, node);

    this.exposedScope[key] = this.scope[key];
  }

  setScopeEntry(ref: Parser.ScopeEntry) {
    super.setScopeEntry(ref);

    this.exposedScope[ref.key] = ref;
  }

  reset(): void {
    super.reset();
    clear(this.exposedScope);
  }

  parseAstStatement(node: Babel.Node) {
    switch (node.type) {
      case Syntax.ExportDefaultDeclaration:
        this.parseExportDefaultDeclaration(node);
        break;

      case Syntax.ExportNamedDeclaration:
        this.parseExportNamedDeclaration(node);
        break;

      case Syntax.ExportAllDeclaration:
        this.parseExportAllDeclaration(node);
        break;

      case Syntax.FunctionDeclaration:
        for (const item of node.body.body) {
          this.parseAstStatement(item);
        }
        break;

      default:
        super.parseAstStatement(node);
        break;
    }
  }

  parseExportDefaultDeclaration(item: Babel.ExportDefaultDeclaration) {
    this.exposeDeclaration('default', item.declaration || item);
  }

  parseExportSpecifier(item: Babel.ExportSpecifier) {
    const name = 'name' in item.exported
      ? item.exported.name
      : this.getValue(item.exported).value as string;

    this.exposeDeclaration(name, item.local);
  }

  parseExportNamespaceSpecifier(_item: Babel.ExportNamespaceSpecifier) {
    // TODO Implement parseExportNamespaceSpecifier
  }

  parseExportDefaultSpecifier(item: Babel.ExportDefaultSpecifier) {
    this.exposeDeclaration('default', item.exported);
  }

  parseExportAllDeclaration(item: Babel.ExportAllDeclaration) {
    if (item.assertions) {
      for (const assertion of item.assertions) {
        const name = 'name' in assertion.key
          ? assertion.key.name
          : this.getValue(assertion.key).value as string;

        this.exposeDeclaration(name, assertion);
      }
    }
  }

  parseExportNamedDeclaration(item: Babel.ExportNamedDeclaration) {
    if (item.declaration) {
      switch (item.declaration.type) {
        case Syntax.VariableDeclaration:
          this.parseVariableDeclaration(item.declaration);

          for (const declaration of item.declaration.declarations) {
            const name = this.parseKey(declaration as any);

            this.exposeDeclaration(name, declaration);
          }
          break;

        default: {
          const name = this.parseKey(item.declaration as any);

          if (name) {
            this.exposeDeclaration(name, item.declaration);
          }
          break;
        }
      }
    } else {
      for (const specifier of item.specifiers) {
        switch (specifier.type) {
          case Syntax.ExportSpecifier:
            this.parseExportSpecifier(specifier);
            break;

          case Syntax.ExportDefaultSpecifier:
            this.parseExportDefaultSpecifier(specifier);
            break;

          case Syntax.ExportNamespaceSpecifier:
            this.parseExportNamespaceSpecifier(specifier);
            break;
        }
      }
    }
  }

  emitEntryFeature({ name, ref, node, nodeType = node, nodeComment = node }: Parser.EmitEntryFeatureOptions) {
    this.exposedScope[name] = {
      key: name,
      value: ref,
      node: {
        value: node,
        type: nodeType,
        comment: nodeComment,
      },
    };
  }

  exposeDeclaration(name: string, declaration: Babel.Node) {
    const ref = this.getScopeValue(name);

    if (ref) {
      this.exposedScope[name] = ref;
    } else {
      let node = declaration;

      if (declaration.type === Syntax.Identifier) {
        const declref = this.getScopeValue(declaration.name);

        if (declref) {
          node = declref.node.value;
        }
      }

      if (node.type === Syntax.CallExpression) {
        const result = this.executeCallExpressionProperty(node, declaration);

        if (result) {
          return;
        }
      }

      this.exposedScope[name] = {
        key: name,
        value: this.getValue(node),
        node: {
          value: node,
          type: node,
          comment: node,
        },
      };
    }
  }

  parseData(property) {
    const name = this.parseKey(property);

    this.exposeDeclaration(name, property);
  }
}
