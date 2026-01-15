import { assetUrl } from "../utils/paths";

const projects = [
  {
    id: "arjuna",
    title: "Arjuna",
    subtitle: "Personal Portfolio Website for talented design engineer",
    description:
      "A clean and strategic portfolio website built to showcase projects, personality, and process with a premium editorial feel.",
    challenges:
      "Arjuna is a skilled design engineer with a strong portfolio, but his online presence did not reflect the quality of his work. He needed a personal site that could showcase his experience, process, and personality, while also making it easy for potential clients or teams to reach out. The old layout felt flat, lacked structure, and did not support storytelling.",
    solutions:
      "We built a sleek one-page website designed to highlight work without feeling overwhelming. The layout is structured around clarity with curated case studies, bold typography, and clear calls to action so visitors can understand his value quickly and get in touch.",
    solutionVideo: assetUrl("video/project1.mp4"),
    results: {
      summary:
        "Arjuna's site now reflects his skill and focus, helping him stand out in a competitive industry and connect with more aligned opportunities.",
      metrics: [
        { value: "3x", label: "More clicks" },
        { value: "2x", label: "Longer session time" },
        { value: "4", label: "New inquiries in 30 days" },
      ],
      client: {
        quote:
          "Working with Essabir felt personal. The process was smooth, the design was stunning, and everything had meaning.",
        name: "Arjuna Ibrahim",
        role: "Design Engineer",
        avatar: assetUrl("clients/client1.png"),
        company: "Self-employed",
      },
    },
    year: "2023",
    timeline: "3 Months",
    services: ["Website", "Branding"],
    liveUrl: "https://example.com",
    image: assetUrl("projects/imag3.png"),
    gallery: [
      assetUrl("projects/accessories.jpg"),
      assetUrl("projects/auth-system.jpg"),
    ],
  },
  {
    id: "bima",
    title: "Bima",
    subtitle: "Website and branding for AI Automation Company",
    description:
      "A bold identity and marketing site for an AI automation team, designed to position the brand as fast, reliable, and future-ready.",
    challenges:
      "The team needed to explain complex AI automation services while still feeling fast, modern, and trustworthy. The previous site lacked hierarchy and did not communicate outcomes or differentiation. They also needed a flexible system to scale content as services evolved.",
    solutions:
      "We created a bold identity and modular marketing site with narrative sections, outcome-led messaging, and motion accents. The new layout balances credibility with speed, and the component system supports ongoing updates without redesigning pages.",
    solutionVideo: assetUrl("video/project1.mp4"),
    results: {
      summary:
        "Bima's marketing site now explains complex automation services with clarity while converting interest into qualified conversations.",
      metrics: [
        { value: "48%", label: "Increase in demo requests" },
        { value: "2.1x", label: "More time on site" },
        { value: "35%", label: "Lower bounce rate" },
      ],
      client: {
        quote:
          "The new site finally tells our story. We can pitch faster and attract leads that actually fit.",
        name: "Liam Chen",
        role: "COO",
        company: "Bima",
        avatar: assetUrl("clients/client1.png"),
      },
    },
    year: "2024",
    timeline: "8 Weeks",
    services: ["Website", "Branding", "Strategy"],
    liveUrl: "https://example.com",
    image: assetUrl("projects/image.png"),
    gallery: [
      assetUrl("projects/elearning.jpg"),
      assetUrl("projects/game-engine.jpg"),
    ],
  },
  {
    id: "mandala",
    title: "Mandala",
    subtitle: "Boutique commerce experience for a premium lifestyle brand",
    description:
      "A refined commerce experience crafted for a premium lifestyle label, blending cinematic imagery with conversion-focused flows.",
    challenges:
      "Mandala needed a premium commerce experience that felt cinematic while still converting. The existing store felt generic and did not elevate the product story or craft. They also needed a clearer path from discovery to checkout.",
    solutions:
      "We designed a refined storefront with immersive imagery, restrained UI, and a guided product flow. The new experience highlights craft and materials, while the purchase journey stays simple and fast.",
    solutionVideo: assetUrl("video/project1.mp4"),
    results: {
      summary:
        "The new storefront elevated Mandala's brand perception and improved the path to purchase across desktop and mobile.",
      metrics: [
        { value: "1.6x", label: "Higher conversion rate" },
        { value: "28%", label: "More repeat buyers" },
        { value: "3.4x", label: "Product page saves" },
      ],
      client: {
        quote:
          "Every detail feels premium. Our products finally look the way they should online.",
        name: "Dianna Sulastri",
        role: "Founder",
        company: "Mandala",
        avatar: assetUrl("clients/client1.png"),

      },
    },
    year: "2024",
    timeline: "10 Weeks",
    services: ["Website", "Ecommerce", "Visual Design"],
    liveUrl: "https://example.com",
    image: assetUrl("projects/image2.png"),
    gallery: [
      assetUrl("projects/wordpress-theme.jpg"),
      assetUrl("projects/blazor-app.jpg"),
    ],
  },
];

export default projects;
