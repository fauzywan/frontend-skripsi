import { useMemo, useState } from "react";
import { EmptyState, Icon } from "../components.jsx";

const PAGE_SIZE = 10;

export default function ResultsPage({ data, rows, onGoUpload, onDownloadCsv }) {
  const [query, setQuery] = useState("");
  const [filter, setFilter] = useState("Semua");
  const [page, setPage] = useState(1);
  const filtered = useMemo(
    () =>
      rows.filter((row) => {
        const label = String(row.predicted_sentiment || row.sentiment || row.label || row.prediction || "Tidak dianalisis");
        const text = String(row.original_text || row.text || row.komentar || row.comment || row.ulasan || "");
        return (filter === "Semua" || label.toLowerCase() === filter.toLowerCase()) && text.toLowerCase().includes(query.toLowerCase());
      }),
    [rows, filter, query],
  );
  if (!data) return <EmptyState onUpload={onGoUpload} />;
  const pageCount = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const currentPage = Math.min(page, pageCount);
  const visible = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);
  return (
    <section>
      <div className="page-heading split">
        <div>
          <span className="eyebrow">Keluaran model</span>
          <h1>Hasil Klasifikasi</h1>
          <p>Telusuri label sentimen untuk setiap ulasan dalam dataset.</p>
        </div>
        <button className="button primary" onClick={onDownloadCsv}>
          <Icon name="download" />
          Unduh CSV
        </button>
      </div>
      <div className="card results">
        <div className="toolbar">
          <input
            aria-label="Cari ulasan"
            value={query}
            onChange={(event) => {
              setQuery(event.target.value);
              setPage(1);
            }}
            placeholder="Cari isi ulasan…"
          />
          <div className="filters">
            {["Semua", "Positif", "Netral", "Negatif"].map((item) => (
              <button
                key={item}
                className={filter === item ? "active" : ""}
                onClick={() => {
                  setFilter(item);
                  setPage(1);
                }}
              >
                {item}
              </button>
            ))}
          </div>
        </div>
        <div className="table-wrap">
          <table>
            <thead>
              <tr>
                <th>No.</th>
                <th>Isi ulasan</th>
                <th>Sentimen</th>
              </tr>
            </thead>
            <tbody>
              {visible.length ? (
                visible.map((row, index) => {
                  const label = String(row.predicted_sentiment || row.sentiment || row.label || row.prediction || "Tidak dianalisis");
                  return (
                    <tr key={`${currentPage}-${index}`}>
                      <td>{(currentPage - 1) * PAGE_SIZE + index + 1}</td>
                      <td>{row.original_text || row.text || row.komentar || row.comment || row.ulasan || "-"}</td>
                      <td>
                        <span className={`pill ${label.toLowerCase().replace(" ", "-")}`}>{label}</span>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="3" className="no-row">
                    Tidak ada data yang cocok.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
        <div className="table-footer">
          <span>
            Menampilkan {visible.length} dari {filtered.length} hasil
          </span>
          <div className="pagination">
            <button disabled={currentPage === 1} onClick={() => setPage((value) => value - 1)}>
              Sebelumnya
            </button>
            <b>
              {currentPage} / {pageCount}
            </b>
            <button disabled={currentPage === pageCount} onClick={() => setPage((value) => value + 1)}>
              Berikutnya
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
