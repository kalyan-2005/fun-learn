export const sidebarData = {
    organization: {
      name: "Fun Lab",
      logo: "AudioWaveform",
      plan: "Student",
    },
    user: {
      name: "Kalyan Tingani",
      email: "kalyantingani@gmail.com",
      avatar: "",
    },
    navMain: [
      {
        title: "Dashboard",
        url: "/dashboard",
        icon: "BookOpen",
        isActive: true,
      },
      {
        title: "Learn",
        url: "/learn",
        icon: "UserCheck",
      },
      {
        title: "Assignments",
        url: "/assignments",
        icon: "PenTool",
        items: [
          {
            title: "Exam Results",
            url: "/exams/results",
          },
          {
            title: "Grade Reports",
            url: "/exams/reports",
          },
        ],
      },
      {
        title: "My Courses",
        url: "/my-courses",
        icon: "GraduationCap",
        items: [
          {
            title: "Existing",
            url: "/courses/courses",
          },
          {
            title: "Create New",
            url: "/courses/new",
          },
        ],
      },
      {
        title: "Schedule",
        url: "/schedule",
        icon: "Calendar",
        items: [
          {
            title: "Class Timetable",
            url: "/schedule/timetable",
          },
          {
            title: "Exam Schedule",
            url: "/schedule/exams",
          },
        ],
      },
    ],
    subjects: [
      {
        name: "Mathematics",
        url: "/subjects/mathematics",
        icon: "BookOpen",
      },
      {
        name: "Science",
        url: "/subjects/science",
        icon: "BookOpen",
      },
      {
        name: "Literature",
        url: "/subjects/literature",
        icon: "BookOpen",
      },
    ],
  };
  