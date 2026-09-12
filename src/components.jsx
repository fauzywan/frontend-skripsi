export const Icon = ({ name, size = 20 }) => {
  const paths = {
    upload: <><path d="M12 16V4m0 0L7 9m5-5 5 5"/><path d="M5 15v4h14v-4"/></>,
    dashboard: <><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></>,
    chart: <><path d="M4 20V10m6 10V4m6 16v-7m5 7H2"/></>,
    table: <><rect x="3" y="4" width="18" height="16" rx="2"/><path d="M3 10h18M9 4v16"/></>,
    download: <><path d="M12 3v12m0 0 5-5m-5 5-5-5"/><path d="M5 21h14"/></>,
    file: <><path d="M6 2h8l4 4v16H6z"/><path d="M14 2v5h5"/></>,
    check: <path d="m5 12 4 4L19 6"/>,
    menu: <path d="M4 7h16M4 12h16M4 17h16"/>,
    close: <path d="m6 6 12 12M18 6 6 18"/>,
  };
  return <svg className="icon" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">{paths[name]}</svg>;
};

export function EmptyState({ title = 'Belum ada hasil analisis', children, onUpload }) {
  return <div className="empty card"><div className="empty-icon"><Icon name="chart" size={30}/></div><h3>{title}</h3><p>{children || 'Unggah dataset CSV terlebih dahulu untuk menampilkan informasi pada halaman ini.'}</p><button className="button primary" onClick={onUpload}><Icon name="upload"/>Unggah dataset</button></div>;
}

export function StatCard({ label, value, note, tone = 'default' }) {
  return <article className={`stat-card ${tone}`}><span>{label}</span><strong>{value}</strong><small>{note}</small></article>;
}

export function SentimentBars({ counts }) {
  const items = [['Positif', counts.positive, 'positive'], ['Netral', counts.neutral, 'neutral'], ['Negatif', counts.negative, 'negative']];
  const total = Math.max(1, items.reduce((sum, [, value]) => sum + value, 0));
  return <div className="bars">{items.map(([label, value, tone]) => { const percentage = Math.round(value / total * 100); return <div className="bar-row" key={label}><div><b>{label}</b><span>{value} data · {percentage}%</span></div><div className="track"><i className={tone} style={{ width: `${percentage}%` }}/></div></div>})}</div>;
}
