// Type declarations for CSS files
declare module "*.css" {
  const content: { [className: string]: string };
  export default content;
}

// Type declarations for CSS modules
declare module "*.module.css" {
  const classes: { [key: string]: string };
  export default classes;
}

// Type declarations for side-effect CSS imports
declare module "./globals.css";
declare module "../styles/globals.css";
