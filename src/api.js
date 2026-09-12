import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';

const API_BASE = (import.meta.env.VITE_API_BASE_URL || 'http://127.0.0.1:8000').replace(/\/$/, '');

async function parseError(response) {
  try {
    const data = await response.json();
    return data.message || data.error || 'Permintaan gagal.';
  } catch {
    return `Permintaan gagal (${response.status}).`;
  }
}

export async function analyzeCsv(file) {
  const body = new FormData();
  body.append('file', file);
  const response = await fetch(`${API_BASE}/api/analyze-csv`, { method: 'POST', body });
  if (!response.ok) throw new Error(await parseError(response));
  return response.json();
}

export async function downloadCsv(file) {
  if (!file) throw new Error('Dataset sumber tidak tersedia. Unggah ulang dataset.');
  const body = new FormData();
  body.append('file', file);
  const response = await fetch(`${API_BASE}/api/download-csv`, { method: 'POST', body });
  if (!response.ok) throw new Error(await parseError(response));
  await saveResponseBlob(response, 'hasil-klasifikasi.csv');
}

async function saveResponseBlob(response, fallbackName) {
  const blob = await response.blob();
  const disposition = response.headers.get('content-disposition') || '';
  const filename = disposition.match(/filename\*?=(?:UTF-8''|")?([^";]+)/i)?.[1] || fallbackName;
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = decodeURIComponent(filename.replaceAll('"', ''));
  document.body.appendChild(link);
  link.click();
  link.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

export function downloadPdf(result, counts, rows) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const total = counts.positive + counts.neutral + counts.negative;
  const metrics = result?.model?.metrics || {};
  const percent = (value) => `${((value / Math.max(1, total)) * 100).toFixed(2)}%`;

  doc.setFillColor(23, 61, 51);
  doc.rect(0, 0, 210, 34, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(18);
  doc.text('Laporan Analisis Sentimen Na Willa', 15, 17);
  doc.setFontSize(9);
  doc.text(`Model: ${result?.model?.name || 'Support Vector Machine'}`, 15, 25);

  doc.setTextColor(30, 48, 43);
  doc.setFontSize(12);
  doc.text('Ringkasan Dataset', 15, 46);
  autoTable(doc, {
    startY: 51,
    theme: 'grid',
    head: [['Informasi', 'Nilai']],
    body: [
      ['Nama file', result?.filename || '-'],
      ['Total data', String(result?.summary?.total_data ?? total)],
      ['Data dianalisis', String(result?.summary?.total_dianalisis ?? total)],
      ['Data tidak dianalisis', String(result?.summary?.total_tidak_dianalisis ?? 0)],
    ],
    headStyles: { fillColor: [23, 61, 51] },
  });

  const summaryY = doc.lastAutoTable.finalY + 10;
  doc.text('Distribusi Sentimen', 15, summaryY);
  autoTable(doc, {
    startY: summaryY + 5,
    theme: 'striped',
    head: [['Sentimen', 'Jumlah', 'Persentase']],
    body: [
      ['Positif', counts.positive, percent(counts.positive)],
      ['Netral', counts.neutral, percent(counts.neutral)],
      ['Negatif', counts.negative, percent(counts.negative)],
    ],
    headStyles: { fillColor: [46, 139, 104] },
  });

  const metricY = doc.lastAutoTable.finalY + 10;
  doc.text('Performa Model pada Data Uji', 15, metricY);
  autoTable(doc, {
    startY: metricY + 5,
    theme: 'grid',
    head: [['Accuracy', 'Macro Precision', 'Macro Recall', 'Macro F1']],
    body: [[metrics.accuracy, metrics.precision_macro, metrics.recall_macro, metrics.macro_f1]
      .map((value) => value == null ? '-' : Number(value).toFixed(4))],
    headStyles: { fillColor: [23, 61, 51] },
  });

  doc.addPage();
  doc.setFontSize(12);
  doc.text('Sampel Hasil Klasifikasi', 15, 16);
  autoTable(doc, {
    startY: 21,
    theme: 'striped',
    head: [['No.', 'Teks Ulasan', 'Prediksi']],
    body: rows.slice(0, 100).map((row, index) => [
      index + 1,
      String(row.review_text || '-'),
      String(row.predicted_sentiment || '-'),
    ]),
    columnStyles: { 0: { cellWidth: 12 }, 2: { cellWidth: 28 } },
    headStyles: { fillColor: [23, 61, 51] },
    styles: { fontSize: 8, overflow: 'linebreak' },
  });

  doc.setFontSize(8);
  doc.setTextColor(95, 110, 104);
  doc.text('Dihasilkan oleh Sistem Analisis Sentimen Na Willa', 15, 290);
  doc.save('laporan-analisis-sentimen-na-willa.pdf');
}
