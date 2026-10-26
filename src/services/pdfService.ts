import { jsPDF } from 'jspdf';
import { TransacaoFinanceira } from '../types';

/**
 * Converte múltiplas páginas capturadas em um PDF estruturado
 */
export async function gerarPdfProntuarioFisico(
  paginasBase64: string[],
  pacienteNome: string,
  cpf: string
): Promise<{ pdfBlob: Blob; pdfDataUri: string }> {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });

  const pageWidth = 210;
  const pageHeight = 297;

  paginasBase64.forEach((imgData, index) => {
    if (index > 0) {
      doc.addPage();
    }

    // Cabeçalho de auditoria do prontuário
    doc.setFillColor(15, 118, 110); // Brand teal
    doc.rect(0, 0, pageWidth, 12, 'F');
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'bold');
    doc.text(`NexAi-PSICO | Prontuário Histórico Digitalizado - Paciente: ${pacienteNome} (CPF: ${cpf})`, 10, 8);
    doc.text(`Pág ${index + 1}/${paginasBase64.length}`, pageWidth - 25, 8);

    // Adiciona a imagem escaneada na página
    const margin = 10;
    const imgWidth = pageWidth - margin * 2;
    const imgHeight = pageHeight - margin * 2 - 15;

    try {
      doc.addImage(imgData, 'JPEG', margin, 18, imgWidth, imgHeight, undefined, 'FAST');
    } catch (e) {
      // Fallback para PNG caso necessário
      doc.addImage(imgData, 'PNG', margin, 18, imgWidth, imgHeight, undefined, 'FAST');
    }

    // Rodapé de segurança LGPD
    doc.setFontSize(7);
    doc.setTextColor(100, 116, 139);
    doc.setFont('helvetica', 'normal');
    doc.text(
      `Digitalizado via NexAi-PSICO em ${new Date().toLocaleDateString('pt-BR')} ${new Date().toLocaleTimeString('pt-BR')} - Documento com Sigilo Médico / CFM e CFP`,
      pageWidth / 2,
      pageHeight - 5,
      { align: 'center' }
    );
  });

  const pdfBlob = doc.output('blob');
  const pdfDataUri = doc.output('datauristring');

  return { pdfBlob, pdfDataUri };
}

/**
 * Gera Recibo Médico Oficial em PDF pronto para Imposto de Renda / DMED
 */
export function gerarReciboPdf(transacao: TransacaoFinanceira, clinicaNome: string = 'NexAi Clínica de Psiquiatria & Psicologia'): void {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a5', // Formato A5 clássico de receituário/recibo
  });

  const pageWidth = 148;
  const pageHeight = 210;

  // Barra de topo elegante
  doc.setFillColor(30, 50, 92); // Navy
  doc.rect(0, 0, pageWidth, 18, 'F');

  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(clinicaNome.toUpperCase(), pageWidth / 2, 10, { align: 'center' });
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.text('RECIBO DE PRESTAÇÃO DE SERVIÇOS DE SAÚDE', pageWidth / 2, 15, { align: 'center' });

  // Número do Recibo e Data
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text(`Recibo Nº: ${transacao.numeroRecibo || 'REC-' + transacao.id.substring(0, 8)}`, 14, 28);
  doc.setFont('helvetica', 'normal');
  doc.text(`Data: ${new Date(transacao.dataPagamento || transacao.dataVencimento).toLocaleDateString('pt-BR')}`, pageWidth - 14, 28, { align: 'right' });

  // Linha divisória
  doc.setDrawColor(226, 232, 240);
  doc.line(14, 32, pageWidth - 14, 32);

  // Valor em Destaque
  doc.setFillColor(240, 253, 249);
  doc.roundedRect(14, 36, pageWidth - 28, 16, 2, 2, 'F');
  doc.setTextColor(15, 118, 110);
  doc.setFontSize(14);
  doc.setFont('helvetica', 'bold');
  doc.text(`VALOR: R$ ${transacao.valor.toFixed(2).replace('.', ',')}`, pageWidth / 2, 46, { align: 'center' });

  // Corpo do Recibo
  doc.setTextColor(51, 65, 85);
  doc.setFontSize(9.5);
  doc.setFont('helvetica', 'normal');

  const corpoTexto = `Recebi(emos) de ${transacao.pacienteNome.toUpperCase()}, inscrito(a) no CPF sob o nº ${transacao.emitirParaCpf || transacao.pacienteCpf}, a importância de R$ ${transacao.valor.toFixed(2).replace('.', ',')} referente a: ${transacao.discriminacaoServico || 'Consulta e Avaliação Especializada em Saúde Mental'}.`;

  const splitText = doc.splitTextToSize(corpoTexto, pageWidth - 28);
  doc.text(splitText, 14, 60);

  // Dados do Profissional Emissor
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.text('Dados do Profissional Responsável:', 14, 95);
  doc.setFont('helvetica', 'normal');
  doc.text(`Nome: ${transacao.profissionalNome}`, 14, 102);
  doc.text(`Registro: ${transacao.profissionalRegistro}`, 14, 108);
  doc.text(`Forma de Pagamento: ${transacao.metodoPagamento.toUpperCase()}`, 14, 114);

  // Linha de Assinatura
  doc.line(30, 155, pageWidth - 30, 155);
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.text(transacao.profissionalNome, pageWidth / 2, 160, { align: 'center' });
  doc.setFont('helvetica', 'normal');
  doc.text(transacao.profissionalRegistro, pageWidth / 2, 165, { align: 'center' });

  // Rodapé Fiscal
  doc.setFontSize(7);
  doc.setTextColor(148, 163, 184);
  doc.text(
    'Documento emitido eletronicamente para fins de comprovação e dedução de despesas médicas (DMED / IRPF).',
    pageWidth / 2,
    pageHeight - 10,
    { align: 'center' }
  );

  // Download automático
  const nomeLimpo = transacao.pacienteNome.replace(/[^a-zA-Z0-9]/g, '_');
  doc.save(`Recibo_${transacao.numeroRecibo || 'Med'}_${nomeLimpo}.pdf`);
}
