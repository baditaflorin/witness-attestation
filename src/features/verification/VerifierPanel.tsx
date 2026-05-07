import { CheckCircle2, FileCheck2, ShieldAlert, Upload } from 'lucide-react';
import { useState } from 'react';

import { verifyBundleJson, type VerificationReport } from './verifyBundle';

export function VerifierPanel() {
  const [rawBundle, setRawBundle] = useState('');
  const [report, setReport] = useState<VerificationReport | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);

  async function verify() {
    setIsVerifying(true);
    try {
      setReport(await verifyBundleJson(rawBundle));
    } finally {
      setIsVerifying(false);
    }
  }

  async function handleFile(file: File | null) {
    if (!file) {
      return;
    }

    setRawBundle(await file.text());
    setReport(null);
  }

  return (
    <section className="tool-section" aria-labelledby="verify-title">
      <div className="section-heading">
        <FileCheck2 size={24} aria-hidden="true" />
        <div>
          <p className="eyebrow">Verify</p>
          <h2 id="verify-title">Offline evidence check</h2>
        </div>
      </div>

      <label className="file-picker">
        <Upload size={18} aria-hidden="true" />
        <span>Import JSON bundle</span>
        <input
          type="file"
          accept="application/json,.json"
          onChange={(event) => {
            void handleFile(event.target.files?.[0] ?? null);
          }}
        />
      </label>

      <label className="field">
        <span>Bundle JSON</span>
        <textarea
          value={rawBundle}
          rows={8}
          spellCheck={false}
          onChange={(event) => {
            setRawBundle(event.target.value);
            setReport(null);
          }}
        />
      </label>

      <button
        className="primary-action"
        type="button"
        disabled={rawBundle.trim().length === 0 || isVerifying}
        onClick={() => {
          void verify();
        }}
      >
        <CheckCircle2 size={18} aria-hidden="true" />
        Verify bundle
      </button>

      {report ? (
        <div className={report.valid ? 'result success' : 'result danger'} role="status">
          {report.valid ? (
            <CheckCircle2 size={22} aria-hidden="true" />
          ) : (
            <ShieldAlert size={22} aria-hidden="true" />
          )}
          <div>
            <strong>{report.valid ? 'Valid bundle' : 'Verification failed'}</strong>
            <p>{report.summary}</p>
          </div>
        </div>
      ) : null}

      {report ? (
        <ul className="check-list">
          {report.checks.map((check) => (
            <li key={check.label} className={check.passed ? 'passed' : 'failed'}>
              <span aria-hidden="true">{check.passed ? 'OK' : 'NO'}</span>
              {check.label}
            </li>
          ))}
        </ul>
      ) : null}
    </section>
  );
}
