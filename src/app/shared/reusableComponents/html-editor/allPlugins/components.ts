import { cloneDeep } from 'lodash';
import {
  getIconHtmlList,
  nextUniqueId,
  updateStyle,
  createIconLookup,
  getSliderStyles
} from './utils';
import {
  CAROUSEL_TYPE,
  countdownConfig,
  TRAIT_TYPES,
  componentTypes as Types
} from '../pluginsConfig/constants';
export default function (editor: any, opt: any = {}) {
  const c = opt;
  const domc = editor.DomComponents;
  const defaultType = domc.getType('default');
  const defaultModel = defaultType.model;
  const defaultView = defaultType.view;
  const icons = c.icons;
  const getIcon = createIconLookup(icons);
  const pfx = countdownConfig.countdownClsPfx;
  const formData = c.formData;
  const defaultCarouselOptions = [
    {
      type: CAROUSEL_TYPE.IMAGE,
      imgSrc: '',
      videoSrc: '',
      videoLink: ''
    },
    {
      type: CAROUSEL_TYPE.IMAGE,
      imgSrc: '',
      videoSrc: '',
      videoLink: ''
    },
    {
      type: CAROUSEL_TYPE.IMAGE,
      imgSrc: '',
      videoSrc: '',
      videoLink: ''
    },
    {
      type: CAROUSEL_TYPE.IMAGE,
      imgSrc: '',
      videoSrc: '',
      videoLink: ''
    },
    {
      type: CAROUSEL_TYPE.IMAGE,
      imgSrc: '',
      videoSrc: '',
      videoLink: ''
    }
  ];
  const defaultAccordianOptions = [
    {
      title: 'Accordion #1',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
      iconPosition: 'left'
    },
    {
      title: 'Accordion #2',
      content:
        'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
      iconPosition: 'left'
    }
  ];

  domc.addType(Types.DIVIDER, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          stylable: [],
          traits: [
            {
              label: 'Color',
              name: 'color',
              changeProp: 1,
              type: 'color',
              default: '#000000'
            },
            {
              label: 'Weight',
              name: 'weight',
              changeProp: 1,
              type: 'number',
              default: 1,
              min: 1,
              max: 10,
              step: 1
            },
            {
              label: 'Gap',
              name: 'gap',
              changeProp: 1,
              type: 'number',
              default: 10,
              min: 2,
              max: 50,
              step: 1
            },
            {
              label: 'Width',
              name: 'width',
              changeProp: 1,
              type: 'number',
              default: 100,
              min: 0,
              max: 100,
              step: 1
            },
            {
              label: 'Alignment',
              name: 'alignment',
              changeProp: 1,
              type: 'select',
              default: 'left',
              options: [
                { id: 'left', name: 'Left' },
                { id: 'center', name: 'Center' },
                { id: 'right', name: 'Right' }
              ]
            }
          ],
          attributes: { color: '#000000' },
          script: function () {
            const color = '{[ color ]}';
            const weight = '{[ weight ]}';
            const gap = '{[ gap ]}';
            const width = '{[ width ]}';
            const alignment = '{[ alignment ]}';
            const dividerSeparatorElement = this.querySelector(
              '[data-js="gjs-divider-separator"]'
            );
            dividerSeparatorElement.style.borderBlockStartColor = color;
            dividerSeparatorElement.style.borderBlockStartWidth = weight + 'px';
            dividerSeparatorElement.style.width = width + '%';
            this.style.paddingBlockStart = gap + 'px';
            this.style.paddingBlockEnd = gap + 'px';
            this.style.justifyContent = alignment;
          }
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.DIVIDER
          ) {
            return {
              type: Types.DIVIDER
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const props = ['color', 'weight', 'gap', 'width', 'alignment'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.updateScript);
        const comps = this.model.get('components');
        if (!comps.length) {
          comps.reset();
          comps.add(
            `<div data-js="gjs-divider-separator" class="gjs-divider-separator"></div>`
          );
        }
      }
    })
  });

  domc.addType(Types.SPACER, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          stylable: [],
          traits: [
            {
              label: 'Space',
              name: 'space',
              changeProp: 1,
              type: 'number',
              default: 50,
              min: 10,
              max: 500,
              step: 1
            }
          ],
          script: function () {
            const space = '{[ space ]}';
            this.style.height = space + 'px';
          }
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.SPACER
          ) {
            return {
              type: Types.SPACER
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const props = ['space'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.updateScript);
        // const comps = this.model.get('components');
        // if (!comps.length) {
        //   comps.reset();
        //   comps.add(
        //     `<div data-js="gjs-spacer-inner" class="gjs-spacer-inner"></div>`
        //   );
        // }
      }
    })
  });

  domc.addType(Types.SLIDER, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          draggable: true,
          stylable: [],
          layerable: false,
          styles: getSliderStyles('slider'),
          sliderConfig: [
            {
              bgColor: '#833CA3',
              bgImage: '',
              headingText: 'Slide Heading',
              descriptionText:
                'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor',
              btnText: 'Click here'
            },
            {
              bgColor: '#4054B2',
              bgImage: '',
              headingText: 'Slide Heading',
              descriptionText:
                'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor',
              btnText: 'Click here'
            },
            {
              bgColor: '#1ABC9C',
              bgImage: '',
              headingText: 'Slide Heading',
              descriptionText:
                'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor',
              btnText: 'Click here'
            }
          ],
          sliderHeight: 300,
          traits: [
            {
              label: 'Slider Config',
              name: 'sliderConfig',
              changeProp: 1,
              type: TRAIT_TYPES.SLIDER_CONFIG,
              options: [
                {
                  bgColor: '#833CA3',
                  bgImage: '',
                  headingText: 'Slide Heading',
                  descriptonText:
                    'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor',
                  btnText: 'Click here'
                },
                {
                  bgColor: '#4054B2',
                  bgImage: '',
                  headingText: 'Slide Heading',
                  descriptonText:
                    'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor',
                  btnText: 'Click here'
                },
                {
                  bgColor: '#1ABC9C',
                  bgImage: '',
                  headingText: 'Slide Heading',
                  descriptonText:
                    'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor',
                  btnText: 'Click here'
                }
              ]
            },
            {
              label: 'Height',
              name: 'sliderHeight',
              type: 'number',
              changeProp: 1,
              min: 100,
              max: 1000,
              default: 300
            }
          ],
          script: function () {
            const slider = (() => {
              const slider = this;
              const sliderContent = this.querySelector('.slider-content');
              const sliderWrapper: HTMLElement = this.querySelector(
                '.slider-content-wrapper'
              );
              const elements = this.querySelectorAll('.slider-content__item');
              const sliderContentControls = createHTMLElement(
                'div',
                'slider-content__controls',
                null
              );
              let dotsWrapper: any = null;
              let leftArrow: any = null;
              let rightArrow: any = null;
              // let intervalId: any = null; //identifier setInterval

              // data
              const itemsInfo = {
                offset: 0,
                position: {
                  current: 0,
                  min: 0,
                  max: elements.length - 1
                },
                intervalSpeed: 4000,

                update: function (value: any) {
                  this.position.current = value;
                  this.offset = -value;
                },
                reset: function () {
                  this.position.current = 0;
                  this.offset = 0;
                }
              };

              const controlsInfo = {
                buttonsEnabled: false,
                dotsEnabled: false,
                prevButtonDisabled: true,
                nextButtonDisabled: false
              };

              function init(props: any) {
                let { intervalSpeed, offset } = itemsInfo;
                const { position } = itemsInfo;

                if (slider && sliderContent && sliderWrapper && elements) {
                  if (props && props.intervalSpeed) {
                    intervalSpeed = props.intervalSpeed;
                    console.log(intervalSpeed);
                  }
                  if (props && props.currentItem) {
                    if (
                      parseInt(props.currentItem) >= position.min &&
                      parseInt(props.currentItem) <= position.max
                    ) {
                      position.current = props.currentItem;
                      offset = -props.currentItem;
                      console.log(offset);
                    }
                  }
                  if (props && props.buttons) {
                    controlsInfo.buttonsEnabled = true;
                  }
                  if (props && props.dots) {
                    controlsInfo.dotsEnabled = true;
                  }

                  _updateControlsInfo();
                  _createControls(controlsInfo.dotsEnabled);
                  _render();
                } else {
                  console.log(
                    "The slider layout is set incorrectly. Check that all required classes 'slider/slider-content/slider-wrapper/slider-content__item' are present"
                  );
                }
              }

              function _updateControlsInfo() {
                const { current, min, max } = itemsInfo.position;
                controlsInfo.prevButtonDisabled = current > min ? false : true;
                controlsInfo.nextButtonDisabled = current < max ? false : true;
              }

              // Creating markup elements
              function _createControls(dots = false) {
                //Wrapper for controls
                sliderContent.append(sliderContentControls);

                // Controls
                createArrows();
                dots ? createDots() : null;

                // Arrows function
                function createArrows() {
                  const dValueLeftArrow =
                    'M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z';
                  const dValueRightArrow =
                    'M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z';
                  const leftArrowSVG = createSVG(dValueLeftArrow);
                  const rightArrowSVG = createSVG(dValueRightArrow);

                  leftArrow = createHTMLElement('div', 'prev-arrow', null);
                  leftArrow.append(leftArrowSVG);
                  leftArrow.addEventListener('click', () =>
                    updateItemsInfo(itemsInfo.position.current - 1)
                  );

                  rightArrow = createHTMLElement('div', 'next-arrow', null);
                  rightArrow.append(rightArrowSVG);
                  rightArrow.addEventListener('click', () =>
                    updateItemsInfo(itemsInfo.position.current + 1)
                  );

                  sliderContentControls.append(leftArrow, rightArrow);

                  // SVG function
                  function createSVG(dValue: any, color = 'currentColor') {
                    const svg = document.createElementNS(
                      'http://www.w3.org/2000/svg',
                      'svg'
                    );
                    svg.setAttribute('viewBox', '0 0 256 512');
                    const path = document.createElementNS(
                      'http://www.w3.org/2000/svg',
                      'path'
                    );
                    path.setAttribute('fill', color);
                    path.setAttribute('d', dValue);
                    svg.appendChild(path);
                    return svg;
                  }
                }

                // Dots function
                function createDots() {
                  dotsWrapper = createHTMLElement('div', 'dots', null);
                  for (let i = 0; i < itemsInfo.position.max + 1; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.addEventListener('click', function () {
                      updateItemsInfo(i);
                    });
                    dotsWrapper.append(dot);
                  }
                  sliderContentControls.append(dotsWrapper);
                }
              }

              // Set a class for controls (buttons, arrows)
              function setClass(options: any) {
                if (options) {
                  options.forEach((props: any) => {
                    if (props?.element) {
                      props?.disabled
                        ? props?.element.classList.add(props?.className)
                        : props?.element.classList.remove(props?.className);
                    } else {
                      console.log(
                        'Error: function setClass(): element = ',
                        props?.element
                      );
                    }
                  });
                }
              }

              // Update slider values
              function updateItemsInfo(value: any) {
                itemsInfo.update(value);
                _slideItem(true);
              }

              // Show items
              const _render = () => {
                const { prevButtonDisabled, nextButtonDisabled } = controlsInfo;
                let controlsArray = [
                  {
                    element: leftArrow,
                    className: 'd-none',
                    disabled: prevButtonDisabled
                  },
                  {
                    element: rightArrow,
                    className: 'd-none',
                    disabled: nextButtonDisabled
                  }
                ];
                if (controlsInfo.buttonsEnabled) {
                  controlsArray = [...controlsArray];
                }

                //Showing/hiding controls
                setClass(controlsArray);

                //Moving the slider
                sliderWrapper.style.transform =
                  'translateX(' + itemsInfo.offset * 100 + '%)';

                // Set the active element for dots
                if (controlsInfo.dotsEnabled) {
                  if (this.querySelector('.dot--active')) {
                    this.querySelector('.dot--active').classList.remove(
                      'dot--active'
                    );
                  }
                  dotsWrapper.children[
                    itemsInfo.position.current
                  ].classList.add('dot--active');
                }
              };

              // Move slide
              function _slideItem(autoMode = false) {
                console.log(autoMode);
                // if (autoMode && intervalId) {
                //   clearInterval(intervalId);
                // }
                _updateControlsInfo();
                _render();
              }

              // Create HTML markup for an element
              function createHTMLElement(
                tagName = 'div',
                className: any,
                innerHTML: any
              ) {
                const element = document.createElement(tagName);
                className ? (element.className = className) : null;
                innerHTML ? (element.innerHTML = innerHTML) : null;
                return element;
              }

              // Available Methods
              return { init };
            })();
            const sliderControls = this.querySelector(
              '.slider-content__controls'
            );
            if (!sliderControls) {
              slider.init({
                // intervalSpeed: 1000,
                currentItem: 0,
                buttons: true,
                dots: true
              });
            }
          }
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.SLIDER
          ) {
            return {
              type: Types.SLIDER
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const comps = this.model.get('components');
        if (!comps.length) {
          comps.reset();
          const sliderConfig = cloneDeep(this.model.get('sliderConfig'));
          const sliderComponent = this.getSliderComponent(sliderConfig);
          this.model.addAttributes({ sliderConfig });
          comps.add(sliderComponent);
        }
        this.listenTo(
          this.model,
          'change:attributes:sliderConfig',
          this.updateSlides
        );
        const props = ['sliderHeight'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.handlePropertyChange);
      },
      handlePropertyChange() {
        if ('sliderHeight' in this.model.changed) {
          const wrapper = this.model.find('.slider-content-wrapper')[0];
          if (!wrapper.attributes.attributes.id) {
            wrapper.resetId();
          }
          const id = wrapper.attributes.attributes.id;
          updateStyle(
            editor,
            id,
            {
              height: this.model.changed['sliderHeight'] + 'px'
            },
            true
          );
        }
      },
      getSliderComponent(sliderConfig: any, generateIds: any = true) {
        let slides = '';
        let styles = '';
        sliderConfig.forEach((option: any) => {
          if (generateIds) {
            option['id'] = nextUniqueId();
          }
          slides += this.getSlide(option);
          styles += this.getSlideStyle(option);
        });
        return `<div class="slider-content" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
              <div class="slider-content-wrapper" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
                ${slides}
              </div>
            </div>
            <style>
              ${styles}
            </style>`;
      },
      getSlide(option: any) {
        return `<div data-gjs-draggable="false" data-gjs-selectable="false" data-js-id="${option.id}" data-gjs-hoverable="false" class="slider-content__item image-${option.id}" >
                <div class="data-container" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
                  <div data-gjs-type="text" id="slide-heading-${option.id}" class="slide-heading-${option.id} slide-heading">${option.headingText}</div>
                  <div data-gjs-type="text" id="slide-desc-${option.id}" class="slide-desc-${option.id} slide-description">${option.descriptionText}</div>
                  <a data-gjs-type="${Types.BUTTON}" id="slide-btn-${option.id}" class="slide-btn-${option.id} slide-btn"><div>${option.btnText}</div></a>
                </div>
            </div>`;
      },
      getSlideStyle(option: any) {
        return option.bgImage
          ? `
            .image-${option.id} {
              background-image: url(${option.bgImage});
              background-repeat: no-repeat;
              background-position: center;
              background-size: cover;
            }
          `
          : `
            .image-${option.id} {
              background-color: ${option.bgColor};
            }
        `;
      },
      updateSlides() {
        if ('open' in this.model.changed && !this.model.changed['open']) {
          return;
        }
        const comps = this.model.get('components');
        if (comps.length > 0) {
          comps.reset();
        }
        const sliderConfig = this.model.getAttributes()['sliderConfig'];
        const sliderComponent = this.getSliderComponent(sliderConfig, false);
        comps.add(sliderComponent);
        this.updateScript();
      }
    })
  });

  domc.addType(Types.HEADING, {
    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        droppable: false,
        stylable: [],
        tag: 'h2',
        traits: [
          {
            label: 'HTML Tag',
            name: 'tag',
            changeProp: 1,
            type: 'select',
            default: 'h2',
            options: [
              { id: 'h1', name: 'h1' },
              { id: 'h2', name: 'h2' },
              { id: 'h3', name: 'h3' },
              { id: 'h4', name: 'h4' },
              { id: 'h5', name: 'h5' },
              { id: 'h6', name: 'h6' }
            ]
          }
        ]
      }
    }),

    view: defaultView.extend({
      init() {
        const props = ['tag'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.changeTag);
        const comps = this.model.get('components');
        if (!comps.length) {
          comps.reset();
          comps.add(
            `<h2 data-js="gjs-heading-inner" style="margin: 0">Add Your Heading Text Here</h2>
            <style>
              .gjs-heading {
                width: 100%;
                padding: 0.5rem;
              }
            </style>`
          );
        }
      },
      changeTag() {
        this.model.components().models[0].set('tagName', this.model.get('tag'));
      }
    })
  });

  domc.addType(Types.BUTTON, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          // stylable: [],
          traits: [
            {
              type: 'text', // If you don't specify the type, the `text` is the default one
              name: 'href', // Required and available for all traits
              label: 'href', // The label you will see near the input
              // label: false, // If you set label to `false`, the label column will be removed
              placeholder: 'eg https://www.google.com' // Placeholder to show inside the input
            }
          ]
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.BUTTON
          ) {
            return {
              type: Types.BUTTON
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const props = ['href'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.updateScript);
      }
    })
  });

  domc.addType(Types.ICONS, {
    model: defaultModel.extend({
      defaults: {
        ...defaultModel.prototype.defaults,
        droppable: false,
        stylable: [],
        iconName: 'star',
        iconId: '',
        color: '#000000',
        size: '50',
        alignment: 'left',
        traits: [
          {
            type: 'button',
            text: 'Change Icon',
            full: true,
            command: (editor: any) => {
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
                    .forEach((i) =>
                      i.removeEventListener('click', onIconClick)
                    );
                }
                icon.addEventListener('click', onIconClick);
              });
            }
          },
          {
            label: 'Color',
            name: 'color',
            changeProp: 1,
            type: 'color',
            default: '#000000'
          },
          {
            label: 'Size',
            name: 'size',
            changeProp: 1,
            type: 'number',
            default: 50,
            min: 10,
            max: 200,
            step: 1
          },
          {
            label: 'Alignment',
            name: 'alignment',
            changeProp: 1,
            type: 'select',
            default: 'left',
            options: [
              { id: 'left', name: 'Left' },
              { id: 'center', name: 'Center' },
              { id: 'right', name: 'Right' }
            ]
          }
        ],
        script: function () {
          const alignment = '{[ alignment ]}';
          this.style.textAlign = alignment;
        }
      }
    }),

    view: defaultView.extend({
      init() {
        const props = ['alignment'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.updateScript);
        this.listenTo(this.model, 'change:size', this.updateSvgSize);
        this.listenTo(this.model, 'change:color', this.updateSvgColor);
        this.listenTo(this.model, 'change:iconName', this.updateSvg);
        // this.listenTo(this.model, 'change:iconName', this.updateSvg);

        const comps = this.model.get('components');
        if (!comps.length) {
          const id = nextUniqueId();
          const svgName = this.model.get('iconName');
          const svgObject = icons.find((icon: any) => icon.name === svgName);
          const svg = svgObject.svg
            .replace('SVG_ID', id)
            .replace('SVG_CLASS', id);
          this.model.set('iconId', id);

          comps.reset();
          comps.add(`
            ${svg}
            `);
          updateStyle(editor, id, {
            width: '50px',
            height: 'auto',
            color: '#000000',
            fill: 'currentColor'
          });
        }
      },
      updateSvg() {
        const svgName = this.model.get('iconName');
        const iconId = this.model.get('iconId');
        const svgObject = icons.find((icon: any) => icon.name === svgName);
        const svg = svgObject.svg
          .replace('SVG_ID', iconId)
          .replace('SVG_CLASS', iconId);
        const comps = this.model.get('components');
        if (comps?.length > 0) {
          comps.reset();
        }
        comps.add(svg);
      },

      updateSvgSize() {
        const size = this.model.get('size');
        const iconId = this.model.get('iconId');
        updateStyle(editor, iconId, {
          width: size + 'px'
        });
      },
      updateSvgColor() {
        const color = this.model.get('color');
        const iconId = this.model.get('iconId');
        updateStyle(editor, iconId, {
          color
        });
      }
    })
  });

  domc.addType(Types.COUNTDOWN, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          startfrom: countdownConfig.startTime,
          endText: countdownConfig.endText,
          droppable: false,
          traits: [
            {
              label: 'Start',
              name: 'startfrom',
              changeProp: 1,
              type: countdownConfig.dateInputType
            },
            {
              label: 'End text',
              name: 'endText',
              changeProp: 1
            }
          ],
          script: function () {
            var startfrom = '{[ startfrom ]}';
            var endTxt = '{[ endText ]}';
            var countDownDate = new Date(startfrom).getTime();
            var countdownEl = this.querySelector('[data-js=countdown]');
            var endTextEl = this.querySelector('[data-js=countdown-endtext]');
            var dayEl = this.querySelector('[data-js=countdown-day]');
            var hourEl = this.querySelector('[data-js=countdown-hour]');
            var minuteEl = this.querySelector('[data-js=countdown-minute]');
            var secondEl = this.querySelector('[data-js=countdown-second]');
            var oldInterval = this.gjs_countdown_interval;
            if (oldInterval) {
              oldInterval && clearInterval(oldInterval);
            }

            var setTimer = function (
              days: number,
              hours: number,
              minutes: number,
              seconds: number
            ) {
              dayEl.innerHTML = days < 10 ? '0' + days : days;
              hourEl.innerHTML = hours < 10 ? '0' + hours : hours;
              minuteEl.innerHTML = minutes < 10 ? '0' + minutes : minutes;
              secondEl.innerHTML = seconds < 10 ? '0' + seconds : seconds;
            };

            var moveTimer = function () {
              var now = new Date().getTime();
              var distance = countDownDate - now;
              var days = Math.floor(distance / 86400000);
              var hours = Math.floor((distance % 86400000) / 3600000);
              var minutes = Math.floor((distance % 360000) / 60000);
              var seconds = Math.floor((distance % 60000) / 1000);

              setTimer(days, hours, minutes, seconds);

              /* If the count down is finished, write some text */
              if (distance < 0) {
                clearInterval(interval);
                endTextEl.innerHTML = endTxt;
                countdownEl.style.display = 'none';
                endTextEl.style.display = '';
              }
            };

            if (countDownDate) {
              var interval = setInterval(moveTimer, 1000);
              this.gjs_countdown_interval = interval;
              endTextEl.style.display = 'none';
              countdownEl.style.display = '';
              moveTimer();
            } else {
              setTimer(0, 0, 0, 0);
            }
          }
        }
      },
      {
        isComponent(el: any): any {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.COUNTDOWN
          ) {
            return {
              type: Types.COUNTDOWN
            };
          }
        }
      }
    ),

    view: defaultView.extend({
      init() {
        this.listenTo(
          this.model,
          'change:startfrom change:endText',
          this.updateScript
        );
        const comps = this.model.get('components');

        // Add a basic countdown template if it's not yet initialized
        if (!comps.length) {
          comps.reset();
          comps.add(`
            <span data-js="countdown" class="${pfx}-cont">
              <div class="${pfx}-block">
                <div data-js="countdown-day" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${countdownConfig.labelDays}</div>
              </div>
              <div class="${pfx}-block">
                <div data-js="countdown-hour" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${countdownConfig.labelHours}</div>
              </div>
              <div class="${pfx}-block">
                <div data-js="countdown-minute" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${countdownConfig.labelMinutes}</div>
              </div>
              <div class="${pfx}-block">
                <div data-js="countdown-second" class="${pfx}-digit"></div>
                <div class="${pfx}-label">${countdownConfig.labelSeconds}</div>
              </div>
            </span>
            <span data-js="countdown-endtext" class="${pfx}-endtext"></span>
          `);
        }
      }
    })
  });

  domc.addType(Types.GALLERY, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          stylable: [],
          traits: [
            {
              label: 'Gallery Config',
              name: 'galleryConfig',
              changeProp: 1,
              type: TRAIT_TYPES.GALLERY_CONFIG
            },
            {
              label: 'Columns',
              name: 'columns',
              changeProp: 1,
              type: 'number',
              min: 1,
              max: 24,
              default: 4
            },
            {
              label: 'Spacing',
              name: 'spacing',
              changeProp: 1,
              type: 'number',
              min: 0,
              max: 100,
              default: 10
            }
          ],
          galleryImages: [],
          'script-props': ['galleryImages'],
          script: function (props: any) {
            const galleryImages = props.galleryImages ?? [];
            let curIndex = 0;
            const overlay = createHTMLElement('div', 'overlay');
            const image = createHTMLElement('img');
            const leftArrow = createHTMLElement(
              'div',
              null,
              'prev-arrow',
              null
            );
            const rightArrow = createHTMLElement(
              'div',
              null,
              'next-arrow',
              null
            );
            const buttons = createHTMLElement(
              'div',
              null,
              'overlay-btns',
              null
            );
            const createArrows = () => {
              const dValueLeftArrow =
                'M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z';
              const dValueRightArrow =
                'M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z';
              const leftArrowSVG = createSVG(dValueLeftArrow);
              const rightArrowSVG = createSVG(dValueRightArrow);

              const updateOverlayImage = (index: number) => {
                image.style.display = 'none';
                if (index < 0 || index >= galleryImages.length) {
                  index = 0;
                }
                curIndex = index;
                image.setAttribute('src', galleryImages[curIndex].url);
                fadeIn(image);
              };

              leftArrow.append(leftArrowSVG);
              leftArrow.addEventListener('click', (e: any) => {
                updateOverlayImage(curIndex - 1);
                e.stopPropagation();
              });

              rightArrow.append(rightArrowSVG);
              rightArrow.addEventListener('click', (e: any) => {
                updateOverlayImage(curIndex + 1);
                e.stopPropagation();
              });
            };
            const createButtons = () => {
              const dValueCloseIcon =
                'M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z';

              const closeIcon = createSVG(dValueCloseIcon, '0 0 1000 1000');
              const closeButton = createHTMLElement(
                'div',
                null,
                'overlay-close',
                null
              );
              closeButton.append(closeIcon);
              buttons.append(closeButton);
              closeButton.addEventListener('click', (e: any) => {
                fadeOut(overlay);
                e.stopPropagation();
              });
            };
            createArrows();
            createButtons();
            // Add overlay
            overlay.append(image);
            overlay.prepend(leftArrow);
            overlay.append(rightArrow);
            overlay.append(buttons);
            this.append(overlay);

            // Hide overlay on default
            overlay.style.display = 'none';

            // When an image is clicked
            this.querySelectorAll('.gallery-item-overlay').forEach(
              (ele: HTMLElement) => {
                ele.addEventListener('click', (event: any) => {
                  // Prevents default behavior
                  event.preventDefault();
                  // Adds href attribute to variable
                  const imageElement =
                    event.currentTarget.previousElementSibling;
                  const id = imageElement.getAttribute('data-js-id');
                  curIndex = galleryImages.findIndex(
                    (image: any) => image.id === id
                  );
                  if (curIndex != -1) {
                    image.setAttribute('src', galleryImages[curIndex].url);
                    image.setAttribute('data-img-id', id);
                    // Fade in the overlay
                    fadeIn(overlay);
                  }
                });
              }
            );

            // When the overlay is clicked
            overlay.addEventListener('click', (e: any) => {
              e.preventDefault();
              fadeOut(overlay);
            });

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

            // SVG function
            function createSVG(
              dValue: any,
              viewBox = '0 0 256 512',
              color = 'currentColor'
            ) {
              const svg = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'svg'
              );
              svg.setAttribute('viewBox', viewBox);
              const path = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
              );
              path.setAttribute('fill', color);
              path.setAttribute('d', dValue);
              svg.appendChild(path);
              return svg;
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
          }
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.GALLERY
          ) {
            return {
              type: Types.GALLERY
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const comps = this.model.get('components');
        if (!comps.length) {
          const galleryImages = this.model.get('galleryImages');
          comps.reset();
          this.model.setAttributes({ galleryImages });
          this.model.resetId();
          if (galleryImages?.length > 0) {
            const galleryComponent = this.getGalleryComponent(galleryImages);
            // this.model.set('galleryImages', galleryImages);
            comps.add(galleryComponent);
          } else {
            comps.add(this.getEmptyGalleryComponent());
          }
        }
        this.listenTo(
          this.model,
          'change:attributes:galleryImages',
          this.updateGalleryComponent
        );
        const props = ['columns', 'spacing'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.handlePropertyChange);
      },
      handlePropertyChange() {
        const id = this.model.attributes.attributes.id;
        if ('columns' in this.model.changed) {
          updateStyle(
            editor,
            id,
            {
              'grid-template-columns': `repeat(${this.model.changed['columns']}, 1fr) !important`
            },
            true
          );
        } else if ('spacing' in this.model.changed) {
          updateStyle(
            editor,
            id,
            {
              'row-gap': `${this.model.changed['spacing']}px`,
              'column-gap': `${this.model.changed['spacing']}px`
            },
            true
          );
        }
      },
      getEmptyGalleryComponent() {
        return `
          <div class="empty-gallery-icon" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
              <svg data-gjs-type="svg" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64">
                <path data-gjs-type="svg-in" d="M3,30H19a1,1,0,0,0,1-1V13a1,1,0,0,0-1-1H3a1,1,0,0,0-1,1V29A1,1,0,0,0,3,30ZM4,14H18V28H4Z"/>
                <path data-gjs-type="svg-in" d="M61,12H25a1,1,0,0,0-1,1V29a1,1,0,0,0,1,1H61a1,1,0,0,0,1-1V13A1,1,0,0,0,61,12ZM60,28H26V14H60Z"/>
                <path data-gjs-type="svg-in" d="M61,34H45a1,1,0,0,0-1,1V51a1,1,0,0,0,1,1H61a1,1,0,0,0,1-1V35A1,1,0,0,0,61,34ZM60,50H46V36H60Z"/>
                <path data-gjs-type="svg-in" d="M40,51V35a1,1,0,0,0-1-1H3a1,1,0,0,0-1,1V51a1,1,0,0,0,1,1H39A1,1,0,0,0,40,51Zm-2-1H4V36H38Z"/>
              </svg>
          </div>
          
          <style>
            .gallery {
              position: relative;
              width: 100;
              min-height: 55px;
            }
            .gallery .empty-gallery-icon {
              position: absolute;
              left: 2px;
              width: calc(100% - 4px);
              max-height: 55px;
              text-align: center;
              background-color: rgba(213, 216, 220, .8);
            }

            .gallery .empty-gallery-icon svg {
              width: 54px;
              height: auto;
              color: #babfc5;
              fill: currentColor;
            }
          </style>`;
      },
      getGalleryComponent(images: any[], generateIds: boolean = true) {
        let imageContainers = '';
        let imageStyles = '';
        images.forEach((image: any) => {
          if (generateIds) {
            image['id'] = nextUniqueId();
          }
          imageContainers += this.getImageForComponent(image);
          imageStyles += this.getStyleForImage(image);
        });
        return `
          ${imageContainers}

          <style>
            .gallery {
              display: grid;
              grid-gap: 10px 10px;
              grid-template-columns: repeat(4, 1fr);
            }

            .gallery .gallery-item-wrapper {
              position: relative;
              width: 100%;
              height: 100%;
              transition: all 350ms ease-in;
            }

            .gallery .gallery-item {
              width: 100%;
              padding-bottom: 55%;
              background-position: center center;
              background-size: cover;
              transform-origin: center top;
              transition: transform 800ms ease-in;
            }

            .gallery .gallery-item-overlay {
              cursor: pointer;
              height: 100%;
              width: 100%;
              position: absolute;
              top: 0;
              left: 0;
              transition: background-color 600ms ease-in-out;
            }

            .gallery .gallery-item-overlay:hover {
              background-color: rgba(0, 0, 0, 0.5);
            }

            .gallery #overlay {
              background: rgba(0, 0, 0, 0.7);
              width: 100%;
              height: 100%;
              position: fixed;
              top: 0;
              left: 0;
              display: flex;
              justify-content: center;
              align-items: center;
              z-index: 999;
              -webkit-user-select: none;
              -moz-user-select: none;
              -ms-user-select: none;
              user-select: none;
            }
            
            .gallery #overlay img {
              position: relative;
              top: 50%;
              left: 50%;
              margin: 0;
              padding: 5%;
              width: 80%;
              height: auto;
              object-fit: contain;
              transform: translate(-50%, -50%);
            }
            
            .gallery .prev-arrow, .gallery .next-arrow {
              position: absolute;
              top: 50%;
              transform: translateY(-50%);
              cursor: pointer;
              color: rgb(238 238 238 / 90%);
              width: 20px;
              transition: all 0.3s;
            }
            
            .gallery .prev-arrow { 
              left: 8%;
            }

            .gallery .next-arrow {
              right: 8%;
            }
      
            .gallery .overlay-btns {
              position: absolute;
              top: 20px;
              right: 20px;
              cursor: pointer;
              color: rgb(238 238 238 / 90%);
              width: 20px;
              transition: all 0.3s;
            }
      
            .gallery .prev-arrow:hover,
            .gallery .next-arrow:hover,
            .gallery .overlay-btns:hover {
              cursor: pointer;
              color: rgba(0, 0, 0, 0.7);
            }

            ${imageStyles}
          </style>
        `;
      },
      getImageForComponent(image: any) {
        return `<div class="gallery-item-wrapper">
          <div class="gallery-item gallery-item-${image.id}" data-js-id="${image.id}" role="img"></div>
          <div class="gallery-item-overlay"></div>
        </div>
        `;
      },
      getStyleForImage(image: any) {
        return `.gallery-item-${image.id} {
          background-image: url(${image.url});
        }`;
      },
      updateGalleryComponent() {
        if ('open' in this.model.changed && !this.model.changed['open']) {
          return;
        }
        const comps = this.model.get('components');
        if (comps.length > 0) {
          comps.reset();
        }
        const images = this.model.getAttributes()['galleryImages'];
        if (images?.length > 0) {
          comps.add(this.getGalleryComponent(images, false));
        } else {
          comps.add(this.getEmptyGalleryComponent());
        }
        this.model.set('galleryImages', images);
      }
    })
  });

  domc.addType(Types.FORM, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          iframeSrc: formData.formUrl,
          traits: [
            {
              label: 'Choose Form Name',
              name: 'formId',
              type: 'select',
              changeProp: 1,
              options: [...(formData.formList ?? [])]
            }
          ]
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.FORM
          ) {
            return {
              type: Types.FORM
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const props = ['formId'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.updateFormId);

        const comps = this.model.get('components');
        if (!comps.length) {
          const iframeSrc = this.model.get('iframeSrc');
          const formId = this.model.get('formId');
          comps.reset();
          comps.add(`
            <iframe data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false" 
              class="gjs-form-iframe" src="${
                formId ? iframeSrc + formId : ''
              }" frameborder="0" allowfullscreen="true"></iframe>

            <style>
              .gjs-form {
                width: 615px;
                height: 350px;
                padding: 1rem;
              }
              .gjs-form .gjs-form-iframe {
                width: 100%;
                height: 100%;
              }
            </style>
          `);
        }
      },
      updateFormId() {
        const iframeSrc = this.model.get('iframeSrc');
        const formId = this.model.get('formId');
        this.model.components().models[0].setAttributes({
          ...this.model.components().models[0].getAttributes(),
          src: iframeSrc + formId
        });
      }
    })
  });

  domc.addType(Types.REVIEWS, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          draggable: true,
          stylable: [],
          layerable: false,
          reviewConfig: [
            {
              name: 'John Doe',
              title: '@username',
              rating: '0.0',
              icon: '<svg id="SVG_ID" class="SVG_CLASS" data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path data-gjs-type="svg-in" draggable="false" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>',
              reviewText:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
              bgColor: '#ffffff'
            },
            {
              name: 'John Doe',
              title: '@username',
              rating: '0.0',
              icon: '<svg id="SVG_ID" class="SVG_CLASS" data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path data-gjs-type="svg-in" draggable="false" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>',
              reviewText:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
              bgColor: '#ffffff'
            },
            {
              name: 'John Doe',
              title: '@username',
              rating: '0.0',
              icon: '<svg id="SVG_ID" class="SVG_CLASS" data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path data-gjs-type="svg-in" draggable="false" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>',
              reviewText:
                'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
              bgColor: '#ffffff'
            }
          ],
          sliderWidth: 100,
          traits: [
            {
              label: 'Review Config',
              name: 'reviewConfig',
              changeProp: 1,
              type: TRAIT_TYPES.REVIEW_CONFIG,
              options: [
                {
                  name: 'John Doe',
                  title: '@username',
                  rating: '0.0',
                  icon: '<svg id="SVG_ID" class="SVG_CLASS" data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path data-gjs-type="svg-in" draggable="false" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>',
                  reviewText:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
                  bgColor: '#ffffff'
                },
                {
                  name: 'John Doe',
                  title: '@username',
                  rating: '0.0',
                  icon: '<svg id="SVG_ID" class="SVG_CLASS" data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path data-gjs-type="svg-in" draggable="false" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>',
                  reviewText:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
                  bgColor: '#ffffff'
                },
                {
                  name: 'John Doe',
                  title: '@username',
                  rating: '0.0',
                  icon: '<svg id="SVG_ID" class="SVG_CLASS" data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path data-gjs-type="svg-in" draggable="false" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>',
                  reviewText:
                    'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
                  bgColor: '#ffffff'
                }
              ]
            },
            {
              label: 'Width',
              name: 'sliderWidth',
              type: 'number',
              changeProp: 1,
              min: 50,
              max: 100,
              default: 100
            }
          ],
          script: function () {
            const slider = (() => {
              const slider = this;
              const sliderContent = this.querySelector('.slider-content');
              const sliderWrapper: HTMLElement = this.querySelector(
                '.slider-content-wrapper'
              );
              const elements = this.querySelectorAll('.slider-content__item');
              const sliderContentControls = createHTMLElement(
                'div',
                'slider-content__controls',
                null
              );
              let dotsWrapper: any = null;
              let leftArrow: any = null;
              let rightArrow: any = null;
              // let intervalId: any = null; //identifier setInterval

              // data
              const itemsInfo = {
                offset: 0,
                position: {
                  current: 0,
                  min: 0,
                  max: elements.length - 1
                },
                intervalSpeed: 4000,

                update: function (value: any) {
                  this.position.current = value;
                  this.offset = -value;
                },
                reset: function () {
                  this.position.current = 0;
                  this.offset = 0;
                }
              };

              const controlsInfo = {
                buttonsEnabled: false,
                dotsEnabled: false,
                prevButtonDisabled: true,
                nextButtonDisabled: false
              };

              function init(props: any) {
                let { intervalSpeed, offset } = itemsInfo;
                const { position } = itemsInfo;

                if (slider && sliderContent && sliderWrapper && elements) {
                  if (props && props.intervalSpeed) {
                    intervalSpeed = props.intervalSpeed;
                    console.log(intervalSpeed);
                  }
                  if (props && props.currentItem) {
                    if (
                      parseInt(props.currentItem) >= position.min &&
                      parseInt(props.currentItem) <= position.max
                    ) {
                      position.current = props.currentItem;
                      offset = -props.currentItem;
                      console.log(offset);
                    }
                  }
                  if (props && props.buttons) {
                    controlsInfo.buttonsEnabled = true;
                  }
                  if (props && props.dots) {
                    controlsInfo.dotsEnabled = true;
                  }

                  _updateControlsInfo();
                  _createControls(controlsInfo.dotsEnabled);
                  _render();
                } else {
                  console.log(
                    "The slider layout is set incorrectly. Check that all required classes 'slider/slider-content/slider-wrapper/slider-content__item' are present"
                  );
                }
              }

              function _updateControlsInfo() {
                const { current, min, max } = itemsInfo.position;
                controlsInfo.prevButtonDisabled = current > min ? false : true;
                controlsInfo.nextButtonDisabled = current < max ? false : true;
              }

              // Creating markup elements
              function _createControls(dots = false) {
                //Wrapper for controls
                sliderContent.append(sliderContentControls);

                // Controls
                createArrows();
                dots ? createDots() : null;

                // Arrows function
                function createArrows() {
                  const dValueLeftArrow =
                    'M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z';
                  const dValueRightArrow =
                    'M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z';
                  const leftArrowSVG = createSVG(dValueLeftArrow);
                  const rightArrowSVG = createSVG(dValueRightArrow);

                  leftArrow = createHTMLElement('div', 'prev-arrow', null);
                  leftArrow.append(leftArrowSVG);
                  leftArrow.addEventListener('click', () =>
                    updateItemsInfo(itemsInfo.position.current - 1)
                  );

                  rightArrow = createHTMLElement('div', 'next-arrow', null);
                  rightArrow.append(rightArrowSVG);
                  rightArrow.addEventListener('click', () =>
                    updateItemsInfo(itemsInfo.position.current + 1)
                  );

                  sliderContentControls.append(leftArrow, rightArrow);

                  // SVG function
                  function createSVG(dValue: any, color = 'currentColor') {
                    const svg = document.createElementNS(
                      'http://www.w3.org/2000/svg',
                      'svg'
                    );
                    svg.setAttribute('viewBox', '0 0 256 512');
                    const path = document.createElementNS(
                      'http://www.w3.org/2000/svg',
                      'path'
                    );
                    path.setAttribute('fill', color);
                    path.setAttribute('d', dValue);
                    svg.appendChild(path);
                    return svg;
                  }
                }

                // Dots function
                function createDots() {
                  dotsWrapper = createHTMLElement('div', 'dots', null);
                  for (let i = 0; i < itemsInfo.position.max + 1; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.addEventListener('click', function () {
                      updateItemsInfo(i);
                    });
                    dotsWrapper.append(dot);
                  }
                  sliderContentControls.append(dotsWrapper);
                }
              }

              // Set a class for controls (buttons, arrows)
              function setClass(options: any) {
                if (options) {
                  options.forEach((props: any) => {
                    if (props?.element) {
                      props?.disabled
                        ? props?.element.classList.add(props?.className)
                        : props?.element.classList.remove(props?.className);
                    } else {
                      console.log(
                        'Error: function setClass(): element = ',
                        props?.element
                      );
                    }
                  });
                }
              }

              // Update slider values
              function updateItemsInfo(value: any) {
                itemsInfo.update(value);
                _slideItem(true);
              }

              // Show items
              const _render = () => {
                const { prevButtonDisabled, nextButtonDisabled } = controlsInfo;
                let controlsArray = [
                  {
                    element: leftArrow,
                    className: 'd-none',
                    disabled: prevButtonDisabled
                  },
                  {
                    element: rightArrow,
                    className: 'd-none',
                    disabled: nextButtonDisabled
                  }
                ];
                if (controlsInfo.buttonsEnabled) {
                  controlsArray = [...controlsArray];
                }

                //Showing/hiding controls
                setClass(controlsArray);

                //Moving the slider
                sliderWrapper.style.transform =
                  'translateX(' + itemsInfo.offset * 100 + '%)';

                // Set the active element for dots
                if (controlsInfo.dotsEnabled) {
                  if (this.querySelector('.dot--active')) {
                    this.querySelector('.dot--active').classList.remove(
                      'dot--active'
                    );
                  }
                  dotsWrapper.children[
                    itemsInfo.position.current
                  ].classList.add('dot--active');
                }
              };

              // Move slide
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              function _slideItem(autoMode = false) {
                // console.log(autoMode);
                // if (autoMode && intervalId) {
                //   clearInterval(intervalId);
                // }
                _updateControlsInfo();
                _render();
              }

              // Create HTML markup for an element
              function createHTMLElement(
                tagName = 'div',
                className: any,
                innerHTML: any
              ) {
                const element = document.createElement(tagName);
                className ? (element.className = className) : null;
                innerHTML ? (element.innerHTML = innerHTML) : null;
                return element;
              }

              // Available Methods
              return { init };
            })();

            const sliderControls = this.querySelector(
              '.slider-content__controls'
            );
            if (!sliderControls) {
              slider.init({
                // intervalSpeed: 1000,
                currentItem: 0,
                buttons: true,
                dots: true
              });
            }
          }
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.REVIEWS
          ) {
            return {
              type: Types.REVIEWS
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const comps = this.model.get('components');
        if (!comps.length) {
          comps.reset();
          const reviewConfig = cloneDeep(this.model.get('reviewConfig'));
          const sliderComponent = this.getSliderComponent(reviewConfig);
          this.model.addAttributes({ reviewConfig });
          comps.add(sliderComponent);
        }
        this.listenTo(
          this.model,
          'change:attributes:reviewConfig',
          this.updateSlides
        );
        const props = ['sliderWidth', 'customReview'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.handlePropertyChange);
      },
      handlePropertyChange() {
        if ('sliderWidth' in this.model.changed) {
          const wrapper = this.model.find('.slider-content')[0];
          if (!wrapper.attributes.attributes.id) {
            wrapper.resetId();
          }
          const id = wrapper.attributes.attributes.id;
          updateStyle(
            editor,
            id,
            {
              width: `calc( ${this.model.changed['sliderWidth']}% - 40px );`
            },
            true
          );
        }
        if ('customReview' in this.model.changed) {
          const customReview = this.model.get('customReview');
          const reviewConfig = [...this.model.getAttributes()['reviewConfig']];
          const index = reviewConfig.findIndex(
            (c: any) => c.id === customReview.id
          );
          reviewConfig[index].name = customReview.review.name;
          reviewConfig[index].reviewText = customReview.review.description;
          reviewConfig[index].rating = customReview.review.ratings;
          const svg = getIcon(customReview.review.handleName, customReview.id);
          reviewConfig[index].icon = svg;
          this.model.setAttributes({ reviewConfig });
          this.model.updateTrait('reviewConfig', {
            ...this.model.getTrait('reviewConfig'),
            options: reviewConfig
          });
        }
      },
      getSliderComponent(reviewConfig: any, generateIds: any = true) {
        let slides = '';
        let styles = '';
        reviewConfig.forEach((option: any) => {
          if (generateIds) {
            const id = nextUniqueId();
            option['id'] = id;
            option.icon = option.icon
              .replace('SVG_ID', id)
              .replace('SVG_CLASS', id);
          }
          slides += this.getSlide(option);
          styles += this.getSlideStyle(option);
        });
        return `<div class="slider-content" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
              <div class="slider-content-wrapper" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
                ${slides}
              </div>
            </div>
            <style>
              ${styles}
            </style>`;
      },
      getSlide(option: any) {
        const hasRating =
          !isNaN(parseFloat(option.rating)) && parseFloat(option.rating) != 0;
        const ratingElement = hasRating
          ? `<div data-gjs-draggable="false" data-gjs-selectable="false" data-rating="${option.rating}" id="slide-header-rating-${option.id}" class="slide-header-rating-${option.id} slide-header-rating">
            <span class="slide-stars" role="img">
              <span class="slide-stars-inner" role="img"></span>
            </span>
          </div>`
          : '';
        return `<div data-gjs-draggable="false" data-gjs-selectable="false" data-js-id="${option.id}" data-gjs-hoverable="false" class="slider-content__item review-${option.id}" >
                <div class="data-container" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
                  <div class="slide-header">
                    <div class="slide-header-inner">
                      <div data-gjs-type="text" id="slide-header-name-${option.id}" class="slide-header-name-${option.id} slide-header-name">${option.name}</div>
                      ${ratingElement}
                      <div data-gjs-type="text" id="slide-header-title-${option.id}" class="slide-header-title-${option.id} slide-header-title">${option.title}</div>
                    </div>
                    <div id="slide-header-title-${option.id}" class="slide-header-icon-${option.id} slide-header-icon">
                      ${option.icon}
                    </div>
                  </div>
                  <div class="slide-footer">
                    <div data-gjs-type="text" id="slide-review-text-${option.id}" class="slide-review-text-${option.id} slide-review-text">${option.reviewText}</div>
                  </div>
                </div>
            </div>`;
      },
      getSlideStyle(option: any) {
        const hasRating =
          !isNaN(parseFloat(option.rating)) && parseFloat(option.rating) != 0;
        const ratingStyle = hasRating
          ? `.slide-header-rating-${option.id} .slide-stars-inner {
                width: calc(calc(12px + 2px) * ${option.rating} + calc(12px / 2) * 0) !important;
            }`
          : '';
        return `
            .review-${option.id} {
              background-color: ${option.bgColor};
            }
            ${ratingStyle}
        `;
      },
      updateSlides() {
        if ('open' in this.model.changed && !this.model.changed['open']) {
          return;
        }
        const comps = this.model.get('components');
        if (comps.length > 0) {
          comps.reset();
        }
        const reviewConfig = this.model.getAttributes()['reviewConfig'];
        const sliderComponent = this.getSliderComponent(reviewConfig, false);
        comps.add(sliderComponent);
        this.updateScript();
      }
    })
  });

  domc.addType(Types.CAROUSEL, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          draggable: true,
          stylable: [],
          layerable: false,
          styles: getSliderStyles('carousel'),
          sliderHeight: 230,
          swipeSlides: 1,
          traits: [
            {
              label: 'Carousel Config',
              name: 'carouselConfig',
              changeProp: 1,
              type: TRAIT_TYPES.CAROUSEL_CONFIG
            },
            {
              label: 'Height',
              name: 'sliderHeight',
              type: 'number',
              changeProp: 1,
              min: 100,
              max: 1000
            },
            {
              label: 'Items',
              name: 'swipeSlides',
              type: 'number',
              changeProp: 1,
              min: 1,
              max: 4
            }
          ],
          script: function () {
            const slider = (() => {
              const slider = this;
              const sliderContent = this.querySelector('.slider-content');
              const sliderWrapper: HTMLElement = this.querySelector(
                '.slider-content-wrapper'
              );
              const elements = this.querySelectorAll('.slider-content__item');
              const sliderContentControls = createHTMLElement(
                'div',
                'slider-content__controls',
                null
              );
              let dotsWrapper: any = null;
              let leftArrow: any = null;
              let rightArrow: any = null;
              // let intervalId: any = null; //identifier setInterval

              // data
              const itemsInfo = {
                offset: 0,
                position: {
                  current: 0,
                  min: 0,
                  max: elements.length - 1
                },
                intervalSpeed: 4000,

                update: function (value: any) {
                  this.position.current = value;
                  this.offset = -value;
                },
                reset: function () {
                  this.position.current = 0;
                  this.offset = 0;
                }
              };

              const controlsInfo = {
                buttonsEnabled: false,
                dotsEnabled: false,
                prevButtonDisabled: true,
                nextButtonDisabled: false
              };

              function init(props: any) {
                let { intervalSpeed, offset } = itemsInfo;
                const { position } = itemsInfo;

                if (slider && sliderContent && sliderWrapper && elements) {
                  if (props && props.intervalSpeed) {
                    intervalSpeed = props.intervalSpeed;
                    console.log(intervalSpeed);
                  }
                  if (props && props.currentItem) {
                    if (
                      parseInt(props.currentItem) >= position.min &&
                      parseInt(props.currentItem) <= position.max
                    ) {
                      position.current = props.currentItem;
                      offset = -props.currentItem;
                      console.log(offset);
                    }
                  }
                  if (props && props.buttons) {
                    controlsInfo.buttonsEnabled = true;
                  }
                  if (props && props.dots) {
                    controlsInfo.dotsEnabled = true;
                  }

                  _updateControlsInfo();
                  _createControls(controlsInfo.dotsEnabled);
                  _render();
                } else {
                  console.log(
                    "The slider layout is set incorrectly. Check that all required classes 'slider/slider-content/slider-wrapper/slider-content__item' are present"
                  );
                }
              }

              function _updateControlsInfo() {
                const { current, min, max } = itemsInfo.position;
                // account for the first slide which
                console.log(itemsInfo.position);
                controlsInfo.prevButtonDisabled = current > min ? false : true;
                controlsInfo.nextButtonDisabled = current < max ? false : true;
              }

              // Creating markup elements
              function _createControls(dots = false) {
                //Wrapper for controls
                sliderContent.append(sliderContentControls);

                // Controls
                createArrows();
                dots ? createDots() : null;

                // Arrows function
                function createArrows() {
                  const dValueLeftArrow =
                    'M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z';
                  const dValueRightArrow =
                    'M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z';
                  const leftArrowSVG = createSVG(dValueLeftArrow);
                  const rightArrowSVG = createSVG(dValueRightArrow);

                  leftArrow = createHTMLElement('div', 'prev-arrow', null);
                  leftArrow.append(leftArrowSVG);
                  leftArrow.addEventListener('click', () =>
                    updateItemsInfo(itemsInfo.position.current - 1)
                  );

                  rightArrow = createHTMLElement('div', 'next-arrow', null);
                  rightArrow.append(rightArrowSVG);
                  rightArrow.addEventListener('click', () =>
                    updateItemsInfo(itemsInfo.position.current + 1)
                  );

                  sliderContentControls.append(leftArrow, rightArrow);

                  // SVG function
                  function createSVG(dValue: any, color = 'currentColor') {
                    const svg = document.createElementNS(
                      'http://www.w3.org/2000/svg',
                      'svg'
                    );
                    svg.setAttribute('viewBox', '0 0 256 512');
                    const path = document.createElementNS(
                      'http://www.w3.org/2000/svg',
                      'path'
                    );
                    path.setAttribute('fill', color);
                    path.setAttribute('d', dValue);
                    svg.appendChild(path);
                    return svg;
                  }
                }

                // Dots function
                function createDots() {
                  dotsWrapper = createHTMLElement('div', 'dots', null);
                  for (let i = 0; i < itemsInfo.position.max + 1; i++) {
                    const dot = document.createElement('div');
                    dot.className = 'dot';
                    dot.addEventListener('click', function () {
                      updateItemsInfo(i);
                    });
                    dotsWrapper.append(dot);
                  }
                  sliderContentControls.append(dotsWrapper);
                }
              }

              // Set a class for controls (buttons, arrows)
              function setClass(options: any) {
                if (options) {
                  options.forEach((props: any) => {
                    if (props?.element) {
                      props?.disabled
                        ? props?.element.classList.add(props?.className)
                        : props?.element.classList.remove(props?.className);
                    } else {
                      console.log(
                        'Error: function setClass(): element = ',
                        props?.element
                      );
                    }
                  });
                }
              }

              // Update slider values
              function updateItemsInfo(value: any) {
                itemsInfo.update(value);
                _slideItem(true);
              }

              // Show items
              const _render = () => {
                const { prevButtonDisabled, nextButtonDisabled } = controlsInfo;
                let controlsArray = [
                  {
                    element: leftArrow,
                    className: 'd-none',
                    disabled: prevButtonDisabled
                  },
                  {
                    element: rightArrow,
                    className: 'd-none',
                    disabled: nextButtonDisabled
                  }
                ];
                if (controlsInfo.buttonsEnabled) {
                  controlsArray = [...controlsArray];
                }

                //Showing/hiding controls
                setClass(controlsArray);

                //Moving the slider
                sliderWrapper.style.transform =
                  'translateX(' + itemsInfo.offset * 100 + '%)';

                // Set the active element for dots
                if (controlsInfo.dotsEnabled) {
                  if (this.querySelector('.dot--active')) {
                    this.querySelector('.dot--active').classList.remove(
                      'dot--active'
                    );
                  }
                  dotsWrapper.children[
                    itemsInfo.position.current
                  ]?.classList.add('dot--active');
                }
              };

              // Move slide
              function _slideItem(autoMode = false) {
                console.log(autoMode);
                // if (autoMode && intervalId) {
                //   clearInterval(intervalId);
                // }
                _updateControlsInfo();
                _render();
              }

              // Create HTML markup for an element
              function createHTMLElement(
                tagName = 'div',
                className: any,
                innerHTML: any
              ) {
                const element = document.createElement(tagName);
                className ? (element.className = className) : null;
                innerHTML ? (element.innerHTML = innerHTML) : null;
                return element;
              }

              // Available Methods
              return { init };
            })();

            const sliderControls = this.querySelector(
              '.slider-content__controls'
            );
            if (!sliderControls) {
              slider.init({
                // intervalSpeed: 1000,
                currentItem: 0,
                buttons: true,
                dots: true
              });
            }
            const c = '{[ carouselConfig ]}';
            const carouselConfig =
              JSON.parse(c)?.filter(
                (c: any) => c.type === 'video' && c.videoSrc !== ''
              ) ?? [];
            let curIndex = 0;
            const overlay = createHTMLElement('div', 'overlay');
            const iframe = createHTMLElement('iframe');
            iframe.setAttribute('allowfullscreen', 'true');
            iframe.setAttribute('frameborder', '0');
            iframe.setAttribute('width', '640');
            iframe.setAttribute('height', '360');
            const leftArrow = createHTMLElement(
              'div',
              null,
              'prev-arrow',
              null
            );
            const rightArrow = createHTMLElement(
              'div',
              null,
              'next-arrow',
              null
            );
            const buttons = createHTMLElement(
              'div',
              null,
              'overlay-btns',
              null
            );
            const createArrows = () => {
              const dValueLeftArrow =
                'M31.7 239l136-136c9.4-9.4 24.6-9.4 33.9 0l22.6 22.6c9.4 9.4 9.4 24.6 0 33.9L127.9 256l96.4 96.4c9.4 9.4 9.4 24.6 0 33.9L201.7 409c-9.4 9.4-24.6 9.4-33.9 0l-136-136c-9.5-9.4-9.5-24.6-.1-34z';
              const dValueRightArrow =
                'M224.3 273l-136 136c-9.4 9.4-24.6 9.4-33.9 0l-22.6-22.6c-9.4-9.4-9.4-24.6 0-33.9l96.4-96.4-96.4-96.4c-9.4-9.4-9.4-24.6 0-33.9L54.3 103c9.4-9.4 24.6-9.4 33.9 0l136 136c9.5 9.4 9.5 24.6.1 34z';
              const leftArrowSVG = createSVG(dValueLeftArrow);
              const rightArrowSVG = createSVG(dValueRightArrow);

              const updateOverlayIframe = (index: number) => {
                iframe.style.display = 'none';
                if (index < 0 || index >= carouselConfig.length) {
                  index = 0;
                }
                curIndex = index;
                iframe.setAttribute('src', carouselConfig[curIndex].videoLink);
                iframe.setAttribute(
                  'data-video-id',
                  carouselConfig[curIndex].id
                );
                fadeIn(iframe);
              };

              leftArrow.append(leftArrowSVG);
              leftArrow.addEventListener('click', (e: any) => {
                updateOverlayIframe(curIndex - 1);
                e.stopPropagation();
              });

              rightArrow.append(rightArrowSVG);
              rightArrow.addEventListener('click', (e: any) => {
                updateOverlayIframe(curIndex + 1);
                e.stopPropagation();
              });
            };
            const createButtons = () => {
              const dValueCloseIcon =
                'M742 167L500 408 258 167C246 154 233 150 217 150 196 150 179 158 167 167 154 179 150 196 150 212 150 229 154 242 171 254L408 500 167 742C138 771 138 800 167 829 196 858 225 858 254 829L496 587 738 829C750 842 767 846 783 846 800 846 817 842 829 829 842 817 846 804 846 783 846 767 842 750 829 737L588 500 833 258C863 229 863 200 833 171 804 137 775 137 742 167Z';

              const closeIcon = createSVG(dValueCloseIcon, '0 0 1000 1000');
              const closeButton = createHTMLElement(
                'div',
                null,
                'overlay-close',
                null
              );
              closeButton.append(closeIcon);
              buttons.append(closeButton);
              closeButton.addEventListener('click', (e: any) => {
                fadeOut(overlay);
                e.stopPropagation();
              });
            };
            createArrows();
            createButtons();
            // Add overlay
            overlay.append(iframe);
            overlay.prepend(leftArrow);
            overlay.append(rightArrow);
            overlay.append(buttons);
            this.append(overlay);

            overlay.style.display = 'none';

            carouselConfig.forEach((config: any, index: number) => {
              this.querySelector(
                `[data-js-id="${config.id}"] .content-item-overlay`
              ).addEventListener('click', (e: any) => {
                e.preventDefault();
                curIndex = index;
                iframe.setAttribute('src', config.videoLink);
                iframe.setAttribute('data-video-id', config.id);
                // Fade in the overlay
                fadeIn(overlay);
              });
            });

            overlay.addEventListener('click', (e: any) => {
              e.preventDefault();
              fadeOut(overlay);
              iframe.setAttribute('src', '');
            });

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

            function createSVG(
              dValue: any,
              viewBox = '0 0 256 512',
              color = 'currentColor'
            ) {
              const svg = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'svg'
              );
              svg.setAttribute('viewBox', viewBox);
              const path = document.createElementNS(
                'http://www.w3.org/2000/svg',
                'path'
              );
              path.setAttribute('fill', color);
              path.setAttribute('d', dValue);
              svg.appendChild(path);
              return svg;
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
          }
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.CAROUSEL
          ) {
            return {
              type: Types.CAROUSEL
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const comps = this.model.get('components');
        if (!comps.length) {
          comps.reset();
          const carouselConfig = cloneDeep(defaultCarouselOptions) || [];
          const carouselComponent = this.getCarouselComponent(carouselConfig);
          this.model.set('carouselConfig', carouselConfig);
          comps.add(carouselComponent);
        }
        this.listenTo(this.model, 'change:carouselConfig', this.updateSlides);
        const props = ['sliderHeight', 'swipeSlides'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.handlePropertyChange);
      },
      handlePropertyChange() {
        if ('sliderHeight' in this.model.changed) {
          const wrapper = this.model.find('.slider-content-wrapper')[0];
          if (!wrapper.attributes.attributes.id) {
            wrapper.resetId();
          }
          const id = wrapper.attributes.attributes.id;
          updateStyle(
            editor,
            id,
            {
              height: this.model.changed['sliderHeight'] + 'px'
            },
            true
          );
        }

        if ('swipeSlides' in this.model.changed) {
          const wrapper = this.model.find('.slider-content-wrapper')[0];
          if (!wrapper.attributes.attributes.id) {
            wrapper.resetId();
          }
          const id = wrapper.attributes.attributes.id;
          const swipeSlides: number = this.model.changed['swipeSlides'];
          const noOfSlidesInView = swipeSlides ? 100 / swipeSlides : 100;
          updateStyle(
            editor,
            id,
            {
              width: noOfSlidesInView + '%'
            },
            true
          );
          this.updateScript();
        }
      },
      getCarouselComponent(carouselConfig: any, generateIds: any = true) {
        let slides = '';
        carouselConfig.forEach((option: any) => {
          if (generateIds) {
            option['id'] = nextUniqueId();
          }
          slides += this.getSlide(option);
        });
        return `<div class="slider-content" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
              <div class="slider-content-wrapper" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
                ${slides}
              </div>
            </div>`;
      },
      getSlide(option: any) {
        return `<div data-gjs-draggable="false" data-gjs-selectable="false" data-js-id="${
          option.id
        }" data-gjs-hoverable="false" class="slider-content__item">
                <div class="data-container" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
                  <div role="img" class="slide-content slide-content-${
                    option.id
                  }" data-js-id="${option.id}" ${
          option.videoLink ? `data-lightbox-video="${option.videoLink}"` : ''
        } data-gjs-draggable="false" data-gjs-selectable="true" data-gjs-hoverable="false" 
        data-gjs-removable="false" data-gjs-copyable="false" data-gjs-editable="false">
                    ${
                      option.type === CAROUSEL_TYPE.VIDEO
                        ? `<div data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false" class="slide-content-play">
                        <svg data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false" data-gjs-type="svg" aria-hidden="true" class="e-font-icon-svg e-eicon-play" viewBox="0 0 1000 1000" xmlns="http://www.w3.org/2000/svg">
                        <path data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false" data-gjs-type="svg-in" d="M838 162C746 71 633 25 500 25 371 25 258 71 163 162 71 254 25 367 25 500 25 633 71 746 163 837 254 929 367 979 500 979 633 979 746 933 838 837 929 746 975 633 975 500 975 367 929 254 838 162M808 192C892 279 933 379 933 500 933 621 892 725 808 808 725 892 621 938 500 938 379 938 279 896 196 808 113 725 67 621 67 500 67 379 108 279 196 192 279 108 383 62 500 62 621 62 721 108 808 192M438 392V642L642 517 438 392Z">
                        </path
                        </svg>
                        </div>`
                        : ''
                    }
                  </div>
                </div>
                ${
                  option.videoSrc
                    ? '<div class="content-item-overlay" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false"></div>'
                    : ''
                }
            </div>`;
      },
      updateSlides() {
        if ('open' in this.model.changed && !this.model.changed['open']) {
          return;
        }
        const comps = this.model.get('components');
        if (comps.length > 0) {
          comps.reset();
        }
        const carouselConfig = this.model.get('carouselConfig');
        const slidesNo = this.model
          .get('traits')
          .where({ name: 'swipeSlides' })[0]
          .get('value');

        const slidesHeight = this.model
          .get('traits')
          .where({ name: 'sliderHeight' })[0]
          .get('value');
        const carouselComponent = this.getCarouselComponent(
          carouselConfig,
          false
        );
        comps.add(carouselComponent);
        const wrapper = this.model.find('.slider-content-wrapper')[0];
        if (!wrapper.attributes.attributes.id) {
          wrapper.resetId();
        }
        const id = wrapper.attributes.attributes.id;
        updateStyle(
          editor,
          id,
          {
            height: slidesHeight + 'px'
          },
          true
        );
        updateStyle(
          editor,
          id,
          {
            width: slidesNo ? 100 / slidesNo + '%' : 100 + '%'
          },
          true
        );
        this.updateScript();
      }
    })
  });

  domc.addType(Types.HTML, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          stylable: [],
          traits: [
            {
              label: 'HTML Config',
              name: 'htmlConfig',
              changeProp: 1,
              type: TRAIT_TYPES.HTML_CONFIG
            }
          ]
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.HTML
          ) {
            return {
              type: Types.HTML
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const comps = this.model.get('components');
        if (!comps.length) {
          comps.reset();
          comps.add(
            `<div class="gjs-html-inner" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
              Html Code
            </div>`
          );
        }
        const props = ['html'];
        const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        this.listenTo(this.model, reactTo, this.updateHtml);
      },
      updateHtml() {
        const htmlwrapper = this.model.find('.gjs-html-inner')[0];
        if (htmlwrapper) {
          // $(htmlwrapper.view.el).html(this.model.get('html'));
          const componentWrapper = htmlwrapper.get('components');
          componentWrapper.reset();
          componentWrapper.add(this.model.get('html'));
        }
      }
    })
  });

  domc.addType(Types.ACCORDION, {
    model: defaultModel.extend(
      {
        defaults: {
          ...defaultModel.prototype.defaults,
          droppable: false,
          stylable: [],
          traits: [
            {
              label: 'Accordion Config',
              name: 'accordionConfig',
              changeProp: 1,
              type: TRAIT_TYPES.ACCORDION_CONFIG
            }
          ],
          script: function () {
            this.querySelectorAll('.accordion-item').forEach((item: any) => {
              item
                .querySelector('.accordion-item-header')
                .addEventListener('click', () => {
                  const openElement = this.querySelector(
                    '.accordion-item.open'
                  );
                  if (openElement && openElement != item) {
                    openElement.classList.toggle('open');
                  }
                  item.classList.toggle('open');
                });
            });
          }
        }
      },
      {
        isComponent(el: any) {
          if (
            el.getAttribute &&
            el.getAttribute('data-gjs-type') == Types.ACCORDION
          ) {
            return {
              type: Types.ACCORDION
            };
          }
          return null;
        }
      }
    ),

    view: defaultView.extend({
      init() {
        const comps = this.model.get('components');
        if (!comps.length) {
          comps.reset();
          const accordionConfig = cloneDeep(defaultAccordianOptions) || [];
          const accordionComponent =
            this.getAccordionComponent(accordionConfig);
          this.model.set('accordionConfig', accordionConfig);
          comps.add(accordionComponent);
        }
        this.listenTo(
          this.model,
          'change:accordionConfig',
          this.updateAccordion
        );
        // const props = ['html'];
        // const reactTo = props.map((prop) => `change:${prop}`).join(' ');
        // this.listenTo(this.model, reactTo, this.updateHtml);
      },
      getAccordionComponent(
        accordionConfig: any[],
        generateIds: boolean = true
      ) {
        const accordions = accordionConfig
          .map((option) => {
            if (generateIds) {
              option['id'] = nextUniqueId();
            }
            return this.getAccordionHtml(option);
          })
          .join('');
        return `
        <div class="gjs-accordion-inner" data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false">
          <div class="accordion">
            ${accordions}
          </div>
        </div>
        
        <style>
          .gjs-accordion-inner {
            padding: 20px;
          }
          
          .accordion {
          }
          
          .accordion .accordion-item {
            background-color: #f1f1f1;
            border: 2px solid #d5d8dc;
            border-radius: 5px;
          }

          .accordion .accordion-item+.accordion-item {
            border-top: none;
          }
          
          .accordion .accordion-item.open .accordion-item-description-wrapper {
            border-top: 2px solid #d5d8dc;
          }
          
          .accordion .accordion-item .accordion-item-header {
            padding: 15px 20px;
            cursor: pointer;
          }

          .accordion .accordion-item .accordion-item-header .accordion-icon-left {
            float: left;
            text-align: left;
            width: 1.5rem;
            display: inline-block;
          }

          .accordion .accordion-item .accordion-item-header .accordion-icon-right {
            float: right;
            text-align: right;
            display: inline-block;
          }
          
          .accordion .accordion-item .accordion-item-header .accordion-item-header-title {
            display: inline-block;
            font-weight: 600;
          }
          
          .accordion .accordion-item .accordion-item-header .accordion-item-header-icon {
            transition: all 0.2s ease;
          }
          
          .accordion
            .accordion-item.open
            .accordion-item-header
            .accordion-item-header-icon {
            transform: rotate(-180deg);
          }
          
          .accordion .accordion-item .accordion-item-description-wrapper {
            display: grid;
            grid-template-rows: 0fr;
            overflow: hidden;
            transition: all 0.2s ease;
          }
          
          .accordion .accordion-item.open .accordion-item-description-wrapper {
            grid-template-rows: 1fr;
          }
          
          .accordion
            .accordion-item
            .accordion-item-description-wrapper
            .accordion-item-description {
            min-height: 0;
          }
          
          .accordion
            .accordion-item
            .accordion-item-description-wrapper
            .accordion-item-description
            p {
            padding: 15px 20px;
            margin-block-start: 0;
            margin-block-end: 0.9rem;
            line-height: 1.5;
          }
        
        </style>`;
      },
      getAccordionHtml(option: any) {
        const defaultGJSAttrs =
          'data-gjs-draggable="false" data-gjs-selectable="false" data-gjs-hoverable="false"';
        return `<div class="accordion-item" ${defaultGJSAttrs}>
          <div class="accordion-item-header" ${defaultGJSAttrs}>
            <span class="accordion-icon-${option.iconPosition}" ${defaultGJSAttrs}>
              <svg ${defaultGJSAttrs} data-gjs-type="svg" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-chevron-down accordion-item-header-icon">
                <path ${defaultGJSAttrs} data-gjs-type="svg-in" d="m6 9 6 6 6-6" />
              </svg>
            </span>
            <div class="accordion-item-header-title" ${defaultGJSAttrs}>${option.title}</div>
          </div>
          <div class="accordion-item-description-wrapper" ${defaultGJSAttrs}>
            <div class="accordion-item-description" ${defaultGJSAttrs}>
              <p ${defaultGJSAttrs}>${option.content}</p>
            </div>
          </div>
        </div>`;
      },
      updateAccordion() {
        if ('open' in this.model.changed && !this.model.changed['open']) {
          return;
        }
        const comps = this.model.get('components');
        if (comps.length > 0) {
          comps.reset();
        }
        const accordionConfig = this.model.get('accordionConfig');
        comps.add(this.getAccordionComponent(accordionConfig, false));
        this.updateScript();
      }
    })
  });
}
