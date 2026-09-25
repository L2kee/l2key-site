import { BLOG_BACKLOG } from "./blog-backlog";

export type BlogSection = {
  heading?: string;
  paragraphs: string[];
};

export type BlogPost = {
  slug: string;
  title: string;
  /** Shorter search title when "title | EVOGENCY" runs past ~60 characters. */
  seoTitle?: string;
  description: string;
  excerpt: string;
  date: string;
  /** Set only when the post's content was substantially rewritten. */
  updated?: string;
  tag: string;
  sections: BlogSection[];
  relatedHref?: string;
  relatedLabel?: string;
};

const ORIGINAL_POSTS: BlogPost[] = [
  {
    slug: "how-to-choose-an-seo-agency-in-orlando",
    title: "How to Choose an SEO Agency in Orlando",
    description:
      "A straightforward guide to picking an SEO agency in Orlando: what to actually look for, the red flags to avoid, and the questions worth asking before you sign anything.",
    excerpt:
      "What to actually look for in an SEO agency, the red flags to avoid, and the questions worth asking before you sign anything.",
    date: "2026-09-18",
    tag: "SEO",
    relatedHref: "/seo-agency-orlando",
    relatedLabel: "See our SEO service",
    sections: [
      {
        paragraphs: [
          "Every SEO agency in Orlando will tell you they get results. Almost none of them will show you exactly how. That gap between the promise and the proof is where most local businesses get burned, so before you hire anyone, it helps to know what a real SEO process actually looks like.",
        ],
      },
      {
        heading: "Start with the audit, not the pitch",
        paragraphs: [
          "A real SEO agency looks at your site and your Google presence before they tell you what's wrong with it. If someone quotes you a price before they've actually opened your website, they're selling a package, not a plan built around your business.",
          "A good audit covers three things: the technical health of your site, whether your Google Business Profile is set up correctly, and how your content compares to what's already ranking for the searches you care about. If an agency skips straight to a sales pitch, ask to see the audit first.",
        ],
      },
      {
        heading: "Be skeptical of guaranteed rankings",
        paragraphs: [
          "Nobody controls Google's algorithm, including the agency pitching you. Anyone who guarantees a specific ranking, a specific timeline, or a specific number of leads is either inexperienced or not being straight with you. What a reputable agency can guarantee is the work itself: the technical fixes, the content, and the local optimization that actually influence rankings over time.",
        ],
      },
      {
        heading: "Ask who actually does the work",
        paragraphs: [
          "A lot of agencies sell the relationship and outsource the execution. Ask directly who will be doing the technical work and the content writing, and whether that's the same person you're talking to now. A smaller, local agency where the person pitching you is the person doing the work tends to catch problems faster than a layered account management structure.",
        ],
      },
      {
        heading: "The bottom line",
        paragraphs: [
          "Look for an agency that audits before it pitches, shows you real work instead of vague promises, and is honest that SEO takes months, not days. That combination is rarer than it should be, which is exactly why it's worth taking the time to find it.",
        ],
      },
    ],
  },
  {
    slug: "what-is-local-seo",
    title: "What Is Local SEO and Why It Matters for Orlando Businesses",
    seoTitle: "What Is Local SEO? A Guide for Orlando Businesses",
    description:
      "Local SEO explained in plain language: what it actually is, how it's different from regular SEO, and why it matters most for Orlando businesses that depend on nearby customers.",
    excerpt:
      "Local SEO explained in plain language, and why it matters most if your customers are searching for you nearby.",
    date: "2026-09-18",
    tag: "SEO",
    relatedHref: "/seo-agency-orlando",
    relatedLabel: "See our SEO service",
    sections: [
      {
        paragraphs: [
          "If your customers find you by searching \"near me\" or the name of their neighborhood, local SEO is the thing deciding whether you show up first or not at all. It's a different game than ranking a national website, and it runs on different rules.",
        ],
      },
      {
        heading: "How local SEO is different from regular SEO",
        paragraphs: [
          "Regular SEO is mostly about a ranked list of links. Local SEO is about the map pack, the three businesses Google shows at the top of a local search along with a map. Getting into that map pack depends on signals that don't matter much for a national site: your Google Business Profile, your reviews, your local citations, and how consistent your business name, address, and phone number are across the web.",
        ],
      },
      {
        heading: "The signals that actually move the needle",
        paragraphs: [
          "Your Google Business Profile is the foundation. Categories, hours, service area, and photos all need to be filled out completely and kept current. On top of that, reviews matter more locally than almost anywhere else, both the count and how recently they came in. Citations, meaning your business listed consistently on directories across the web, round out the picture.",
          "None of this replaces having a real, fast, useful website. Local SEO and a good website work together. A perfectly optimized Google Business Profile still needs a website behind it that actually converts a visitor once they click through.",
        ],
      },
      {
        heading: "Who this matters most for",
        paragraphs: [
          "Local SEO matters most for businesses that live and die by nearby customers: plumbers, roofers, contractors, restaurants, and similar service businesses. If you're competing for anyone within driving distance rather than customers anywhere in the country, this is where your SEO effort should be concentrated first.",
        ],
      },
    ],
  },
  {
    slug: "how-much-should-a-small-business-website-cost",
    title: "How Much Should a Small Business Website Actually Cost",
    seoTitle: "Small Business Website Cost: A Real Breakdown | EVOGENCY",
    description:
      "A real breakdown of small business website pricing: what changes the cost, why templates and custom builds are priced so differently, and how to avoid overpaying or underbuilding.",
    excerpt:
      "What actually changes the price of a small business website, and how to avoid overpaying or underbuilding.",
    date: "2026-09-18",
    tag: "Web Design",
    relatedHref: "/web-design-agency-orlando",
    relatedLabel: "See our web design service",
    sections: [
      {
        paragraphs: [
          "There's no single honest answer to what a website should cost, because the number depends entirely on what the site actually needs to do. What's useful is understanding what actually drives the price up or down, so a quote makes sense instead of feeling like a guess.",
        ],
      },
      {
        heading: "What actually drives the cost",
        paragraphs: [
          "The number of pages matters, but not as much as what those pages need to do. A five page site with a contact form costs far less than a five page site with online booking, payment processing, or a custom database behind it. Design complexity, how much content needs to be written, and how many rounds of revision are built into the process all shift the number too.",
        ],
      },
      {
        heading: "Template versus custom",
        paragraphs: [
          "A template can be a reasonable starting point for a very simple, low traffic site. The tradeoff is that you're working inside someone else's structure, and it shows the moment your business needs something the template wasn't built to do. A custom build costs more up front because it's built around your specific business instead of a generic layout, and it tends to convert better and grow easier as a result.",
        ],
      },
      {
        heading: "What a fair quote looks like",
        paragraphs: [
          "A fair quote comes after a real conversation about what you actually need, not a generic package pulled off a price sheet. If two agencies quote wildly different numbers for what sounds like the same project, ask each of them exactly what's included. The gap is usually in what happens after launch: hosting, updates, and support, which some agencies bake in and others quietly leave out.",
        ],
      },
    ],
  },
  {
    slug: "signs-your-website-is-costing-you-customers",
    title: "Five Signs Your Website Is Costing You Customers",
    description:
      "The real warning signs that your business website is losing you customers before they ever pick up the phone, and what to actually do about each one.",
    excerpt:
      "The real warning signs that your website is losing you customers before they ever pick up the phone.",
    date: "2026-09-18",
    tag: "Web Design",
    relatedHref: "/web-design-agency-orlando",
    relatedLabel: "See our web design service",
    sections: [
      {
        paragraphs: [
          "A website doesn't have to be broken to be losing you business. Most of the time it's a handful of quiet problems that add up: a slightly slower load time here, an unclear call to action there. Here's what to actually check.",
        ],
      },
      {
        heading: "1. It's slow to load on a phone",
        paragraphs: [
          "Most of your visitors are on a phone, often on a mediocre connection. If your site takes more than a few seconds to load, a real percentage of visitors are gone before they see anything. Test your own site on your phone, not just a fast office computer.",
        ],
      },
      {
        heading: "2. It's not obvious what to do next",
        paragraphs: [
          "If a visitor has to hunt for your phone number or figure out how to actually contact you, most of them won't bother. Every page should make the next step obvious: call, book, or get a quote, stated clearly and repeated more than once on longer pages.",
        ],
      },
      {
        heading: "3. It hasn't been updated in years",
        paragraphs: [
          "An outdated design signals an outdated business, fairly or not. So does a copyright year in the footer that's several years behind, or services listed that you no longer offer. Small details like this quietly erode trust before a visitor even reads your copy.",
        ],
      },
      {
        heading: "4. There's no real proof you're legitimate",
        paragraphs: [
          "Real reviews, real photos of actual work, and a real address and phone number all build trust fast. A site with none of that asks a visitor to take a leap of faith that most people simply won't take when a competitor's site makes it easy to trust them instead.",
        ],
      },
      {
        heading: "5. It looks fine on desktop and broken on mobile",
        paragraphs: [
          "A surprising number of small business sites were designed for a desktop screen first and never properly adapted for mobile. Buttons that are too small to tap, text that requires zooming, and menus that don't work on a touchscreen all quietly push mobile visitors away.",
        ],
      },
    ],
  },
  {
    slug: "how-to-get-more-google-reviews",
    title: "How to Get More Google Reviews Without Breaking the Rules",
    seoTitle: "How to Get More Google Reviews the Right Way | EVOGENCY",
    description:
      "A practical, honest guide to getting more Google reviews for your business the right way, without fake reviews or tactics that put your Google Business Profile at risk.",
    excerpt:
      "A practical, honest guide to getting more reviews without fake reviews or tactics that put your Google profile at risk.",
    date: "2026-09-18",
    tag: "Reviews",
    relatedHref: "/google-reviews-orlando",
    relatedLabel: "See our reviews service",
    sections: [
      {
        paragraphs: [
          "Most businesses know reviews matter. Far fewer have an actual system for getting them, which is usually the entire problem. Here's what actually works, and what to avoid entirely.",
        ],
      },
      {
        heading: "Ask at the right moment",
        paragraphs: [
          "The best time to ask for a review is right after a customer says something positive, whether that's out loud after a job or in a follow up message once a service is finished. Waiting a week and sending a generic email to everyone in your database gets a fraction of the response of asking in the moment.",
        ],
      },
      {
        heading: "Make it genuinely easy",
        paragraphs: [
          "A direct link that takes a customer straight to the review box, sent by text or email, removes almost every excuse not to leave one. If someone has to search for your business on Google themselves and find the right place to click, most people simply won't finish.",
        ],
      },
      {
        heading: "What to never do",
        paragraphs: [
          "Never pay for reviews, never write them yourself, and never offer a discount specifically in exchange for a review. All three violate Google's policies directly and can get a business profile suspended entirely, which costs you every review you've already earned along with your map pack visibility. It's not worth the risk for a shortcut that a real system replaces anyway.",
        ],
      },
      {
        heading: "Respond to what comes in",
        paragraphs: [
          "A business that responds to reviews, good and bad, reads as more trustworthy than one that never does. A short, professional response to a bad review often builds more trust with future customers than having no negative reviews at all, since it shows a real person is paying attention.",
        ],
      },
    ],
  },
  {
    slug: "do-you-need-a-custom-crm",
    title: "Do You Actually Need a Custom CRM, or Will a Template Work",
    seoTitle: "Custom CRM vs Off the Shelf: Which Fits? | EVOGENCY",
    description:
      "How to decide between an off the shelf CRM like HubSpot or Salesforce and a custom built CRM, based on how your business actually sells and tracks customers.",
    excerpt:
      "How to decide between an off the shelf CRM and a custom build, based on how your business actually operates.",
    date: "2026-09-18",
    tag: "CRM",
    relatedHref: "/custom-crm-development-orlando",
    relatedLabel: "See our CRM development service",
    sections: [
      {
        paragraphs: [
          "Every growing business eventually hits the same wall: spreadsheets and sticky notes stop being enough to track leads and customers. The question that follows is whether an off the shelf tool solves it, or whether the business has outgrown what a template can offer.",
        ],
      },
      {
        heading: "When a template is genuinely fine",
        paragraphs: [
          "If your sales process is simple and fits neatly into generic stages like new, contacted, and closed, an off the shelf CRM can work well and get you moving fast. The per seat cost is manageable at a small scale, and you don't need to wait on a build.",
        ],
      },
      {
        heading: "When it starts costing you",
        paragraphs: [
          "The cracks show up when your process doesn't match the tool's categories, when you're paying for features you never use, or when the per seat pricing starts adding up as your team grows. At that point you're often bending your actual business process to fit software instead of the other way around.",
        ],
      },
      {
        heading: "What a custom CRM actually solves",
        paragraphs: [
          "A custom CRM is built around your specific pipeline stages, your specific fields, and the tools you already use, so nothing gets typed in twice across five different systems. You own it outright instead of renting it forever, and it can grow with new pipelines and automations as your business changes, rather than waiting on whatever tier a subscription service decides to sell you.",
        ],
      },
      {
        heading: "The honest answer",
        paragraphs: [
          "If a template is working, there's no reason to rebuild it just to have something custom. But if you're fighting your CRM more than it's helping you, that's usually the clearest sign it's worth the conversation.",
        ],
      },
    ],
  },
  {
    slug: "what-is-generative-engine-optimization",
    title: "What Generative Engine Optimization Means for Your Business",
    seoTitle: "What Is Generative Engine Optimization? | EVOGENCY",
    description:
      "A plain language explanation of generative engine optimization, or GEO: what it is, how it differs from regular SEO, and why it's worth thinking about now while almost nobody else is.",
    excerpt:
      "A plain language explanation of GEO, how it differs from regular SEO, and why it's worth thinking about now.",
    date: "2026-09-18",
    tag: "AI Search",
    relatedHref: "/generative-engine-optimization-orlando",
    relatedLabel: "See our GEO service",
    sections: [
      {
        paragraphs: [
          "People are starting to ask ChatGPT, Perplexity, and Google AI Overviews for a recommendation instead of typing a search and scrolling through links. Generative engine optimization, or GEO, is the practice of making sure your business is the one those systems actually mention.",
        ],
      },
      {
        heading: "How it's different from regular SEO",
        paragraphs: [
          "Traditional SEO earns you a spot in a ranked list of links that a person clicks through themselves. GEO earns you a mention inside the answer itself, before a person ever sees a list of options. The two share the same foundation of local signals and site authority, but the content built around them is structured differently, aimed at being extracted and repeated accurately rather than just read top to bottom.",
        ],
      },
      {
        heading: "Why now, specifically",
        paragraphs: [
          "This is genuinely early. Almost nobody at the local business level is actively optimizing for it yet, which means there's an open lane that won't stay open forever. Being early here costs a lot less than trying to catch up once every competitor in your market has already done the work.",
        ],
      },
      {
        heading: "What it actually takes",
        paragraphs: [
          "Clear, accurate, well structured content about your business, the same fundamentals of SEO you're probably already investing in, plus paying attention to what these AI tools currently say about you and your competitors when someone asks. There's no guaranteed formula, since none of these systems publish their exact criteria, but the businesses paying attention now will be ahead of the ones who wait.",
        ],
      },
    ],
  },
  {
    slug: "ai-automation-ideas-for-local-businesses",
    title: "AI Automation Ideas Every Local Service Business Should Consider",
    seoTitle: "AI Automation Ideas for Local Businesses | EVOGENCY",
    description:
      "Practical AI automation ideas for local service businesses like plumbers, roofers, and contractors: real workflows worth automating and what to leave alone.",
    excerpt:
      "Practical AI automation ideas for plumbers, roofers, and contractors, and the workflows worth automating first.",
    date: "2026-09-18",
    tag: "AI Automation",
    relatedHref: "/ai-automation-orlando",
    relatedLabel: "See our AI automation service",
    sections: [
      {
        paragraphs: [
          "AI automation sounds abstract until you look at where a local service business actually loses time and money every week. Most of it comes down to a handful of specific, fixable moments.",
        ],
      },
      {
        heading: "Instant lead response",
        paragraphs: [
          "A lead who fills out a form at nine at night and doesn't hear back until Monday morning has usually already called someone else by then. An automated first response, even a simple one, keeps that lead warm until a real person can follow up.",
        ],
      },
      {
        heading: "Follow up on quotes that go quiet",
        paragraphs: [
          "A quote sent and never followed up on is money left on the table. Automated, well timed follow up messages catch the leads that would have otherwise just gone cold, without anyone having to remember to chase them manually.",
        ],
      },
      {
        heading: "Syncing information across your tools",
        paragraphs: [
          "If the same customer's information gets typed into your CRM, your calendar, and your invoicing tool separately, that's a place automation pays for itself almost immediately. Connecting the tools you already use removes the manual retyping and the mistakes that come with it.",
        ],
      },
      {
        heading: "What to leave alone",
        paragraphs: [
          "Automation should remove manual, repetitive work, not the parts of the job that actually need a person, like a sensitive customer conversation or a judgment call on a complicated job. The goal is freeing up time for the work that matters, not replacing the team.",
        ],
      },
    ],
  },
  {
    slug: "cross-platform-vs-native-app-development",
    title: "Cross Platform vs Native: How to Choose the Right Approach for Your App",
    seoTitle: "Cross Platform vs Native Apps: How to Choose | EVOGENCY",
    description:
      "A clear breakdown of cross platform app development with Flutter versus native iOS and Android development, and how to decide which one actually fits your app idea.",
    excerpt:
      "Cross platform versus native app development, explained plainly, and how to decide which one fits your idea.",
    date: "2026-09-18",
    tag: "Mobile Apps",
    relatedHref: "/mobile-app-development-orlando",
    relatedLabel: "See our app development service",
    sections: [
      {
        paragraphs: [
          "One of the first real decisions in building an app is whether to build it natively for each platform or cross platform with a single codebase. The right answer depends entirely on what the app actually needs to do.",
        ],
      },
      {
        heading: "What cross platform actually means",
        paragraphs: [
          "Cross platform development, using a framework like Flutter, means writing the app once and shipping it to iOS, Android, and even desktop from a single codebase. That means one team building and maintaining one piece of software instead of two or three separate ones that all need to be kept in sync.",
        ],
      },
      {
        heading: "When native still makes sense",
        paragraphs: [
          "Native development can be the right call when an app depends heavily on the newest platform specific features the moment they're released, or when performance needs are extremely demanding, like high end gaming. For the vast majority of business apps, that level of platform specific dependency simply isn't there.",
        ],
      },
      {
        heading: "Why cross platform wins for most businesses",
        paragraphs: [
          "Building once and shipping everywhere means a faster launch, a lower cost to maintain, and one team that actually understands the whole app instead of two teams that have to stay coordinated. Flutter apps run at native or near native performance for the overwhelming majority of business use cases, which is why it's the default approach for most new apps that aren't chasing extremely specialized platform features.",
        ],
      },
    ],
  },
  {
    slug: "google-business-profile-checklist",
    title: "The Google Business Profile Checklist Every Local Business Should Run Through",
    seoTitle: "Google Business Profile Checklist | EVOGENCY",
    description:
      "A complete checklist for optimizing your Google Business Profile, covering the fields most local businesses skip and the details that actually affect map pack visibility.",
    excerpt:
      "A complete checklist covering the fields most local businesses skip and the details that actually affect visibility.",
    date: "2026-09-18",
    tag: "SEO",
    relatedHref: "/seo-agency-orlando",
    relatedLabel: "See our SEO service",
    sections: [
      {
        paragraphs: [
          "A Google Business Profile that's only half filled out is one of the quietest ways a local business loses visibility. Here's what to actually check, in order.",
        ],
      },
      {
        heading: "The basics",
        paragraphs: [
          "Business name exactly as it appears in the real world, correct category as the primary category with relevant secondary categories added, accurate hours including holiday hours, and a real, complete address or service area. Small mismatches between what's on your profile and what's on your website, like a slightly different phone number, quietly hurt your local trust signals.",
        ],
      },
      {
        heading: "Photos and completeness",
        paragraphs: [
          "Real photos of your actual work, your team, and your location, kept current. A profile with old or generic stock photos reads as less trustworthy, and Google's own data shows profiles with more photos get more engagement.",
        ],
      },
      {
        heading: "Reviews and posts",
        paragraphs: [
          "A steady, honest flow of real reviews, responded to consistently, matters more here than almost anywhere else. Regular posts about real updates, offers, or projects also give Google fresh signals that the business is active, which is a real factor in how profiles get treated over time.",
        ],
      },
      {
        heading: "The easy ones people skip",
        paragraphs: [
          "A complete business description in your own words, the services or products section filled out specifically rather than left generic, and messaging turned on if you're willing to respond to it. None of these take long, and almost nobody finishes all of them, which is exactly why doing so is a real advantage.",
        ],
      },
    ],
  },
  {
    slug: "why-mobile-first-design-is-not-optional",
    title: "Why Mobile First Design Is Not Optional Anymore",
    description:
      "Why designing a website mobile first, instead of adapting a desktop design down, matters more than ever for how people actually browse and search today.",
    excerpt:
      "Why designing mobile first, instead of adapting a desktop design down, matters more than ever.",
    date: "2026-09-18",
    tag: "Web Design",
    relatedHref: "/web-design-agency-orlando",
    relatedLabel: "See our web design service",
    sections: [
      {
        paragraphs: [
          "For most local businesses, the majority of website visitors are on a phone, often while standing in a parking lot or sitting in their car deciding who to call. A site designed for desktop first and squeezed down to fit a smaller screen shows it immediately.",
        ],
      },
      {
        heading: "What mobile first actually means",
        paragraphs: [
          "Mobile first design means starting with the smallest screen and building up, rather than designing for a wide desktop monitor and shrinking it afterward. That changes real decisions: bigger tap targets, shorter menus, and content ordered around what a phone user actually needs first, like your phone number and what you do.",
        ],
      },
      {
        heading: "What goes wrong with the opposite approach",
        paragraphs: [
          "A desktop first site squeezed onto mobile tends to end up with tiny text that requires zooming, buttons placed too close together to tap accurately, and menus that were never really designed to work with a thumb. Every one of those small frictions pushes a percentage of visitors to leave before they ever reach your contact information.",
        ],
      },
      {
        heading: "The business case, not just the design case",
        paragraphs: [
          "This isn't only about looking good on a phone. Google's own ranking systems evaluate the mobile version of a site first, so a poor mobile experience can hold back how the site performs in search results, on top of the visitors it loses directly. Mobile first design is a business decision wearing a design decision's clothes.",
        ],
      },
    ],
  },
  {
    slug: "does-your-website-need-a-redesign-or-just-a-refresh",
    title: "How to Know If Your Website Needs a Redesign or Just a Refresh",
    seoTitle: "Website Redesign or Refresh? How to Tell | EVOGENCY",
    description:
      "How to tell whether your website needs a full redesign or just a targeted refresh, so you spend money on the fix that actually matches the problem.",
    excerpt:
      "How to tell whether your site needs a full rebuild or just a targeted fix, so you spend money on the right thing.",
    date: "2026-09-18",
    tag: "Web Design",
    relatedHref: "/web-design-agency-orlando",
    relatedLabel: "See our web design service",
    sections: [
      {
        paragraphs: [
          "Not every outdated feeling website needs to be torn down and rebuilt from scratch. Sometimes the foundation is fine and only a few specific things need work. Knowing the difference saves both money and time.",
        ],
      },
      {
        heading: "Signs a refresh is enough",
        paragraphs: [
          "If the site loads reasonably fast, works fine on mobile, and the structure makes sense, but the copy is stale, the photos are outdated, or a couple of key pages just aren't converting, that's usually a refresh. Updating content, swapping photos, and rebuilding a handful of underperforming pages can solve most of the actual problem without touching what's already working.",
        ],
      },
      {
        heading: "Signs you actually need a redesign",
        paragraphs: [
          "If the site is genuinely slow, doesn't work properly on mobile at a structural level, is built on an outdated platform that's hard to update safely, or simply can't do something the business now needs, like online booking, that's a real redesign, not a patch. Trying to refresh a site with real structural problems usually just delays the inevitable rebuild while spending money along the way.",
        ],
      },
      {
        heading: "How to actually decide",
        paragraphs: [
          "A real audit, not a guess, is the fastest way to know which one you need. It should look at speed, mobile usability, the platform underneath the site, and how well the current pages are actually converting, then give you an honest answer instead of defaulting to the more expensive option.",
        ],
      },
    ],
  },
];

/**
 * Drip-publish batch 1 of the 100-post backlog (src/lib/blog-backlog.ts).
 * Add more slugs here in future sessions rather than publishing the whole
 * backlog at once — see the EVOGENCY Website vault note for the cadence.
 */
const PUBLISHED_BACKLOG_SLUGS = [
  "seo-for-plumbers",
  "seo-for-roofers",
  "website-design-for-plumbers",
  "google-reviews-for-plumbers",
  "ai-automation-for-plumbers",
  "keyword-research-basics-for-small-business",
  "what-makes-a-website-convert",
  "review-count-and-rating-and-the-map-pack",
  "does-your-business-need-an-app-or-just-a-website",
  "seo-vs-ppc-for-a-local-business",
  "website-design-for-roofers",
  "google-reviews-for-roofers",
  "ai-automation-for-roofers",
  "seo-for-hvac-companies",
  "seo-for-electricians",
  "seo-for-landscapers",
  "seo-for-restaurants",
  "seo-for-dentists",
  "seo-for-auto-repair-shops",
];

// Newest first, so each drip publish shows up at the top of /blog. The sort
// is stable, so posts sharing a date keep their original order.
export const BLOG_POSTS: BlogPost[] = [
  ...ORIGINAL_POSTS,
  ...BLOG_BACKLOG.filter((p) => PUBLISHED_BACKLOG_SLUGS.includes(p.slug)),
].sort((a, b) => b.date.localeCompare(a.date));

export function getBlogPost(slug: string) {
  return BLOG_POSTS.find((p) => p.slug === slug);
}
