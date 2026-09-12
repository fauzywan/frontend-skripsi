import { useRef, useState } from 'react';
import { Icon } from '../components.jsx';

export default function UploadPage({ onAnalyze, loading, error }) {
  const [file, setFile] = useState(null);
  const input = useRef();
  const select = (candidate) => {
    if (!candidate) return;
    if (!candidate.name.toLowerCase().endsWith('.csv')) return window.alert('Pilih berkas dengan format CSV.');
    if (candidate.size > 10 * 1024 * 1024) return window.alert('Ukuran file maksimum 10 MB.');
    setFile(candidate);
  };

  return <section><div className="page-heading"><div><span className="eyebrow">Mulai analisis</span><h1>Unggah Dataset</h1><p>Masukkan dataset ulasan berformat CSV untuk diproses menggunakan model Support Vector Machine.</p></div></div><div className="upload-layout"><div className="card upload-card"><div className="steps"><span className="active">1</span><i/><span className={loading ? 'active' : ''}>2</span><i/><span>3</span></div><div className="step-labels"><b>Pilih dataset</b><span>Proses analisis</span><span>Lihat hasil</span></div><div className={`drop-zone ${file ? 'has-file' : ''}`} onDragOver={(event) => event.preventDefault()} onDrop={(event) => { event.preventDefault(); select(event.dataTransfer.files[0]); }} onClick={() => input.current.click()}><input ref={input} type="file" accept=".csv,text/csv" hidden onChange={(event) => select(event.target.files[0])}/><div className="upload-icon"><Icon name={file ? 'check' : 'upload'} size={30}/></div>{file ? <><h3>{file.name}</h3><p>{(file.size / 1024).toFixed(1)} KB · Siap dianalisis</p></> : <><h3>Tarik dan letakkan file CSV di sini</h3><p>atau klik untuk memilih file dari perangkat</p></>}</div>{error && <div className="error" role="alert">{error}</div>}<button className="button primary wide" disabled={!file || loading} onClick={() => onAnalyze(file)}>{loading ? <span className="spinner"/> : <Icon name="chart"/>}{loading ? 'Menganalisis dataset…' : 'Analisis Dataset'}</button></div><aside className="card guide"><h3>Panduan dataset</h3><p>Pastikan file memenuhi ketentuan berikut:</p><ul><li>Format file <b>.CSV</b> dengan encoding UTF-8</li><li>Memiliki kolom wajib <b>review_text</b></li><li>Baris pertama berisi nama kolom</li><li>Ukuran maksimum 10 MB</li></ul><div className="note"><b>Contoh struktur</b><code>review_text<br/>"Filmnya sangat bagus"<br/>"Ceritanya cukup lambat"</code></div></aside></div></section>;
}
