import SVG_MAP from '../pluginsConfig/svgConfig';

const businessPlugin = (editor: any, options: any = {}) => {
  console.log(options);

  const category: string = options.category || 'Business';
  const businessInfo: any = options.businessInfo || {};
  const clinicInfo: any = options.clinicInfo || {};

  editor.Blocks.add('businessName', {
    label: 'Business Name',
    media: SVG_MAP.businessNameSvg,
    category,
    content: {
      type: 'text',
      style: { padding: '10px' },
      content: businessInfo?.businessName ?? 'Insert your Business Name',
      attributes: {
        title: 'Business Name'
      }
    },
    attributes: {
      title: 'Business Name'
    }
  });

  editor.Blocks.add('businessLogo', {
    label: 'Business Logo',
    media: SVG_MAP.businessLogoSvg,
    category,
    content: {
      type: 'image',
      attributes: {
        alt: businessInfo?.businessName ?? 'Business Logo',
        width: '150px',
        src: businessInfo.businessLogo
      }
    },
    attributes: {
      title: 'Business Logo'
    }
  });

  editor.Blocks.add('agencyName', {
    label: 'Agency Name',
    media: SVG_MAP.agencyNameSvg,
    category,
    content: {
      type: 'text',
      style: { padding: '10px' },
      content: businessInfo?.agencyName ?? 'Insert your Agency Name',
      attributes: {
        title: 'Agency Name'
      }
    },
    attributes: {
      title: 'Agency Name'
    }
  });

  editor.Blocks.add('agencyLogo', {
    label: 'Agency Logo',
    media: SVG_MAP.agencyLogoSvg,
    category,
    content: {
      type: 'image',
      attributes: {
        alt: businessInfo?.agencyName ?? 'Agency Logo',
        width: '150px',
        src: businessInfo.agencyLogo
      }
    },
    attributes: {
      title: 'Agency Logo'
    }
  });

  editor.Blocks.add('clinicAbout', {
    label: 'Clinic About',
    media: SVG_MAP.clinicAboutSvg,
    category,
    content: {
      type: 'text',
      style: { padding: '10px' },
      content: clinicInfo?.clinicAbout ?? 'Insert your CLinic About',
      attributes: {
        title: 'Clinic About'
      }
    },
    attributes: {
      title: 'Clinic About'
    }
  });

  editor.Blocks.add('clinicAddress', {
    label: 'Clinic Address',
    media: SVG_MAP.clinicAddressSvg,
    category,
    content: {
      type: 'text',
      style: { padding: '10px' },
      content: clinicInfo?.clinicAddress ?? 'Insert your CLinic Address',
      attributes: {
        title: 'Clinic Address'
      }
    },
    attributes: {
      title: 'Clinic Address'
    }
  });

  editor.Blocks.add('clinicContactNumber', {
    label: 'Contact Number',
    media: SVG_MAP.clinicContactNumberSvg,
    category,
    content: {
      type: 'text',
      style: { padding: '10px' },
      content:
        clinicInfo?.clinicContactNumber ?? 'Insert your CLinic Contact Number',
      attributes: {
        title: 'Clinic Contact Number'
      }
    },
    attributes: {
      title: 'Clinic Contact Number'
    }
  });

  editor.Blocks.add('clinicWebsite', {
    label: 'Clinic Website',
    media: SVG_MAP.clinicWebsiteSvg,
    category,
    content: {
      type: 'link',
      content: clinicInfo?.clinicWebsite ?? 'Insert you Clinic Website',
      attributes: {
        href: clinicInfo?.clinicWebsite ?? '',
        title: 'Clinic Website',
        target: '_blank'
      }
    },
    attributes: {
      title: 'Clinic Website'
    }
  });
};

export default businessPlugin;
