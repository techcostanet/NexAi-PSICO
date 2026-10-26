export interface AppVersionInfo {
  version: string;
  buildDate: string;
  environment: string;
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: '1.0.3',
  buildDate: '2026-10-26T20:53:43.006Z',
  environment: 'production',
};

export const APP_VERSION = APP_VERSION_INFO.version;
