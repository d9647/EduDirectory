
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SimpleHeader from "@/components/layout/simple-header";
import Footer from "@/components/layout/footer";

export default function TermsOfUse() {
  return (
    <div className="min-h-screen flex flex-col">
      <SimpleHeader />
      <main className="flex-1 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl font-bold text-gray-900">EDUCATION&nbsp;YELLOW&nbsp;PAGES – TERMS&nbsp;OF&nbsp;USE</CardTitle>
              <p className="text-sm text-gray-600">Last updated: July 19, 2025</p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-sm">
              <div className="space-y-4">
                <p className="text-gray-600 text-xs mb-4">
                  <strong>Ownership Note:</strong> Education&nbsp;Yellow&nbsp;Pages is owned and operated by Dragonfly&nbsp;AI&nbsp;LLC. All references to "EYP," "we," "our," or "us" below refer to Dragonfly&nbsp;AI&nbsp;LLC.
                </p>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Welcome to Education&nbsp;Yellow&nbsp;Pages</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Dragonfly&nbsp;AI&nbsp;LLC ("EYP," "we," "our," or "us") operates the educationyellowpages.org website, related mobile experiences, and any content, listings, or services we provide (collectively, the "Platform"). By accessing or interacting with the Platform—whether as a parent, student, provider, or other visitor—you agree to these Terms&nbsp;of&nbsp;Use ("TOU"). If you act on behalf of an organization, you confirm you have authority to bind that entity and that it accepts these TOU. If you disagree with any part of the TOU, do not use the Platform.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    We may update the TOU at our sole discretion. Your continued use of the Platform after changes take effect constitutes acceptance of the revised TOU. Our Privacy Policy, Posting Guidelines, and other policies referenced here are incorporated by reference and equally binding.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Limited License</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Provided you (i) are old enough and legally able to form a binding contract, or (ii) act with valid authority on behalf of an organization, EYP grants you a personal, revocable, non‑exclusive, non‑transferable license to use the Platform in accordance with these TOU. All rights not expressly granted are reserved. You may not reproduce, frame, sell, sublicense, or create derivative works from Platform content except for materials you yourself post.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    When you post text, reviews, images, or other content, you grant EYP a worldwide, royalty‑free, irrevocable, sublicensable license to use, display, distribute, and adapt that content in connection with the Platform.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">3. Acceptable Use</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">Unless we grant written permission, you agree not to:</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 ml-4">
                    <li>Deploy bots, scrapers, or similar tools to harvest data, create accounts, or post content.</li>
                    <li>Circumvent or interfere with our moderation, security, or rate‑limiting mechanisms.</li>
                    <li>Post false, misleading, unlawful, or prohibited content (see Posting Guidelines).</li>
                    <li>Collect or publish personal data about other users without their explicit consent.</li>
                    <li>Rent, sell, or transfer user accounts or any access to the Platform.</li>
                    <li>Reverse‑engineer, decompile, or otherwise attempt to derive source code, or combine the Platform or any API with unauthorized software or services.</li>
                    <li>Use the Platform in a manner that violates any applicable law or another party's rights.</li>
                  </ul>
                  <p className="text-gray-700 text-sm leading-relaxed mt-3">
                    We may moderate, alter, or remove content and suspend or terminate access at our discretion. Our moderation—or lack thereof—does not waive any right we have to act later.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">4. Fees</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    Basic browsing, posting, and bookmarking features are free. If we introduce paid upgrades or promotional listings, fees will be disclosed before purchase. Taxes are additional and fees are non‑refundable unless required by law.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">5. Disclaimer; Limitation of Liability</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    The Platform is provided "as is" without warranties of any kind. EYP disclaims all warranties, express or implied, including but not limited to warranties of merchantability, fitness for a particular purpose, and non-infringement.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    In no event shall EYP be liable for any indirect, incidental, special, consequential, or punitive damages, including but not limited to loss of profits, data, use, goodwill, or other intangible losses, resulting from your use of the Platform.
                  </p>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    EYP's total liability to you for any claims arising from or related to your use of the Platform shall not exceed the amount paid by you, if any, for accessing the Platform in the twelve (12) months preceding the claim.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">6. Governing Law</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    These TOU shall be governed by and construed in accordance with the laws of the State of California, without regard to its conflict of law provisions. Any disputes arising from these TOU or your use of the Platform shall be resolved in the courts of California.
                  </p>
                </section>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">7. Contact Information</h3>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    If you have any questions about these Terms of Use, please contact us at legal@eduyellowpages.org.
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
