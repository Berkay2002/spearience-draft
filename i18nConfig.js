const i18nConfig = {
  locales: ['en', 'sv'],
  defaultLocale: 'en',
  prefixDefault: false, // Don't prefix default locale (en) 
  localeCookie: 'NEXT_LOCALE',
  serverSetCookie: 'always', // Always update cookie when locale changes
  cookieOptions: {
    sameSite: 'strict',
    maxAge: 60 * 60 * 24 * 365, // 1 year
    path: '/'
  }
};

module.exports = i18nConfig; 