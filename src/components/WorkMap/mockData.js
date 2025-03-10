// Avatar URLs from the Operately design system
const avatarImages = [
  "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1534528741775-53994a69daeb?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
  "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80",
];

export const mockData = [
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
        nextStep: "Account management section launched",
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
    children: [],
  },
  {
    id: "goal-3",
    type: "goal",
    name: "Acquire new customers",
    status: "on_track",
    progress: 35,
    space: "Marketing",
    owner: {
      name: "Sam A.",
      initials: "SA",
      avatar: avatarImages[3],
    },
    deadline: {
      display: "Dec 12 2024",
      isPast: false,
    },
    nextStep: "People are signing up for SaaS",
    children: [
      {
        id: "goal-3-1",
        type: "goal",
        name: "Increase number of new signups",
        status: "on_track",
        progress: 45,
        space: "Marketing",
        owner: {
          name: "Vangipurappu L.",
          initials: "VL",
        },
        deadline: {
          display: "Jun 30",
          isPast: false,
        },
        nextStep: "2x more signups",
        children: [
          {
            id: "goal-3-1-1",
            type: "goal",
            name: "Increase organic search traffic",
            status: "caution",
            progress: 15,
            space: "Search Engines and LLMs",
            owner: {
              name: "Donald M.",
              initials: "DM",
              avatar: avatarImages[4],
            },
            deadline: {
              display: "Mar 31",
              isPast: false,
            },
            nextStep: "20% organic search increase",
            children: [
              {
                id: "project-5",
                type: "project",
                name: "Create blog posts for top 3 hotel management keywords",
                status: "caution",
                progress: 20,
                space: "Marketing",
                owner: {
                  name: "Yuval H.",
                  initials: "YH",
                  avatar: avatarImages[5],
                },
                deadline: {
                  display: "Mar 8",
                  isPast: false,
                },
                nextStep: "viral article draft",
                children: [],
              },
              {
                id: "project-6",
                type: "project",
                name: "Create YouTube videos for top 3 hotel management keywords",
                status: "pending",
                progress: 5,
                space: "People Ops",
                owner: {
                  name: "Andrew H.",
                  initials: "AH",
                },
                deadline: {
                  display: "Undefined",
                  isPast: false,
                },
                nextStep: "No active milestones",
                children: [],
              },
            ],
          },
        ],
      },
    ],
  },
  {
    id: "project-standalone",
    type: "project",
    name: "Legacy system migration to AWS",
    status: "dropped",
    progress: 18,
    space: "Engineering",
    owner: {
      name: "Alexandra K.",
      initials: "AK",
      avatar: avatarImages[4]
    },
    deadline: {
      display: "Oct 15 2024",
      isPast: false
    },
    nextStep: "Project deprioritized in favor of new architecture",
    children: []
  },
  {
    id: "goal-4",
    type: "goal",
    name: "Expand to European market by Q3",
    status: "failed",
    progress: 25,
    space: "International",
    owner: {
      name: "Michael B.",
      initials: "MB",
      avatar: avatarImages[5]
    },
    deadline: {
      display: "Sep 30 2024",
      isPast: false
    },
    nextStep: "Regulatory compliance issues blocked expansion",
    children: []
  },
];
