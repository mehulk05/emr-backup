import { getIconHtmlList } from './utils';

export default function (editor: any, opt: any = {}) {
  const c = opt;
  const commands = editor.Commands;
  const icons = c.icons;

  editor.Commands.add('set-device-desktop', {
    run: (editor: any) => editor.setDevice('Desktop')
  });
  editor.Commands.add('set-device-tablet', {
    run: (editor: any) => editor.setDevice('Tablet')
  });
  editor.Commands.add('set-device-mobile', {
    run: (editor: any) => editor.setDevice('Mobile')
  });

  editor.Commands.add('clear-canvas', {
    run: (editor: any) => {
      editor.DomComponents.getWrapper().setStyle('');
      editor.setStyle('');
      editor.CssComposer.getAll().reset();
      editor.DomComponents.clear();
    }
  });

  commands.add('choose-icon', {
    run(editor: any, sender: any, opts: any = {}) {
      editor.Modal.open({
        title: 'Choose Icon',
        content: getIconHtmlList(icons)
      }).onceClose(() => this.stopCommand());
      const iconList = document.querySelectorAll('.gjs-popup-icon');
      iconList.forEach((icon) => {
        function onIconClick(e: any) {
          e.preventDefault;
          e.stopPropagation();
          const iconName = e.currentTarget.getAttribute('id');
          editor.Modal.close();
          opts.target.set('icon', {
            name: iconName,
            options: opts.options || {}
          });
          document
            .querySelectorAll('.gjsp-popup-icon')
            .forEach((i) => i.removeEventListener('click', onIconClick));
        }
        icon.addEventListener('click', onIconClick);
      });
    },
    stop(editor: any) {
      editor.Modal.close();
    }
  });
}
