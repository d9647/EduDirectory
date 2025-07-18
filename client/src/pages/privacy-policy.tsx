
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleHeader from "@/components/layout/simple-header";
import Footer from "@/components/layout/footer";

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900">Privacy Policy</CardTitle>
              <p className="text-gray-600">Last updated: January 2025</p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Information We Collect</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We collect information you provide directly to us, such as when you create an account, submit a listing, 
                    or contact us for support.
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Personal information (name, email address, phone number)</li>
                    <li>Business information (company name, services offered, location)</li>
                    <li>Usage data (how you interact with our platform)</li>
                    <li>Device information (browser type, IP address, operating system)</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">2. How We Use Your Information</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">We use the information we collect to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Provide, maintain, and improve our services</li>
                    <li>Process transactions and send related information</li>
                    <li>Send you technical notices and support messages</li>
                    <li>Respond to your comments and questions</li>
                    <li>Monitor and analyze trends and usage</li>
                    <li>Detect and prevent fraudulent or illegal activity</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">3. Information Sharing</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    We do not sell, trade, or otherwise transfer your personal information to third parties except as described below:
                  </p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>With your consent</li>
                    <li>To comply with legal obligations</li>
                    <li>To protect our rights and safety</li>
                    <li>In connection with a business transfer or merger</li>
                    <li>With service providers who assist us in operating our platform</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Data Security</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We implement appropriate security measures to protect your personal information against unauthorized access, 
                    alteration, disclosure, or destruction. However, no method of transmission over the internet is 100% secure, 
                    and we cannot guarantee absolute security.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Cookies and Tracking</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We use cookies and similar tracking technologies to enhance your experience on our platform. You can set your 
                    browser to refuse cookies, but this may limit your ability to use certain features of our service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Your Rights</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">You have the right to:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Access and update your personal information</li>
                    <li>Request deletion of your personal information</li>
                    <li>Opt out of certain communications</li>
                    <li>Request a copy of your data</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Children's Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Our service is not intended for children under 13 years of age. We do not knowingly collect personal 
                    information from children under 13. If we become aware that we have collected such information, we will 
                    take steps to delete it.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Changes to This Policy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new 
                    Privacy Policy on this page and updating the "Last updated" date.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">9. Contact Us</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about this Privacy Policy, please contact us through our platform.
                  </p>
                </section>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}
