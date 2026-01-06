import React from 'react';

export default function Privacy() {
  return (
    <div className="view-fade">
      <h1>Privacy Policy</h1>
      <p>Last updated: January 6, 2026</p>
      <section>
        <h3>Overview</h3>
        <p>Q.Lab is committed to protecting your privacy. This policy describes what information we collect, how we use it, and your rights.</p>
      </section>
      <section>
        <h3>Information We Collect</h3>
        <ul>
          <li>Account details (email, name)</li>
          <li>Uploads you provide (files you choose to upload)</li>
          <li>Usage and diagnostic data to help improve the service</li>
        </ul>
      </section>
      <section>
        <h3>How We Use Data</h3>
        <p>We use the data to provide, maintain, and improve the service. We will not sell your personal data.</p>
      </section>
      <section>
        <h3>Your Rights</h3>
        <p>You may request deletion of your account or data by contacting us at <a href="mailto:privacy@qlab.example">privacy@qlab.example</a>.</p>
      </section>
    </div>
  );
}