import React, { useState } from 'react';

export default function Upload() {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const onFile = (f) => {
    setFile(f);
    setPreview(URL.createObjectURL(f));
    setResult(null);
  };

  const upload = async () => {
    if (!file) return;
    setLoading(true);
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/storage/upload', { method: 'POST', body: fd });
      const data = await res.json();
      if (!res.ok) throw data;
      setResult(data);
    } catch (err) {
      console.error(err);
      setResult({ error: err?.error || 'Upload failed' });
    } finally { setLoading(false); }
  };

  return (
    <div className="view-fade">
      <h1>Upload (Cloudinary)</h1>
      <div style={{ maxWidth: 720 }}>
        <input type="file" accept="image/*,video/*" onChange={e => onFile(e.target.files?.[0])} />
        {preview && <div style={{ marginTop: 12 }}><img src={preview} alt="preview" style={{ maxWidth: 240, borderRadius: 8 }} /></div>}
        <div style={{ marginTop: 12 }}>
          <button className="primary-btn" onClick={upload} disabled={!file || loading}>{loading ? 'Uploading...' : 'Upload'}</button>
        </div>
        {result && (
          <div style={{ marginTop: 12 }}>
            {result.error ? <div className="error">{result.error}</div> : (
              <div>
                <div>URL: <a href={result.url} target="_blank" rel="noreferrer">{result.url}</a></div>
                <pre style={{ marginTop: 8, maxHeight: 200, overflow: 'auto' }}>{JSON.stringify(result.raw || result, null, 2)}</pre>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}