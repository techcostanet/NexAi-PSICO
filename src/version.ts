export interface AppVersionInfo {
  version: string;
  buildDate: string;
  environment: string;
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: '1.0.13',
  buildDate: '2026-10-31T17:17:54.097Z',
  environment: 'production',
};

export const APP_VERSION = APP_VERSION_INFO.version;
