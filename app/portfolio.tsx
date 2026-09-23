'use client';
/* oxlint-disable next/no-img-element -- Static export uses precompressed responsive images; no runtime image service is needed. */

import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import {
  ArrowUpRight,
  ArrowRight,
  House,
  Layers3,
  BriefcaseBusiness,
  UserRound,
  Mail,
  GitFork,
  Command as CommandIcon,
  Sun,
  Moon,
  MapPin,
  Code2,
  Cpu,
  Check,
  Terminal,
  Puzzle,
  Monitor,
  CalendarDays,
  Smartphone,
  Wallpaper,
  Gamepad2,
} from 'lucide-react';
import { ProfileBackground, CareerHistory } from './profile-background';
import { ContactPage } from './contact-page';
import { WordShuffle } from './word-shuffle';
import { GameSessionProvider } from './game-session';
import {
  MotionProvider,
  MotionToggle,
  PageTransition,
  MotionPage,
  Reveal,
  ScrollProgress,
} from './page-motion';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Command,
  CommandInput,
  CommandList,
  CommandEmpty,
  CommandGroup,
  CommandItem,
} from '@/components/ui/command';

type View =
  | 'overview'
  | 'projects'
  | 'experience'
  | 'about'
  | 'playground'
  | 'contact';
type Filter =
  | 'All projects'
  | 'iOS apps'
  | 'Systems'
  | 'Salesforce'
  | 'Web apps';
type Project = {
  id: string;
  title: string;
  category: Filter;
  type: string;
  year: string;
  image?: string;
  imageSmall?: string;
  tone: string;
  description: string;
  details: string;
  features: string[];
  stack: string[];
  source?: string;
  live?: string;
  credit?: string;
  storeUrl?: string;
  status?: string;
  role?: string;
  audience?: string;
  gallery?: { file: string; label: string }[];
};
const email = 'ajaykareer06@gmail.com';
const nav = [
  { id: 'overview', name: 'Overview', icon: House },
  { id: 'projects', name: 'Projects', icon: Layers3 },
  { id: 'experience', name: 'Experience', icon: BriefcaseBusiness },
  { id: 'about', name: 'About me', icon: UserRound },
  { id: 'playground', name: 'Playground', icon: Gamepad2 },
  { id: 'contact', name: 'Contact', icon: Mail },
] as const;
const projects: Project[] = [
  {
    id: 'creativepos-reporting',
    title: 'Creative POS Reporting',
    category: 'iOS apps',
    type: 'BUSINESS · iOS APP',
    year: '2026',
    tone: 'creativepos',
    description:
      'Sales insight and important POS alerts, right in a business owner’s pocket.',
    details:
      'I built Creative POS Reporting for our business partners to keep track of daily sales and important point-of-sale activity from their iPhone. Owners and managers can move between sales summaries, detailed reporting, and configurable alerts across their authorized store locations.',
    features: [
      'Dashboard totals, transaction counts, averages, net sales, gross sales, and taxes',
      'Daily, date-range, and monthly sales reporting',
      'Notifications for refunds, voided or cancelled orders, and paid outs',
      'Alert preferences with minimum amount thresholds',
      'Access to one or more authorized store locations',
      'Face ID / Touch ID Quick Login and Keychain-backed saved credentials',
    ],
    stack: ['iOS', 'Sales reporting', 'Push notifications'],
    storeUrl:
      'https://apps.apple.com/ng/app/creative-pos-reporting/id6799240504',
    status: 'On the App Store',
    role: 'App development at CreativePOS',
    audience: 'Business owners & managers',
    credit:
      'Built for existing Creative POS customers. An active account and authorized login are required. Reports, locations, and notifications depend on assigned permissions and POS configuration.',
    gallery: [
      { file: 'creativepos-dashboard.jpg', label: 'Sales dashboard' },
      { file: 'creativepos-alerts.jpg', label: 'Alert preferences' },
      { file: 'creativepos-login.jpg', label: 'Secure sign-in' },
    ],
  },
  {
    id: 'kareers-walls',
    title: 'Kareer’s Walls',
    category: 'iOS apps',
    type: 'WALLPAPER APP',
    year: 'iOS',
    tone: 'walls',
    description:
      'A personal wallpaper app for discovering high-quality backgrounds, free of cost.',
    details:
      'I created Kareer’s Walls to make finding a great iPhone wallpaper feel personal and effortless. It brings curated collections, search, favourite categories, and a personalized For You feed together in one place.',
    features: [
      'Curated and featured wallpapers across Nature, Minimal, Space, OLED, Abstract, and more',
      'Search plus Popular, Top, and Fresh collections',
      'Favourite categories and a personalized For You feed',
      'Saved favourites for returning to wallpapers you love',
      'Resolution and file-size previews before downloading',
      'High-quality wallpaper downloads, free of cost',
    ],
    stack: ['iOS', 'Personalization', 'Wallpapers'],
    status: 'Personal project',
    role: 'Creator & app developer',
    audience: 'iPhone users',
    credit:
      'An iOS project by Ajay Kareer. A public App Store download is not available yet.',
  },
  {
    id: 'windows-update-manager',
    title: 'Windows Update Manager',
    category: 'Systems',
    type: 'WINDOWS UTILITY',
    year: '2025',
    image: 'windows-update-manager.png',
    tone: 'systems',
    description:
      'Practical control over Windows updates for POS terminals, kiosks, and PCs.',
    details:
      'A menu-driven Windows utility that brings update controls, restoration, and status checks into one place. Built for situations where operating-system maintenance needs deliberate timing.',
    features: [
      'Menu-based controls for blocking and restoring updates',
      'Windows service and policy status checks',
      'Scheduled watchdog tasks for maintaining the chosen configuration',
    ],
    stack: ['Windows Batch', 'PowerShell', 'Windows services'],
    source: 'https://github.com/ajaykareer/Windows-Update-Manager',
  },
  {
    id: 'weather-app',
    title: 'The Weather App',
    category: 'Web apps',
    type: 'WEB APPLICATION',
    year: '2023',
    image: 'weather-69c3ec64-1280.webp',
    imageSmall: 'weather-69c3ec64-640.webp',
    tone: 'weather',
    description:
      'A simple way to check the weather in cities around the world.',
    details:
      'A weather interface that uses a weather API to turn a city search into readable conditions. An exploration of API integration and responsive front-end development.',
    features: [
      'City-based weather lookup',
      'Current conditions from a weather API',
      'Responsive interface for different screen sizes',
    ],
    stack: ['JavaScript', 'Bootstrap', 'CSS', 'Weather API'],
    source: 'https://github.com/ajaykareer/WeatherAPP',
    live: 'https://weather-app-ten-lemon.vercel.app',
  },
  {
    id: 'word-shuffle',
    title: 'Word Shuffle',
    category: 'Salesforce',
    type: 'SALESFORCE APPLICATION',
    year: '2024',
    image: 'word-shuffle-linkedin.jpg',
    tone: 'salesforce',
    description:
      'A word game built inside Salesforce, with difficulty levels and saved results.',
    details:
      'A Salesforce game built with Aura components and Apex. Players choose a difficulty and reveal hidden word tiles to find a target within three attempts. Results are stored for each user in Salesforce. The browser adaptation adds a study step and a temporary scoreboard for this visit, with no Salesforce connection.',
    features: [
      'Three difficulty levels and a reshuffle action',
      'Three attempts with in-game feedback',
      'Per-user game results stored through Apex and SOQL',
    ],
    stack: ['Salesforce Aura', 'Apex', 'JavaScript', 'SOQL'],
    source: 'https://github.com/ajaykareer/Word-Shuffle-Game-Salesforce-Aura',
  },
  {
    id: 'web-gallery',
    title: 'AKK Web Gallery',
    category: 'Web apps',
    type: 'PHOTO GALLERY',
    year: '2023',
    image: 'akk-9a32c0fd-1280.webp',
    imageSmall: 'akk-9a32c0fd-640.webp',
    tone: 'gallery',
    description:
      'A photo gallery with account registration, built with React and Firebase.',
    details:
      'A web-gallery project that explores an account-based photo experience and Firebase integration through a React interface.',
    features: [
      'Photo gallery browsing',
      'Account registration',
      'React interface with Firebase integration',
    ],
    stack: ['React', 'Firebase', 'CSS'],
    source: 'https://github.com/ajaykareer/web-gallery',
    live: 'https://akk-web-gallery.web.app/',
    credit:
      'Adapted from Diego Arndt’s web-gallery project. The public repository is a fork.',
  },
  {
    id: 'davosbet',
    title: 'DavosBet',
    category: 'Web apps',
    type: 'SPORTS INTERFACE',
    year: '2023',
    image: 'davosbet-2ba74307-1280.webp',
    imageSmall: 'davosbet-2ba74307-640.webp',
    tone: 'sports',
    description:
      'A sports interface exploring live scores, standings, and sports data.',
    details:
      'A sports-data front end that brings scores and standings into a dashboard. This project explores working with an external sports API and responsive interface styling.',
    features: [
      'Sports scores and standings',
      'External sports API integration',
      'Responsive layout and navigation',
    ],
    stack: ['JavaScript', 'Tailwind CSS', 'SCSS', 'Sports API'],
    source: 'https://github.com/ajaykareer/davosbet/',
    credit:
      'Adapted from Diego Arndt’s DavosBet project. The public repository is a fork.',
  },
];
const projectOrder = [
  'creativepos-reporting',
  'kareers-walls',
  'word-shuffle',
  'windows-update-manager',
  'web-gallery',
  'davosbet',
  'weather-app',
];
projects.sort(
  (a, b) => projectOrder.indexOf(a.id) - projectOrder.indexOf(b.id),
);

function ProjectArtwork({ project }: { project: Project }) {
  if (project.id === 'creativepos-reporting')
    return (
      <div className="ios-artwork reporting-artwork">
        <div className="app-art-copy">
          <img
            className="app-icon"
            src="/projects/creativepos-icon.jpg"
            alt=""
            width={54}
            height={54}
          />
          <span className="app-art-kicker">CREATIVE POS</span>
          <strong>
            Business insight.
            <br />
            Anywhere.
          </strong>
          <span className="app-art-caption">REPORTING FOR iPHONE & iPAD</span>
        </div>
        <div className="app-screens">
          <img
            src="/projects/creativepos-alerts.jpg"
            alt="Creative POS alert preferences"
            loading="lazy"
          />
          <img
            src="/projects/creativepos-dashboard.jpg"
            alt="Creative POS sales dashboard"
            loading="lazy"
          />
        </div>
      </div>
    );
  if (project.id === 'kareers-walls')
    return (
      <div className="ios-artwork walls-artwork">
        <div className="walls-heading">
          <Wallpaper size={26} />
          <span>PERSONAL iOS PROJECT</span>
        </div>
        <strong>
          Kareer’s
          <br />
          <em>Walls.</em>
        </strong>
        <span className="walls-bottom">
          A little more you.<span>WALLPAPERS, FREE.</span>
        </span>
      </div>
    );
  if (project.image)
    return (
      <img
        src={`/projects/${project.image}`}
        srcSet={
          project.imageSmall
            ? `/projects/${project.imageSmall} 640w, /projects/${project.image} 1280w`
            : undefined
        }
        sizes="(max-width: 600px) calc(100vw - 44px), (max-width: 1100px) 45vw, 680px"
        alt={`${project.title} interface`}
        loading="lazy"
        decoding="async"
        width="1000"
        height="600"
      />
    );
  return (
    <div className="word-project">
      <Puzzle size={32} />
      <span className="word-tiles" aria-hidden="true">
        {'SHUFFLE'.split('').map((letter, i) => (
          <span key={i}>{letter}</span>
        ))}
      </span>
      <span className="word-caption">BUILT WITH AURA & APEX</span>
    </div>
  );
}

function ProjectCard({
  project,
  index,
  onOpen,
}: {
  project: Project;
  index: number;
  onOpen: (project: Project) => void;
}) {
  return (
    <Reveal
      as="article"
      className="project-card"
      delay={(index % 2) * 0.12}
      distance={52}
    >
      <button
        className="project-card-button"
        onClick={() => onOpen(project)}
        aria-label={`View ${project.title}`}
      >
        <div className={`project-visual tone-${project.tone}`}>
          <ProjectArtwork project={project} />
          <span className="project-open">
            <ArrowUpRight />
          </span>
        </div>
        <div className="project-heading">
          <div>
            <p className="eyebrow">{project.type}</p>
            <h3>{project.title}</h3>
          </div>
          {project.category === 'iOS apps' ? (
            <Smartphone className="project-platform" size={19} />
          ) : (
            <span className="project-number">0{index + 1}</span>
          )}
        </div>
      </button>
      {project.id === 'word-shuffle' && (
        <Button className="shuffle-card-link" variant="ghost" onClick={() => onOpen(project)}>
          <Puzzle size={16} /> Play the web demo <ArrowUpRight size={15} />
        </Button>
      )}
      <p className="project-description">{project.description}</p>
      <div className="tags">
        {project.stack.slice(0, 3).map((tag) => (
          <span key={tag}>{tag}</span>
        ))}
      </div>
    </Reveal>
  );
}

function PortfolioProviders({ children }: { children: ReactNode }) {
  return (
    <GameSessionProvider>
      <MotionProvider>{children}</MotionProvider>
    </GameSessionProvider>
  );
}

export default function Portfolio() {
  const [view, setView] = useState<View>('overview');
  const [filter, setFilter] = useState<Filter>('All projects');
  const [selected, setSelected] = useState<Project | null>(null);
  const [commandOpen, setCommandOpen] = useState(false);
  const [dark, setDark] = useState(false);
  const pageHeading = useRef<HTMLHeadingElement>(null);
  const projectDialogHeading = useRef<HTMLHeadingElement>(null);
  const didMount = useRef(false);

  useEffect(() => {
    const syncHash = () => {
      const value = window.location.hash.slice(1);
      if (nav.some((item) => item.id === value)) setView(value as View);
      else setView('overview');
    };
    syncHash();
    window.addEventListener('hashchange', syncHash);
    // Every new visit begins in light mode. The switch controls this visit only.
    document.documentElement.classList.remove('dark');
    return () => {
      window.removeEventListener('hashchange', syncHash);
    };
  }, []);
  useEffect(() => {
    document.documentElement.classList.toggle('dark', dark);
  }, [dark]);
  const pageEntered = useCallback(() => {
    if (didMount.current) {
      pageHeading.current?.focus({ preventScroll: true });
    }
    didMount.current = true;
  }, []);
  useEffect(() => {
    const key = (event: KeyboardEvent) => {
      if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k') {
        event.preventDefault();
        setSelected(null);
        setCommandOpen((open) => !open);
      }
    };
    window.addEventListener('keydown', key);
    return () => window.removeEventListener('keydown', key);
  }, []);
  const navigate = useCallback((next: View) => {
    setView(next);
    setCommandOpen(false);
    window.location.hash = next;
  }, []);
  const toggleTheme = () => setDark((value) => !value);
  const openProject = (project: Project) => {
    setCommandOpen(false);
    setSelected(project);
  };
  const openContact = () => {
    setSelected(null);
    navigate('contact');
  };
  const currentTitle = nav.find((item) => item.id === view)?.name;
  const visibleProjects = projects.filter(
    (project) => filter === 'All projects' || project.category === filter,
  );

  return (
    <PortfolioProviders>
      <div className="portfolio-app">
        <ScrollProgress />
        <a
          className="skip-link"
          href="#main"
          onClick={(event) => {
            event.preventDefault();
            document.getElementById('main')?.focus();
          }}
        >
          Skip to content
        </a>
        <aside className="sidebar">
          <a
            className="monogram"
            href="#overview"
            aria-label="Ajay Kareer home"
            onClick={() => navigate('overview')}
          >
            ak<span aria-hidden="true">✳</span>
          </a>
          <div className="sidebar-identity">
            <h2>Ajay Kareer</h2>
            <p>Software & hardware engineer</p>
          </div>
          <p className="nav-label">EXPLORE</p>
          <nav aria-label="Portfolio">
            {nav.map(({ id, name, icon: Icon }, i) => (
              <Button
                variant="ghost"
                className={`nav-item ${view === id ? 'active' : ''}`}
                key={id}
                aria-label={name}
                aria-current={view === id ? 'page' : undefined}
                onClick={() => navigate(id)}
                title={name}
              >
                <Icon />
                <span className="nav-name">{name}</span>
                <span className="nav-number">0{i + 1}</span>
              </Button>
            ))}
          </nav>
          <div className="sidebar-bottom">
            <p>HAVE SOMETHING IN MIND?</p>
            <Button variant="ghost" className="say-hello" onClick={openContact}>
              Let’s talk <ArrowUpRight />
            </Button>
            <div className="social-links">
              <a
                href="https://github.com/ajaykareer"
                aria-label="GitHub"
                target="_blank"
                rel="noopener noreferrer"
              >
                <GitFork />
              </a>
              <a
                href="https://linkedin.com/in/ajaykareer"
                aria-label="LinkedIn"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span className="linkedin-mark">in</span>
              </a>
              <a href={`mailto:${email}`} aria-label="Email Ajay">
                <Mail />
              </a>
            </div>
          </div>
        </aside>
        <div className="main-shell">
          <header className="topbar">
            <div>
              <span className="breadcrumb-muted">Portfolio</span>
              <span className="breadcrumb-slash">/</span>
              {currentTitle}
            </div>
            <div className="top-actions">
              <Button
                variant="ghost"
                className="command-button"
                onClick={() => setCommandOpen(true)}
                aria-label="Quick jump, Control or Command K"
              >
                <CommandIcon size={15} />
                <span>Quick jump</span>
                <kbd>Ctrl K</kbd>
              </Button>
              <span className="top-divider" />
              <MotionToggle />
              <Button
                variant="ghost"
                size="icon"
                className="theme-button"
                onClick={toggleTheme}
                aria-label={`Switch to ${dark ? 'light' : 'dark'} theme`}
                title={`Switch to ${dark ? 'light' : 'dark'} theme`}
              >
                {dark ? <Sun /> : <Moon />}
              </Button>
            </div>
          </header>
          <main id="main" className="content" tabIndex={-1}>
            <PageTransition>
              <MotionPage key={view} onEntered={pageEntered}>
                {view === 'contact' && (
                  <ContactPage dark={dark} headingRef={pageHeading} />
                )}
                {view === 'overview' && (
                  <>
                    <section className="intro">
                      <Reveal className="intro-copy" distance={32}>
                        <p className="eyebrow">
                          <span className="small-spark" aria-hidden="true">
                            ✳
                          </span>{' '}
                          HELLO, I’M AJAY
                        </p>
                        <h1 ref={pageHeading} tabIndex={-1}>
                          Software meets
                          <br />
                          the <em>real world.</em>
                        </h1>
                        <p className="intro-description">
                          I build iOS apps, business tools, and the systems
                          behind them. Software & Hardware Engineer at{' '}
                          <strong>CreativePOS.</strong>
                        </p>
                        <div className="hero-actions">
                          <Button
                            className="primary-action"
                            onClick={() => navigate('projects')}
                          >
                            Explore my projects <ArrowUpRight />
                          </Button>
                          <Button
                            variant="ghost"
                            className="text-action"
                            onClick={openContact}
                          >
                            Get in touch <ArrowRight size={16} />
                          </Button>
                        </div>
                        <div className="location">
                          <MapPin size={14} /> Ajax, Ontario <span>·</span>{' '}
                          Always curious. Always building.
                        </div>
                      </Reveal>
                      <Reveal
                        className="portrait-wrap"
                        delay={0.14}
                        distance={48}
                      >
                        <div className="portrait-frame">
                          <img
                            src="/projects/ajay-linkedin-800.webp"
                            srcSet="/projects/ajay-linkedin-400.webp 400w, /projects/ajay-linkedin-800.webp 800w"
                            sizes="(max-width: 600px) 75vw, 360px"
                            fetchPriority="high"
                            decoding="async"
                            alt="Ajay Kareer"
                            width="800"
                            height="800"
                          />
                          <span className="portrait-caption">
                            ENGINEER. DEVELOPER. BUILDER.
                          </span>
                        </div>
                        <div className="portrait-sticker">
                          <Smartphone />
                          <span>
                            Apps.
                            <br />
                            Systems.
                            <br />
                            Ideas.
                          </span>
                        </div>
                        <span className="photo-mark" aria-hidden="true">
                          ✳
                        </span>
                      </Reveal>
                    </section>
                    <Reveal delay={0.16}>
                      <button
                        className="current-role"
                        onClick={() => navigate('experience')}
                      >
                        <span className="role-icon">
                          <Cpu />
                        </span>
                        <span className="role-copy">
                          <span className="eyebrow">WHERE I AM NOW</span>
                          <span className="role-title">
                            Software & Hardware Engineer{' '}
                            <span>@ CreativePOS</span>
                          </span>
                        </span>
                        <span className="role-date">JUN 2024 — PRESENT</span>
                        <ArrowUpRight className="role-arrow" />
                      </button>
                    </Reveal>
                    <section className="selected-work">
                      <Reveal className="section-title">
                        <div>
                          <span className="eyebrow">
                            iOS APPS, PLATFORMS & PRACTICAL TOOLS
                          </span>
                          <h2>
                            Selected work
                            <span>
                              {' '}
                              / {String(projects.length).padStart(2, '0')}
                            </span>
                          </h2>
                        </div>
                        <Button
                          variant="ghost"
                          onClick={() => navigate('projects')}
                        >
                          View all projects <ArrowRight size={16} />
                        </Button>
                      </Reveal>
                      <div className="project-grid">
                        {projects.slice(0, 4).map((project, index) => (
                          <ProjectCard
                            key={project.id}
                            project={project}
                            index={index}
                            onOpen={openProject}
                          />
                        ))}
                      </div>
                    </section>
                    <Reveal className="playground-invitation">
                      <div className="playground-invitation-icon">
                        <Gamepad2 size={28} aria-hidden="true" />
                      </div>
                      <div>
                        <p className="eyebrow">A LITTLE BRAIN BREAK</p>
                        <h2>Curious? Come play.</h2>
                        <p>
                          Try Word Shuffle, test your memory, and set a score
                          for this visit.
                        </p>
                      </div>
                      <Button onClick={() => navigate('playground')} className="primary-action">
                        Open Playground <ArrowUpRight size={17} />
                      </Button>
                    </Reveal>
                  </>
                )}
                {view === 'playground' && (
                  <>
                    <Reveal className="view-heading" distance={32}>
                      <p className="eyebrow">PLAYGROUND / SMALL INTERACTIVE EXPERIMENTS</p>
                      <h1 ref={pageHeading} tabIndex={-1}>
                        A little play. <em>A fresh perspective.</em>
                      </h1>
                      <p>
                        Take a quick break with Word Shuffle. Your scoreboard
                        follows you around this visit and resets on refresh.
                      </p>
                    </Reveal>
                    <div className="playground-games">
                      <WordShuffle />
                    </div>
                  </>
                )}

                {view === 'projects' && (
                  <>
                    <Reveal className="view-heading" distance={32}>
                      <p className="eyebrow">SELECTED WORK / APPS & SYSTEMS</p>
                      <h1 ref={pageHeading} tabIndex={-1}>
                        Curiosity, <em>in practice.</em>
                      </h1>
                      <p>
                        iOS products, Salesforce experiences, and tools built
                        for real use.
                      </p>
                    </Reveal>
                    <Reveal className="filter-bar" delay={0.12}>
                      <div
                        className="filter-buttons"
                        aria-label="Filter projects"
                      >
                        {(
                          [
                            'All projects',
                            'iOS apps',
                            'Systems',
                            'Salesforce',
                            'Web apps',
                          ] as Filter[]
                        ).map((item) => (
                          <Button
                            variant="ghost"
                            key={item}
                            onClick={() => setFilter(item)}
                            aria-pressed={filter === item}
                            className={`filter-button ${filter === item ? 'is-active' : ''}`}
                          >
                            {item}
                          </Button>
                        ))}
                      </div>
                      <output className="results-count">
                        {visibleProjects.length}{' '}
                        {visibleProjects.length === 1 ? 'project' : 'projects'}
                      </output>
                    </Reveal>
                    <div
                      key={filter}
                      className="project-grid full-project-grid"
                    >
                      {visibleProjects.map((project) => (
                        <ProjectCard
                          key={project.id}
                          project={project}
                          index={projects.indexOf(project)}
                          onOpen={openProject}
                        />
                      ))}
                    </div>
                  </>
                )}

                {view === 'experience' && (
                  <>
                    <Reveal className="view-heading" distance={32}>
                      <p className="eyebrow">THE JOURNEY SO FAR</p>
                      <h1 ref={pageHeading} tabIndex={-1}>
                        Code is only
                        <br />
                        <em>half the story.</em>
                      </h1>
                      <p>
                        Working where software, hardware, and everyday use come
                        together.
                      </p>
                    </Reveal>
                    <Reveal
                      as="section"
                      className="experience-card"
                      delay={0.12}
                    >
                      <div className="experience-top">
                        <span className="large-icon">
                          <Cpu />
                        </span>
                        <div>
                          <span className="current-badge">CURRENT ROLE</span>
                          <h2>CreativePOS</h2>
                          <p>Software & Hardware Engineer</p>
                        </div>
                      </div>
                      <div className="experience-date">
                        <CalendarDays size={17} />
                        <time dateTime="2024-06-01">June 1, 2024</time>
                        <span>— Present</span>
                      </div>
                      <p className="experience-description">
                        Since June 2024, I’ve been working as a Software &
                        Hardware Engineer at CreativePOS. I built Creative POS
                        Reporting to give our business partners access to sales
                        reports and important POS notifications on their iPhone.
                        My work connects the software people interact with and
                        the hardware it runs on.
                      </p>
                      <div className="practice-grid">
                        <div>
                          <Code2 />
                          <h3>Software</h3>
                          <p>
                            Thinking through how an application works, from its
                            interface to the logic behind it.
                          </p>
                        </div>
                        <div>
                          <Monitor />
                          <h3>Hardware</h3>
                          <p>
                            Bringing a hands-on engineering perspective to the
                            devices behind the experience.
                          </p>
                        </div>
                        <div>
                          <Cpu />
                          <h3>Point of sale</h3>
                          <p>
                            Working in the space where digital systems meet
                            everyday business operations.
                          </p>
                        </div>
                      </div>
                    </Reveal>
                    <CareerHistory />
                    <Reveal as="section" className="related-work">
                      <p className="eyebrow">FROM MY PERSONAL TOOLBOX</p>
                      <h2>A practical systems project</h2>
                      <button
                        className="related-project"
                        onClick={() =>
                          openProject(
                            projects.find(
                              (project) =>
                                project.id === 'windows-update-manager',
                            )!,
                          )
                        }
                      >
                        <Terminal />
                        <span>
                          <strong>Windows Update Manager</strong>
                          <span>
                            A personal utility for Windows terminals, kiosks,
                            and PCs.
                          </span>
                        </span>
                        <ArrowUpRight />
                      </button>
                    </Reveal>
                  </>
                )}

                {view === 'about' && (
                  <>
                    <Reveal className="view-heading" distance={32}>
                      <p className="eyebrow">MORE THAN A JOB TITLE</p>
                      <h1 ref={pageHeading} tabIndex={-1}>
                        A builder.
                        <br />A <em>curious mind.</em>
                      </h1>
                    </Reveal>
                    <section className="about-grid">
                      <Reveal className="about-photo" delay={0.1}>
                        <img
                          src="/projects/ajay-linkedin-800.webp"
                          srcSet="/projects/ajay-linkedin-400.webp 400w, /projects/ajay-linkedin-800.webp 800w"
                          sizes="(max-width: 600px) calc(100vw - 44px), 460px"
                          decoding="async"
                          alt="Ajay Kareer"
                          width="800"
                          height="800"
                        />
                        <span>AJAY KAREER / AJAX, ONTARIO</span>
                      </Reveal>
                      <Reveal className="about-copy" delay={0.2}>
                        <h2>Hi, I’m Ajay.</h2>
                        <p>
                          I’m a software and hardware engineer based in Ajax,
                          Ontario. My background spans business analysis,
                          Salesforce, and web development. Today, I bring that
                          perspective to iOS apps and point-of-sale systems at
                          CreativePOS.
                        </p>
                        <p>
                          I like the space between an idea and something you can
                          actually use. Creative POS Reporting helps business
                          partners stay close to their sales. Kareer’s Walls is
                          my own take on a personal, easy-to-use wallpaper app.
                          Word Shuffle and Windows Update Manager explore other
                          sides of the same curiosity.
                        </p>
                        <p>
                          I studied Web Design and Development at Humber College
                          after completing a bachelor’s degree in Civil
                          Engineering. That mix of analytical thinking and
                          hands-on building still shapes how I approach a
                          problem.
                        </p>
                        <Button
                          className="primary-action"
                          onClick={openContact}
                        >
                          Say hello <ArrowUpRight />
                        </Button>
                      </Reveal>
                    </section>
                    <ProfileBackground />
                    <section className="toolbox">
                      <Reveal className="section-title">
                        <div>
                          <p className="eyebrow">TOOLS I’VE WORKED WITH</p>
                          <h2>Different tools. Same curiosity.</h2>
                        </div>
                        <Code2 />
                      </Reveal>
                      <div className="toolbox-grid">
                        <Reveal>
                          <h3>Web development</h3>
                          <div className="tags">
                            {[
                              'JavaScript',
                              'React',
                              'HTML & CSS',
                              'Tailwind CSS',
                              'Bootstrap',
                              'Firebase',
                            ].map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                        </Reveal>
                        <Reveal delay={0.12}>
                          <h3>Systems & platforms</h3>
                          <div className="tags">
                            {[
                              'Windows Batch',
                              'PowerShell',
                              'Salesforce Aura',
                              'Apex',
                              'SOQL',
                            ].map((item) => (
                              <span key={item}>{item}</span>
                            ))}
                          </div>
                        </Reveal>
                      </div>
                    </section>
                  </>
                )}
              </MotionPage>
            </PageTransition>
            <footer className="page-footer">
              <span>© {new Date().getFullYear()} Ajay Kareer</span>
              <button onClick={openContact}>
                Let’s make something useful.{' '}
                <span className="orange" aria-hidden="true">
                  ✳
                </span>
              </button>
            </footer>
          </main>
        </div>

        <Dialog
          open={selected !== null}
          onOpenChange={(open) => {
            if (!open) setSelected(null);
          }}
        >
          <DialogContent className="project-dialog" initialFocus={projectDialogHeading}>
            {selected && (
              <>
                <DialogHeader>
                  <p className="eyebrow">
                    {selected.type} / {selected.year}
                  </p>
                  <DialogTitle className="dialog-title" ref={projectDialogHeading} tabIndex={-1}>
                    {selected.title}
                  </DialogTitle>
                  <DialogDescription className="dialog-description">
                    {selected.description}
                  </DialogDescription>
                </DialogHeader>
                {selected.id === 'word-shuffle' ? (
                  <WordShuffle compact />
                ) : selected.gallery ? (
                  <div className="project-gallery">
                    {selected.gallery.map((image) => (
                      <figure key={image.file}>
                        <img
                          src={`/projects/${image.file}`}
                          alt={image.label}
                          loading="lazy"
                          decoding="async"
                        />
                        <figcaption>{image.label}</figcaption>
                      </figure>
                    ))}
                  </div>
                ) : selected.image ? (
                  <div className={`dialog-image tone-${selected.tone}`}>
                    <img
                      src={`/projects/${selected.image}`}
                      alt={`${selected.title} screenshot`}
                      decoding="async"
                    />
                  </div>
                ) : selected.category === 'iOS apps' ? (
                  <div
                    className={`project-visual detail-artwork tone-${selected.tone}`}
                  >
                    <ProjectArtwork project={selected} />
                  </div>
                ) : null}
                {selected.role && (
                  <dl className="project-facts">
                    <div>
                      <dt>MY ROLE</dt>
                      <dd>{selected.role}</dd>
                    </div>
                    <div>
                      <dt>BUILT FOR</dt>
                      <dd>{selected.audience}</dd>
                    </div>
                    <div>
                      <dt>STATUS</dt>
                      <dd>{selected.status}</dd>
                    </div>
                  </dl>
                )}
                <p className="project-detail-text">{selected.details}</p>
                <h3 className="detail-heading">What’s inside</h3>
                <ul className="feature-list">
                  {selected.features.map((feature) => (
                    <li key={feature}>
                      <Check />
                      {feature}
                    </li>
                  ))}
                </ul>
                <div className="tags">
                  {selected.stack.map((tag) => (
                    <span key={tag}>{tag}</span>
                  ))}
                </div>
                {selected.credit && (
                  <p className="project-credit">{selected.credit}</p>
                )}
                <div className="dialog-actions">
                  {selected.source && (
                    <a
                      className="external-action"
                      href={selected.source}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <GitFork size={17} />
                      View source
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                  {selected.live && (
                    <a
                      className="external-action accent-action"
                      href={selected.live}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      Open live project
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                  {selected.storeUrl && (
                    <a
                      className="external-action accent-action"
                      href={selected.storeUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      <Smartphone size={17} />
                      View on the App Store
                      <ArrowUpRight size={16} />
                    </a>
                  )}
                  {!selected.source && !selected.storeUrl && (
                    <Button
                      className="primary-action"
                      onClick={() => {
                        setSelected(null);
                        openContact();
                      }}
                    >
                      Ask me about this project
                      <ArrowUpRight size={16} />
                    </Button>
                  )}
                </div>
              </>
            )}
          </DialogContent>
        </Dialog>
        <Dialog open={commandOpen} onOpenChange={setCommandOpen}>
          <DialogContent className="command-dialog">
            <DialogHeader className="sr-only">
              <DialogTitle>Quick jump</DialogTitle>
              <DialogDescription>
                Search pages and projects. Use the arrow keys and Enter to
                choose.
              </DialogDescription>
            </DialogHeader>
            <Command>
              <CommandInput
                placeholder="Where would you like to go?"
                aria-label="Search pages and projects"
              />
              <CommandList>
                <CommandEmpty>
                  No matches. Try a project name or “about”.
                </CommandEmpty>
                <CommandGroup heading="Explore">
                  {nav.map(({ id, name, icon: Icon }) => (
                    <CommandItem key={id} onSelect={() => navigate(id)}>
                      <Icon />
                      {name}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Projects">
                  {projects.map((project) => (
                    <CommandItem
                      key={project.id}
                      onSelect={() => openProject(project)}
                    >
                      <Layers3 />
                      {project.title}
                    </CommandItem>
                  ))}
                </CommandGroup>
                <CommandGroup heading="Connect">
                  <CommandItem onSelect={openContact}>
                    <Mail />
                    Get in touch
                  </CommandItem>
                </CommandGroup>
              </CommandList>
              <div className="command-hint">
                <span>↑ ↓ to navigate · Enter to open</span>
                <span>Esc to close</span>
              </div>
            </Command>
          </DialogContent>
        </Dialog>
      </div>
    </PortfolioProviders>
  );
}
