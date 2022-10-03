module.exports = {
  locales: ['en', 'fr'],
  defaultLocale: 'en',
  pages: {
    '*': ['common'],
    '/': ['auth'],
    '/nof1': ['nof1List', 'createTest', 'importData', 'mail'],
    '/create-test': ['createTest'],
    '/profile': ['profile'],
    '/import-data': ['importData'],
    '/results': ['results', 'createTest'],
  },
};

