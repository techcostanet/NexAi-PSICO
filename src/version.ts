export interface AppVersionInfo {
  version: string;
  buildDate: string;
  environment: string;
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: '1.0.12',
  buildDate: '2026-10-31T17:07:46.099Z',
  environment: 'production',
};

export const APP_VERSION = APP_VERSION_INFO.version;
