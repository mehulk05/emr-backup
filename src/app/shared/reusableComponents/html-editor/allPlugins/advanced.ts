import SVG_MAP from '../pluginsConfig/svgConfig';
import {
  countdownConfig,
  componentTypes as Types
} from '../pluginsConfig/constants';

const advancedPlugin = (editor: any, options: any = {}) => {
  const bm: any = editor.BlockManager;
  const category: string = options.category || 'Advanced';

  bm.add(Types.SLIDER, {
    label: 'Slider',
    content: { type: 'slider', attributes: { class: 'slider' } },
    media: SVG_MAP.sliderSvg,
    category
  });

  bm.add(Types.GALLERY, {
    label: 'Gallery',
    media: SVG_MAP.gallerySvg,
    content: { type: 'gallery', attributes: { class: 'gallery' } },
    category,
    attributes: {
      title: 'Gallery'
    }
  });

  bm.add(Types.COUNTDOWN, {
    label: countdownConfig.labelCountdown,
    category,
    attributes: { class: 'fa fa-clock-o' },
    content: `
	  <div class="${countdownConfig.countdownClsPfx}" data-gjs-type="countdown"></div>
	  <style>
    .${countdownConfig.countdownClsPfx} {
      text-align: center;
      font-family: Helvetica, serif;
    }

    .${countdownConfig.countdownClsPfx}-block {
      display: inline-block;
      margin: 0 10px;
      padding: 10px;
    }

    .${countdownConfig.countdownClsPfx}-digit {
      font-size: 5rem;
    }

    .${countdownConfig.countdownClsPfx}-endtext {
      font-size: 5rem;
    }

    .${countdownConfig.countdownClsPfx}-cont,
    .${countdownConfig.countdownClsPfx}-block {
      display: inline-block;
    }
  </style>
	`
  });

  bm.add(Types.FORM, {
    label: 'Form',
    media: SVG_MAP.formSvg,
    content: { type: Types.FORM, attributes: { class: 'gjs-form' } },
    category,
    attributes: {
      title: 'Form'
    }
  });

  bm.add(Types.REVIEWS, {
    label: 'Reviews',
    media: SVG_MAP.reviewsSvg,
    content: `<div data-gjs-type="reviews" id="gjs-reviews" class="gjs-reviews"></div>
		<style>
			.gjs-reviews {
				position: relative;
				width: 100%;
				overflow: hidden;
			}

			.gjs-reviews .slider-content {
				width: 95%;
				margin: 0 auto;
				overflow: hidden;
			}

			.gjs-reviews .slider-content-wrapper {
				display: flex;
				transition: transform 0.5s ease-in-out;
			}

			.gjs-reviews .slider-content__item {
				flex: 1 0 100%;
				width: 100%;
				height: auto;
				background-repeat: no-repeat;
				background-position: center;
				background-size: contain;
				color: rgba(0, 0, 0, 0.714);
				border: 1px solid #e1e8ed;
			}

			.gjs-reviews .slide-heading {
				font-size: 32px;
				font-weigth: 700;
				line-height: 1;
			}

			.gjs-reviews .slide-description {
				font-size: 16px;
				font-weight: 400;
				line-height: 1.4;
			}

			.gjs-reviews .data-container {
				// background-color: #fff;
				border-radius: 5px;
				width: 100%;
			}

			.gjs-reviews .slide-header {
				display: flex;
				align-items: flex-start;
				width: 100%;
				padding-inline-start: 15px;
				padding-inline-end: 15px;
				padding-block-start: 6px;
				padding-block-end: 6px;
				border-block-end: 1px solid #e1e8ed;
			}

			.gjs-reviews .slide-header .slide-header-name {
				color: #1c2022;
				font-weight: 600;
				font-style: normal;
				font-size: 14px;
				line-height: 1.5;
			}

			.gjs-reviews .slide-header .slide-header-title {
				color: #697882;
				font-size: 12.5px;
				font-weight: 400;
			}

			.gjs-reviews .slide-header .slide-stars {
				display: inline-block;
				height: 11.4px;
				width: 68px;
				background-size: 14px 11.4px;
				background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.44 19'><polygon fill='%2380868b' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19'/></svg>");
				background-repeat: repeat-x;
				overflow: hidden;
				position: relative;
			}

			.gjs-reviews .slide-header .slide-stars-inner {
				display: block;
				height: 11.4px;
				width: 68px;
				background-size: 14px 11.4px;
				background-image: url("data:image/svg+xml,<svg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 23.44 19'><polygon fill='%23f0ad4e' points='10,15.27 16.18,19 14.54,11.97 20,7.24 12.81,6.63 10,0 7.19,6.63 0,7.24 5.46,11.97 3.82,19'/></svg>");
				background-repeat: repeat-x;
			}

			.gjs-reviews .slide-header .slide-header-icon {
				font-size: 17px;
				margin-inline-start: auto;
			}
			
			.gjs-reviews .slide-header .slide-header-icon svg {
				min-height: 1em;
				min-width: 1em;
				fill: currentColor;
			}

			.gjs-reviews .slide-footer {
				padding-inline-start: 15px;
				padding-inline-end: 15px;
				padding-block-start: 6px;
				padding-block-end: 15px;
			}

			.gjs-reviews .slide-footer .slide-review-text {
				font-size: 14px;
				font-weight: 400;
				line-height: 20px;
			}

			.gjs-reviews .slider-content__controls {
				display: flex;
				justify-content: center;
				padding: 1rem;
			}

			.gjs-reviews .prev-arrow {
				position: absolute;
				top: calc(50% - 40px / 2);
				left: 10px;
				width: 10px;
				cursor: pointer;
				color: rgba(0, 0, 0, 0.3);
				transform: translateY(-50%);
				transition: all 0.3s;
			}

			.gjs-reviews .next-arrow {
				position: absolute;
				top: calc(50% - 40px / 2);
				right: 10px;
				width: 10px;
				cursor: pointer;
				color: rgba(0, 0, 0, 0.3);
				transform: translateY(-50%);
				transition: all 0.3s;
			}

			.gjs-reviews .prev-arrow:hover,
			.gjs-reviews .next-arrow:hover {
				color: rgba(0, 0, 0, 0.7);
			}

			.gjs-reviews .dots {
				display: flex;
			}

			.gjs-reviews .dot {
				cursor: pointer;
				width: 8px;
				height: 8px;
				margin-right: 4px;
				background-color: rgba(0, 0, 0, 0.3);

				border-radius: 50%;
				transition: all 0.3s;
			}

			.gjs-reviews .dot:last-child {
				margin-right: 0;
			}

			.gjs-reviews .dot:not(.dot--active):hover {
				background-color: rgba(0, 0, 0, 0.5);
			}

			.gjs-reviews .dot--active {
				background-color: rgb(0, 0, 0);
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
		</style>
    `,
    category,
    attributes: {
      title: 'Reviews'
    }
  });

  bm.add(Types.CAROUSEL, {
    label: 'Carousel',
    content: { type: 'carousel', attributes: { class: 'carousel' } },
    media: SVG_MAP.carouselSvg,
    category
  });

  bm.add(Types.HTML, {
    label: 'HTML',
    content: { type: Types.HTML, attributes: { class: Types.HTML } },
    media: SVG_MAP.htmlSvg,
    category
  });

  bm.add(Types.ACCORDION, {
    label: 'Accordion',
    content: { type: Types.ACCORDION, attributes: { class: Types.ACCORDION } },
    media: SVG_MAP.accordionSvg,
    category
  });
};

export default advancedPlugin;
