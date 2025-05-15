// Types for the Homepage model

// Multi-language text type
export interface LanguageText {
  en: string;
  ar: string;
}

// Hero section type
export interface HeroType {
  title: LanguageText;
  subtitle: LanguageText;
  description: LanguageText;
  backgroundImage: string;
  buttonText: LanguageText;
  buttonLink: string;
}

// About section type
export interface AboutType {
  title: LanguageText;
  miniTitle: LanguageText;
  description: LanguageText;
  link: string;
  linkText: LanguageText;
  mainImage: string;
}

// Service type for about section
export interface AboutServiceType {
  title: LanguageText;
  miniTitle: LanguageText;
  description: LanguageText;
  image: string;
}

// Logo type
export interface LogoType {
  image: string;
  name: string;
}

// Service type
export interface ServiceType {
  title: LanguageText;
  description: LanguageText;
  icon: string;
  color: string;
  link: string;
  linkText: LanguageText;
}

// Technology type
export interface TechnologyType {
  name: string;
  images: string[];
}

// Technology section type
export interface TechnologiesSectionType {
  title: LanguageText;
  description: LanguageText;
  technologies: TechnologyType[];
}

// Homepage type
export interface HomepageType {
  hero: HeroType;
  about: AboutType;
  aboutServices: AboutServiceType[];
  logos: LogoType[];
  services: ServiceType[];
  technologies: TechnologyType[];
}
