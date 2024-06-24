export const RegexEnum = {
  textFeild: '^[a-zA-Z]*$',
  //   phone: '^[0-9]{9,10}$',
  phone: '^[0-9]{10}$',
  //   phone: /^\d{9,10}$/,
  userNameWithSpecial: '^[a-zA-Z0-9]*$',
  folderNameRegex: /^[^\\/:*?"<>|]+[^\\/:*?"<>|.\s]$/,

  anythingExceptSpace: '^[^\n ]*$',
  amount: '^([0-9]+(.[0-9]+)?)',
  numeric: '^[0-9]*.?[0-9]+$',
  alpha_spaces: '[a-zA-Z][a-zA-Z ]+',
  // eslint-disable-next-line prettier/prettier
  alphabetNew: '^[a-zA-Zs]+$',
  textField_Spaces: /^(\s+\S+\s*)*(?!\s).*$/,
  email1: '^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,10}$',
  email: '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,10}$',
  mobile: '^[1-9][0-9]{9}$',
  url: '(https?://)?([\\da-z.-]+)\\.([a-z.]{2,6})[/\\w .-]*/?',
  httpUrl:
    /^(http(s)?:\/\/)[\w.-]+(?:\.[\w\.-]+)+[\w\-\._~:/?#[\]@!\$&'\(\)\*\+,;=.]+$/,
  httpUrlRegex:
    /[(http(s)?):\/\/(www\.)?a-zA-Z0-9@:%._\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\+.~#?&//=]*)/,
  zipcode: '^[0-9]{5}(?:-[0-9]{4})?$',
  httpUrlRegexLessRestrictive: `^(https?://)[\w.-]+(?:\.[\w\.-]+)+(/[\w\-\._~:/?#[\]@!\$&'()*+,;=]*)?`,
  passwordValidation:
    '^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[@$!])[a-zA-Z0-9@$!]{8,}$',
  chatTime: /^(0[0-9]|1[0-2]):[0-5][0-9]([ ])(AM|PM)$/,
  hashtag: /^(#[a-zA-Z0-9]+,? *)*#[a-zA-Z0-9]+$/,
  DD_MM_YYY_FORMAT:
    // eslint-disable-next-line prettier/prettier
    '^(0?[1-9]|[12][0-9]|3[01])[-/](0?[1-9]|1[012])[-/]((?:19|20|21)[0-9][0-9])$',

  MM_DD_YYYY_FORMAT:
    // eslint-disable-next-line prettier/prettier
    '^(0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])[-/]((?:19|20|21)[0-9][0-9])$',

  YYYY_MM_DD_FORMAT:
    // eslint-disable-next-line prettier/prettier
    '^((?:19|20|21)[0-9][0-9])[-/](0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])$',

  /* -------------------------------------------------------------------------- */
  /*                            BELOW ARE NOT CORRECT                           */
  /* -------------------------------------------------------------------------- */
  UNFORMATTED_DD_MM_YYY_FORMAT:
    // eslint-disable-next-line prettier/prettier
    '^(0?[1-9]|[12][0-9]|3[01])[-/](0?[1-9]|1[012])[-/]((?:19|20|21)[0-9][0-9])$',

  UNFORMATTED_MM_DD_YYYY_FORMAT:
    // eslint-disable-next-line prettier/prettier
    '^(0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])[-/]((?:19|20|21)[0-9][0-9])$',

  UNFORMATTED_YYYY_MM_DD_FORMAT:
    // eslint-disable-next-line prettier/prettier
    '^((?:19|20|21)[0-9][0-9])[-/](0?[1-9]|1[012])[-/](0?[1-9]|[12][0-9]|3[01])$'
};
