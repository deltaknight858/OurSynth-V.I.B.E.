/// <reference types="react-dom" />

// Narrow JSX intrinsic elements to standard HTML/SVG so attribute checking works
declare namespace JSX {
  // Use React's built-in definitions for most elements
  interface IntrinsicElements extends React.HTMLAttributes<HTMLElement> {
    // Allow SVG tags with SVG props
    svg: React.SVGProps<SVGSVGElement>;
    title: React.SVGProps<SVGTitleElement>;
    desc: React.SVGProps<SVGDescElement>;
    defs: React.SVGProps<SVGDefsElement>;
    linearGradient: React.SVGProps<SVGLinearGradientElement>;
    filter: React.SVGProps<SVGFilterElement>;
    feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement>;
    feOffset: React.SVGProps<SVGFEOffsetElement>;
    feComposite: React.SVGProps<SVGFECompositeElement>;
    feColorMatrix: React.SVGProps<SVGFEColorMatrixElement>;
    feBlend: React.SVGProps<SVGFEBlendElement>;
    g: React.SVGProps<SVGGElement>;
    rect: React.SVGProps<SVGRectElement>;
    circle: React.SVGProps<SVGCircleElement>;
    path: React.SVGProps<SVGPathElement>;
    clipPath: React.SVGProps<SVGClipPathElement>;
    ellipse: React.SVGProps<SVGEllipseElement>;
    use: React.SVGProps<SVGUseElement>;
  }
}

// Allow importing CSS modules (e.g., import styles from './LandingPage.module.css')
declare module '*.module.css';
declare module 'd3';/// <reference types="react" />
/// <reference types="react-dom" />

// Narrow JSX intrinsic elements to standard HTML/SVG so attribute checking works
declare namespace JSX {
  // Use React's built-in definitions for most elements
  interface IntrinsicElements extends React.HTMLAttributes<HTMLElement> {
    // Allow SVG tags with SVG props
    svg: React.SVGProps<SVGSVGElement>;
    title: React.SVGProps<SVGTitleElement>;
    desc: React.SVGProps<SVGDescElement>;
    defs: React.SVGProps<SVGDefsElement>;
    linearGradient: React.SVGProps<SVGLinearGradientElement>;
    filter: React.SVGProps<SVGFilterElement>;
    feGaussianBlur: React.SVGProps<SVGFEGaussianBlurElement>;
    feOffset: React.SVGProps<SVGFEOffsetElement>;
    feComposite: React.SVGProps<SVGFECompositeElement>;
    feColorMatrix: React.SVGProps<SVGFEColorMatrixElement>;
    feBlend: React.SVGProps<SVGFEBlendElement>;
    g: React.SVGProps<SVGGElement>;
    rect: React.SVGProps<SVGRectElement>;
    circle: React.SVGProps<SVGCircleElement>;
    path: React.SVGProps<SVGPathElement>;
    clipPath: React.SVGProps<SVGClipPathElement>;
    ellipse: React.SVGProps<SVGEllipseElement>;
    use: React.SVGProps<SVGUseElement>;
  }
}

// Allow importing CSS modules (e.g., import styles from './LandingPage.module.css')
declare module '*.module.css';