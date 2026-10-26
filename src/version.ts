export interface AppVersionInfo {
  version: string;
  buildDate: string;
  environment: string;
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: '1.0.2',
  buildDate: '2026-10-26T20:35:38.160Z',
  environment: 'production',
};

export const APP_VERSION = APP_VERSION_INFO.version;
