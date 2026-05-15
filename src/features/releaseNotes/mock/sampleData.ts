import { ReleaseNote } from '../types';

export const SAMPLE_RELEASE_NOTES: ReleaseNote[] = [
  {
    id: '1',
    version: '2024.05.15',
    title: 'Enterprise Multi-Tenant Security Baseline',
    description: 'We are introducing a unified security layer for multi-tenant environments, supporting OIDC and granular RBAC policies across all cloud regions.',
    content: `
<h1>Security Architecture Overhaul</h1>
<p>This release marks a significant milestone in our commitment to enterprise-grade security. We have completely re-engineered the authentication and authorization pipeline to support complex organizational hierarchies.</p>

<h2>Key Improvements</h2>
<ul>
  <li><strong>Unified Identity Provider:</strong> Native support for Okta, Azure AD, and Google Workspace via OpenID Connect.</li>
  <li><strong>Granular RBAC:</strong> Define roles at the department, project, or asset level with inherited permissions.</li>
  <li><strong>Audit Sovereignty:</strong> Every administrative action is now immutable and exportable to enterprise SIEM tools.</li>
</ul>

<blockquote>
  "Infrastructure security is not a feature; it is the foundation of our platform ecosystem."
</blockquote>

<h3>Migration Path</h3>
<p>Administrators should review the <code>Trust & Safety</code> documentation to map existing legacy permissions to the new RBAC model. Legacy auth endpoints will be supported until December 2024.</p>
    `,
    audience: 'Admin',
    releaseType: 'Security',
    status: 'Published',
    createdBy: 'Sarah Chen',
    createdAt: '2024-05-15T09:00:00Z',
    updatedAt: '2024-05-15T11:30:00Z',
    tags: ['Security', 'Compliance', 'Audit'],
    pinned: true,
    featured: true
  },
  {
    id: '2',
    version: '2024.05.10',
    title: 'High-Performance Grid & Data Virtualization',
    description: 'Migration to AG Grid Enterprise V31.2 with optimized memory management for datasets exceeding 1M+ rows.',
    content: `
<h2>Computational Performance optimization</h2>
<p>We have optimized our data rendering pipeline to ensure that even the largest enterprise datasets remain responsive. Our benchmarks show a 40% reduction in TTI (Time to Interactive) for complex dashboards.</p>

<h3>What's New in v31.2</h3>
<ul>
  <li>Advanced Column State Persistence: Column order, widths, and visibility filters are now synchronized across sessions.</li>
  <li>Row Virtualization 2.0: Significant improvements to scroll stability on high-DPI displays.</li>
  <li>Server-side Row Model Improvements: Faster grouping and aggregation when integrated with Snowflake or BigQuery.</li>
</ul>

<pre><code>// Example: Configuring the new persistence layer
const gridOptions = {
  persistence: {
    storage: 'local',
    namespace: 'corp_finance_reporting'
  }
};</code></pre>
    `,
    audience: 'Engineering',
    releaseType: 'Infrastructure',
    status: 'Published',
    createdBy: 'Marcus Aurelius',
    createdAt: '2024-05-10T14:20:00Z',
    updatedAt: '2024-05-10T14:20:00Z',
    tags: ['Performance', 'Engineering', 'Big Data'],
    pinned: false,
    featured: false
  },
  {
    id: '3',
    version: '2024.05.05',
    title: 'Executive Intelligence & BI Refresh',
    description: 'New visualization primitives and predictive analytics widgets for divisional management reporting.',
    content: `
<h2>Unified Reporting Surface</h2>
<p>The management dashboard has been refreshed with a focus on directional data and KPI tracking. We have replaced legacy static charts with dynamic, interactive intelligence widgets.</p>

<h3>Featured Capability: Revenue Attribution</h3>
<p>Managers can now drill down from global revenue targets directly into individual regional performance metrics with a single click. The data is backed by our new real-time ETL pipeline.</p>

<table>
  <thead>
    <tr>
      <th>Metric</th>
      <th>Legacy Target</th>
      <th>Optimized Target</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>Data Latency</td>
      <td>&lt; 5 mins</td>
      <td>&lt; 10 secs</td>
    </tr>
    <tr>
      <td>Aggregation Speed</td>
      <td>1.2s</td>
      <td>0.3s</td>
    </tr>
  </tbody>
</table>
    `,
    audience: 'Managers',
    releaseType: 'Feature',
    status: 'Published',
    createdBy: 'Emily Watson',
    createdAt: '2024-05-05T10:00:00Z',
    updatedAt: '2024-05-06T09:15:00Z',
    tags: ['BI', 'Analytics', 'Reporting'],
    pinned: false,
    featured: true
  }
];

