export interface AppVersionInfo {
  version: string;
  buildDate: string;
  environment: string;
}

export const APP_VERSION_INFO: AppVersionInfo = {
  version: '1.0.9',
  buildDate: '2026-10-30T20:04:28.588Z',
  environment: 'production',
};

export const APP_VERSION = APP_VERSION_INFO.version;
