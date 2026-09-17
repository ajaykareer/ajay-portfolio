import { Award, GraduationCap, ArrowUpRight } from 'lucide-react';

const credentials = [
  ['Platform App Builder', 'July 2023'],
  ['Service Cloud Consultant', 'June 2023'],
  ['Administrator', 'May 2023'],
  ['Associate', 'May 2023'],
];

export function ProfileBackground() {
  return (
    <section
      className="profile-background"
      aria-labelledby="background-heading"
    >
      <div className="section-title">
        <div>
          <p className="eyebrow">THE FOUNDATION</p>
          <h2 id="background-heading">Learning that shapes the work.</h2>
        </div>
      </div>
      <div className="education-grid">
        <article>
          <GraduationCap />
          <p className="eyebrow">2022 — 2023</p>
          <h3>Humber College</h3>
          <p>Web Design and Development</p>
        </article>
        <article>
          <GraduationCap />
          <p className="eyebrow">2010 — 2014</p>
          <h3>Maharshi Dayanand University</h3>
          <p>Bachelor’s degree, Civil Engineering</p>
        </article>
      </div>
      <div className="credentials-heading">
        <h3>Salesforce certifications earned</h3>
        <a
          href="https://www.linkedin.com/in/ajaykareer/details/certifications/"
          target="_blank"
          rel="noopener noreferrer"
        >
          View on LinkedIn <ArrowUpRight size={15} />
        </a>
      </div>
      <div className="credentials-grid">
        {credentials.map(([name, date]) => (
          <article key={name}>
            <Award />
            <div>
              <h4>{name}</h4>
              <p>Salesforce · Issued {date}</p>
            </div>
          </article>
        ))}
      </div>
    </section>
  );
}

export function CareerHistory() {
  return (
    <section className="career-history" aria-labelledby="career-heading">
      <div className="section-title">
        <div>
          <p className="eyebrow">SALESFORCE & BUSINESS ANALYSIS</p>
          <h2 id="career-heading">A broader engineering perspective.</h2>
        </div>
      </div>
      <div className="career-row">
        <span className="career-date">STARTED SEP 2022</span>
        <div>
          <h3>Salesforce BA / Administrator</h3>
          <p>Fidelis Security</p>
          <span>Remote · United States</span>
        </div>
      </div>
      <div className="career-row">
        <span className="career-date">MAY 2020 — JUN 2022</span>
        <div>
          <h3>Salesforce Business Analyst</h3>
          <p>Lahav Group Consultant · Client: HSBC</p>
          <span>Remote · Canada</span>
        </div>
      </div>
      <div className="career-row">
        <span className="career-date">APR 2015 — APR 2020</span>
        <div>
          <h3>Business Analyst</h3>
          <p>Competency’s Solutions · Client: Bank of America</p>
          <span>
            Requirements, process analysis, and Python reporting · Gurugram,
            India
          </span>
        </div>
      </div>
    </section>
  );
}
