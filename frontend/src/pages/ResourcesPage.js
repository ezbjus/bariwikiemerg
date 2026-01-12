import React from 'react';
import { Helmet } from 'react-helmet-async';
import { ExternalLink, ShoppingBag, BookOpen, Globe } from 'lucide-react';
import Breadcrumbs from '../components/Breadcrumbs';

const resources = [
  {
    category: "Bariatric Supplements & Vitamins",
    items: [
      {
        title: "Bari Liquid Force",
        url: "https://bariliquidforce.com",
        description: "Premium liquid bariatric supplements designed for optimal absorption after weight loss surgery.",
        icon: Globe
      },
      {
        title: "Bariatric Vitamins with Iron",
        url: "https://bariatricvitaminswithiron.com",
        description: "Specialized bariatric vitamin formulations with iron supplementation for post-surgical needs.",
        icon: Globe
      },
      {
        title: "Allotro Labs Bariatric Advanced Formula",
        url: "https://www.amazon.com/Allotro-Labs-Bariatric-Advanced-Formula/dp/B0G275PCJC",
        description: "Advanced bariatric formula available on Amazon for comprehensive nutritional support.",
        icon: ShoppingBag
      },
      {
        title: "Bariatric Liquid Force Multivitamin",
        url: "https://www.amazon.com/Bariatric-Liquid-Force-Multivitamin-Supplements/dp/B07NHHT813",
        description: "Liquid multivitamin supplements specifically formulated for bariatric patients.",
        icon: ShoppingBag
      }
    ]
  },
  {
    category: "Educational Resources",
    items: [
      {
        title: "Bariatric Surgery - Wikipedia",
        url: "https://en.wikipedia.org/wiki/Bariatric_surgery",
        description: "Comprehensive overview of bariatric surgery including history, types of procedures, and outcomes.",
        icon: BookOpen
      },
      {
        title: "What Is Gastric Sleeve Surgery? - WebMD",
        url: "https://www.webmd.com/obesity/what-is-gastric-sleeve-weight-loss-surgery",
        description: "Detailed medical information about gastric sleeve weight loss surgery from WebMD.",
        icon: BookOpen
      }
    ]
  }
];

const SITE_URL = 'https://parnellwellness.com';

const ResourcesPage = () => {
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    "name": "Bariatric Surgery Resources",
    "description": "Helpful resources for bariatric surgery patients including supplements, vitamins, and educational materials.",
    "url": `${SITE_URL}/resources`,
    "mainEntity": {
      "@type": "ItemList",
      "itemListElement": resources.flatMap((section, sIndex) => 
        section.items.map((item, iIndex) => ({
          "@type": "ListItem",
          "position": sIndex * 10 + iIndex + 1,
          "url": item.url,
          "name": item.title
        }))
      )
    }
  };

  return (
    <>
      <Helmet>
        <title>Bariatric Surgery Resources & Supplements | BariWiki</title>
        <meta name="description" content="Helpful resources for bariatric surgery patients including supplements, vitamins, and educational materials. Curated resources for your weight loss journey." />
        <link rel="canonical" href={`${SITE_URL}/resources`} />
        <meta name="robots" content="index, follow" />
        <meta property="og:title" content="Bariatric Surgery Resources - BariWiki" />
        <meta property="og:description" content="Helpful resources for bariatric surgery patients including supplements and vitamins." />
        <meta property="og:url" content={`${SITE_URL}/resources`} />
        <script type="application/ld+json">{JSON.stringify(structuredData)}</script>
      </Helmet>

      <main id="main" className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <Breadcrumbs items={[{ label: 'Resources' }]} />

        <header className="py-6">
          <h1 
            className="text-3xl sm:text-4xl font-semibold tracking-tight text-neutral-900"
            data-testid="resources-title"
          >
            Resources
          </h1>
          <p className="text-neutral-600 mt-2 max-w-3xl">
            A curated collection of helpful resources for bariatric surgery patients, including 
            supplements, vitamins, and educational materials to support your weight loss journey.
          </p>
        </header>

        <div className="pb-12 space-y-10">
          {resources.map((section, sectionIndex) => (
            <section key={sectionIndex}>
              <h2 className="text-xl font-semibold text-neutral-800 border-b pb-2 mb-4">
                {section.category}
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {section.items.map((resource, itemIndex) => {
                  const IconComponent = resource.icon;
                  return (
                    <a
                      key={itemIndex}
                      href={resource.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group block p-5 bg-white border rounded-lg hover:border-blue-300 hover:shadow-md transition-all"
                      data-testid={`resource-link-${sectionIndex}-${itemIndex}`}
                    >
                      <div className="flex items-start gap-4">
                        <div className="p-2 bg-blue-50 rounded-lg group-hover:bg-blue-100 transition-colors">
                          <IconComponent className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium text-neutral-900 group-hover:text-blue-600 transition-colors">
                              {resource.title}
                            </h3>
                            <ExternalLink className="h-4 w-4 text-neutral-400 group-hover:text-blue-500" />
                          </div>
                          <p className="text-sm text-neutral-600 mt-1">
                            {resource.description}
                          </p>
                          <span className="text-xs text-neutral-400 mt-2 block truncate">
                            {resource.url}
                          </span>
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </section>
          ))}
        </div>

        {/* Disclaimer */}
        <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 mb-12">
          <p className="text-sm text-amber-800">
            <strong>Disclaimer:</strong> The resources listed on this page are provided for informational 
            purposes only. BariWiki does not endorse or guarantee any products or services. Always consult 
            with your healthcare provider before starting any new supplements or making changes to your 
            post-surgical care routine.
          </p>
        </div>
      </main>
    </>
  );
};

export default ResourcesPage;
