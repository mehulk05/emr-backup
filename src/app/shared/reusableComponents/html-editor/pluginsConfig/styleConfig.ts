const StyleConfig = {
  styleManagerSectors: [
    {
      name: 'General',
      buildProps: [
        'float',
        'display',
        'position',
        'top',
        'right',
        'left',
        'bottom'
      ],
      properties: [
        {
          property: 'float',
          type: 'radio',
          defaults: 'none',
          list: [
            { value: 'none', className: 'fa fa-times' },
            { value: 'left', className: 'fa fa-align-left' },
            { value: 'right', className: 'fa fa-align-right' }
          ]
        },
        { property: 'position', type: 'select' }
      ]
    },
    {
      name: 'Dimension',
      open: false,
      buildProps: [
        'width',
        'flex-width',
        'height',
        'max-width',
        'min-height',
        'margin',
        'padding'
      ],
      properties: [
        {
          id: 'flex-width',
          type: 'integer',
          name: 'Width',
          units: ['px', '%'],
          property: 'flex-basis',
          toRequire: 1
        },
        {
          property: 'margin',
          properties: [
            { name: 'Top', property: 'margin-top' },
            { name: 'Right', property: 'margin-right' },
            { name: 'Bottom', property: 'margin-bottom' },
            { name: 'Left', property: 'margin-left' }
          ]
        },
        {
          property: 'padding',
          properties: [
            { name: 'Top', property: 'padding-top' },
            { name: 'Right', property: 'padding-right' },
            { name: 'Bottom', property: 'padding-bottom' },
            { name: 'Left', property: 'padding-left' }
          ]
        }
      ]
    },
    {
      name: 'Typography',
      open: false,
      buildProps: [
        'font-family',
        'font-size',
        'font-weight',
        'letter-spacing',
        'color',
        'line-height',
        'text-align',
        'text-decoration',
        'text-shadow'
      ],
      properties: [
        { name: 'Font', property: 'font-family' },
        { name: 'Weight', property: 'font-weight' },
        { name: 'Font color', property: 'color' },
        {
          property: 'text-align',
          type: 'radio',
          defaults: 'left',
          list: [
            {
              value: 'left',
              name: 'Left',
              className: 'fa fa-align-left'
            },
            {
              value: 'center',
              name: 'Center',
              className: 'fa fa-align-center'
            },
            {
              value: 'right',
              name: 'Right',
              className: 'fa fa-align-right'
            },
            {
              value: 'justify',
              name: 'Justify',
              className: 'fa fa-align-justify'
            }
          ]
        },
        {
          property: 'text-decoration',
          type: 'radio',
          defaults: 'none',
          list: [
            { value: 'none', name: 'None', className: 'fa fa-times' },
            {
              value: 'underline',
              name: 'underline',
              className: 'fa fa-underline'
            },
            {
              value: 'line-through',
              name: 'Line-through',
              className: 'fa fa-strikethrough'
            }
          ]
        },
        {
          property: 'text-shadow',
          properties: [
            { name: 'X position', property: 'text-shadow-h' },
            { name: 'Y position', property: 'text-shadow-v' },
            { name: 'Blur', property: 'text-shadow-blur' },
            { name: 'Color', property: 'text-shadow-color' }
          ]
        }
      ]
    },
    {
      name: 'Decorations',
      open: false,
      buildProps: [
        'opacity',
        'border-radius',
        'border',
        'box-shadow',
        'background-bg'
      ],
      properties: [
        {
          type: 'slider',
          property: 'opacity',
          defaults: 1,
          step: 0.01,
          max: 1,
          min: 0
        },
        {
          property: 'border-radius',
          properties: [
            { name: 'Top', property: 'border-top-left-radius' },
            { name: 'Right', property: 'border-top-right-radius' },
            { name: 'Bottom', property: 'border-bottom-left-radius' },
            { name: 'Left', property: 'border-bottom-right-radius' }
          ]
        },
        {
          property: 'box-shadow',
          properties: [
            { name: 'X position', property: 'box-shadow-h' },
            { name: 'Y position', property: 'box-shadow-v' },
            { name: 'Blur', property: 'box-shadow-blur' },
            { name: 'Spread', property: 'box-shadow-spread' },
            { name: 'Color', property: 'box-shadow-color' },
            { name: 'Shadow type', property: 'box-shadow-type' }
          ]
        },
        {
          id: 'background-bg',
          property: 'background',
          type: 'bg'
        }
      ]
    },
    {
      name: 'Extra',
      open: false,
      buildProps: ['transition', 'perspective', 'transform'],
      properties: [
        {
          property: 'transition',
          properties: [
            { name: 'Property', property: 'transition-property' },
            { name: 'Duration', property: 'transition-duration' },
            { name: 'Easing', property: 'transition-timing-function' }
          ]
        },
        {
          property: 'transform',
          properties: [
            { name: 'Rotate X', property: 'transform-rotate-x' },
            { name: 'Rotate Y', property: 'transform-rotate-y' },
            { name: 'Rotate Z', property: 'transform-rotate-z' },
            { name: 'Scale X', property: 'transform-scale-x' },
            { name: 'Scale Y', property: 'transform-scale-y' },
            { name: 'Scale Z', property: 'transform-scale-z' }
          ]
        }
      ]
    },
    {
      name: 'Flex',
      open: false,
      properties: [
        'flex-direction',
        'flex-wrap',
        'justify-content',
        'align-items',
        'align-content',
        'order',
        'flex-basis',
        'flex-grow',
        'flex-shrink',
        'align-self'
      ]
    }
  ]
};

export default StyleConfig;
