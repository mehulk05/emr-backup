export default function (editor: any, opt: any = {}) {
  const c: any = opt;
  const bm: any = editor.BlockManager;
  const blocks: string[] = c.blocks;
  const stylePrefix: string = c.stylePrefix;
  const flexGrid: boolean = c.flexGrid;
  const basicStyle: boolean = c.addBasicStyle;
  const clsRow: string = `${stylePrefix}row`;
  const clsCell: string = `${stylePrefix}cell`;
  const styleRow: string = flexGrid
    ? `
    .${clsRow} {
      display: flex;
      justify-content: flex-start;
      align-items: stretch;
      flex-wrap: nowrap;
      padding: 10px;
    }
    @media (max-width: 768px) {
      .${clsRow} {
        flex-wrap: wrap;
      }
    }`
    : `
    .${clsRow} {
      display: table;
      padding: 10px;
      width: 100%;
    }
    @media (max-width: 768px) {
      .${stylePrefix}cell, .${stylePrefix}cell30, .${stylePrefix}cell70 {
        width: 100%;
        display: block;
      }
    }`;
  const styleClm: string = flexGrid
    ? `
    .${clsCell} {
      min-height: 75px;
      flex-grow: 1;
      flex-basis: 100%;
    }`
    : `
    .${clsCell} {
      width: 8%;
      display: table-cell;
      height: 75px;
    }`;
  const styleClm30: string = `
  .${stylePrefix}cell30 {
    width: 30%;
  }`;
  const styleClm70: string = `
  .${stylePrefix}cell70 {
    width: 70%;
  }`;

  const step: number = 0.2;
  const minDim: number = 1;
  const currentUnit: number = 1;
  const resizerBtm: any = {
    tl: 0,
    tc: 0,
    tr: 0,
    cl: 0,
    cr: 0,
    bl: 0,
    br: 0,
    minDim
  };
  const resizerRight: any = {
    ...resizerBtm,
    cr: 1,
    bc: 0,
    currentUnit,
    minDim,
    step
  };

  // Flex elements do not react on width style change therefore I use
  // 'flex-basis' as keyWidth for the resizer on columns
  if (flexGrid) {
    resizerRight.keyWidth = 'flex-basis';
  }

  const rowAttr: any = {
    class: clsRow,
    'data-gjs-droppable': `.${clsCell}`,
    'data-gjs-resizable': resizerBtm,
    'data-gjs-name': 'Row'
  };

  const colAttr: any = {
    class: clsCell,
    'data-gjs-draggable': `.${clsRow}`,
    'data-gjs-resizable': resizerRight,
    'data-gjs-name': 'Cell'
  };

  if (flexGrid) {
    colAttr['data-gjs-unstylable'] = ['width'];
    colAttr['data-gjs-stylable-require'] = ['flex-basis'];
  }

  // Make row and column classes private
  const privateCls: string[] = [`.${clsRow}`, `.${clsCell}`];
  editor.on(
    'selector:add',
    (selector: any) =>
      privateCls.indexOf(selector.getFullName()) >= 0 &&
      selector.set('private', 1)
  );

  const attrsToString = (attrs: any): string => {
    const result: string[] = [];

    for (const key in attrs) {
      let value: any = attrs[key];
      const toParse: boolean =
        value instanceof Array || value instanceof Object;
      value = toParse ? JSON.stringify(value) : value;
      result.push(`${key}=${toParse ? `'${value}'` : `"${value}"`}`);
    }

    return result.length ? ` ${result.join(' ')}` : '';
  };

  const toAdd = (name: string): boolean => blocks.indexOf(name) >= 0;
  const attrsRow: string = attrsToString(rowAttr);
  const attrsCell: string = attrsToString(colAttr);

  toAdd('column1') &&
    bm.add('column1', {
      label: c.labelColumn1,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-b1' },
      content: `<div ${attrsRow}>
        <div ${attrsCell}></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
        </style>`
          : ''
      }`
    });

  toAdd('column2') &&
    bm.add('column2', {
      label: c.labelColumn2,
      attributes: { class: 'gjs-fonts gjs-f-b2' },
      category: c.category,
      content: `<div ${attrsRow}>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
        </style>`
          : ''
      }`
    });

  toAdd('column3') &&
    bm.add('column3', {
      label: c.labelColumn3,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-b3' },
      content: `<div ${attrsRow}>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
        <div ${attrsCell}></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
        </style>`
          : ''
      }`
    });

  toAdd('column3-7') &&
    bm.add('column3-7', {
      label: c.labelColumn37,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-b37' },
      content: `<div ${attrsRow}>
        <div ${attrsCell} style="${
        flexGrid ? 'flex-basis' : 'width'
      }: 30%;"></div>
        <div ${attrsCell} style="${
        flexGrid ? 'flex-basis' : 'width'
      }: 70%;"></div>
      </div>
      ${
        basicStyle
          ? `<style>
          ${styleRow}
          ${styleClm}
          ${styleClm30}
          ${styleClm70}
        </style>`
          : ''
      }`
    });

  toAdd('heading') &&
    bm.add('heading', {
      label: c.labelHeading,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-text' },
      content: { type: 'heading', attributes: { class: 'gjs-heading' } }
    });

  toAdd('text') &&
    bm.add('text', {
      label: c.labelText,
      category: c.category,
      attributes: { class: 'fa fa-align-left' },
      content: {
        type: 'text',
        content: 'Insert your text here',
        style: { padding: '10px' },
        activeOnRender: 1
      }
    });

  toAdd('link') &&
    bm.add('link', {
      label: c.labelLink,
      category: c.category,
      attributes: { class: 'fa fa-link' },
      content: {
        type: 'link',
        content: 'Link',
        style: { color: '#d983a6' }
      }
    });

  toAdd('button') &&
    bm.add('button', {
      label: c.labelButtonName,
      category: c.category,
      content: `<a data-gjs-type="button" class="gjs-block-button"><div>Click here!</div></a>
      <style>
      .gjs-block-button {
        display: inline-block;
        background-color: #414141;
        color: #ffffff;
        font-family: Ubuntu, Helvetica, Arial, sans-serif;
        font-size: 13px;
        font-weight: 400;
        line-height: 120%;
        margin: 0;
        text-decoration: none;
        text-transform: none;
        padding: 10px 25px;
        border-radius: 3px;
        text-align: center;
        transition: all .3s;
        outline: none;
      }
      </style>`,
      attributes: { class: 'gjs-fonts gjs-f-button' }
    });

  toAdd('divider') &&
    bm.add('divider', {
      label: c.labelDivider,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-divider' },
      content: `<div data-gjs-type="divider" class="gjs-divider" ></div>
      <style>
        .gjs-divider {
          display: flex;
          justify-content: left;
          width: 100%;
          padding-block-start: 10px;
          padding-block-end: 10px;
        }
        .gjs-divider-separator {
          display: flex;
          width: 100%;
          border-block-start: 1px solid #000000;
        }
      </style>`
    });

  toAdd('spacer') &&
    bm.add('spacer', {
      label: c.labelSpacer,
      media: `<svg class="gjs-block-svg" height="40" viewBox="0 0 24 24">
        <path fill="currentColor" d="M8,18H11V15H2V13H22V15H13V18H16L12,22L8,18M12,2L8,6H11V9H2V11H22V9H13V6H16L12,2Z"></path>
      </svg>`,
      category: c.category,
      content: `<div data-gjs-type="spacer" class="gjs-spacer" style="width: 100%"></div>
      <style>
        .gjs-spacer {
          width: 100%;
          height: 50px;
        }
      </style>`
    });

  toAdd('image') &&
    bm.add('image', {
      label: c.labelImage,
      category: c.category,
      attributes: { class: 'gjs-fonts gjs-f-image' },
      content: {
        style: { color: 'black' },
        type: 'image',
        activeOnRender: 1
      }
    });

  toAdd('video') &&
    bm.add('video', {
      label: c.labelVideo,
      category: c.category,
      attributes: { class: 'fa fa-youtube-play' },
      content: {
        type: 'video',
        src: 'img/video2.webm',
        style: {
          height: '350px',
          width: '615px'
        }
      }
    });

  toAdd('map') &&
    bm.add('map', {
      label: c.labelMap,
      category: c.category,
      attributes: { class: 'fa fa-map-o' },
      content: {
        type: 'map',
        style: { height: '350px' }
      }
    });

  toAdd('icons') &&
    bm.add('icons', {
      label: c.labelIcons,
      media:
        '<svg class="gjs-block-svg" height="40" enable-background="new 0 0 512 512" height="512px" id="Layer_1" version="1.1" viewBox="0 0 512 512" width="512px" xml:space="preserve" xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink"><path d="M256,512C114.625,512,0,397.391,0,256C0,114.609,114.625,0,256,0c141.391,0,256,114.609,256,256  C512,397.391,397.391,512,256,512z M256,64C149.969,64,64,149.969,64,256s85.969,192,192,192c106.047,0,192-85.969,192-192  S362.047,64,256,64z M288,384h-64v-96h-96v-64h96v-96h64v96h96v64h-96V384z"/></svg>',
      category: c.category,
      content: { type: 'icons', attributes: { class: 'gjs-icons' } }
    });
}
