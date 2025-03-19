import type {
  LicenseConfig,
  NavBarConfig,
  ProfileConfig,
  SiteConfig,
  ProjectsConfig,
} from './types/config'
import { LinkPreset } from './types/config'

export const siteConfig: SiteConfig = {
  title: '时歌的博客',
  subtitle: '理解以真实为本，但真实本身并不会自动呈现',
  lang: 'zh_CN',         // 'en', 'zh_CN', 'zh_TW', 'ja', 'ko'
  themeColor: {
    hue: 250,         // Default hue for the theme color, from 0 to 360. e.g. red: 0, teal: 200, cyan: 250, pink: 345
    fixed: false,     // Hide the theme color picker for visitors
  },
  banner: {
    enable: true,
    src: 'assets/images/blog-banner.webp',   // Relative to the /src directory. Relative to the /public directory if it starts with '/'
    position: 'center',      // Equivalent to object-position, only supports 'top', 'center', 'bottom'. 'center' by default
    credit: {
      enable: false,         // Display the credit text of the banner image
      text: '',              // Credit text to be displayed
      url: ''                // (Optional) URL link to the original artwork or artist's page
    }
  },
  toc: {
    enable: true,           // Display the table of contents on the right side of the post
    depth: 2                // Maximum heading depth to show in the table, from 1 to 3
  },
  favicon: [    // Leave this array empty to use the default favicon
    // {
    //   src: '/favicon/icon.png',    // Path of the favicon, relative to the /public directory
    //   theme: 'light',              // (Optional) Either 'light' or 'dark', set only if you have different favicons for light and dark mode
    //   sizes: '32x32',              // (Optional) Size of the favicon, set only if you have favicons of different sizes
    // }
  ]
}

export const navBarConfig: NavBarConfig = {
  links: [
    LinkPreset.Home,
    LinkPreset.Projects,
    LinkPreset.Archive,
    LinkPreset.About,
    LinkPreset.Friends,
    LinkPreset.Bookshelf,
    {
      name: '开往',
      url: 'https://www.travellings.cn/go.html',     // Internal links should not include the base path, as it is automatically added
      external: true,                               // Show an external link icon and will open in a new tab
    },
  ],
}

export const profileConfig: ProfileConfig = {
  avatar: 'assets/images/avatar.webp',  // Relative to the /src directory. Relative to the /public directory if it starts with '/'
  name: '时歌',
  bio: '理解以真实为本，但真实本身并不会自动呈现.',
  links: [
    {
      name: 'QQ',
      icon: 'mdi:qqchat',       // Visit https://icones.js.org/ for icon codes
                                        // You will need to install the corresponding icon set if it's not already included
                                        // `pnpm add @iconify-json/<icon-set-name>`
      url: 'https://qm.qq.com/q/Qm6VfZnWM0',
    },
    {
      name: 'NetEaseMusic',
      icon: 'tabler:brand-netease-music',
      url: 'https://music.163.com/#/user/home?id=1997803975',
    },
    {
      name: 'GitHub',
      icon: 'fa6-brands:github',
      url: 'https://github.com/Lapis0x0',
    },
  ],
}

export const licenseConfig: LicenseConfig = {
  enable: true,
  name: 'CC BY-NC-SA 4.0',
  url: 'https://creativecommons.org/licenses/by-nc-sa/4.0/',
}

export const projectsConfig: ProjectsConfig = {
  enable: true,
  projects: [
    {
      id: 'tech',
      title: '技术项目',
      description: '我的技术相关项目',
      image: 'assets/images/tech-project.webp',
      items: [
        {
          id: 'fuwari',
          title: 'Fuwari博客',
          description: '基于Astro和Fuwari主题的个人博客',
          image: 'assets/images/blog-banner.webp',
          url: 'https://github.com/Lapis0x0/fuwari',
          categories: ['Web开发'],
          tags: ['Astro', 'Fuwari', '博客']
        },
        {
          id: 'project-sample',
          title: '示例项目',
          description: '这是一个示例项目，展示项目功能的使用方法',
          categories: ['示例'],
          tags: ['示例', '教程']
        }
      ]
    },
    {
      id: 'writing',
      title: '写作项目',
      description: '我的写作相关项目',
      items: [
        {
          id: 'tech-tutorials',
          title: '技术教程',
          description: '各种技术相关的教程和指南',
          posts: ['TechnicalTutorials/新一代静态博客框架Astro的部署优化指南与使用体验']
        }
      ]
    }
  ]
}
