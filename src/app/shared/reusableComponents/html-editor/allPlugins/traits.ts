import { CAROUSEL_TYPE, TRAIT_TYPES } from '../pluginsConfig/constants';
import {
  getStyleByClass,
  nextUniqueId,
  parseMediaFromUrl,
  rgb2hex,
  updateStyle
} from './utils';

import * as ace from 'ace-builds';
import 'ace-builds/src-noconflict/mode-html';
import 'ace-builds/src-noconflict/theme-merbivore';
import 'ace-builds/src-noconflict/ext-language_tools';
import 'ace-builds/src-noconflict/snippets/html';
import { debounce } from 'lodash';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export default function (editor: any, opt: any = {}) {
  const traits = editor.TraitManager;
  const icons = opt.icons;
  const sliderDefaultOption = {
    bgColor: '#bbbbbb',
    bgImage: '',
    headingText: 'Slide Heading',
    descriptionText:
      'Lorem ipsum dolor sit amet consectetur adipiscing elit dolor',
    btnText: 'Click Here'
  };

  const reviewDefaultOption = {
    name: 'John Doe',
    title: '@username',
    rating: '0.0',
    icon: '<svg id="SVG_ID" class="SVG_CLASS" data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 488 512"><path data-gjs-type="svg-in" draggable="false" d="M488 261.8C488 403.3 391.1 504 248 504 110.8 504 0 393.2 0 256S110.8 8 248 8c66.8 0 123 24.5 166.3 64.9l-67.5 64.9C258.5 52.6 94.3 116.6 94.3 256c0 86.5 69.1 156.6 153.7 156.6 98.2 0 135-70.4 140.8-106.9H248v-85.3h236.1c2.3 12.7 3.9 24.9 3.9 41.4z"/></svg>',
    reviewText:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
    bgColor: '#ffffff'
  };

  const carouselDefaultOption = {
    type: CAROUSEL_TYPE.IMAGE,
    imgSrc: '',
    videoSrc: '',
    videoLink: ''
  };

  const accordionDefaultOption = {
    title: 'New Accordion Title',
    content:
      'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Ut elit tellus, luctus nec ullamcorper mattis, pulvinar dapibus leo.',
    iconPosition: 'left'
  };

  traits.addType(TRAIT_TYPES.SLIDER_CONFIG, {
    noLabel: true,
    // Expects as return a simple HTML string or an HTML element
    createInput({ trait }: any) {
      const sliderConfig =
        this.target.view.model.getAttributes()['sliderConfig'];
      const traitOpts = sliderConfig ? [...sliderConfig] : trait.get('options');
      this.sliderConfig = traitOpts;

      const getSlideHtml = (config: any) => {
        return `<div class="slider-slides-row">
          <button class="slider-button-title btn-title-${config.id}">${
          config.headingText
        }</button>
          <button class="slider-button-icon remove-slide"><span> <i class="fa fa-remove" aria-hidden="true"></i> </span></button>
        </div>
        <div class="slider-slide-settings p-2">
          <div class="flex justify-content-between align-items-center">
            <label>Color</label>
            <input class="slide-bg-color bg-color-${config.id}" data-js-id="${
          config.id
        }" type="color"/ value="${config.bgColor}">
          </div>
          <div>
            <label class="mb-1">Image</label>
            <div class="gjs-control-media__content gjs-control-tag-area gjs-control-preview-area">
              <div class="gjs-control-media-area">
                  <div class="gjs-control-media__preview" ${
                    config.bgImage
                      ? `style="background-image: url(${config.bgImage});"`
                      : ''
                  }></div>
              </div>
              <div class="gjs-control-overlay" data-js-id="${config.id}">
                <div class="gjs-control-media__remove gjs-control-media__content__remove ${
                  config.bgImage ? '' : 'd-none'
                }" title="Remove" data-js-id="${config.id}">
                    <i class="eicon-trash-o fa fa-trash" aria-hidden="true"></i>
                </div>
              </div>
              <div class="gjs-control-media-upload-button gjs-control-media__content__upload-button ${
                config.bgImage ? 'd-none' : ''
              }">
                  <i class="eicon-plus-circle fa fa-plus" aria-hidden="true"></i>
              </div>
              <div class="gjs-control-media__tools gjs-control-dynamic-switcher-wrapper">
                  <div class="gjs-control-media__tool gjs-control-media__replace" data-media-type="image">Choose
                      Image</div>
              </div>
            </div>
          </div>
        </div>`;
      };

      let slides = '';
      traitOpts.forEach((option: any) => {
        slides += `
        <div class="slider-slides-row-wrapper mb-2" data-js-id="${option.id}">
            ${getSlideHtml(option)}
          </div>
        `;
      });

      // Create a new element container and add some content
      const el = document.createElement('div');
      el.classList.add('p-2');

      el.innerHTML = `
      <label class="my-2"><span>Slides</span></label>
      <div class="slider-slides-list">
          <div class="slider-slides-rows">
              ${slides}
          </div>
          <div class="slider-add-slide">
            <button class="slider-add-slide-btn"> <i class="fa fa-plus mr-1" aria-hidden="true"></i> Add Item </button>
          </div>
      </div>`;

      const chooseImageHandler = (e: any) => {
        const id = e.target.getAttribute('data-js-id');
        this.model.set('idForImageChange', id);
        if (this.model.changed['src'] === '') {
          delete this.model.changed['src'];
        }
        editor.runCommand('open-assets', {
          target: this.model,
          types: ['image'],
          accept: 'image/*',
          onSelect: () => {
            editor.Modal.close();
            editor.AssetManager.setTarget(null);
          }
        });
      };

      const removeImageHandler = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const id = e.target.parentElement.getAttribute('data-js-id');
        const mediaWrapper = e.target.closest(
          '.gjs-control-media__content.gjs-control-preview-area'
        );
        mediaWrapper.querySelector(
          '.gjs-control-media__preview'
        ).style.backgroundImage = '';
        mediaWrapper
          .querySelector('.gjs-control-media__content__remove')
          .classList.add('d-none');
        mediaWrapper
          .querySelector('.gjs-control-media__content__upload-button')
          .classList.remove('d-none');
        const sliderConfig: any[] = this.sliderConfig;
        const index = sliderConfig.findIndex((c: any) => c.id === id);
        sliderConfig[index].bgImage = '';
        updateStyle(editor, `image-${id}`, {
          'background-image': ''
        });
      };

      // handler for settings area toggle
      const toggleSlideSettings = (e: any) => {
        e.preventDefault();
        const isCurrentElementAndOpen =
          e.target.parentElement.nextElementSibling.classList.contains(
            'editable'
          );
        const openSettings = el.querySelector(
          '.slider-slide-settings.editable'
        );
        if (openSettings) {
          openSettings.classList.remove('editable');
        }
        if (!isCurrentElementAndOpen) {
          e.target.parentElement.nextElementSibling.classList.add('editable');
        }
      };

      const removeIconHandler = (e: any) => {
        const curRow = e.currentTarget.closest('.slider-slides-row-wrapper');
        const id = curRow.getAttribute('data-js-id');
        curRow.remove();
        const sliderConfig = [...this.sliderConfig];
        const index = sliderConfig.findIndex((c: any) => c.id === id);
        sliderConfig.splice(index, 1);
        this.sliderConfig = sliderConfig;
        this.target.view.model.setAttributes({ sliderConfig });
      };

      const changeColorHandler = (e: any) => {
        const id = e.target.getAttribute('data-js-id');
        const sliderConfig: any[] = this.sliderConfig;
        const index = sliderConfig.findIndex((c: any) => c.id === id);
        sliderConfig[index].bgColor = e.target.value;
        updateStyle(editor, `image-${id}`, {
          'background-color': e.target.value
        });
      };

      const events = [
        {
          type: 'click',
          selector: '.slider-button-icon.remove-slide',
          handler: removeIconHandler
        },
        {
          type: 'click',
          selector: '.slider-button-title',
          handler: toggleSlideSettings
        },
        {
          type: 'change',
          selector: '.slide-bg-color',
          handler: changeColorHandler
        },
        {
          type: 'click',
          selector:
            '.gjs-control-media__remove.gjs-control-media__content__remove',
          handler: removeImageHandler
        },
        {
          type: 'click',
          selector: '.gjs-control-overlay',
          handler: chooseImageHandler
        }
      ];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const addItemHandler = (e: any) => {
        const slidesContainer = el.querySelector('.slider-slides-rows');
        const newSlide = document.createElement('div');
        const newOption = { ...sliderDefaultOption, id: nextUniqueId() };
        newSlide.classList.add('slider-slides-row-wrapper', 'mb-2');
        newSlide.setAttribute('data-js-id', newOption.id);
        newSlide.innerHTML = getSlideHtml(newOption);
        slidesContainer.appendChild(newSlide);

        events.forEach((ev) => {
          newSlide
            .querySelector(ev.selector)
            .addEventListener(ev.type, ev.handler);
        });

        const sliderConfig = [...this.sliderConfig];
        sliderConfig.push(newOption);
        this.sliderConfig = sliderConfig;
        this.target.view.model.setAttributes({ sliderConfig });
      };

      // setting up events for above created html buttons and input
      const addSlideButton = el.querySelector('.slider-add-slide-btn');
      addSlideButton.addEventListener('click', addItemHandler);

      events.forEach((ev) => {
        el.querySelectorAll(ev.selector).forEach((ele: any) => {
          ele.addEventListener(ev.type, ev.handler);
        });
      });

      this.listenTo(this.model, 'change:src', this.updateImage);
      return el;
    },

    updateImage() {
      const id = this.model.get('idForImageChange');
      if (!id) {
        return;
      }

      const sliderConfig: any[] = this.sliderConfig;
      const index = sliderConfig.findIndex((config: any) => config.id === id);
      sliderConfig[index].bgImage = this.model.get('src');
      updateStyle(editor, `image-${id}`, {
        'background-image': `url(${this.model.get('src')})`,
        'background-repeat': 'no-repeat',
        'background-position': 'center',
        'background-size': 'cover'
      });

      const el = this.model.el;
      const slideRow = el.querySelector(`[data-js-id="${id}"]`);
      slideRow.querySelector(
        '.gjs-control-media__preview'
      ).style.backgroundImage = `url(${this.model.get('src')})`;
      slideRow
        .querySelector('.gjs-control-media__content__remove')
        .classList.remove('d-none');
      slideRow
        .querySelector('.gjs-control-media__content__upload-button')
        .classList.add('d-none');
      this.model.set('idForImageChange', '');
      this.model.set('src', '');
    },

    // Update elements on the component change
    onUpdate({ elInput, component }: any) {
      if (
        component &&
        !component.changed['sliderConfig'] &&
        !component.changed['status']
      ) {
        const components = component.find('.slider-content__item');
        // const $this = this;
        if (components?.length > 0) {
          const configArray: any[] = [];
          components.forEach((element: any) => {
            const id = element.attributes.attributes['data-js-id'];
            const heading = element.find(`.slide-heading-${id}`);
            let headingText = sliderDefaultOption.headingText;
            if (heading?.length > 0) {
              headingText = heading[0].view.el.innerText;
            }
            const description = element.find(`.slide-description-${id}`);
            let descriptionText = sliderDefaultOption.descriptionText;
            if (description?.length > 0) {
              descriptionText = description[0].view.el.innerText;
            }
            const btn = element.find(`.slide-btn-${id}`);
            let btnText = sliderDefaultOption.btnText;
            if (btn) {
              btnText = btn.innerText;
            }

            const styles = getStyleByClass(editor, `image-${id}`);
            const bgColor =
              styles['background-color'] ?? sliderDefaultOption.bgColor;
            const bgImage =
              styles['background-image'] ?? sliderDefaultOption.bgImage;

            configArray.push({
              id,
              headingText,
              descriptionText,
              bgColor,
              bgImage,
              btnText
            });
            elInput.querySelector(`.btn-title-${id}`).innerText = headingText;
            elInput.querySelector(`.bg-color-${id}`).value =
              bgColor?.startsWith('rgb') ? rgb2hex(bgColor) : bgColor;
          });
          if (configArray.length > 0) {
            this.sliderConfig = [...configArray];
          }
        }
      }
    }
  });

  traits.addType(TRAIT_TYPES.GALLERY_CONFIG, {
    noLabel: true,
    // Expects as return a simple HTML string or an HTML element
    updateImage() {
      if (this.model.get('addNew') === false) {
        return;
      }
      const imgUrl = this.model.get('src');
      const galleryImages = this.galleryImages;
      const newGalleryImage = {
        id: nextUniqueId(),
        url: imgUrl
      };
      galleryImages.push(newGalleryImage);
      this.target.view.model.setAttributes({
        galleryImages: [...galleryImages]
      });

      const el = this.model.el;
      const imageContainer = el.querySelector('.control-gallery-container');
      const addButton = el.querySelector(
        '.control-gallery-thumbnail.gallary-image-add'
      );
      const newImage = document.createElement('div');
      newImage.classList.add('control-gallery-thumbnail-wrapper');
      newImage.setAttribute('data-js-id', newGalleryImage.id);
      newImage.innerHTML = `
        <img class="control-gallery-thumbnail" src="${newGalleryImage.url}">
        <div class="control-gallery-thumbnail-overlay gallery-image-remove">
          <i class="fa fa-trash" aria-hidden="true"></i>
        </div>`;
      newImage
        .querySelector(
          '.control-gallery-thumbnail-overlay.gallery-image-remove'
        )
        .addEventListener('click', (e: any) => {
          e.preventDefault();
          const imageWrapper = e.currentTarget.parentElement;
          const id = imageWrapper.getAttribute('data-js-id');
          imageWrapper.remove();

          const galleryImages = this.galleryImages.filter(
            (image: any) => image.id !== id
          );
          this.galleryImages = galleryImages;
          this.target.view.model.setAttributes({
            galleryImages: [...galleryImages]
          });
        });

      imageContainer.insertBefore(newImage, addButton);

      this.model.set('addNew', false);
      this.model.set('src', '');
    },
    createInput() {
      this.listenTo(this.model, 'change:src', this.updateImage);

      const galleryImages =
        this.target.view.model.getAttributes()['galleryImages'];
      this.galleryImages = galleryImages ? [...galleryImages] : [];

      const el = document.createElement('div');
      el.classList.add('gallery-settings-container');

      const getImages = () => {
        return galleryImages
          .map(
            (image: any) =>
              `<div class="control-gallery-thumbnail-wrapper" data-js-id="${image.id}">
                <img class="control-gallery-thumbnail" src="${image.url}">
                <div class="control-gallery-thumbnail-overlay gallery-image-remove">
                  <i class="fa fa-trash" aria-hidden="true"></i>
                </div>
              </div>`
          )
          .join('');
      };

      el.innerHTML = `
        <label class="mb-2">Images</label>
        <div class="control-gallery-container">
          ${getImages()}
          <span class="control-gallery-thumbnail gallary-image-add"><i class="fa fa-plus" aria-hidden="true"></i></span>
        </div>
      `;

      const addImageButton = el.querySelector(
        '.control-gallery-thumbnail.gallary-image-add'
      );

      addImageButton.addEventListener('click', (e: any) => {
        e.preventDefault();
        this.model.set('addNew', true);
        editor.runCommand('open-assets', {
          target: this.model,
          types: ['image'],
          accept: 'image/*',
          onSelect: () => {
            editor.Modal.close();
            editor.AssetManager.setTarget(null);
          }
        });
      });

      const removeImageButtons = el.querySelectorAll(
        '.control-gallery-thumbnail-overlay.gallery-image-remove'
      );

      const removeImageHandler = (e: any) => {
        e.preventDefault();
        const imageWrapper = e.currentTarget.parentElement;
        const id = imageWrapper.getAttribute('data-js-id');
        imageWrapper.remove();

        const galleryImages = this.galleryImages.filter(
          (image: any) => image.id !== id
        );
        this.galleryImages = galleryImages;
        this.target.view.model.setAttributes({
          galleryImages: [...galleryImages]
        });
      };

      removeImageButtons.forEach((ele: any) => {
        ele.addEventListener('click', removeImageHandler);
      });

      return el;
    }
  });

  traits.addType(TRAIT_TYPES.REVIEW_CONFIG, {
    noLabel: true,
    // Expects as return a simple HTML string or an HTML element
    createInput({ trait }: any) {
      const reviewConfig =
        this.target.view.model.getAttributes()['reviewConfig'];
      const traitOpts = reviewConfig ? [...reviewConfig] : trait.get('options');

      this.reviewConfig = traitOpts;

      const getSlideHtml = (config: any) => {
        return `<div class="slider-slides-row">
          <button class="slider-button-title btn-title-${config.id}">${
          config.name
        }</button>
          <button class="slider-button-icon remove-slide"><span> <i class="fa fa-remove" aria-hidden="true"></i> </span></button>
        </div>
        <div class="slider-slide-settings p-2">
          <div class="text-end">
            <span class="select-existing-review" data-js-id="${
              config.id
            }">Select Existing Review</span>
          </div>
          <div class="flex justify-content-between align-items-center">
            <label>Color</label>
            <input class="slide-bg-color bg-color-${config.id}" data-js-id="${
          config.id
        }" type="color" value="${config.bgColor}"/>
          </div>
          <div class="gjs-number-field flex justify-content-between align-items-center" data-input>
            <label>Rating</label>
            <input class="slide-rating rating-${config.id}" data-js-id="${
          config.id
        }" type="number" min="0" max="5" step="0.1" value="${
          config.rating
        }" placeholder="0"/>
          </div>
          <div>
            <label class="mb-1">Icon</label>
            <div class="gjs-control-media__content gjs-control-tag-area gjs-control-preview-area">
              <div class="gjs-control-media-area">
                  <div class="gjs-control-media-icon__preview">
                    ${config.icon ? config.icon : ''}
                  </div>
              </div>
              <div class="gjs-control-overlay" data-js-id="${config.id}">
                <div class="gjs-control-media__remove gjs-control-media__content__remove ${
                  config.icon ? '' : 'd-none'
                }" title="Remove" data-js-id="${config.id}">
                    <i class="eicon-trash-o fa fa-trash" aria-hidden="true"></i>
                </div>
              </div>
              <div class="gjs-control-media-upload-button gjs-control-media__content__upload-button ${
                config.icon ? 'd-none' : ''
              }">
                  <i class="eicon-plus-circle fa fa-plus" aria-hidden="true"></i>
              </div>
              <div class="gjs-control-media__tools gjs-control-dynamic-switcher-wrapper">
                  <div class="gjs-control-media__tool gjs-control-media__replace" data-media-type="image">Choose
                      Icon</div>
              </div>
            </div>
          </div>
        </div>`;
      };

      let slides = '';
      traitOpts.forEach((option: any) => {
        slides += `
        <div class="slider-slides-row-wrapper mb-2" data-js-id="${option.id}">
            ${getSlideHtml(option)}
          </div>
        `;
      });

      // Create a new element container and add some content
      const el = document.createElement('div');
      el.classList.add('p-2');

      el.innerHTML = `
      <label class="my-2"><span>Slides</span></label>
      <div class="slider-slides-list">
          <div class="slider-slides-rows">
              ${slides}
          </div>
          <div class="slider-add-slide">
            <button class="slider-add-slide-btn"> <i class="fa fa-plus mr-1" aria-hidden="true"></i> Add Item </button>
          </div>
      </div>`;

      const chooseImageHandler = (e: any) => {
        const id = e.target.getAttribute('data-js-id');
        editor.runCommand('choose-icon', {
          target: this.model,
          options: {
            id
          }
        });
      };

      const removeImageHandler = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const id = e.target.parentElement.getAttribute('data-js-id');
        const mediaWrapper = e.target.closest(
          '.gjs-control-media__content.gjs-control-preview-area'
        );
        mediaWrapper.querySelector(
          '.gjs-control-media-icon__preview'
        ).innerHTML =
          '<svg data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path data-gjs-type="svg-in" draggable="false" d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"/></svg>';
        mediaWrapper
          .querySelector('.gjs-control-media__content__remove')
          .classList.add('d-none');
        mediaWrapper
          .querySelector('.gjs-control-media__content__upload-button')
          .classList.remove('d-none');

        const reviewConfig = [...this.reviewConfig];
        const index = reviewConfig.findIndex((c: any) => c.id === id);
        reviewConfig[index].icon = '';
        this.reviewConfig = reviewConfig;
        this.target.view.model.setAttributes({ reviewConfig });
      };

      // handler for settings area toggle
      const toggleSlideSettings = (e: any) => {
        e.preventDefault();
        const isCurrentElementAndOpen =
          e.target.parentElement.nextElementSibling.classList.contains(
            'editable'
          );
        const openSettings = el.querySelector(
          '.slider-slide-settings.editable'
        );
        if (openSettings) {
          openSettings.classList.remove('editable');
        }
        if (!isCurrentElementAndOpen) {
          e.target.parentElement.nextElementSibling.classList.add('editable');
        }
      };

      const removeIconHandler = (e: any) => {
        const curRow = e.currentTarget.closest('.slider-slides-row-wrapper');
        const id = curRow.getAttribute('data-js-id');
        curRow.remove();
        const reviewConfig = [...this.reviewConfig];
        const index = reviewConfig.findIndex((c: any) => c.id === id);
        reviewConfig.splice(index, 1);
        this.reviewConfig = reviewConfig;
        this.target.view.model.setAttributes({ reviewConfig });
      };

      const changeColorHandler = (e: any) => {
        const id = e.target.getAttribute('data-js-id');
        const reviewConfig: any[] = this.reviewConfig;
        const index = reviewConfig.findIndex((c: any) => c.id === id);
        reviewConfig[index].bgColor = e.target.value;
        updateStyle(editor, `review-${id}`, {
          'background-color': e.target.value
        });
      };

      const changeRatingHandler = (e: any) => {
        const id = e.target.getAttribute('data-js-id');
        const reviewConfig = [...this.reviewConfig];
        const index = reviewConfig.findIndex((c: any) => c.id === id);
        let rating = e.target.value;
        rating = parseFloat(rating) < 0 ? 0 : rating;
        rating = parseFloat(rating) > 5 ? 5 : rating;
        e.target.value = rating;
        reviewConfig[index].rating = rating;
        this.reviewConfig = reviewConfig;
        this.target.view.model.setAttributes({ reviewConfig });
      };

      const selectExistingReviewHandler = (e: any) => {
        const id = e.currentTarget.getAttribute('data-js-id');
        window.postMessage(
          {
            type: 'select-review',
            id
          },
          window.location.origin
        );
      };

      const events = [
        {
          type: 'click',
          selector: '.slider-button-icon.remove-slide',
          handler: removeIconHandler
        },
        {
          type: 'click',
          selector: '.slider-button-title',
          handler: toggleSlideSettings
        },
        {
          type: 'change',
          selector: '.slide-bg-color',
          handler: changeColorHandler
        },
        {
          type: 'change',
          selector: '.slide-rating',
          handler: changeRatingHandler
        },
        {
          type: 'click',
          selector:
            '.gjs-control-media__remove.gjs-control-media__content__remove',
          handler: removeImageHandler
        },
        {
          type: 'click',
          selector: '.gjs-control-overlay',
          handler: chooseImageHandler
        },
        {
          type: 'click',
          selector: '.select-existing-review',
          handler: selectExistingReviewHandler
        }
      ];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const addItemHandler = (e: any) => {
        const slidesContainer = el.querySelector('.slider-slides-rows');
        const newSlide = document.createElement('div');
        const newOption = { ...reviewDefaultOption, id: nextUniqueId() };
        newOption.icon = newOption.icon
          .replace('SVG_ID', newOption.id)
          .replace('SVG_CLASS', newOption.id);
        newSlide.classList.add('slider-slides-row-wrapper', 'mb-2');
        newSlide.setAttribute('data-js-id', newOption.id);
        newSlide.innerHTML = getSlideHtml(newOption);
        slidesContainer.appendChild(newSlide);

        events.forEach((ev) => {
          newSlide
            .querySelector(ev.selector)
            .addEventListener(ev.type, ev.handler);
        });

        const reviewConfig = [...this.reviewConfig];
        reviewConfig.push(newOption);
        this.reviewConfig = reviewConfig;
        this.target.view.model.setAttributes({ reviewConfig });
      };

      // setting up events for above created html buttons and input
      const addSlideButton = el.querySelector('.slider-add-slide-btn');
      addSlideButton.addEventListener('click', addItemHandler);

      events.forEach((ev) => {
        el.querySelectorAll(ev.selector).forEach((ele: any) => {
          ele.addEventListener(ev.type, ev.handler);
        });
      });

      this.listenTo(this.model, 'change:icon', this.changeIconForSlide);
      return el;
    },

    changeIconForSlide() {
      const icon = this.model.get('icon');
      const id = icon.options.id;
      const svgObject = icons.find((i: any) => i.name === icon.name);
      const svg = svgObject.svg.replace('SVG_ID', id).replace('SVG_CLASS', id);
      const reviewConfig = [...this.reviewConfig];
      const index = reviewConfig.findIndex((c: any) => c.id === id);
      reviewConfig[index].icon = svg;
      this.reviewConfig = reviewConfig;
      this.target.view.model.setAttributes({ reviewConfig });

      const el = this.model.el;
      const slideRow = el.querySelector(`[data-js-id="${id}"]`);
      slideRow.querySelector('.gjs-control-media-icon__preview').innerHTML =
        svg;
    },

    // Update elements on the component change
    onUpdate({ elInput, component }: any) {
      if (
        component &&
        !component.changed['reviewConfig'] &&
        !component.changed['status']
      ) {
        const components = component.find('.slider-content__item');
        if (components?.length > 0) {
          const configArray: any[] = [];
          components.forEach((element: any) => {
            const id = element.attributes.attributes['data-js-id'];
            const nameElement = element.find(`.slide-header-name-${id}`);
            let name = reviewDefaultOption.name;
            if (nameElement?.length > 0) {
              name = nameElement[0].view.el.innerText;
            }
            const titleElement = element.find(`.slide-header-title-${id}`);
            let title = reviewDefaultOption.title;
            if (titleElement?.length > 0) {
              title = titleElement[0].view.el.innerText;
            }
            const reviewTextElement = element.find(`.slide-review-text-${id}`);
            let reviewText = reviewDefaultOption.reviewText;
            if (reviewTextElement?.length > 0) {
              reviewText = reviewTextElement[0].view.el.innerText;
            }
            const ratingElement = element.find(`.slide-header-rating-${id}`);
            let rating = reviewDefaultOption.rating;
            if (ratingElement?.length > 0) {
              rating = ratingElement[0].getAttributes()['data-rating'];
            }
            const iconElement = element.find(`.slide-header-icon-${id}`);
            let icon = '';
            if (iconElement?.length > 0) {
              icon = iconElement[0].view.el.innerHTML;
            }
            const styles = getStyleByClass(editor, `review-${id}`);
            const bgColor =
              styles['background-color'] ?? reviewDefaultOption.bgColor;
            configArray.push({
              id,
              name,
              title,
              rating,
              icon,
              reviewText,
              bgColor
            });
            elInput.querySelector(`.btn-title-${id}`).innerText = name;
            elInput.querySelector(`.rating-${id}`).value = rating;
            elInput.querySelector(`.bg-color-${id}`).value =
              bgColor?.startsWith('rgb') ? rgb2hex(bgColor) : bgColor;
            elInput.querySelector(
              `[data-js-id="${id}"] .gjs-control-media-icon__preview`
            ).innerHTML = icon
              ? icon
              : '<svg data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path data-gjs-type="svg-in" draggable="false" d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"/></svg>';
          });
          if (configArray.length > 0) {
            this.reviewConfig = [...configArray];
          }
        }
      }
    }
  });

  traits.addType(TRAIT_TYPES.CAROUSEL_CONFIG, {
    noLabel: true,
    // Expects as return a simple HTML string or an HTML element
    createInput({ trait }: any) {
      const carouselConfig = this.target.view.model.get('carouselConfig');
      const traitOpts = carouselConfig
        ? [...carouselConfig]
        : trait.get('options');

      this.carouselConfig = traitOpts;
      const getCarouselConfig = (id: any) => {
        const carouselConfig = [...this.carouselConfig];
        const index = carouselConfig.findIndex((c: any) => c.id === id);
        return { carouselConfig, index };
      };
      const setCarouselConfig = (carouselConfig: any[]) => {
        this.carouselConfig = carouselConfig;
        this.target.view.model.set('carouselConfig', carouselConfig);
      };

      const getSlideHtml = (config: any, index: number) => {
        return `<div class="slider-slides-row">
          <button class="slider-button-title btn-title-${config.id}">Item #${
          index + 1
        }</button>
          <button class="slider-button-icon remove-slide"><span> <i class="fa fa-remove" aria-hidden="true"></i> </span></button>
        </div>
        <div class="slider-slide-settings p-2">
          <div class="flex justify-content-between align-items-center">
            <label>Type</label>
            <div class="slide-type" data-js-id="${config.id}">
              <input id="slide-image-type-${
                config.id
              }" type="radio" name="slide-type-${config.id}" value="${
          CAROUSEL_TYPE.IMAGE
        }" ${config.type === CAROUSEL_TYPE.IMAGE ? 'checked="checked"' : ''}>
              <label for="slide-image-type-${
                config.id
              }"><i class="fa fa-image" aria-hidden="true"></i></label>
              <input id="slide-video-type-${
                config.id
              }" type="radio" name="slide-type-${config.id}" value="${
          CAROUSEL_TYPE.VIDEO
        }"${config.type === CAROUSEL_TYPE.VIDEO ? 'checked="checked"' : ''}>
              <label for="slide-video-type-${
                config.id
              }"><i class="fa fa-video" aria-hidden="true"></i></label>
            </div>
          </div>
          <div>
            <label class="mb-1">Image</label>
            <div class="gjs-control-media__content gjs-control-tag-area gjs-control-preview-area">
              <div class="gjs-control-media-area">
                  <div class="gjs-control-media__preview"></div>
              </div>
              <div class="gjs-control-overlay" data-js-id="${config.id}">
                <div class="gjs-control-media__remove gjs-control-media__content__remove ${
                  config.icon ? '' : 'd-none'
                }" title="Remove" data-js-id="${config.id}">
                    <i class="eicon-trash-o fa fa-trash" aria-hidden="true"></i>
                </div>
              </div>
              <div class="gjs-control-media-upload-button gjs-control-media__content__upload-button ${
                config.icon ? 'd-none' : ''
              }">
                  <i class="eicon-plus-circle fa fa-plus" aria-hidden="true"></i>
              </div>
              <div class="gjs-control-media__tools gjs-control-dynamic-switcher-wrapper">
                  <div class="gjs-control-media__tool gjs-control-media__replace" data-media-type="image">Choose
                      Image</div>
              </div>
            </div>
          </div>
          <div class="mt-1 slide-videoSrc slide-videoSrc-${config.id} d-none">
            <label class="mb-1">Video Link</label>
            <div class="slide-video-input" data-input>
              <input type="text" id="slide-videoSrc-${config.id}" data-js-id="${
          config.id
        }" value="${config.videoSrc}" placeholder="Enter your video link">
            </div>
          </div>
        </div>`;
      };

      let slides = '';
      traitOpts.forEach((option: any, i: number) => {
        slides += `
        <div class="slider-slides-row-wrapper mb-2" data-js-id="${option.id}">
            ${getSlideHtml(option, i)}
          </div>
        `;
      });

      // Create a new element container and add some content
      const el = document.createElement('div');
      el.classList.add('p-2');

      el.innerHTML = `
      <label class="my-2"><span>Slides</span></label>
      <div class="slider-slides-list">
          <div class="slider-slides-rows">
              ${slides}
          </div>
          <div class="slider-add-slide">
            <button class="slider-add-slide-btn"> <i class="fa fa-plus mr-1" aria-hidden="true"></i> Add Item </button>
          </div>
      </div>`;

      const carouselTypeHandler = (e: any) => {
        const carouselType = e.target.value;
        const id = e.target.parentElement.getAttribute('data-js-id');
        if (carouselType === CAROUSEL_TYPE.VIDEO) {
          el.querySelector(`.slide-videoSrc-${id}`).classList.remove('d-none');
        } else {
          el.querySelector(`.slide-videoSrc-${id}`).classList.add('d-none');
        }
        const { carouselConfig, index } = getCarouselConfig(id);
        carouselConfig[index].type = carouselType;
        setCarouselConfig(carouselConfig);
        this.target.view.model.trigger('change:carouselConfig');
      };

      const videoLinkChangeHandler = (e: any) => {
        console.log(e.target.value);
        const vLink = e.target.value;
        let videoLink = vLink;
        const video = parseMediaFromUrl(vLink);
        if (video?.videoId) {
          switch (video.type) {
            case 'youtube':
              videoLink = `https://www.youtube.com/embed/${video.videoId}?autoplay=1&rel=0&controls=0&enablejsapi=1`;
              break;
            case 'vimeo':
              videoLink = `https://player.vimeo.com/video/${video.videoId}?autoplay=1&rel=0&controls=0#t=`;
              break;
          }
        }
        const id = e.target.getAttribute('data-js-id');
        const { carouselConfig, index } = getCarouselConfig(id);
        carouselConfig[index].videoSrc = vLink ?? '';
        carouselConfig[index].videoLink = videoLink ?? '';
        setCarouselConfig(carouselConfig);
        this.target.view.model.trigger('change:carouselConfig');
      };

      const chooseImageHandler = (e: any) => {
        const id = e.target.getAttribute('data-js-id');
        this.model.set('idForImageChange', id);
        if (this.model.changed['src'] === '') {
          delete this.model.changed['src'];
        }
        editor.runCommand('open-assets', {
          target: this.model,
          types: ['image'],
          accept: 'image/*',
          onSelect: () => {
            editor.Modal.close();
            editor.AssetManager.setTarget(null);
          }
        });
      };

      const removeImageHandler = (e: any) => {
        e.preventDefault();
        e.stopPropagation();
        const id = e.target.parentElement.getAttribute('data-js-id');
        const mediaWrapper = e.target.closest(
          '.gjs-control-media__content.gjs-control-preview-area'
        );
        mediaWrapper.querySelector(
          '.gjs-control-media__preview'
        ).style.backgroundImage = '';
        mediaWrapper
          .querySelector('.gjs-control-media__content__remove')
          .classList.add('d-none');
        mediaWrapper
          .querySelector('.gjs-control-media__content__upload-button')
          .classList.remove('d-none');
        const carouselConfig: any[] = this.carouselConfig;
        const index = carouselConfig.findIndex((c: any) => c.id === id);
        carouselConfig[index].bgImage = '';
        updateStyle(editor, `slide-content-${id}`, {
          'background-image': ''
        });
      };

      // handler for settings area toggle
      const toggleSlideSettings = (e: any) => {
        e.preventDefault();
        const isCurrentElementAndOpen =
          e.target.parentElement.nextElementSibling.classList.contains(
            'editable'
          );
        const openSettings = el.querySelector(
          '.slider-slide-settings.editable'
        );
        if (openSettings) {
          openSettings.classList.remove('editable');
        }
        if (!isCurrentElementAndOpen) {
          e.target.parentElement.nextElementSibling.classList.add('editable');
        }
      };

      const removeIconHandler = (e: any) => {
        const curRow = e.currentTarget.closest('.slider-slides-row-wrapper');
        const id = curRow.getAttribute('data-js-id');
        curRow.remove();
        const { carouselConfig, index } = getCarouselConfig(id);
        carouselConfig.splice(index, 1);
        this.carouselConfig = carouselConfig;
        this.target.view.model.set('carouselConfig', carouselConfig);
      };

      const events = [
        {
          type: 'click',
          selector: '.slider-button-icon.remove-slide',
          handler: removeIconHandler
        },
        {
          type: 'click',
          selector: '.slider-button-title',
          handler: toggleSlideSettings
        },
        {
          type: 'click',
          selector:
            '.gjs-control-media__remove.gjs-control-media__content__remove',
          handler: removeImageHandler
        },
        {
          type: 'click',
          selector: '.gjs-control-overlay',
          handler: chooseImageHandler
        },
        {
          type: 'change',
          selector: '.slide-type input[type="radio"]',
          handler: carouselTypeHandler
        },
        {
          type: 'change',
          selector: '.slide-video-input input',
          handler: videoLinkChangeHandler
        }
      ];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const addItemHandler = (e: any) => {
        const slidesContainer = el.querySelector('.slider-slides-rows');
        const newSlide = document.createElement('div');
        const newOption = { ...carouselDefaultOption, id: nextUniqueId() };

        newSlide.classList.add('slider-slides-row-wrapper', 'mb-2');
        newSlide.setAttribute('data-js-id', newOption.id);
        newSlide.innerHTML = getSlideHtml(
          newOption,
          slidesContainer.children.length
        );
        slidesContainer.appendChild(newSlide);

        events.forEach((ev) => {
          newSlide
            .querySelector(ev.selector)
            .addEventListener(ev.type, ev.handler);
        });

        const carouselConfig = [...this.carouselConfig];
        carouselConfig.push(newOption);
        setCarouselConfig(carouselConfig);
      };

      // setting up events for above created html buttons and input
      const addSlideButton = el.querySelector('.slider-add-slide-btn');
      addSlideButton.addEventListener('click', addItemHandler);

      events.forEach((ev) => {
        el.querySelectorAll(ev.selector).forEach((ele: any) => {
          ele.addEventListener(ev.type, ev.handler);
        });
      });

      this.listenTo(this.model, 'change:src', this.updateImage);
      return el;
    },

    updateImage() {
      const id = this.model.get('idForImageChange');
      if (!id) {
        return;
      }

      const carouselConfig: any[] = this.carouselConfig;
      const index = carouselConfig.findIndex((config: any) => config.id === id);
      carouselConfig[index].bgImage = this.model.get('src');
      updateStyle(editor, `slide-content-${id}`, {
        'background-image': `url(${this.model.get('src')}) !important`
      });

      const el = this.model.el;
      const slideRow = el.querySelector(`[data-js-id="${id}"]`);
      slideRow.querySelector(
        '.gjs-control-media__preview'
      ).style.backgroundImage = `url(${this.model.get('src')})`;
      slideRow
        .querySelector('.gjs-control-media__content__remove')
        .classList.remove('d-none');
      slideRow
        .querySelector('.gjs-control-media__content__upload-button')
        .classList.add('d-none');
      this.model.set('idForImageChange', '');
      this.model.set('src', '');
    }

    // Update elements on the component change
    // onUpdate({ elInput, component }: any) {
    //   if (
    //     component &&
    //     !component.changed['carouselConfig'] &&
    //     !component.changed['status']
    //   ) {
    //     const components = component.find('.slider-content__item');
    //     if (components?.length > 0) {
    //       const configArray: any[] = [];
    //       components.forEach((element: any) => {
    //         const id = element.attributes.attributes['data-js-id'];
    //         const nameElement = element.find(`.slide-header-name-${id}`);
    //         let name = reviewDefaultOption.name;
    //         if (nameElement?.length > 0) {
    //           name = nameElement[0].view.el.innerText;
    //         }
    //         const titleElement = element.find(`.slide-header-title-${id}`);
    //         let title = reviewDefaultOption.title;
    //         if (titleElement?.length > 0) {
    //           title = titleElement[0].view.el.innerText;
    //         }
    //         const styles = getStyleByClass(editor, `review-${id}`);
    //         const bgColor =
    //           styles['background-color'] ?? reviewDefaultOption.bgColor;
    //         configArray.push({
    //           id,
    //           name,
    //           title,
    //           bgColor
    //         });
    //         elInput.querySelector(`.btn-title-${id}`).innerText = name;
    //         elInput.querySelector(`.rating-${id}`).value = rating;
    //         elInput.querySelector(`.bg-color-${id}`).value =
    //           bgColor?.startsWith('rgb') ? rgb2hex(bgColor) : bgColor;
    //         elInput.querySelector(
    //           `[data-js-id="${id}"] .gjs-control-media__preview`
    //         ).innerHTML = icon
    //           ? icon
    //           : '<svg data-gjs-type="svg" draggable="false" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path data-gjs-type="svg-in" draggable="false" d="M464 448H48c-26.51 0-48-21.49-48-48V112c0-26.51 21.49-48 48-48h416c26.51 0 48 21.49 48 48v288c0 26.51-21.49 48-48 48zM112 120c-30.928 0-56 25.072-56 56s25.072 56 56 56 56-25.072 56-56-25.072-56-56-56zM64 384h384V272l-87.515-87.515c-4.686-4.686-12.284-4.686-16.971 0L208 320l-55.515-55.515c-4.686-4.686-12.284-4.686-16.971 0L64 336v48z"/></svg>';
    //       });
    //       if (configArray.length > 0) {
    //         this.carouselConfig = [...configArray];
    //       }
    //     }
    //   }
    // }
  });

  traits.addType(TRAIT_TYPES.HTML_CONFIG, {
    noLabel: true,
    // Expects as return a simple HTML string or an HTML element
    createInput() {
      const htmlString = this.target.view.model.get('html') ?? '';

      const el = document.createElement('div');
      el.classList.add('html-editor-container');

      el.innerHTML = `
        <label class="mb-2">HTML Code</label>
        <div class="html-editor"></div>
      `;

      const htmlEditor = el.querySelector('.html-editor');

      const aceEditor = ace.edit(htmlEditor, {
        theme: 'ace/theme/merbivore',
        mode: 'ace/mode/html',
        useWorker: false,
        enableBasicAutocompletion: true,
        enableSnippets: true,
        enableLiveAutocompletion: true,
        minLines: 5,
        wrap: true,
        value: htmlString
      });

      const handleHtmlChange = debounce(() => {
        this.target.view.model.set('html', aceEditor.getSession().getValue());
      }, 500);

      aceEditor.getSession().on('change', handleHtmlChange);

      return el;
    }
  });

  traits.addType(TRAIT_TYPES.ACCORDION_CONFIG, {
    noLabel: true,
    // Expects as return a simple HTML string or an HTML element
    createInput({ trait }: any) {
      const accordionConfig = this.target.view.model.get('accordionConfig');
      const traitOpts = accordionConfig
        ? [...accordionConfig]
        : trait.get('options') ?? [];
      this.accordionConfig = traitOpts;

      // const getAccordionConfig = (id: any) => {
      //   const accordionConfig = [...this.accordionConfig];
      //   const index = accordionConfig.findIndex((c: any) => c.id === id);
      //   return { accordionConfig, index };
      // };
      const setAccordionConfig = (accordionConfig: any[]) => {
        this.accordionConfig = accordionConfig;
        this.target.view.model.set('accordionConfig', accordionConfig);
        this.target.view.model.trigger('change:accordionConfig');
      };

      const getSlideHtml = (config: any) => {
        return `<div class="slider-slides-row">
          <button class="slider-button-title btn-title-${config.id}">${config.title}</button>
          <button class="slider-button-icon remove-slide remove-accordian"><span> <i class="fa fa-remove" aria-hidden="true"></i> </span></button>
        </div>
        <div class="slider-slide-settings p-2">
          <div class="mb-2">
            <label class="mb-1">Title</label>
            <input id="title" class="slide-title" data-js-id="${config.id}" type="text" value="${config.title}">
          </div>
          <div class="accordion-editor-container">
            <label class="mb-1">Content</label>
            <textarea id="content" class="slide-content" data-js-id="${config.id}">${config.content}</textarea>
          </div>
        </div>`;
      };

      let slides = '';
      traitOpts.forEach((option: any) => {
        slides += `
        <div class="slider-slides-row-wrapper mb-2" data-js-id="${option.id}">
            ${getSlideHtml(option)}
          </div>
        `;
      });

      // Create a new element container and add some content
      const el = document.createElement('div');
      el.classList.add('p-2');

      el.innerHTML = `
      <label class="my-2"><span>Accordion</span></label>
      <div class="slider-slides-list">
          <div class="slider-slides-rows">
              ${slides}
          </div>
          <div class="slider-add-slide">
            <button id="add-accordion-btn" class="slider-add-slide-btn"> <i class="fa fa-plus mr-1" aria-hidden="true"></i> Add Item </button>
          </div>
      </div>`;

      // handler for settings area toggle
      const toggleSlideSettings = (e: any) => {
        e.preventDefault();
        const isCurrentElementAndOpen =
          e.target.parentElement.nextElementSibling.classList.contains(
            'editable'
          );
        const openSettings = el.querySelector(
          '.slider-slide-settings.editable'
        );
        if (openSettings) {
          openSettings.classList.remove('editable');
        }
        if (!isCurrentElementAndOpen) {
          e.target.parentElement.nextElementSibling.classList.add('editable');
        }
      };

      const removeAccordian = (e: any) => {
        e.preventDefault();
        const curRow = e.currentTarget.closest('.slider-slides-row-wrapper');
        const id = curRow.getAttribute('data-js-id');
        curRow.remove();
        const accordionConfig: any[] = this.accordionConfig;
        const index = accordionConfig.findIndex((c: any) => c.id === id);
        accordionConfig.splice(index, 1);
        setAccordionConfig(accordionConfig);
      };

      const onAccordionContentChange = (e: any) => {
        e.preventDefault();
        const id = e.target.getAttribute('data-js-id');
        const contentType = e.target.getAttribute('id');
        const accordionConfig: any[] = this.accordionConfig;
        const index = accordionConfig.findIndex((c: any) => c.id === id);
        accordionConfig[index][contentType] = e.target.value;
        this.accordionConfig = accordionConfig;
        this.target.view.model.set('accordionConfig', accordionConfig);
        this.target.view.model.trigger('change:accordionConfig');
      };

      const events = [
        {
          type: 'click',
          selector: '.slider-button-title',
          handler: toggleSlideSettings
        },
        {
          type: 'click',
          selector: '.remove-accordian',
          handler: removeAccordian
        },
        {
          type: 'change',
          selector: '.slide-title',
          handler: onAccordionContentChange
        },
        {
          type: 'change',
          selector: '.slide-content',
          handler: onAccordionContentChange
        }
      ];

      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const addItemHandler = (e: any) => {
        const slidesContainer = el.querySelector('.slider-slides-rows');
        const newSlide = document.createElement('div');
        const newOption = { ...accordionDefaultOption, id: nextUniqueId() };
        newSlide.classList.add('slider-slides-row-wrapper', 'mb-2');
        newSlide.setAttribute('data-js-id', newOption.id);
        newSlide.innerHTML = getSlideHtml(newOption);
        slidesContainer.appendChild(newSlide);
        events.forEach((ev) => {
          newSlide
            .querySelector(ev.selector)
            .addEventListener(ev.type, ev.handler);
        });
        const accordionConfig = [...this.accordionConfig];
        accordionConfig.push(newOption);
        setAccordionConfig(accordionConfig);
      };

      // setting up events for above created html buttons and input
      const addAccordionButton = el.querySelector('#add-accordion-btn');
      addAccordionButton.addEventListener('click', addItemHandler);

      events.forEach((ev) => {
        el.querySelectorAll(ev.selector).forEach((ele: any) => {
          ele.addEventListener(ev.type, ev.handler);
        });
      });
      return el;
    },
    // Update elements on the component change
    onUpdate({ elInput, component }: any) {
      console.log(elInput);
      console.log(component);
      // if (
      //   'status' in component.changed &&
      //   component.changed['status'] === 'selected'
      // ) {
      // const getAccordionConfig = (id: any) => {
      //   const accordionConfig = [...this.accordionConfig];
      //   const index = accordionConfig.findIndex((c: any) => c.id === id);
      //   return { accordionConfig, index };
      // };
      // const setAccordionConfig = (accordionConfig: any[]) => {
      //   this.accordionConfig = accordionConfig;
      //   this.target.view.model.set('accordionConfig', accordionConfig);
      //   this.target.view.model.trigger('change:accordionConfig');
      // };
      // const createEditor = (option: any) => {
      //   (window as any).CKEDITOR.replace(`ck-editor-${option.id}`, {
      //     extraAllowedContent: '*(*);*{*}', // Allows any class and any inline style
      //     allowedContent: true, // Disable auto-formatting, class removing, etc.
      //     enterMode: 2, // CKEDITOR.ENTER_BR,
      //     extraPlugins: 'sharedspace,justify,colorbutton,panelbutton,font',
      //     toolbar: [
      //       { name: 'styles', items: ['Font', 'FontSize'] },
      //       { name: 'colors', items: ['TextColor', 'BGColor'] },
      //       ['Bold', 'Italic', 'Underline', 'Strike'],
      //       { name: 'paragraph', items: ['NumberedList', 'BulletedList'] },
      //       { name: 'links', items: ['Link', 'Unlink'] }
      //     ]
      //   }).on('change', (e: any) => {
      //     if (e?.name === 'change' && e?.editor) {
      //       console.log(e.editor.getData());
      //       const { accordionConfig, index } = getAccordionConfig(option.id);
      //       const data = e.editor.getData() ?? '';
      //       accordionConfig[index].content = data;
      //       setAccordionConfig(accordionConfig);
      //     }
      //   });
      // };
      // this.accordionConfig?.forEach((config: any) => {
      //   const editorInstance = (window as any).CKEDITOR.instances[
      //     `ck-editor-${config.id}`
      //   ];
      //   if (editorInstance) {
      //     const data = editorInstance.getData();
      //     editorInstance.destroy();
      //     elInput.querySelector(`#ck-editor-${config.id}`).value = data;
      //     setTimeout(() => {
      //       createEditor(config);
      //     }, 100);
      //   }
      // });
      // }
    }
  });
}
