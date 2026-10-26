// Integração Opcional com Firebase SDK
// Se as variáveis de ambiente estiverem configuradas, conecta com Firestore/Auth na nuvem;
// caso contrário, utiliza a camada reativa local com IndexedDB/LocalStorage.

export interface FirebaseConfig {
  apiKey?: string;
  authDomain?: string;
  projectId?: string;
  storageBucket?: string;
  messagingSenderId?: string;
  appId?: string;
}

export function getFirebaseConfig(): FirebaseConfig {
  return {
    apiKey: import.meta.env.VITE_FIREBASE_API_KEY || localStorage.getItem('nexai_fb_api_key') || undefined,
    authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || localStorage.getItem('nexai_fb_auth_domain') || undefined,
    projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || localStorage.getItem('nexai_fb_project_id') || undefined,
    storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || localStorage.getItem('nexai_fb_storage_bucket') || undefined,
    messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || localStorage.getItem('nexai_fb_sender_id') || undefined,
    appId: import.meta.env.VITE_FIREBASE_APP_ID || localStorage.getItem('nexai_fb_app_id') || undefined,
  };
}

export function isFirebaseConfigured(): boolean {
  const config = getFirebaseConfig();
  return Boolean(config.apiKey && config.projectId);
}
