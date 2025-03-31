// Mock data for development purposes
import type { GoalStatus } from "./types/workmap";

// Define types for our mock data
interface User {
  id?: string; // Making id optional for mock data users
  name: string;
  email?: string;
  avatar?: string;
  initials?: string;
  role?: string;
}

interface Company {
  id: string;
  name: string;
  logoUrl: string;
}

interface NavigationItem {
  id: string;
  label: string;
  href: string;
  icon: string;
}

interface Deadline {
  display: string;
  isPast: boolean;
}

interface CompletedOn {
  display: string;
}

interface WorkMapItem {
  id: string;
  type: "goal" | "project";
  name: string;
  status: GoalStatus;
  progress: number;
  space: string;
  owner: User;
  deadline?: Deadline;
  completedOn?: CompletedOn;
  nextStep?: string;
  children: WorkMapItem[];
}

// Avatar URLs from the Operately design system
export const avatarImages: string[] = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];

// For backward compatibility
export const avatarUrl: string = avatarImages[0];

// Sample user data
export const currentUser: User = {
  id: "user-1",
  name: "John Doe",
  email: "john.doe@example.com",
  avatar: avatarUrl,
  role: "Product Manager",
};

// Sample company data
export const companyData: Company = {
  id: "company-1",
  name: "Nexus Dynamics",
  logoUrl: "/logo.svg",
};

// Sample navigation items
export const navItems: NavigationItem[] = [
  { id: "nav-1", label: "Home", href: "/", icon: "home" },
  { id: "nav-2", label: "Company", href: "/work-map/", icon: "map" },
  { id: "nav-3", label: "My work", href: "#", icon: "camera-selfie" },
  { id: "nav-4", label: "Review", href: "#", icon: "coffee" },
];

// Work Map mock data
export const mockData: WorkMapItem[] = [
  {
    id: "goal-1",
    type: "goal",
    name: "Acquire the first users of Operately outside Semaphore",
    status: "on_track",
    progress: 45,
    space: "General",
    owner: {
      name: "Igor Š.",
      initials: "IŠ",
      avatar: avatarImages[0],
    },
    deadline: {
      display: "Dec 31 2024",
      isPast: false,
    },
    nextStep: "People are signing up for SaaS",
    children: [
      {
        id: "project-1",
        type: "project",
        name: "Document features in Help Center",
        status: "completed",
        progress: 100,
        space: "Product",
        owner: {
          name: "Marko A.",
          initials: "MA",
          avatar: avatarImages[1],
        },
        deadline: {
          display: "Mar 31",
          isPast: false,
        },
        completedOn: {
          display: "Mar 10 2025",
        },
        nextStep: "",
        children: [],
      },
      {
        id: "project-2",
        type: "project",
        name: "Release 0.4",
        status: "paused",
        progress: 30,
        space: "Product",
        owner: {
          name: "Igor Š.",
          initials: "IŠ",
          avatar: avatarImages[0],
        },
        deadline: {
          display: "Feb 7",
          isPast: true,
        },
        nextStep: "All weekly updates are collected",
        children: [],
      },
      {
        id: "project-3",
        type: "project",
        name: "Design awesome goals",
        status: "caution",
        progress: 25,
        space: "R&D",
        owner: {
          name: "Adriano L.",
          initials: "AL",
        },
        deadline: {
          display: "Undefined",
          isPast: false,
        },
        nextStep: "No active milestones",
        children: [],
      },
      {
        id: "project-4",
        type: "project",
        name: "Deprecate $Competitor at Acme, Inc.",
        status: "on_track",
        progress: 75,
        space: "Product",
        owner: {
          name: "Igor Š.",
          initials: "IŠ",
          avatar: avatarImages[0],
        },
        deadline: {
          display: "Dec 31 2024",
          isPast: false,
        },
        nextStep: "$Competitor is in read-only mode",
        children: [],
      },
    ],
  },
  {
    id: "goal-2",
    type: "goal",
    name: "Accelerate growth from current customers",
    status: "issue",
    progress: 15,
    space: "Customer Success",
    owner: {
      name: "Jennifer L.",
      initials: "JL",
      avatar: avatarImages[2],
    },
    deadline: {
      display: "Dec 31",
      isPast: false,
    },
    nextStep: "Increase total active users",
    children: [
      {
        id: "goal-22",
        type: "goal",
        name: "Increase TikTok impressions by 60%",
        status: "missed", // Goal not accomplished (red)
        progress: 30,
        space: "Marketing",
        owner: {
          name: "Sam A.",
          initials: "SA",
          avatar: avatarImages[3],
        },
        deadline: {
          display: "Feb 28 2025",
          isPast: true,
        },
        completedOn: {
          display: "Mar 4 2025",
        },
        nextStep: "",
        children: [],
      },
      {
        id: "goal-23",
        type: "goal",
        name: "Increase LinkedIn followers by 40%",
        status: "partial", // Goal partially accomplished (amber/yellow)
        progress: 75,
        space: "Marketing",
        owner: {
          name: "Sam A.",
          initials: "SA",
          avatar: avatarImages[3],
        },
        deadline: {
          display: "Mar 15 2025",
          isPast: true,
        },
        completedOn: {
          display: "Mar 15 2025",
        },
        nextStep: "",
        children: [],
      },
    ],
  },
  {
    id: "goal-3",
    type: "goal",
    name: "Acquire new customers",
    status: "on_track",
    progress: 60,
    space: "Sales",
    owner: {
      name: "Michael R.",
      initials: "MR",
      avatar: avatarImages[4],
    },
    deadline: {
      display: "Jun 30 2025",
      isPast: false,
    },
    nextStep: "Prepare sales collateral",
    children: [],
  },
  {
    id: "goal-4",
    type: "goal",
    name: "Improve customer retention rate",
    status: "achieved", // Goal fully accomplished (green)
    progress: 100,
    space: "Customer Success",
    owner: {
      name: "Jennifer L.",
      initials: "JL",
      avatar: avatarImages[2],
    },
    deadline: {
      display: "Mar 15 2025",
      isPast: true,
    },
    completedOn: {
      display: "Mar 12 2025",
    },
    nextStep: "",
    children: [],
  },
];
