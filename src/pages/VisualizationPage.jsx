import { useMemo } from "react";
import { EmptyState, SentimentBars } from "../components.jsx";

const ignoredWords = new Set(["yang", "dan", "di", "ke", "dari", "ini", "itu", "untuk", "dengan", "ada", "aku", "saya", "film", "filmnya", "juga", "karena", "aja", "nya", "the", "a", "of", "is", "to", "in"]);

export default function VisualizationPage({ data, counts, rows, onGoUpload }) {
  const keywords = useMemo(() => {
    const frequencies = {};
    rows.forEach((row) =>
      String(row.original_text || "")
        .toLowerCase()
        .replace(/[^a-zA-ZÀ-ÿ\s]/g, " ")
        .split(/\s+/)
        .forEach((word) => {
          if (word.length > 2 && !ignoredWords.has(word)) frequencies[word] = (frequencies[word] || 0) + 1;
        }),
    );
    return Object.entries(frequencies)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 24);
  }, [rows]);
  if (!data) return <EmptyState onUpload={onGoUpload} />;
  const total = Math.max(1, counts.positive + counts.neutral + counts.negative);
  const donut = `conic-gradient(#2e8b68 0 ${(counts.positive / total) * 100}%, #d3a642 0 ${((counts.positive + counts.neutral) / total) * 100}%, #c85d5d 0)`;
  console.log(keywords);

  return (
    <section>
      <div className="page-heading">
        <span className="eyebrow">Eksplorasi data</span>
        <h1>Visualisasi Sentimen</h1>
        <p>Perbandingan komposisi sentimen dan kata dominan pada dataset.</p>
      </div>
      <div className="visual-grid">
        <article className="card panel">
          <h2>Komposisi Sentimen</h2>
          <p>Persentase setiap kelas terhadap seluruh hasil valid.</p>
          <div className="donut-wrap">
            <div className="donut" style={{ background: donut }}>
              <div>
                <b>{total.toLocaleString("id-ID")}</b>
                <span>Data dianalisis</span>
              </div>
            </div>
            <div className="legend">
              <span>
                <i className="positive" />
                Positif
              </span>
              <span>
                <i className="neutral" />
                Netral
              </span>
              <span>
                <i className="negative" />
                Negatif
              </span>
            </div>
          </div>
        </article>
        <article className="card panel">
          <h2>Perbandingan Kategori</h2>
          <p>Jumlah dan persentase hasil klasifikasi.</p>
          <SentimentBars counts={counts} />
        </article>
      </div>
      <article className="card panel keyword-panel">
        <h2>Kata Dominan</h2>
        <p>Frekuensi kata pada ulasan yang dianalisis; ditampilkan sebagai word cloud sederhana.</p>
        <div className="word-cloud">
          {keywords.length ? (
            keywords.map(([word, frequency], index) => (
              <span key={word} style={{ fontSize: `${Math.max(13, 29 - index * 0.55)}px`, opacity: Math.max(0.55, 1 - index * 0.018) }} title={`${frequency} kemunculan`}>
                {word}
                <small>{frequency}</small>
              </span>
            ))
          ) : (
            <em>Tidak ada kata yang dapat ditampilkan.</em>
          )}
        </div>
      </article>
    </section>
  );
}
