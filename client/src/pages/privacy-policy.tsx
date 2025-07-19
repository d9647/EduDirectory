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
              <CardTitle className="text-3xl font-bold text-gray-900">Educational Yellow Pages Privacy Policy</CardTitle>
              <p className="text-gray-600">Last updated: January 19, 2025</p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none">
              <div className="space-y-6">
                <p className="text-gray-700 leading-relaxed">
                  This policy details how data about you is used when you access our websites and services, including via our mobile applications 
                  (together, "Educational Yellow Pages") or interact with us. If we update it, we will revise the date, place notices on our platform 
                  if changes are material, and/or obtain your consent as required by law.
                </p>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">1. Protecting Your Privacy</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                    <li>We take precautions to prevent unauthorized access to or misuse of data about you.</li>
                    <li>We do not run ads, other than the educational listings posted by our users.</li>
                    <li>We do not share your data with third parties for marketing purposes.</li>
                    <li>We do not engage in cross-marketing or link-referral programs.</li>
                    <li>We do not employ tracking devices for marketing purposes.</li>
                    <li>We do not send you unsolicited communications for marketing purposes.</li>
                    <li>We do not engage in affiliate marketing (and prohibit it on our platform).</li>
                    <li>We do provide email communication services to facilitate educational connections.</li>
                    <li>Please review privacy policies of any third party sites linked to from our platform.</li>
                    <li>We do not respond to "Do Not Track" signals.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">2. Data We Collect, Use and Disclose</h2>
                  <p className="text-gray-700 leading-relaxed mb-4">
                    Below is a list of all the types of data we have collected in the last 12 months, where we got it, why we collected it 
                    and the categories of third parties to whom we disclosed it. We do not sell your data to third parties. Please note that 
                    disclosure to "Service providers" applies when you use certain features of our platform.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Data Type</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Where We Got It</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Why Collected</th>
                          <th className="border border-gray-300 px-4 py-2 text-left font-semibold">Disclosed To</th>
                        </tr>
                      </thead>
                      <tbody className="text-sm">
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">First and last name</td>
                          <td className="border border-gray-300 px-4 py-2">User entry</td>
                          <td className="border border-gray-300 px-4 py-2">Facilitating educational connections and personalizing your use</td>
                          <td className="border border-gray-300 px-4 py-2">Service providers</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">Email</td>
                          <td className="border border-gray-300 px-4 py-2">User entry</td>
                          <td className="border border-gray-300 px-4 py-2">Account creation, user-to-user communications and combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-4 py-2">No one</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Phone number</td>
                          <td className="border border-gray-300 px-4 py-2">User entry</td>
                          <td className="border border-gray-300 px-4 py-2">User-to-user communications, combatting fraud/abuse, personalizing your use</td>
                          <td className="border border-gray-300 px-4 py-2">Service providers</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">Mailing or street address</td>
                          <td className="border border-gray-300 px-4 py-2">User entry</td>
                          <td className="border border-gray-300 px-4 py-2">Listing creation, facilitating educational connections and personalizing your use</td>
                          <td className="border border-gray-300 px-4 py-2">Service providers</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Geographic location</td>
                          <td className="border border-gray-300 px-4 py-2">User entry, IP/geolocation providers</td>
                          <td className="border border-gray-300 px-4 py-2">Personalizing your use and combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-4 py-2">No one</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">Photos and other content you provide</td>
                          <td className="border border-gray-300 px-4 py-2">User entry</td>
                          <td className="border border-gray-300 px-4 py-2">Facilitating and personalizing your use of our platform</td>
                          <td className="border border-gray-300 px-4 py-2">No one</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Saved searches, account preferences, bookmarks</td>
                          <td className="border border-gray-300 px-4 py-2">User entry</td>
                          <td className="border border-gray-300 px-4 py-2">Facilitating and personalizing your use</td>
                          <td className="border border-gray-300 px-4 py-2">No one</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">HTTP browser cookie</td>
                          <td className="border border-gray-300 px-4 py-2">User's browser, web server</td>
                          <td className="border border-gray-300 px-4 py-2">Facilitating and personalizing your use and combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-4 py-2">No one</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Device and browser information</td>
                          <td className="border border-gray-300 px-4 py-2">User's browser, mobile app</td>
                          <td className="border border-gray-300 px-4 py-2">Facilitating and personalizing your use and combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-4 py-2">No one</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2">IP address</td>
                          <td className="border border-gray-300 px-4 py-2">User's browser, mobile app, IP/geolocation providers</td>
                          <td className="border border-gray-300 px-4 py-2">Combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-4 py-2">Service providers that help us combat fraud/abuse</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-4 py-2">Web page views, access times, HTTP headers</td>
                          <td className="border border-gray-300 px-4 py-2">User's browser, mobile app</td>
                          <td className="border border-gray-300 px-4 py-2">Combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-4 py-2">No one</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-gray-700 leading-relaxed mt-4 mb-2">We may share some or all of the above listed data in the following circumstances:</p>
                  <ul className="list-disc list-inside text-gray-700 space-y-2">
                    <li>To respond to subpoenas, search warrants, court orders, or other legal process.</li>
                    <li>To protect the rights, property, or safety of our users, our platform, or the general public.</li>
                    <li>At your direction (e.g. if you authorize us to share data with other users).</li>
                    <li>In connection with a merger, bankruptcy, or sale/transfer of assets.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data We Store</h2>
                  <ul className="list-disc list-inside text-gray-700 space-y-2 leading-relaxed">
                    <li>We retain data as needed to facilitate and personalize your use of our platform, combat fraud/abuse and/or as required by law.</li>
                    <li>We make good faith efforts to store data securely, but can make no guarantees.</li>
                    <li>You may access and update certain data about you via your account login.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. California Users</h2>
                  <p className="text-gray-700 leading-relaxed mb-3">
                    To learn more about the California Consumer Privacy Act and how it applies to you, please visit the California Attorney-General's website.
                  </p>
                  
                  <div className="space-y-3">
                    <p className="text-gray-700"><strong>Right to know:</strong> You have the right to request that we disclose the data we collect, use and disclose, and other information relating to data we collect about you.</p>
                    
                    <p className="text-gray-700"><strong>Right to delete:</strong> You have the right to request the deletion of data that we have collected from you, subject to certain exceptions.</p>
                    
                    <p className="text-gray-700"><strong>Right to non-discrimination:</strong> You have the right not to receive discriminatory treatment for exercising the rights listed above.</p>
                  </div>

                  <p className="text-gray-700 leading-relaxed mt-4">
                    You may submit a request to know or delete via our contact email or through your account settings.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    Only you, or someone you authorize to act on your behalf, may make a request to know or delete your data. 
                    An authorized agent may make a request on your behalf by providing written permission signed by you.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    We will need to confirm your identity before processing your request by asking you to log into your existing account 
                    (if you are a registered user) or by asking you for additional information, such as a government issued ID, 
                    to confirm your identity against information we have already collected.
                  </p>

                  <p className="text-gray-700 leading-relaxed">
                    If you are a registered user under the age of 18, you may request and obtain removal of content or information 
                    publicly posted on our platform. Please note that removal does not ensure complete or comprehensive removal 
                    of said content or information from the Internet.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. International Users</h2>
                  <p className="text-gray-700 leading-relaxed">
                    By accessing our platform or providing us data, you agree we may use and disclose data we collect as described here 
                    or as communicated to you, transmit it outside your resident jurisdiction, and store it on servers in the United States. 
                    For more information please contact our privacy officer at privacy@edu-yellowpages.org.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact</h2>
                  <p className="text-gray-700 leading-relaxed">
                    If you have any questions or concerns about our privacy policy and practices please email privacy@edu-yellowpages.org.
                  </p>
                </section>

                <div className="text-center text-sm text-gray-500 mt-8 pt-4 border-t border-gray-200">
                  © 2025 Educational Yellow Pages
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
      <Footer />
    </div>
  );
}