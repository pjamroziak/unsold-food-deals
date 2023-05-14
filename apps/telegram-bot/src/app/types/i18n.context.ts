export type I18nContext = {
  t: (name: string, pattern?: Record<string, unknown>) => string;
  i18nLocale: string;
};
