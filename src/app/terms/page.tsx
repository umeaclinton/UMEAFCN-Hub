import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Terms & Conditions | UMEAFCN Hub',
  description: 'Terms and Conditions of service for UMEAFCN Hub.',
};

export default function TermsPage() {
  return (
    <article className="single-post">
      <header className="post-header">
        <h1>Terms & Conditions</h1>
        <div className="post-meta">
          <span className="category-badge">Legal</span>
          <span>Last Updated: June 2026</span>
        </div>
      </header>

      <div className="post-content">
        <p>Welcome to UMEAFCN Hub!</p>
        <p>
          These terms and conditions outline the rules and regulations for the use of UMEAFCN Hub's Website, located at www.umeafcnhub.online.
        </p>
        <p>
          By accessing this website we assume you accept these terms and conditions. Do not continue to use UMEAFCN Hub if you do not agree to take all of the terms and conditions stated on this page.
        </p>

        <h2>Terminology</h2>
        <p>
          The following terminology applies to these Terms and Conditions, Privacy Statement and Disclaimer Notice and all Agreements: "Client", "You" and "Your" refers to you, the person log on this website and compliant to the Company's terms and conditions. "The Company", "Ourselves", "We", "Our" and "Us", refers to our Company. "Party", "Parties", or "Us", refers to both the Client and ourselves.
        </p>

        <h2>Cookies</h2>
        <p>
          We employ the use of cookies. By accessing UMEAFCN Hub, you agreed to use cookies in agreement with the UMEAFCN Hub's Privacy Policy.
        </p>
        <p>
          Most interactive websites use cookies to let us retrieve the user's details for each visit. Cookies are used by our website to enable the functionality of certain areas to make it easier for people visiting our website. Some of our affiliate/advertising partners may also use cookies.
        </p>

        <h2>License</h2>
        <p>
          Unless otherwise stated, UMEAFCN Hub and/or its licensors own the intellectual property rights for all material on UMEAFCN Hub. All intellectual property rights are reserved. You may access this from UMEAFCN Hub for your own personal use subjected to restrictions set in these terms and conditions.
        </p>
        <p>You must not:</p>
        <ul>
          <li>Republish material from UMEAFCN Hub</li>
          <li>Sell, rent or sub-license material from UMEAFCN Hub</li>
          <li>Reproduce, duplicate or copy material from UMEAFCN Hub</li>
          <li>Redistribute content from UMEAFCN Hub</li>
        </ul>

        <h2>Content Liability & Disclaimers</h2>
        <p>
          UMEAFCN Hub is an aggregator that lists job postings, descriptions, and recruitment information compiled using AI technology and public sources. 
        </p>
        <ul>
          <li><strong>Accuracy:</strong> While we strive to ensure the accuracy of the job listings, we do not warrant their completeness, correctness, or availability. The responsibility for verifying application methods, contact emails, and job authenticity lies solely with the user/applicant.</li>
          <li><strong>External Links:</strong> Our website contains links to external websites (e.g., job application portals, corporate careers pages) that are not operated by us. We have no control over and assume no responsibility for the content, privacy policies, or practices of any third-party sites or services.</li>
          <li><strong>No Guarantee:</strong> We do not guarantee that users will secure employment or interviews through the listings published on this site.</li>
        </ul>

        <h2>Reservation of Rights</h2>
        <p>
          We reserve the right to request that you remove all links or any particular link to our Website. You approve to immediately remove all links to our Website upon request. We also reserve the right to amen these terms and conditions and it's linking policy at any time. By continuously linking to our Website, you agree to be bound to and follow these linking terms and conditions.
        </p>

        <h2>Removal of links from our website</h2>
        <p>
          If you find any link on our Website that is offensive for any reason, you are free to contact and inform us any moment. We will consider requests to remove links but we are not obligated to or so or to respond to you directly.
        </p>
        <p>
          We do not ensure that the information on this website is correct, we do not warrant its completeness or accuracy; nor do we promise to ensure that the website remains available or that the material on the website is kept up to date.
        </p>

        <h2>Disclaimer of Warranties</h2>
        <p>
          To the maximum extent permitted by applicable law, we exclude all representations, warranties and conditions relating to our website and the use of this website. Nothing in this disclaimer will:
        </p>
        <ul>
          <li>limit or exclude our or your liability for death or personal injury;</li>
          <li>limit or exclude our or your liability for fraud or fraudulent misrepresentation;</li>
          <li>limit any of our or your liabilities in any way that is not permitted under applicable law; or</li>
          <li>exclude any of our or your liabilities that may not be excluded under applicable law.</li>
        </ul>
        <p>
          The limitations and prohibitions of liability set in this Section and elsewhere in this disclaimer: (a) are subject to the preceding paragraph; and (b) govern all liabilities arising under the disclaimer, including liabilities arising in contract, in tort and for breach of statutory duty.
        </p>
        <p>
          As long as the website and the information and services on the website are provided free of charge, we will not be liable for any loss or damage of any nature.
        </p>
      </div>

      <div className="post-footer">
        <Link href="/" className="btn-back">
          &larr; Back to Home
        </Link>
      </div>
    </article>
  );
}
