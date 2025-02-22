import { each, isString, isFunction, isUndefined } from 'underscore';
import BrowserParserHtml from './BrowserParserHtml';

export default (config: any) => {
  const c = config;
  const modelAttrStart = 'data-gjs-';
  const event = 'parse:html';

  return {
    compTypes: '',

    modelAttrStart,

    /**
     * Extract component props from an attribute object
     * @param {Object} attr
     * @returns {Object} An object containing props and attributes without them
     */
    splitPropsFromAttr(attr = {}) {
      const props: any = {};
      const attrs: any = {};

      each(attr, (value: any, key) => {
        if (key.indexOf(this.modelAttrStart) === 0) {
          const modelAttr = key.replace(modelAttrStart, '');
          const valueLen = value.length;
          const valStr = value && isString(value);
          const firstChar = valStr && value.substr(0, 1);
          const lastChar = valStr && value.substr(valueLen - 1);
          value = value === 'true' ? true : value;
          value = value === 'false' ? false : value;

          // Try to parse JSON where it's possible
          // I can get false positive here (eg. a selector '[data-attr]')
          // so put it under try/catch and let fail silently
          try {
            value =
              (firstChar == '{' && lastChar == '}') ||
              (firstChar == '[' && lastChar == ']')
                ? JSON.parse(value)
                : value;
          } catch (e) {}

          props[modelAttr] = value;
        } else {
          attrs[key] = value;
        }
      });

      return {
        props,
        attrs
      };
    },

    /**
     * Parse style string to object
     * @param {string} str
     * @return {Object}
     * @example
     * var stl = ParserHtml.parseStyle('color:black; width:100px; test:value;');
     * console.log(stl);
     * // {color: 'black', width: '100px', test: 'value'}
     */
    parseStyle(str: any) {
      var result: any = {};
      var decls = str.split(';');
      for (var i = 0, len = decls.length; i < len; i++) {
        var decl = decls[i].trim();
        if (!decl) continue;
        var prop = decl.split(':');
        result[prop[0].trim()] = prop.slice(1).join(':').trim();
      }
      return result;
    },

    /**
     * Parse class string to array
     * @param {string} str
     * @return {Array<string>}
     * @example
     * var res = ParserHtml.parseClass('test1 test2 test3');
     * console.log(res);
     * // ['test1', 'test2', 'test3']
     */
    parseClass(str: any) {
      const result = [];
      const cls = str.split(' ');
      for (let i = 0, len = cls.length; i < len; i++) {
        const cl = cls[i].trim();
        if (!cl) continue;
        result.push(cl);
      }
      return result;
    },

    /**
     * Get data from the node element
     * @param  {HTMLElement} el DOM element to traverse
     * @return {Array<Object>}
     */
    parseNode(el: any, opts: any = {}) {
      const result = [];
      const nodes = el.childNodes;

      for (var i = 0, len = nodes.length; i < len; i++) {
        const node = nodes[i];
        const attrs = node.attributes || [];
        const attrsLen = attrs.length;
        const nodePrev = result[result.length - 1];
        const nodeChild = node.childNodes.length;
        const ct = this.compTypes;
        let model: any = {};

        // Start with understanding what kind of component it is
        if (ct) {
          let obj = {};
          const type =
            node.getAttribute && node.getAttribute(`${modelAttrStart}type`);

          // If the type is already defined, use it
          if (type) {
            model = { type };
          } else {
            // Iterate over all available Component Types and
            // the first with a valid result will be that component
            for (let it = 0; it < ct.length; it++) {
              const compType: any = ct[it];
              obj = compType.model.isComponent(node, opts);

              if (obj) {
                if (typeof obj !== 'object') {
                  obj = { type: compType.id };
                }
                break;
              }
            }

            model = obj;
          }
        }

        // Set tag name if not yet done
        if (!model.tagName) {
          const tag = node.tagName || '';
          const ns = node.namespaceURI || '';
          model.tagName =
            tag && ns === 'http://www.w3.org/1999/xhtml'
              ? tag.toLowerCase()
              : tag;
        }

        if (attrsLen) {
          model.attributes = {};
        }

        // Parse attributes
        for (let j = 0; j < attrsLen; j++) {
          const nodeName = attrs[j].nodeName;
          let nodeValue = attrs[j].nodeValue;

          // Isolate attributes
          if (nodeName == 'style') {
            model.style = this.parseStyle(nodeValue);
          } else if (nodeName == 'class') {
            model.classes = this.parseClass(nodeValue);
          } else if (nodeName == 'contenteditable') {
            continue;
          } else if (nodeName.indexOf(modelAttrStart) === 0) {
            const modelAttr = nodeName.replace(modelAttrStart, '');
            const valueLen = nodeValue.length;
            const firstChar = nodeValue && nodeValue.substr(0, 1);
            const lastChar = nodeValue && nodeValue.substr(valueLen - 1);
            nodeValue = nodeValue === 'true' ? true : nodeValue;
            nodeValue = nodeValue === 'false' ? false : nodeValue;

            // Try to parse JSON where it's possible
            // I can get false positive here (eg. a selector '[data-attr]')
            // so put it under try/catch and let fail silently
            try {
              nodeValue =
                (firstChar == '{' && lastChar == '}') ||
                (firstChar == '[' && lastChar == ']')
                  ? JSON.parse(nodeValue)
                  : nodeValue;
            } catch (e) {}

            model[modelAttr] = nodeValue;
          } else {
            // Check for attributes from props (eg. required, disabled)
            if (nodeValue === '' && node[nodeName] === true) {
              nodeValue = true;
            }

            model.attributes[nodeName] = nodeValue;
          }
        }

        // Check for nested elements but avoid it if already provided
        if (nodeChild && !model.components) {
          // Avoid infinite nested text nodes
          const firstChild = node.childNodes[0];

          // If there is only one child and it's a TEXTNODE
          // just make it content of the current node
          if (nodeChild === 1 && firstChild.nodeType === 3) {
            !model.type && (model.type = 'text');
            model.components = {
              type: 'textnode',
              content: firstChild.nodeValue
            };
          } else {
            model.components = this.parseNode(node, {
              ...opts,
              inSvg: opts.inSvg || model.type === 'svg'
            });
          }
        }

        // Check if it's a text node and if could be moved to the prevous model
        if (model.type == 'textnode') {
          if (nodePrev && nodePrev.type == 'textnode') {
            nodePrev.content += model.content;
            continue;
          }

          // Throw away empty nodes (keep spaces)
          // if (!config.keepEmptyTextNodes) {
          // }
          const content = node.nodeValue;
          if (!/^\s+$/.test(content!) && !content!.trim()) {
            console.log('232');
            continue;
          }
        }

        // Check for custom void elements (valid in XML)
        if (!nodeChild && `${node.outerHTML}`.slice(-2) === '/>') {
          model.void = true;
        }

        // If all children are texts and there is some textnode the parent should
        // be text too otherwise I'm unable to edit texnodes
        const comps = model.components;
        if (!model.type && comps) {
          let allTxt = 1;
          let foundTextNode = 0;

          for (let ci = 0; ci < comps.length; ci++) {
            const comp = comps[ci];
            const cType = comp.type;

            if (
              ['text', 'textnode'].indexOf(cType) < 0 &&
              c.textTags.indexOf(comp.tagName) < 0
            ) {
              allTxt = 0;
              break;
            }

            if (cType == 'textnode') {
              foundTextNode = 1;
            }
          }

          if (allTxt && foundTextNode) {
            model.type = 'text';
          }
        }

        // If tagName is still empty and is not a textnode, do not push it
        if (!model.tagName && model.type != 'textnode') {
          continue;
        }

        result.push(model);
      }

      return result;
    },

    /**
     * Parse HTML string to a desired model object
     * @param  {string} str HTML string
     * @param  {ParserCss} parserCss In case there is style tags inside HTML
     * @return {Object}
     */
    parse(str: any, parserCss: any, opts = {}) {
      const { em } = c;
      const conf = (em && em.get('Config')) || {};
      const res: any = { html: null, css: null };
      const cf = { ...config, ...opts };
      const options = {
        ...config.optionsHtml,
        // Support previous `configParser.htmlType` option
        htmlType: config.optionsHtml?.htmlType || config.htmlType,
        ...opts
      };
      const el = isFunction(cf.parserHtml)
        ? cf.parserHtml(str, options)
        : BrowserParserHtml(str, options);
      const scripts = el.querySelectorAll('script');
      let i = scripts.length;

      // Support previous `configMain.allowScripts` option
      const allowScripts = !isUndefined(conf.allowScripts)
        ? conf.allowScripts
        : options.allowScripts;

      // Remove script tags
      if (!allowScripts) {
        while (i--) scripts[i].parentNode.removeChild(scripts[i]);
      }

      // Remove unsafe attributes
      if (!options.allowUnsafeAttr) {
        this.__clearUnsafeAttr(el);
      }

      // Detach style tags and parse them
      if (parserCss) {
        const styles = el.querySelectorAll('style');
        let j = styles.length;
        let styleStr = '';

        while (j--) {
          styleStr = styles[j].innerHTML + styleStr;
          styles[j].parentNode.removeChild(styles[j]);
        }

        if (styleStr) res.css = parserCss.parse(styleStr);
      }

      em && em.trigger(`${event}:root`, { input: str, root: el });
      const result = this.parseNode(el, cf);
      // I have to keep it otherwise it breaks the DomComponents.addComponent (returns always array)
      const resHtml =
        result.length === 1 && !c.returnArray ? result[0] : result;
      res.html = resHtml;
      em && em.trigger(event, { input: str, output: res });

      return res;
    },

    __clearUnsafeAttr(node: any) {
      const attrs = node.attributes || [];
      const nodes = node.childNodes || [];
      const toRemove: any[] = [];
      each(attrs, (attr) => {
        const name = attr.nodeName || '';
        name.indexOf('on') === 0 && toRemove.push(name);
      });
      toRemove.map((name) => node.removeAttribute(name));
      each(nodes, (node) => this.__clearUnsafeAttr(node));
    }
  };
};
