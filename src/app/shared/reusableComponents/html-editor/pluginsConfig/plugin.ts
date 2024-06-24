import loadBlockPlugin from '../allPlugins/blocks';
import loadBusinessPlugin from '../allPlugins/business';
import loadAdvancedPlugin from '../allPlugins/advanced';
import loadComponents from '../allPlugins/components';
import loadTraits from '../allPlugins/traits';
import loadCommands from '../allPlugins/commands';
import loadEvents from '../allPlugins/events';
import ICONS from '../pluginsConfig/iconSvg';
import ParserHtml from '../allPlugins/ParserHtml';

export const plugin = (editor: any, options: any = {}) => {
  console.log(options);

  const config = {
    blocks: [
      'column1',
      'heading',
      'text',
      'link',
      'divider',
      'spacer',
      'button',
      'image',
      'video',
      'map',
      'icons'
    ],
    flexGrid: true,
    stylePrefix: 'gjs-',
    addBasicStyle: true,
    category: 'Basic',
    labelColumn1: 'Inner Section',
    labelColumn2: '2 Columns',
    labelColumn3: '3 Columns',
    labelColumn37: '2 Columns 3/7',
    labelHeading: 'Heading',
    labelText: 'Text',
    labelLink: 'Link',
    labelDivider: 'Divider',
    labelSpacer: 'Spacer',
    labelButtonName: 'Button',
    labelImage: 'Image',
    labelVideo: 'Video',
    labelMap: 'Map',
    labelIcons: 'Icons'
  };

  const newParser = ParserHtml(editor.Parser.getConfig());
  editor.Parser.parserHtml.parseNode = newParser.parseNode.bind(
    editor.Parser.parserHtml
  );
  loadCommands(editor, { icons: ICONS });
  loadEvents(editor, { icons: ICONS });
  loadTraits(editor, { icons: ICONS });
  loadComponents(editor, { icons: ICONS, formData: options.formData });

  loadAdvancedPlugin(editor);
  loadBusinessPlugin(editor, options);
  loadBlockPlugin(editor, config);
};
