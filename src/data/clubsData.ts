
// Mock club data with institution information and featured status
export const clubsData = [
  {
    id: 1,
    name: "Abit rgit",
    institution: "RGIT",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: true,
    members: 320
  },
  {
    id: 2,
    name: "ACE committee",
    institution: "GPT",
    category: "Management",
    image: "https://images.unsplash.com/photo-1513364776144-60967b0f800f?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: false,
    isFeatured: false,
    members: 145
  },
  {
    id: 3,
    name: "CodeX Club",
    institution: "PDEA",
    category: "Programming",
    image: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: false,
    isFeatured: true,
    members: 280
  },
  {
    id: 4,
    name: "CSE (AIML) Department",
    institution: "SIGCE",
    category: "Academic",
    image: "",
    isJoined: true,
    isFeatured: false,
    members: 210
  },
  {
    id: 5,
    name: "CSI Chapter",
    institution: "LTCE",
    category: "Technology",
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3",
    isJoined: true,
    isFeatured: true,
    members: 350
  },
  {
    id: 6,
    name: "CSI VIT",
    institution: "VIT",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 175
  },
  {
    id: 7,
    name: "Eloquence Club",
    institution: "SIGCE",
    category: "Communication",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 120
  },
  {
    id: 8,
    name: "EN. IC. Centre",
    institution: "SIGCE",
    category: "Innovation",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 90
  },
  {
    id: 9,
    name: "FOSS SIGCE",
    institution: "SIGCE",
    category: "Open Source",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 150
  },
  {
    id: 10,
    name: "GDG on Campus",
    institution: "LTCE",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 200
  },
  {
    id: 11,
    name: "Google developer groups on",
    institution: "NMIMS",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 230
  },
  {
    id: 12,
    name: "Google Developer Groups On Campus",
    institution: "SIES",
    category: "Technology",
    image: "",
    isJoined: false,
    isFeatured: false,
    members: 185
  }
];

// Mock community data
export const communitiesData = [
  {
    id: 1,
    name: "Computer Science Club",
    institution: "RGIT",
    members: 245,
    description: "For CS enthusiasts to collaborate and learn together.",
    isJoined: false,
    isFeatured: true,
    image: ""
  },
  {
    id: 2,
    name: "Engineering Society",
    institution: "GPT",
    members: 187,
    description: "Connect with fellow engineering students and professionals.",
    isJoined: true,
    isFeatured: true,
    image: "https://images.unsplash.com/photo-1486312338219-ce68d2c6f44d?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
  {
    id: 3,
    name: "Arts & Culture",
    institution: "PDEA",
    members: 156,
    description: "Discuss art, literature and cultural events around campus.",
    isJoined: false,
    isFeatured: false,
    image: ""
  },
  {
    id: 4,
    name: "Sports Club",
    institution: "SIGCE",
    members: 320,
    description: "Join teams, find workout partners, and discuss sports.",
    isJoined: false,
    isFeatured: false,
    image: "https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&auto=format&fit=crop&q=60&ixlib=rb-4.0.3"
  },
];

// Club data types
export interface ClubDataProps {
  id: number;
  name: string;
  institution: string;
  category: string;
  image: string;
  isJoined: boolean;
  isFeatured: boolean;
  members: number;
}

// Community data types
export interface CommunityDataProps {
  id: number;
  name: string;
  institution: string;
  members: number;
  description: string;
  isJoined: boolean;
  isFeatured: boolean;
  image: string;
}
