export interface AppVersionInfo {
  version: string;
  buildDate: string;
  environment: string;
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: '1.0.10',
  buildDate: '2026-10-30T20:43:32.108Z',
  environment: 'production',
};

export const APP_VERSION = APP_VERSION_INFO.version;
