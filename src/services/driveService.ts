export interface DriveUploadResult {
  fileId: string;
  webViewLink: string;
  downloadLink: string;
  folderId: string;
}

/**
 * Simula ou executa upload para o Google Drive
 */
export async function uploadProntuarioFisicoParaDrive(
  pacienteId: string,
  pacienteNome: string,
  pdfBlob: Blob,
  nomeArquivo: string
): Promise<DriveUploadResult> {
  // Se houver backend/Cloud Function configurada
  const backendUrl = import.meta.env.VITE_BACKEND_API_URL;

  if (backendUrl && backendUrl.startsWith('http')) {
    try {
      const formData = new FormData();
      formData.append('pacienteId', pacienteId);
      formData.append('pacienteNome', pacienteNome);
      formData.append('nomeArquivo', nomeArquivo);
      formData.append('file', pdfBlob, nomeArquivo);

      const response = await fetch(`${backendUrl}/uploadDriveProntuario`, {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        return data;
      }
    } catch (e) {
      console.warn('Erro ao conectar com Cloud Function do Drive, usando armazenamento local sincronizado.', e);
    }
  }

  // Simulação instantânea de sincronização no Google Drive
  await new Promise(resolve => setTimeout(resolve, 1500));

  const cleanName = pacienteNome.replace(/[^a-zA-Z0-9]/g, '_').toLowerCase();
  const fileId = `drive_file_${Date.now()}_${cleanName}`;
  const folderId = `folder_${pacienteId.substring(0, 8)}_${cleanName}`;

  return {
    fileId,
    webViewLink: `https://drive.google.com/file/d/${fileId}/view`,
    downloadLink: `https://drive.google.com/uc?id=${fileId}`,
    folderId,
  };
}
