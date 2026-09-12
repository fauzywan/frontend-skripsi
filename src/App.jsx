import { useMemo, useState } from 'react';
import { analyzeCsv, downloadCsv, downloadPdf } from './api.js';
import { Icon } from './components.jsx';
import UploadPage from './pages/UploadPage.jsx';
import DashboardPage from './pages/DashboardPage.jsx';
import VisualizationPage from './pages/VisualizationPage.jsx';
import ResultsPage from './pages/ResultsPage.jsx';

const nav = [['dashboard', 'Dashboard', 'dashboard'], ['visualization', 'Visualisasi', 'chart'], ['results', 'Hasil Klasifikasi', 'table']];
const labelKey = (value = '') => { const text = String(value).toLowerCase(); return text.includes('posit') ? 'positive' : text.includes('negat') ? 'negative' : 'neutral'; };

export default function App() {
  const [page, setPage] = useState('upload');
  const [result, setResult] = useState(null);
  const [sourceFile, setSourceFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [downloading, setDownloading] = useState(false);

  const rows = useMemo(() => result?.reviews || result?.results || result?.data || result?.predictions || [], [result]);
  const counts = useMemo(() => {
    const supplied = result?.summary || result?.counts || {};
    if (Object.keys(supplied).length) return {
      positive: Number(supplied.positive ?? supplied.positif ?? 0),
      neutral: Number(supplied.neutral ?? supplied.netral ?? 0),
      negative: Number(supplied.negative ?? supplied.negatif ?? 0),
    };
    return rows.reduce((accumulator, row) => {
      accumulator[labelKey(row.predicted_sentiment || row.sentiment || row.label || row.prediction)] += 1;
      return accumulator;
    }, { positive: 0, neutral: 0, negative: 0 });
  }, [result, rows]);

  async function upload(file) {
    setLoading(true); setError('');
    try {
      const data = await analyzeCsv(file);
      setSourceFile(file); setResult(data); setPage('dashboard');
    } catch (requestError) {
      setError(requestError.message);
    } finally { setLoading(false); }
  }

  async function getCsv() {
    setDownloading(true);
    try { await downloadCsv(sourceFile); }
    catch (requestError) { window.alert(requestError.message); }
    finally { setDownloading(false); }
  }

  function getPdf() {
    try { downloadPdf(result, counts, rows); }
    catch (requestError) { window.alert(`PDF gagal dibuat: ${requestError.message}`); }
  }

  function resetAnalysis() {
    setResult(null);
    setSourceFile(null);
    setError('');
    setPage('upload');
  }

  const props = { data: result, counts, rows, onGoUpload: () => setPage('upload'), onDownloadCsv: getCsv, onDownloadPdf: getPdf, downloading };
  if (!result) return <div className="upload-entry"><header><div className="brand entry-brand"><div className="brand-mark">NW</div><div><b>Na Willa</b><span>Sentiment Analytics</span></div></div><div className="entry-meta"><b>Sistem Analisis Sentimen</b><span>Model Support Vector Machine</span></div></header><main><UploadPage onAnalyze={upload} loading={loading} error={error}/></main><footer>© 2026 Na Willa · Aplikasi Analisis Sentimen untuk Penelitian Akademik</footer></div>;

  return <div className="workspace-app"><header className="workspace-header"><div className="header-main"><div className="brand top-brand"><div className="brand-mark">NW</div><div><b>Na Willa</b><span>Sentiment Analytics</span></div></div><div className="header-actions"><div className="dataset-status"><i/><div><b>Dataset siap</b><span>{result.filename || 'Dataset ulasan'}</span></div></div><button className="new-analysis" onClick={resetAnalysis}><Icon name="upload"/><span>Dataset Baru</span></button></div></div><nav className="workspace-nav">{nav.map(([id, label, icon]) => <button key={id} className={page === id ? 'active' : ''} onClick={() => setPage(id)}><Icon name={icon}/><span>{label}</span></button>)}</nav></header><div className="workspace-content"><main>{page === 'dashboard' && <DashboardPage {...props}/>} {page === 'visualization' && <VisualizationPage {...props}/>} {page === 'results' && <ResultsPage {...props}/>}</main><footer>© 2026 Na Willa · Aplikasi Analisis Sentimen untuk Penelitian Akademik</footer></div></div>;
}
