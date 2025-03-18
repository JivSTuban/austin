import { useEffect } from 'react';

const PrivacyPolicy = () => {
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
    
      <div className="flex-grow pt-28 pb-16 px-6">
        <div className="max-w-4xl mx-auto prose prose-blue">
          <h1>Privacy Policy</h1>
          <p>Last updated: March 10, 2024</p>

          <h2>1. Information We Collect</h2>
          <p>
            We collect information that you provide directly to us, including when you:
            <ul>
              <li>Create an account</li>
              <li>Fill out forms on our website</li>
              <li>Communicate with us</li>
              <li>Use our services</li>
            </ul>
          </p>

          <h2>2. How We Use Your Information</h2>
          <p>
            We use the information we collect to:
            <ul>
              <li>Provide and improve our services</li>
              <li>Communicate with you</li>
              <li>Personalize your experience</li>
              <li>Comply with legal obligations</li>
            </ul>
          </p>

          <h2>3. Information Sharing</h2>
          <p>
            We do not sell your personal information. We may share your information with:
            <ul>
              <li>Service providers who assist in our operations</li>
              <li>Professional advisors</li>
              <li>Law enforcement when required by law</li>
            </ul>
          </p>

          <h2>4. Data Security</h2>
          <p>
            We implement appropriate technical and organizational measures to protect your personal
            information. However, no method of transmission over the Internet is 100% secure.
          </p>

          <h2>5. Your Rights</h2>
          <p>
            You have the right to:
            <ul>
              <li>Access your personal information</li>
              <li>Correct inaccurate information</li>
              <li>Request deletion of your information</li>
              <li>Object to processing of your information</li>
            </ul>
          </p>

          <h2>6. Cookies</h2>
          <p>
            We use cookies and similar tracking technologies to track activity on our website and hold
            certain information. You can instruct your browser to refuse all cookies or to indicate
            when a cookie is being sent.
          </p>

          <h2>7. Changes to This Policy</h2>
          <p>
            We may update our Privacy Policy from time to time. We will notify you of any changes by
            posting the new Privacy Policy on this page and updating the "Last updated" date.
          </p>

          <h2>8. Contact Us</h2>
          <p>
            If you have any questions about this Privacy Policy, please contact us at:
            <br />
            Email: austin@austinmcclain.com
          </p>
        </div>
      </div>
    
    </div>
  );
};

export default PrivacyPolicy;