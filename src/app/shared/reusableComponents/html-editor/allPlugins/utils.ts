const idPool = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';
function nextUniqueId() {
  var size = 12;
  var id = '';

  while (size-- > 0) {
    id += idPool[(Math.random() * 62) | 0];
  }

  return id;
}

function updateStyle(
  editor: any,
  id: any,
  newStyles: any,
  byId: boolean = false
) {
  const cssContainer = byId
    ? editor.Css.getIdRule(id)
    : editor.Css.getClassRule(id);
  if (cssContainer) {
    cssContainer.setStyle({
      ...(cssContainer.getStyle() || {}),
      ...newStyles
    });
  } else {
    const selector = byId ? `#${id}` : `.${id}`;
    editor.Css.setRule(selector, newStyles);
  }
}

function getStyleByClass(editor: any, className: any) {
  return editor.Css.getClassRule(className)?.getStyle();
}

function rgb2hex(rgb: string) {
  return (
    '#' +
    rgb
      .match(/\d+/g)
      .map((x) => (+x).toString(16).padStart(2, '0'))
      .join(``)
  );
}

function createHTMLElement(
  tagName = 'div',
  id?: any,
  className?: any,
  innerHTML?: any
) {
  const element = document.createElement(tagName);
  id ? (element.id = id) : null;
  className ? (element.className = className) : null;
  innerHTML ? (element.innerHTML = innerHTML) : null;
  return element;
}

function fadeIn(el: any, smooth = true, displayStyle = 'block') {
  el.style.opacity = 0;
  el.style.display = displayStyle;
  if (smooth) {
    let opacity = 0;
    let request: any;

    const animation = () => {
      el.style.opacity = opacity += 0.04;
      if (opacity >= 1) {
        opacity = 1;
        cancelAnimationFrame(request);
      }
    };

    const rAf = () => {
      request = requestAnimationFrame(rAf);
      animation();
    };
    rAf();
  } else {
    el.style.opacity = 1;
  }
}

function fadeOut(el: any, smooth = true, displayStyle = 'none') {
  if (smooth) {
    let opacity = el.style.opacity;
    let request: any;

    const animation = () => {
      el.style.opacity = opacity -= 0.04;
      if (opacity <= 0) {
        opacity = 0;
        el.style.display = displayStyle;
        cancelAnimationFrame(request);
      }
    };

    const rAf = () => {
      request = requestAnimationFrame(rAf);
      animation();
    };
    rAf();
  } else {
    el.style.opacity = 0;
  }
}

function getIconHtmlList(icons: any[]) {
  let finalStr = '';
  icons.forEach((currentIcon: any) => {
    finalStr += `<div class="gjs-popup-icon" id="${currentIcon.name}">
    ${currentIcon.svg}
    <small>${currentIcon.name}</small>
  </div>`;
  });

  return `<div class="gjs-popup-icon-list">${finalStr}</div>`;
}

function createIconLookup(icons: any[]) {
  const cachedIcons = {
    google: '',
    yelp: '',
    facebook: '',
    demandforce:
      '<svg id="SVG_ID" class="SVG_CLASS" data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" style="shape-rendering:geometricPrecision; text-rendering:geometricPrecision; image-rendering:optimizeQuality; fill-rule:evenodd; clip-rule:evenodd" viewBox="0 0 240 240"><g data-gjs-type="svg-in" draggable="false"><path data-gjs-type="svg-in" draggable="false" style="opacity:1" fill="#6e83b6" d="M -0.5,-0.5 C 79.5,-0.5 159.5,-0.5 239.5,-0.5C 239.5,79.5 239.5,159.5 239.5,239.5C 159.5,239.5 79.5,239.5 -0.5,239.5C -0.5,159.5 -0.5,79.5 -0.5,-0.5 Z" /></g><g data-gjs-type="svg-in" draggable="false"><path data-gjs-type="svg-in" draggable="false" style="opacity:1" fill="#3c5695" d="M 0.5,0.5 C 79.8333,0.5 159.167,0.5 238.5,0.5C 238.5,79.8333 238.5,159.167 238.5,238.5C 159.167,238.5 79.8333,238.5 0.5,238.5C 0.5,159.167 0.5,79.8333 0.5,0.5 Z" /></g><g data-gjs-type="svg-in" draggable="false"><path data-gjs-type="svg-in" draggable="false" style="opacity:1" fill="#fcfdfc" d="M 185.5,98.5 C 186.809,113.165 186.809,127.832 185.5,142.5C 178.041,176.079 157.041,192.746 122.5,192.5C 99.1667,192.5 75.8333,192.5 52.5,192.5C 52.5,143.833 52.5,95.1667 52.5,46.5C 77.33,45.3367 102.33,45.17 127.5,46C 160.293,48.6261 179.626,66.1261 185.5,98.5 Z" /></g><g data-gjs-type="svg-in" draggable="false"><path data-gjs-type="svg-in" draggable="false" style="opacity:1" fill="#9ca5c1" d="M 52.5,46.5 C 52.5,95.1667 52.5,143.833 52.5,192.5C 75.8333,192.5 99.1667,192.5 122.5,192.5C 99.0059,193.498 75.3392,193.831 51.5,193.5C 51.1678,144.33 51.5012,95.3305 52.5,46.5 Z" /></g><g data-gjs-type="svg-in" draggable="false"><path data-gjs-type="svg-in" draggable="false" style="opacity:1" fill="#21468f" d="M 99.5,79.5 C 99.5,105.5 99.5,131.5 99.5,157.5C 107.019,157.175 114.352,157.508 121.5,158.5C 113.85,159.143 106.183,159.477 98.5,159.5C 98.1688,132.661 98.5021,105.995 99.5,79.5 Z" /></g><g data-gjs-type="svg-in" draggable="false"><path data-gjs-type="svg-in" draggable="false" style="opacity:1" fill="#3d5796" d="M 99.5,79.5 C 130.033,76.3669 144.033,90.0336 141.5,120.5C 141.782,128.299 140.948,135.966 139,143.5C 136.386,152.283 130.552,157.283 121.5,158.5C 114.352,157.508 107.019,157.175 99.5,157.5C 99.5,131.5 99.5,105.5 99.5,79.5 Z" /></g><g data-gjs-type="svg-in" draggable="false"><path data-gjs-type="svg-in" draggable="false" style="opacity:1" fill="#b4bbd0" d="M 185.5,98.5 C 187.039,105.432 187.706,112.598 187.5,120C 187.684,127.728 187.017,135.228 185.5,142.5C 186.809,127.832 186.809,113.165 185.5,98.5 Z" /></g></svg>',
    other: ''
  };

  function findIcon(iconName: string) {
    return icons.find((icon: any) => icon.name === iconName);
  }

  return (iconName: string, id: any) => {
    let svg = '';
    switch (iconName) {
      case 'yelp':
      case 'google':
      case 'facebook':
      case 'demandforce':
      case 'other':
        if (cachedIcons[iconName] === '') {
          const svgObject = findIcon(
            iconName !== 'other' ? iconName : 'user-circle'
          );
          cachedIcons[iconName] = svgObject.svg;
        }
        svg = cachedIcons[iconName];
        break;
      default:
        svg = icons.find((icon: any) => icon.name === iconName)?.svg;
        break;
    }
    return svg ? svg.replace('SVG_ID', id).replace('SVG_CLASS', id) : '';
  };
}

function getSliderStyles(parentClass: string) {
  let css = '';
  const baseCss = `
    .${parentClass} {
      position: relative;
      width: 100%;
      overflow: hidden;
    }

    .${parentClass} .slider-content {
      position: relative;
      width: 100%;
    }

    .${parentClass} .slider-content__item {
      position: relative;
      flex: 1 0 100%;
      width: 100%;
      height: 100%;
      background-repeat: no-repeat;
      background-position: center;
      background-size: contain;
      color: rgba(0, 0, 0, 0.714);
      display: flex;
      align-items: center;
      justify-content: center;
    }

    .${parentClass} .slider-controls {
      padding: 20px;
      text-align: center;
    }

    .${parentClass} .prev-arrow {
      left: 20px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: rgba(0, 0, 0, 0.3);
      width: 20px;
      transition: all 0.3s;
    }

    .${parentClass} .next-arrow {
      right: 20px;
      position: absolute;
      top: 50%;
      transform: translateY(-50%);
      cursor: pointer;
      color: rgba(0, 0, 0, 0.3);
      width: 20px;
      transition: all 0.3s;
    }

    .${parentClass} .prev-arrow:hover,
    .${parentClass} .next-arrow:hover {
      cursor: pointer;
      color: rgba(0, 0, 0, 0.7);
    }

    .${parentClass} .dot {
      cursor: pointer;
      width: 8px;
      height: 8px;
      margin-right: 4px;
      background-color: rgba(0, 0, 0, 0.3);

      border-radius: 50%;
      transition: all 0.3s;
    }

    .${parentClass} .dot:last-child {
      margin-right: 0;
    }

    .${parentClass} .dot:hover {
      background-color: #fff;
    }

    .${parentClass} .dot--active {
      background-color: rgba(255, 255, 255, 0.5);
    }

    .${parentClass} .slide-btn {
      display: inline-block;
      background-color: #414141;
      font-family: Ubuntu, Helvetica, Arial, sans-serif;
      font-size: 13px;
      font-weight: 400;
      line-height: 1.2;
      margin: 0;
      text-decoration: none;
      text-transform: none;
      padding: 10px 25px;
      border-radius: 3px;
      text-align: center;
      transition: all .3s;
      outline: none;
      cursor: pointer;
      transition: all 0.5s;
    }

    .disabled {
      background-color: #DCCFCF;
      color: #B0A8A8;
      cursor: default;
      pointer-events: none;
    }

    .d-none {
      display: none;
    }

    .active {
      opacity: 1;
    }

    .centered {
      position: relative;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

  `;

  css += baseCss;
  if (parentClass === 'slider') {
    css += `.${parentClass} .slider-content-wrapper {
        display: flex;
        height: 300px;
        transition: transform 0.5s ease-in-out;
      }

    .${parentClass} .slide-heading {
        font-size: 32px;
        font-weigth: 700;
        line-height: 1;
      }

      .${parentClass} .slide-description {
        font-size: 16px;
        font-weight: 400;
        line-height: 1.4;
      }

      .${parentClass} .data-container {
        color: #fff;
        height: 70%;
        width: 95%;
        display: flex;
        justify-content: space-evenly;
        flex-direction: column;
        align-items: center;
      }
      
      .${parentClass} .dots {
        position: absolute;
        display: flex;
        left: 50%;
        transform: translateX(-50%);
        bottom: 10%;
      }`;
  } else if (parentClass === 'carousel') {
    css += `.${parentClass} .slider-content-wrapper {
      display: flex;
      height: 230px;
      padding-bottom: 30px;
      transition: transform 0.5s ease-in-out;
    }
    
    .${parentClass} .data-container {
      height: 100%;
      width: 100%;
      text-align: center;
    }
    
    .${parentClass} .data-container .slide-content {
      position: relative;
      height: 100%;
      max-width: 100%;
      border: none;
      border-radius: 0;
      box-shadow: none;
      background: no-repeat 50%;
      background-size: cover;
      background-image: url('data:image/png;base64,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');
    }

    .${parentClass} .data-container .slide-content-play {
      position: absolute;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }

    .${parentClass} .data-container .slide-content-play svg {
      height: 100px;
      width: 100px;
      fill: #fff;
      filter: drop-shadow(1px 0 6px rgba(0, 0, 0, .3));
    }

    .${parentClass} .content-item-overlay {
      cursor: pointer;
      height: 100%;
      width: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }

    .${parentClass} #overlay {
      background: rgba(0, 0, 0, 0.7);
      width: 100%;
      height: 100%;
      position: fixed;
      top: 0;
      left: 0;
      padding: 60px;
      display: flex;
      justify-content: center;
      align-items: center;
      z-index: 999;
      -webkit-user-select: none;
      -moz-user-select: none;
      -ms-user-select: none;
      user-select: none;
    }

    .${parentClass} #overlay iframe {
      position: relative;
      top: 50%;
      left: 50%;
      margin: 0;
      width: 100%;
      max-height: 90vh;
      aspect-ratio: 1.77777;
      transform: translate(-50%, -50%);
    }

    .${parentClass} .overlay-btns {
      position: absolute;
      top: 20px;
      right: 20px;
      cursor: pointer;
      color: rgb(238 238 238 / 90%);
      width: 20px;
      transition: all 0.3s;
    }
    
    .${parentClass} .dots {
      display: flex;
      position: absolute;
      left: 50%;
      bottom: 12px;
      transform: translateX(-50%);
    }
    
    .${parentClass} .prev-arrow,
    .${parentClass} .next-arrow {
      top: calc(50% - 30px);
    }`;
  }

  return css;
}

function parseMediaFromUrl(url: string) {
  let media;
  let videoId = '';
  if (url.match('http(s)?://(www.)?youtube|youtu.be')) {
    const regEx =
      /(https?:\/\/)?(((m|www)\.)?(youtube(-nocookie)?|youtube.googleapis)\.com.*(v\/|v=|vi=|vi\/|e\/|embed\/|user\/.*\/u\/\d+\/)|youtu\.be\/)([_0-9a-z-]+)/i;
    const match = url.match(regEx);
    if (match && match.length > 8) {
      videoId = match[8];
    }
    media = {
      type: 'youtube',
      videoId
    };
  } else if (url.match('http(s)?://(player.)?vimeo.com')) {
    const regEx =
      /(https?:\/\/)?(www\.)?(player\.)?vimeo\.com\/?(showcase\/)*([0-9))([a-z]*\/)*([0-9]{6,11})[?]?.*/;
    const match = url.match(regEx);
    if (match && match.length == 7) {
      videoId = match[6];
    }
    media = {
      type: 'vimeo',
      videoId
    };
  }
  return media;
}

export {
  nextUniqueId,
  updateStyle,
  getStyleByClass,
  rgb2hex,
  createHTMLElement,
  fadeIn,
  fadeOut,
  getIconHtmlList,
  createIconLookup,
  getSliderStyles,
  parseMediaFromUrl
};
