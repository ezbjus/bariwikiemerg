import React from 'react';
import { Helmet } from 'react-helmet-async';
import { AlertTriangle, Shield, FileText, UserCheck, Info } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const SITE_URL = 'https://parnellwellness.com';

const DisclaimerPage = () => {
  return (
    <>
      <Helmet>
        <title>FDA Medical Disclaimer | BariWiki by Parnell Wellness</title>
        <meta name="description" content="Important FDA medical disclaimer and legal information regarding the content on BariWiki bariatric surgery encyclopedia. Read before using our resources." />
        <link rel="canonical" href={`${SITE_URL}/disclaimer`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Medical Disclaimer - BariWiki" />
        <meta property="og:description" content="Important FDA medical disclaimer and legal information." />
        <meta property="og:url" content={`${SITE_URL}/disclaimer`} />
      </Helmet>

      <main id="main" className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Medical Disclaimer' }]} />

        <header className="py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-amber-100 rounded-lg">
              <AlertTriangle className="h-6 w-6 text-amber-600" />
            </div>
            <h1 
              className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900"
              data-testid="disclaimer-title"
            >
              Medical Disclaimer
            </h1>
          </div>
          <p className="text-neutral-600">
            Last updated: {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
          </p>
        </header>

        <div className="pb-12 space-y-8">
          {/* FDA Disclaimer */}
          <section className="bg-amber-50 border border-amber-200 rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Shield className="h-6 w-6 text-amber-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-amber-900 mb-3">FDA Disclaimer</h2>
                <p className="text-amber-800 leading-relaxed">
                  The statements made on this website have not been evaluated by the Food and Drug 
                  Administration (FDA). The information provided on BariWiki is for educational and 
                  informational purposes only and is not intended to diagnose, treat, cure, or prevent 
                  any disease. Any products, supplements, or treatments mentioned on this site are not 
                  intended to replace professional medical advice, diagnosis, or treatment.
                </p>
              </div>
            </div>
          </section>

          {/* Not Medical Advice */}
          <section className="bg-white border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <FileText className="h-6 w-6 text-blue-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">Not Medical Advice</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  The content on BariWiki is provided for general informational purposes only. It is 
                  not intended to be a substitute for professional medical advice, diagnosis, or treatment. 
                  Always seek the advice of your physician, surgeon, or other qualified health provider 
                  with any questions you may have regarding:
                </p>
                <ul className="list-disc pl-6 text-neutral-700 space-y-2">
                  <li>A medical condition or symptoms you may be experiencing</li>
                  <li>Bariatric surgery procedures and their risks</li>
                  <li>Pre-operative and post-operative care</li>
                  <li>Dietary supplements, vitamins, or medications</li>
                  <li>Any changes to your diet or exercise routine</li>
                  <li>Weight loss treatments or procedures</li>
                </ul>
              </div>
            </div>
          </section>

          {/* Consult Healthcare Provider */}
          <section className="bg-white border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <UserCheck className="h-6 w-6 text-green-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">Consult Your Healthcare Provider</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  Never disregard professional medical advice or delay in seeking it because of something 
                  you have read on BariWiki. If you think you may have a medical emergency, call your 
                  doctor, go to the emergency department, or call 911 immediately.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  BariWiki does not recommend or endorse any specific tests, physicians, surgeons, 
                  products, procedures, opinions, or other information that may be mentioned on this 
                  website. Reliance on any information provided by BariWiki, its employees, contracted 
                  writers, or medical professionals presenting content for publication is solely at 
                  your own risk.
                </p>
              </div>
            </div>
          </section>

          {/* Supplement Disclaimer */}
          <section className="bg-white border rounded-lg p-6">
            <div className="flex items-start gap-4">
              <Info className="h-6 w-6 text-purple-600 flex-shrink-0 mt-1" />
              <div>
                <h2 className="text-xl font-semibold text-neutral-900 mb-3">Dietary Supplement Disclaimer</h2>
                <p className="text-neutral-700 leading-relaxed mb-4">
                  Any dietary supplements, vitamins, or nutritional products mentioned or linked on 
                  BariWiki are not intended to diagnose, treat, cure, or prevent any disease. These 
                  products have not been evaluated by the FDA and are not approved to diagnose, treat, 
                  cure, or prevent any disease.
                </p>
                <p className="text-neutral-700 leading-relaxed">
                  Individual results may vary. Before taking any supplements, especially after bariatric 
                  surgery, consult with your bariatric surgeon or healthcare provider to ensure they 
                  are appropriate for your specific situation and will not interact with any medications 
                  you may be taking.
                </p>
              </div>
            </div>
          </section>

          {/* External Links */}
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">External Links Disclaimer</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              BariWiki may contain links to external websites that are not provided or maintained by 
              us. Please note that we do not guarantee the accuracy, relevance, timeliness, or 
              completeness of any information on these external websites. The inclusion of any links 
              does not necessarily imply a recommendation or endorsement of the views expressed within them.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              We have no control over the nature, content, and availability of those sites. Links to 
              other websites are provided solely for your convenience and informational purposes.
            </p>
          </section>

          {/* Information Accuracy */}
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">Accuracy of Information</h2>
            <p className="text-neutral-700 leading-relaxed mb-4">
              While we strive to provide accurate and up-to-date information, medical knowledge is 
              constantly evolving. The information on BariWiki may not reflect the most current 
              medical research or guidelines. We make no representations or warranties of any kind, 
              express or implied, about the completeness, accuracy, reliability, suitability, or 
              availability of the information contained on this website.
            </p>
            <p className="text-neutral-700 leading-relaxed">
              Any reliance you place on such information is strictly at your own risk. We will not 
              be liable for any loss or damage including without limitation, indirect or consequential 
              loss or damage, arising from the use of information on this website.
            </p>
          </section>

          {/* Professional Use */}
          <section className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">For Healthcare Professionals</h2>
            <p className="text-neutral-700 leading-relaxed">
              Healthcare professionals should not rely solely on the information provided on BariWiki 
              for clinical decision-making. This website is intended as a reference tool and educational 
              resource only. Healthcare providers should use their professional judgment, consult 
              current medical literature, and follow established clinical guidelines when making 
              treatment decisions for their patients.
            </p>
          </section>

          {/* Contact */}
          <section className="bg-neutral-50 border rounded-lg p-6">
            <h2 className="text-xl font-semibold text-neutral-900 mb-3">Questions About This Disclaimer</h2>
            <p className="text-neutral-700 leading-relaxed">
              If you have any questions about this medical disclaimer, please contact us. By using 
              BariWiki, you acknowledge that you have read, understood, and agree to be bound by 
              this medical disclaimer.
            </p>
          </section>

          {/* Agreement Notice */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 text-center">
            <p className="text-blue-800 font-medium">
              By using BariWiki, you acknowledge and agree to this Medical Disclaimer.
            </p>
          </div>
        </div>
      </main>
    </>
  );
};

export default DisclaimerPage;
