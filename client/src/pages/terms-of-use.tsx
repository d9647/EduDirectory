
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import Header from "@/components/layout/header";
import Footer from "@/components/layout/footer";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-3xl font-bold text-gray-900">Terms of Use</CardTitle>
              <p className="text-gray-600">Last updated: January 2025</p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-6">
                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">1. Acceptance of Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing and using Education Yellow Pages, you accept and agree to be bound by the terms and provision of this agreement. 
                    If you do not agree to abide by the above, please do not use this service.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">2. Description of Service</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Education Yellow Pages is a platform that connects students, parents, and educators with educational services including 
                    tutoring providers, summer camps, internships, and job opportunities. We provide a directory service to help users 
                    find relevant educational resources.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">3. User Responsibilities</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>Provide accurate and truthful information when submitting listings or creating accounts</li>
                    <li>Respect intellectual property rights of others</li>
                    <li>Use the service only for lawful purposes</li>
                    <li>Not engage in any activity that could harm or disrupt the service</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">4. Content Guidelines</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Users are responsible for the content they submit. We reserve the right to remove any content that violates our 
                    guidelines or is deemed inappropriate. This includes but is not limited to offensive language, false information, 
                    or content that infringes on others' rights.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">5. Limitation of Liability</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Education Yellow Pages serves as a platform connecting users with educational services. We do not guarantee the 
                    quality, safety, or legality of any services listed. Users engage with service providers at their own risk and 
                    should conduct their own due diligence.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">6. Privacy</h2>
                  <p className="text-gray-700 leading-relaxed">
                    Your privacy is important to us. Please review our Privacy Policy, which also governs your use of the service, 
                    to understand our practices.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">7. Changes to Terms</h2>
                  <p className="text-gray-700 leading-relaxed">
                    We reserve the right to modify these terms at any time. Changes will be posted on this page with an updated 
                    revision date. Your continued use of the service after changes constitutes acceptance of the new terms.
                  </p>
                </section>

                <section>
                  <h2 className="text-xl font-semibold text-gray-900 mb-3">8. Contact Information</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions about these Terms of Use, please contact us through our platform.
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
