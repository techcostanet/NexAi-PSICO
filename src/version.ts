export interface AppVersionInfo {
  version: string;
  buildDate: string;
  environment: string;
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: '1.0.6',
  buildDate: '2026-10-30T14:09:18.983Z',
  environment: 'production',
};

export const APP_VERSION = APP_VERSION_INFO.version;
