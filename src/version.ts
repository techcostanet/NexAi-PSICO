export interface AppVersionInfo {
  version: string;
  buildDate: string;
  environment: string;
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: '1.0.4',
  buildDate: '2026-10-30T13:32:10.159Z',
  environment: 'production',
};

export const APP_VERSION = APP_VERSION_INFO.version;
