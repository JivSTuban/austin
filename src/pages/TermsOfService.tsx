import { useEffect } from 'react';
import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

const TermsOfService = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-blue">
          <h1>Terms of Service</h1>
          <p>Last updated: March 10, 2024</p>

          <h2>1. Agreement to Terms</h2>
          <p>
            By accessing and using this website (the "Service"), you agree to be bound by these Terms of
            Service and agree that you are responsible for compliance with any applicable local laws.
          </p>

          <h2>2. Use License</h2>
          <p>
            Permission is granted to temporarily access the materials (information or software) on Austin
            McClain's website for personal, non-commercial transitory viewing only.
          </p>

          <h2>3. Disclaimer</h2>
          <p>
            The materials on Austin McClain's website are provided on an 'as is' basis. Austin McClain
            makes no warranties, expressed or implied, and hereby disclaims and negates all other
            warranties including, without limitation, implied warranties or conditions of
            merchantability, fitness for a particular purpose, or non-infringement of intellectual
            property or other violation of rights.
          </p>

          <h2>4. Limitations</h2>
          <p>
            In no event shall Austin McClain or its suppliers be liable for any damages (including,
            without limitation, damages for loss of data or profit, or due to business interruption)
            arising out of the use or inability to use the materials on Austin McClain's website.
          </p>

          <h2>5. Accuracy of Materials</h2>
          <p>
            The materials appearing on Austin McClain's website could include technical, typographical,
            or photographic errors. Austin McClain does not warrant that any of the materials on its
            website are accurate, complete, or current.
          </p>

          <h2>6. Links</h2>
          <p>
            Austin McClain has not reviewed all of the sites linked to its website and is not
            responsible for the contents of any such linked site. The inclusion of any link does not
            imply endorsement by Austin McClain of the site. Use of any such linked website is at the
            user's own risk.
          </p>

          <h2>7. Modifications</h2>
          <p>
            Austin McClain may revise these terms of service for its website at any time without
            notice. By using this website, you are agreeing to be bound by the then current version of
            these terms of service.
          </p>

          <h2>8. Governing Law</h2>
          <p>
            These terms and conditions are governed by and construed in accordance with the laws of
            Texas and you irrevocably submit to the exclusive jurisdiction of the courts in that
            location.
          </p>
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default TermsOfService;