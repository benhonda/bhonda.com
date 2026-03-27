import { CodeBlock } from "~/components/blog/code-block";
import { InlineCode } from "~/components/blog/inline-code";
import { PostLayout } from "~/components/blog/post-layout";
import { Text } from "~/components/misc/text";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "~/components/ui/accordion";
import type { PostMeta } from "~/lib/blog/blog-types";

export const postMeta = {
  title: "Google Ads Search Campaigns in 2026: FAQ",
  slug: "google-ads-search-campaigns-faq",
  preview:
    "Practical answers to the questions we hit while setting up Google Ads search campaigns — UTM tracking, ValueTrack parameters, auto-tagging vs. manual tagging, and more.",
  metaDescription:
    "FAQ-style reference for Google Ads search campaigns in 2026: UTM parameters, GCLID auto-tagging, ValueTrack dynamic parameters, Final URL suffix configuration, and analytics attribution.",
  status: "draft",
  publishedAt: "2026-03-25",
  projects: ["silo-cdp", "gtm-proxy"],
  topics: ["google-ads", "analytics", "marketing"],
} satisfies PostMeta;

/** Inline citation link. Opens in a new tab. */
function Cite({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="text-primary underline underline-offset-2"
    >
      {children}
    </a>
  );
}

export default function GoogleAdsSearchCampaignsFaq() {
  return (
    <PostLayout meta={postMeta}>
      <Text as="p" variant="body">
        A running FAQ — answers to the questions we hit while standing up
        Google Ads search campaigns. Every claim is cross-checked against
        primary sources; citations are inline.
      </Text>

      <Accordion type="multiple" className="w-full">
        {/* -------------------------------------------------------------- */}
        {/* Q1: UTM parameters and auto-tagging */}
        {/* -------------------------------------------------------------- */}
        <AccordionItem value="utm-params">
          <AccordionTrigger>
            Do I need to set a Final URL suffix for UTM parameters, or does
            Google Ads add them automatically?
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Text as="p" variant="body">
              Google Ads <strong>does not</strong> add UTM parameters
              automatically. If you want <InlineCode>utm_source</InlineCode>,{" "}
              <InlineCode>utm_medium</InlineCode>, or{" "}
              <InlineCode>utm_campaign</InlineCode> on your landing page URLs,
              you must configure them yourself via the{" "}
              <strong>Final URL suffix</strong> or a tracking template{" "}
              (<Cite href="https://gaconnector.com/blog/how-to-add-utm-parameters-to-google-ads-automatically/">GA Connector</Cite>,{" "}
              <Cite href="https://www.monsterinsights.com/how-to-use-utm-parameters-in-google-ads/">MonsterInsights</Cite>).
            </Text>

            <Text as="p" variant="body">
              That said, your URLs are <strong>not bare</strong> even without
              UTMs. <strong>Auto-tagging</strong> is on by default for new
              Google Ads accounts{" "}
              (<Cite href="https://support.google.com/google-ads/answer/3095550?hl=en">Google Ads Help</Cite>),{" "}
              and it appends a <InlineCode>gclid</InlineCode> parameter to
              every click (e.g. <InlineCode>?gclid=abc123</InlineCode>).{" "}
              <strong>GCLID is a closed system</strong> — only Google Analytics
              (GA4) can decode it and map it to campaign, ad group, keyword,
              etc.{" "}
              (<Cite href="https://salespanel.io/blog/marketing/gclid-vs-utm-parameters/">Salespanel</Cite>).
              GA4 will correctly attribute Google Ads traffic via auto-tagging
              alone, without any manual UTMs{" "}
              (<Cite href="https://support.google.com/analytics/answer/10723328?hl=en">GA4 Help</Cite>).
            </Text>

            <Text as="p" variant="body">
              <strong>Non-Google analytics tools</strong> (Plausible, Matomo,
              etc.) can <em>detect</em> the presence of{" "}
              <InlineCode>gclid</InlineCode> and label traffic as "Paid Search
              / Google," but they <strong>cannot extract</strong> campaign
              names, keywords, or ad group details from it{" "}
              (<Cite href="https://plausible.io/blog/google-ads-tracking">Plausible</Cite>,{" "}
              <Cite href="https://matomo.org/faq/general/how-to-track-google-ads-campaigns-with-matomo/">Matomo</Cite>).
              For granular attribution in those tools, you need UTM parameters.
            </Text>

            <Text as="p" variant="body">
              <strong>Best practice:</strong> keep auto-tagging ON{" "}
              <em>and</em> add manual UTMs via the Final URL suffix.
              Auto-tagging feeds GA4; UTMs feed everything else. If a user's ad
              blocker strips the GCLID, GA4 can fall back to the UTMs{" "}
              (<Cite href="https://www.reportingninja.com/blog/utm-tagging-v-auto-tagging-google-ads">Reporting Ninja</Cite>,{" "}
              <Cite href="https://salespanel.io/blog/marketing/gclid-vs-utm-parameters/">Salespanel</Cite>).
            </Text>
          </AccordionContent>
        </AccordionItem>

        {/* -------------------------------------------------------------- */}
        {/* Q2: ValueTrack parameters */}
        {/* -------------------------------------------------------------- */}
        <AccordionItem value="valuetrack-params">
          <AccordionTrigger>
            What dynamic parameters can I use in the Final URL suffix?
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Text as="p" variant="body">
              Google calls them{" "}
              <Cite href="https://support.google.com/google-ads/answer/6305348?hl=en">
                ValueTrack parameters
              </Cite>
              . They're placeholders wrapped in curly braces that Google
              replaces with actual values at click time. The most useful ones
              for a Final URL suffix:
            </Text>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left px-4 py-2 font-mono font-medium border-b border-border">Parameter</th>
                    <th className="text-left px-4 py-2 font-medium border-b border-border">Returns</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{campaignid}"}</td>
                    <td className="px-4 py-2">Numeric campaign ID</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{adgroupid}"}</td>
                    <td className="px-4 py-2">Numeric ad group ID</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{creative}"}</td>
                    <td className="px-4 py-2">Unique ad creative ID — ties clicks to specific ad variations</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{keyword}"}</td>
                    <td className="px-4 py-2">The keyword that triggered the ad (blank for Dynamic Search Ads)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{matchtype}"}</td>
                    <td className="px-4 py-2">
                      <InlineCode>e</InlineCode> = exact, <InlineCode>p</InlineCode> = phrase,{" "}
                      <InlineCode>b</InlineCode> = broad, <InlineCode>a</InlineCode> = AI Max keywordless
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{device}"}</td>
                    <td className="px-4 py-2">
                      <InlineCode>m</InlineCode> = mobile, <InlineCode>t</InlineCode> = tablet,{" "}
                      <InlineCode>c</InlineCode> = computer
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{network}"}</td>
                    <td className="px-4 py-2">
                      <InlineCode>g</InlineCode> = Google Search, <InlineCode>s</InlineCode> = Search Partners,{" "}
                      <InlineCode>d</InlineCode> = Display, <InlineCode>ytv</InlineCode> = YouTube,{" "}
                      <InlineCode>vp</InlineCode> = Video Partners
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{gclid}"}</td>
                    <td className="px-4 py-2">Google Click Identifier (unique per click)</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{loc_physical_ms}"}</td>
                    <td className="px-4 py-2">Geographic location ID of the user who clicked</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">{"{adposition}"}</td>
                    <td className="px-4 py-2">Position on the page (e.g. "1t2")</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <Text as="p" variant="body">
              A practical suffix covering attribution and debugging:
            </Text>

            <CodeBlock language="text" filename="Final URL suffix">
              {`utm_source=google&utm_medium=cpc&utm_campaign={campaignid}&utm_content={adgroupid}&utm_term={keyword}&device={device}&matchtype={matchtype}&network={network}`}
            </CodeBlock>

            <Text as="p" variant="body">
              Note: the Final URL suffix field doesn't need a leading{" "}
              <InlineCode>?</InlineCode> — Google adds it automatically. The
              complete parameter reference lives in{" "}
              <Cite href="https://support.google.com/google-ads/answer/6305348?hl=en">
                Google's ValueTrack docs
              </Cite>{" "}
              and the{" "}
              <Cite href="https://developers.google.com/google-ads/api/docs/reporting/valuetrack-mapping">
                Google Ads API field mapping
              </Cite>.
            </Text>

            <Text as="p" variant="body">
              One thing to watch: <InlineCode>matchtype</InlineCode> now
              returns <InlineCode>a</InlineCode> for{" "}
              <Cite href="https://groas.ai/post/ai-max-features-complete-list-of-whats-new-in-google-ads-november-2025">
                AI Max keywordless matches
              </Cite>{" "}
              — a fourth value that didn't exist before 2025. If you're parsing
              match types downstream, make sure your logic handles it.
            </Text>
          </AccordionContent>
        </AccordionItem>
        {/* -------------------------------------------------------------- */}
        {/* Q3: What is AI Max? */}
        {/* -------------------------------------------------------------- */}
        <AccordionItem value="ai-max">
          <AccordionTrigger>
            What is AI Max for Search campaigns and should I use it?
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Text as="p" variant="body">
              AI Max is an opt-in optimization layer for standard Search
              campaigns, rolled out globally in open beta in{" "}
              <Cite href="https://blog.google/products/ads-commerce/google-ai-max-for-search-campaigns/">
                May 2025
              </Cite>
              . It bundles three features under one toggle:
            </Text>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Text as="span" variant="body">
                  <strong>Search Term Matching</strong> — expands beyond your
                  keyword list using broad match + keywordless matching (this is
                  where the new <InlineCode>a</InlineCode> matchtype value comes
                  from)
                </Text>
              </li>
              <li>
                <Text as="span" variant="body">
                  <strong>Text Customization</strong> — auto-generates headlines
                  and descriptions based on your landing page content, existing
                  ads, and keywords
                </Text>
              </li>
              <li>
                <Text as="span" variant="body">
                  <strong>Final URL Expansion</strong> — dynamically routes
                  clicks to the most relevant page on your domain instead of
                  always using the ad's default final URL
                </Text>
              </li>
            </ul>

            <Text as="p" variant="body">
              Google reports ~14% more conversions at similar CPA/ROAS, jumping
              to ~27% for campaigns still mostly on exact/phrase match{" "}
              (<Cite href="https://searchengineland.com/ai-max-for-search-everything-you-need-to-know-462923">
                Search Engine Land
              </Cite>
              ). As of February 2026,{" "}
              <Cite href="https://groas.ai/post/ai-max-features-complete-list-of-whats-new-in-google-ads-november-2025">
                text guidelines
              </Cite>{" "}
              (a governance layer for AI-generated copy) are available to all
              advertisers globally.
            </Text>

            <Text as="p" variant="body">
              <strong>Should you use it?</strong> If you need strict control
              over where traffic lands or what your ad copy says — legal,
              compliance, tightly segmented funnels — keep it off. If your site
              has clean architecture, clearly differentiated pages, and you want
              Google's ML to scale relevance automatically, it's worth testing.
              The three components are coupled: you can't enable Final URL
              Expansion without Text Customization{" "}
              (<Cite href="https://support.google.com/google-ads/answer/16672777?hl=en">
                Google Ads Help
              </Cite>
              ).
            </Text>
          </AccordionContent>
        </AccordionItem>

        {/* -------------------------------------------------------------- */}
        {/* Q4: Keyword-level URLs vs. Final URL Expansion */}
        {/* -------------------------------------------------------------- */}
        <AccordionItem value="keyword-urls-vs-expansion">
          <AccordionTrigger>
            Can I set different landing pages per keyword, or should I use Final
            URL Expansion?
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Text as="p" variant="body">
              <strong>Both work.</strong> Keyword-level Final URLs are still
              fully supported — add the "Final URL" column in the Keywords view
              (or use Google Ads Editor) and set a URL per keyword. A
              keyword-level URL overrides the ad-level URL{" "}
              (<Cite href="https://developers.google.com/google-ads/api/docs/ads/upgraded-urls/fields">
                Google Ads API docs
              </Cite>
              ).
            </Text>

            <Text as="p" variant="body">
              <strong>Caveat:</strong> if AI Max's Final URL Expansion is
              enabled, it can override <em>both</em> the ad-level and
              keyword-level URLs when it determines a different page is more
              relevant to the query. The priority chain becomes: AI Max decision
              &gt; keyword URL &gt; ad URL.
            </Text>

            <Text as="p" variant="body">
              <strong>When to use keyword-level URLs:</strong> high-intent exact
              match keywords with bespoke landing pages, localized campaigns
              routing to city-specific pages, or anywhere compliance requires
              strict funnel control.
            </Text>

            <Text as="p" variant="body">
              <strong>When to lean into Final URL Expansion:</strong> clean site
              architecture with clearly differentiated pages. It uses real-time
              signals (query, device, location, crawled site content, connected
              feeds) to pick the best landing page{" "}
              (<Cite href="https://support.google.com/google-ads/answer/14337539?hl=en">
                Google Ads Help
              </Cite>
              ). See Q3 above for the full breakdown.
            </Text>
          </AccordionContent>
        </AccordionItem>

        {/* -------------------------------------------------------------- */}
        {/* Q5: URL Exclusions and Page Feeds */}
        {/* -------------------------------------------------------------- */}
        <AccordionItem value="url-exclusions">
          <AccordionTrigger>
            How do I prevent Final URL Expansion from sending traffic to bad
            pages?
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Text as="p" variant="body">
              Google's own best practices recommend excluding "non-commercial
              pages like About Us, FAQ, or Shipping Details"{" "}
              (<Cite href="https://support.google.com/google-ads/answer/15995647?hl=en">
                Google Ads Help
              </Cite>
              ).
            </Text>

            <Text as="p" variant="body">
              <strong>URL Exclusions</strong> are configured in your campaign
              settings under the Final URL Expansion section{" "}
              (<Cite href="https://support.google.com/google-ads/answer/14337773?hl=en">
                Google Ads Help
              </Cite>
              ). Two methods:
            </Text>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Text as="span" variant="body">
                  <strong>Exact URL</strong> — paste individual URLs line by
                  line (e.g.{" "}
                  <InlineCode>yourdomain.com/about-us</InlineCode>)
                </Text>
              </li>
              <li>
                <Text as="span" variant="body">
                  <strong>Rules</strong> — block entire directories with
                  patterns like "URL contains{" "}
                  <InlineCode>/blog</InlineCode>" or "URL contains{" "}
                  <InlineCode>/careers</InlineCode>". Recommended for larger
                  sites.
                </Text>
              </li>
            </ul>

            <Text as="p" variant="body">
              One limitation: your campaign's original Final URL{" "}
              <strong>cannot</strong> be excluded — it will always remain
              eligible.
            </Text>

            <Text as="p" variant="body">
              <strong>What about Page Feeds?</strong> A common misconception is
              that uploading a Page Feed restricts expansion to only those URLs.{" "}
              <strong>It does not.</strong> When Final URL Expansion is{" "}
              <em>on</em>, a Page Feed is advisory — it helps Google discover
              and prioritize those URLs, but doesn't prevent it from choosing
              others. Page Feeds only act as a hard allow-list when Final URL
              Expansion is <em>off</em>{" "}
              (<Cite href="https://support.google.com/google-ads/answer/13568488?hl=en">
                Google Ads Help
              </Cite>
              ).
            </Text>

            <Text as="p" variant="body">
              <strong>E-commerce tip:</strong> if products frequently go out of
              stock, add a rule to exclude URLs containing "out-of-stock" to
              avoid routing high-intent buyers to dead ends.
            </Text>
          </AccordionContent>
        </AccordionItem>
        {/* -------------------------------------------------------------- */}
        {/* Q6: Filtered / parameterized URLs */}
        {/* -------------------------------------------------------------- */}
        <AccordionItem value="filtered-urls">
          <AccordionTrigger>
            What if my landing pages use query-string filters? Can Final URL
            Expansion handle URLs like <code>?color=red&amp;size=10</code>?
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Text as="p" variant="body">
              <strong>No.</strong> Final URL Expansion selects from pages
              Google has already crawled — it cannot construct or compose
              parameterized URLs on the fly{" "}
              (<Cite href="https://support.google.com/google-ads/answer/14337539?hl=en">
                Google Ads Help
              </Cite>,{" "}
              <Cite href="https://www.datafeedwatch.com/blog/performance-max-final-url-expansion">
                DataFeedWatch
              </Cite>
              ). If a URL like{" "}
              <InlineCode>/shoes?color=red&size=10</InlineCode> isn't in
              Google's index, expansion will never serve it.
            </Text>

            <Text as="p" variant="body">
              Parameterized filter URLs are usually{" "}
              <em>deliberately hidden</em> from Google's index — blocked via{" "}
              <InlineCode>robots.txt</InlineCode> or canonicalized to the parent
              category page — so Google's ad crawler won't find them either{" "}
              (<Cite href="https://developers.google.com/search/docs/crawling-indexing/crawling-managing-faceted-navigation">
                Google Search Central
              </Cite>,{" "}
              <Cite href="https://searchengineland.com/guide/faceted-navigation">
                Search Engine Land
              </Cite>
              ).
            </Text>

            <Text as="h3" variant="heading-xs" className="pt-2">
              The fix: Page Feeds
            </Text>

            <Text as="p" variant="body">
              A{" "}
              <Cite href="https://support.google.com/google-ads/answer/7166527?hl=en">
                Page Feed
              </Cite>{" "}
              bypasses the crawl index entirely. You upload a CSV of the exact
              URLs you want Google Ads to use — including parameterized ones —
              under <strong>Tools &gt; Business Data &gt; Page feed</strong>.
              The format is simple: two columns.
            </Text>

            <div className="overflow-x-auto">
              <table className="w-full text-sm border border-border rounded-lg overflow-hidden">
                <thead>
                  <tr className="bg-muted">
                    <th className="text-left px-4 py-2 font-medium border-b border-border">Column</th>
                    <th className="text-left px-4 py-2 font-medium border-b border-border">Required</th>
                    <th className="text-left px-4 py-2 font-medium border-b border-border">Details</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">Page URL</td>
                    <td className="px-4 py-2">Yes</td>
                    <td className="px-4 py-2">
                      The landing page URL. One per row. Do not include tracking
                      parameters.
                    </td>
                  </tr>
                  <tr>
                    <td className="px-4 py-2 font-mono text-primary">Custom label</td>
                    <td className="px-4 py-2">Recommended</td>
                    <td className="px-4 py-2">
                      One or more labels separated by semicolons. Up to 20 per
                      URL. Used for targeting and segmentation.
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            <CodeBlock language="csv" filename="page-feed.csv">
              {`Page URL,Custom label
https://example.com/shoes?color=red&size=10,RED_SHOES;SIZE_10;FOOTWEAR
https://example.com/shoes?color=blue&size=8,BLUE_SHOES;SIZE_8;FOOTWEAR`}
            </CodeBlock>

            <Text as="p" variant="body">
              Google's template includes rows starting with{" "}
              <InlineCode>#</InlineCode> at the bottom — those are comments,
              ignored on import.
            </Text>

            <Text as="h3" variant="heading-xs" className="pt-2">
              Custom Labels are targeting triggers, not just notes
            </Text>

            <Text as="p" variant="body">
              Labels aren't purely organizational. They're how you control
              which URLs the AI can pick for a given ad group. Without labels,
              Google picks from the entire feed. With them, you restrict
              selection to a labeled subset — e.g. tell an ad group targeting
              men's shoes to only use URLs labeled{" "}
              <InlineCode>MENS_SHOES</InlineCode>. This prevents the AI from
              routing a "men's running shoes" query to a women's shoe page just
              because it converted well{" "}
              (<Cite href="https://support.google.com/google-ads/answer/13568488?hl=en">
                Google Ads Help
              </Cite>
              ).
            </Text>

            <Text as="h3" variant="heading-xs" className="pt-2">
              Upload workflow
            </Text>

            <ol className="list-decimal pl-6 space-y-1">
              <li>
                <Text as="span" variant="body">
                  Save the sheet as <InlineCode>.csv</InlineCode>
                </Text>
              </li>
              <li>
                <Text as="span" variant="body">
                  In Google Ads: <strong>Tools &amp; Settings &gt; Business
                  Data &gt; Data feeds</strong> — click <strong>+</strong>,
                  choose <strong>Page feed</strong>, upload
                </Text>
              </li>
              <li>
                <Text as="span" variant="body">
                  Go to your campaign settings &gt; Final URL Expansion
                  section &gt; attach the feed
                </Text>
              </li>
              <li>
                <Text as="span" variant="body">
                  Optionally restrict by Custom Label at the ad group / asset
                  group level
                </Text>
              </li>
            </ol>

            <Text as="p" variant="body">
              <strong>Remember:</strong> with Final URL Expansion <em>on</em>,
              the Page Feed is advisory, not restrictive. See the URL exclusions
              question above for the full breakdown.
            </Text>
          </AccordionContent>
        </AccordionItem>
        {/* -------------------------------------------------------------- */}
        {/* Q7: HTTPS option in page feed upload */}
        {/* -------------------------------------------------------------- */}
        <AccordionItem value="https-feed-source">
          <AccordionTrigger>
            Why does the "Upload new page feed data" dialog offer HTTPS as a
            source option?
          </AccordionTrigger>
          <AccordionContent className="space-y-4">
            <Text as="p" variant="body">
              The "Select source" dropdown is about{" "}
              <strong>how Google retrieves your feed file</strong>, not the URL
              protocol of the pages in your feed. Four source options are
              available when uploading business data{" "}
              (<Cite href="https://support.google.com/google-ads/answer/7364634?hl=en">
                Google Ads Help
              </Cite>
              ):
            </Text>

            <ul className="list-disc pl-6 space-y-2">
              <li>
                <Text as="span" variant="body">
                  <strong>Upload a file</strong> — manual CSV/TSV upload from
                  your computer
                </Text>
              </li>
              <li>
                <Text as="span" variant="body">
                  <strong>Google Sheets</strong> — link a Sheet directly
                </Text>
              </li>
              <li>
                <Text as="span" variant="body">
                  <strong>HTTPS</strong> — provide a URL to a hosted feed file
                  (e.g.{" "}
                  <InlineCode>
                    https://yoursite.com/feeds/page-feed.csv
                  </InlineCode>
                  ) plus username/password credentials
                </Text>
              </li>
              <li>
                <Text as="span" variant="body">
                  <strong>SFTP</strong> — fetch from an SFTP server using
                  credentials
                </Text>
              </li>
            </ul>

            <Text as="p" variant="body">
              The main reason HTTPS and SFTP exist:{" "}
              <strong>scheduled automatic updates</strong>. You can configure
              Google Ads to auto-fetch your feed daily, weekly, or on the first
              of the month (15-minute increments){" "}
              (<Cite href="https://support.google.com/google-ads/answer/7364396?hl=en">
                Google Ads Help
              </Cite>
              ). Host your feed at a stable URL — ideally generated dynamically
              by your CMS — and Google pulls the latest version on schedule.
            </Text>

            <Text as="p" variant="body">
              <strong>Caveat:</strong> Google's scheduling docs explicitly
              mention auto-updates for "Ad customizer and Dynamic display ad"
              business data{" "}
              (<Cite href="https://support.google.com/google-ads/answer/7364396?hl=en">
                Google Ads Help
              </Cite>
              ). Page feeds use the same upload UI{" "}
              (<Cite href="https://support.google.com/google-ads/answer/7166527?hl=en">
                Google Ads Help
              </Cite>
              ), but whether scheduling applies to page feeds specifically is
              undocumented. The scheduling flow also surfaces slightly different
              source options (Google Drive, HTTP, HTTPS, FTP/SFTP) than the
              initial upload dropdown.
            </Text>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </PostLayout>
  );
}
