const basicPlugin = (editor: any, options: any = {}) => {
  console.log(options);

  const category: string = options.category || 'Basic';

  // Add a button to the toolbar for each category

  editor.Blocks.add('bs1-block', {
    label: 'darsgan',
    content: '<h1>Put your darshan here</h1>',
    category,
    attributes: {
      title: 'Insert h1 block'
    }
  });

  editor.Blocks.add('bs2-block', {
    label: 'darsgan',
    content: '<h1>Put your darshan here</h1>',
    category,
    attributes: {
      title: 'Insert h1 block'
    }
  });
};

export default basicPlugin;
