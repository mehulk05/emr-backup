import { getIconHtmlList } from './utils';

export default function (editor: any, opt: any = {}) {
  const c = opt;
  const icons = c.icons;

  // CODE TO OPEN ICON LIST MODAL JUST AFTER ICON COMPONENT ADDITION
  editor.on('component:add', (model: any) => {
    switch (model.get('type')) {
      case 'icons': {
        editor.Modal.open({
          title: 'Choose Icon',
          content: getIconHtmlList(icons)
        });
        const iconList = document.querySelectorAll('.gjs-popup-icon');
        iconList.forEach((icon) => {
          function onIconClick(e: any) {
            e.preventDefault;
            e.stopPropagation();
            const iconName = e.currentTarget.getAttribute('id');
            const selectedComponent = editor.getSelected();
            editor.Modal.close();
            selectedComponent.set('iconName', iconName);
            document
              .querySelectorAll('.gjsp-popup-icon')
              .forEach((i) => i.removeEventListener('click', onIconClick));
          }
          icon.addEventListener('click', onIconClick);
        });
        break;
      }
      case 'image': {
        model.setStyle({
          width: '100%',
          height: '100%'
        });
      }
    }
  });
}
