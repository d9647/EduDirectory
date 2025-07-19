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
              <CardTitle className="text-2xl font-bold text-gray-900">Educational Yellow Pages Privacy Policy</CardTitle>
              <p className="text-sm text-gray-600">Last updated: January 19, 2025</p>
            </CardHeader>
            <CardContent className="prose prose-gray max-w-none text-sm">
              <div className="space-y-4">
                <p className="text-gray-700 text-sm leading-relaxed">
                  This policy details how data about you is used when you access our websites and services, including via our mobile applications 
                  (together, "Educational Yellow Pages") or interact with us. If we update it, we will revise the date, place notices on our platform 
                  if changes are material, and/or obtain your consent as required by law.
                </p>

                <section>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">1. Protecting Your Privacy</h3>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 leading-relaxed ml-4">
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
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">2. Data We Collect, Use and Disclose</h3>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    Below is a list of all the types of data we have collected in the last 12 months, where we got it, why we collected it 
                    and the categories of third parties to whom we disclosed it. We do not sell your data to third parties. Please note that 
                    disclosure to "Service providers" applies when you use certain features of our platform.
                  </p>

                  <div className="overflow-x-auto">
                    <table className="min-w-full border border-gray-300 text-xs">
                      <thead className="bg-gray-50">
                        <tr>
                          <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Data Type</th>
                          <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Where We Got It</th>
                          <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Why Collected</th>
                          <th className="border border-gray-300 px-2 py-1 text-left font-semibold">Disclosed To</th>
                        </tr>
                      </thead>
                      <tbody className="text-xs">
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">First and last name</td>
                          <td className="border border-gray-300 px-2 py-1">User entry</td>
                          <td className="border border-gray-300 px-2 py-1">Facilitating educational connections and personalizing your use</td>
                          <td className="border border-gray-300 px-2 py-1">Service providers</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1">Email</td>
                          <td className="border border-gray-300 px-2 py-1">User entry</td>
                          <td className="border border-gray-300 px-2 py-1">Account creation, user-to-user communications and combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-2 py-1">No one</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">Phone number</td>
                          <td className="border border-gray-300 px-2 py-1">User entry</td>
                          <td className="border border-gray-300 px-2 py-1">User-to-user communications, combatting fraud/abuse, personalizing your use</td>
                          <td className="border border-gray-300 px-2 py-1">Service providers</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1">Mailing or street address</td>
                          <td className="border border-gray-300 px-2 py-1">User entry</td>
                          <td className="border border-gray-300 px-2 py-1">Listing creation, facilitating educational connections and personalizing your use</td>
                          <td className="border border-gray-300 px-2 py-1">Service providers</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">Geographic location</td>
                          <td className="border border-gray-300 px-2 py-1">User entry, IP/geolocation providers</td>
                          <td className="border border-gray-300 px-2 py-1">Personalizing your use and combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-2 py-1">No one</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1">Photos and other content you provide</td>
                          <td className="border border-gray-300 px-2 py-1">User entry</td>
                          <td className="border border-gray-300 px-2 py-1">Facilitating and personalizing your use of our platform</td>
                          <td className="border border-gray-300 px-2 py-1">No one</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">Saved searches, account preferences, bookmarks</td>
                          <td className="border border-gray-300 px-2 py-1">User entry</td>
                          <td className="border border-gray-300 px-2 py-1">Facilitating and personalizing your use</td>
                          <td className="border border-gray-300 px-2 py-1">No one</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1">HTTP browser cookie</td>
                          <td className="border border-gray-300 px-2 py-1">User's browser, web server</td>
                          <td className="border border-gray-300 px-2 py-1">Facilitating and personalizing your use and combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-2 py-1">No one</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">Device and browser information</td>
                          <td className="border border-gray-300 px-2 py-1">User's browser, mobile app</td>
                          <td className="border border-gray-300 px-2 py-1">Facilitating and personalizing your use and combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-2 py-1">No one</td>
                        </tr>
                        <tr className="bg-gray-50">
                          <td className="border border-gray-300 px-2 py-1">IP address</td>
                          <td className="border border-gray-300 px-2 py-1">User's browser, mobile app, IP/geolocation providers</td>
                          <td className="border border-gray-300 px-2 py-1">Combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-2 py-1">Service providers that help us combat fraud/abuse</td>
                        </tr>
                        <tr>
                          <td className="border border-gray-300 px-2 py-1">Web page views, access times, HTTP headers</td>
                          <td className="border border-gray-300 px-2 py-1">User's browser, mobile app</td>
                          <td className="border border-gray-300 px-2 py-1">Combatting fraud/abuse</td>
                          <td className="border border-gray-300 px-2 py-1">No one</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mt-3 mb-1">We may share some or all of the above listed data in the following circumstances:</p>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1">
                    <li>To respond to subpoenas, search warrants, court orders, or other legal process.</li>
                    <li>To protect the rights, property, or safety of our users, our platform, or the general public.</li>
                    <li>At your direction (e.g. if you authorize us to share data with other users).</li>
                    <li>In connection with a merger, bankruptcy, or sale/transfer of assets.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">3. Data We Store</h2>
                  <ul className="list-disc list-inside text-gray-700 text-sm space-y-1 leading-relaxed">
                    <li>We retain data as needed to facilitate and personalize your use of our platform, combat fraud/abuse and/or as required by law.</li>
                    <li>We make good faith efforts to store data securely, but can make no guarantees.</li>
                    <li>You may access and update certain data about you via your account login.</li>
                  </ul>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">4. California Users</h2>
                  <p className="text-gray-700 text-sm leading-relaxed mb-3">
                    To learn more about the California Consumer Privacy Act and how it applies to you, please visit the <a href="https://oag.ca.gov/privacy/ccpa">California Attorney-General's website</a>.
                  </p>
                  
                  <div className="space-y-3">
                    <p className="text-gray-700"><strong>Right to know:</strong> You have the right to request that we disclose the data we collect, use and disclose, and other information relating to data we collect about you.</p>
                    
                    <p className="text-gray-700"><strong>Right to delete:</strong> You have the right to request the deletion of data that we have collected from you, subject to certain exceptions.</p>
                    
                    <p className="text-gray-700"><strong>Right to non-discrimination:</strong> You have the right not to receive discriminatory treatment for exercising the rights listed above.</p>
                  </div>

                  <p className="text-gray-700 text-sm leading-relaxed mt-3">
                    You may submit a request to know or delete via ccpa@eduyellowpages.org. Please note that we may ask you to verify your identity before processing your request.
                  </p>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    Only you, or someone you authorize to act on your behalf, may make a request to know or delete your data. 
                    An authorized agent may make a request on your behalf by providing written permission signed by you.
                  </p>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    We will need to confirm your identity before processing your request by asking you to log into your existing account 
                    (if you are a registered user) or by asking you for additional information, such as a government issued ID, 
                    to confirm your identity against information we have already collected.
                  </p>

                  <p className="text-gray-700 text-sm leading-relaxed">
                    If you are a registered user under the age of 18, you may request and obtain removal of content or information 
                    publicly posted on our platform. Please note that removal does not ensure complete or comprehensive removal 
                    of said content or information from the Internet.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">5. International Users</h2>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    By accessing our platform or providing us data, you agree we may use and disclose data we collect as described here 
                    or as communicated to you, transmit it outside your resident jurisdiction, and store it on servers in the United States. 
                    For more information please contact our privacy officer at privacy@eduyellowpages.org.
                  </p>
                </section>

                <section>
                  <h2 className="text-2xl font-semibold text-gray-900 mb-4">6. Contact</h2>
                  <p className="text-gray-700 text-sm leading-relaxed">
                    If you have any questions or concerns about our privacy policy and practices please email privacy@edu-yellowpages.org.
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