# Coding Standard

# React.js 
# General conventions
Use Functional Components: Prefer functional components with hooks (useState, useEffect, etc.) over class components.
Avoid Inline Functions in JSX: Define functions outside of JSX to prevent unnecessary re-renders.
Use PropTypes or TypeScript: Use PropTypes or TypeScript for type safety, ensuring props are validated and improving code readability.
Avoid Overusing useEffect: Limit the use of useEffect to essential side effects and avoid using it for simple logic that can be handled inside the component.

# Naming conventions
Variables: Use descriptive names. 
Functions/Methods: Function names should be verbs and clearly describe the action, like calculateTotal(), getUserData().
Classes/Types: Use PascalCase (e.g., UserProfile, CustomerService) if possible.
Constants: Use UPPERCASE with underscores (e.g., MAX_USERS).
Boolean Variables: Use names that imply true/false values, such as isActive, hasPermission.
Component Names: Use PascalCase for React component names (e.g., UserProfile).
State Variables: Use camelCase for state variables and their setters (e.g., userName, setUserName).
Event Handlers: Prefix event handlers with handle or on (e.g., handleClick, onSubmit).

# Code Structure and Organization
Component Size: Keep components small, focusing on one responsibility. Break them into smaller components when they grow too large.
File Organization: Organize files logically, grouping components by functionality or feature (e.g., components/, utils/).
Folder Naming: Use camelCase or PascalCase for folder names (e.g., userProfile/ or UserProfile/).
Avoid Nested Function Definitions: Define functions outside of JSX to keep components clean and prevent unnecessary re-renders.

# JSX and Rendering
Use Destructuring: Destructure props and state variables to improve readability and reduce redundancy.
Self-Closing Tags: Always close self-closing tags (e.g., <img />, <input />).
Component Return Statements: Return only one root element per component.

# Next.js 
# File and Folder Structure
File-based Routing: Use the pages/ directory for routing, with each file corresponding to a route.
Dynamic Routing: Use brackets ([]) for dynamic route segments.
API Routes: Store API route handlers inside the pages/api/ directory.

# Data Fetching
Static Generation (SSG): Prefer static generation using getStaticProps for pages that can be pre-rendered at build time.
Server-side Rendering (SSR): Use SSR (getServerSideProps) for pages requiring data at request time.
Avoid Overusing SSR: Use static generation wherever possible, as it’s more performant than SSR.

# Environment Variables
Use .env.local for local environment variables and .env.production for production variables.
Prefix public environment variables with NEXT_PUBLIC_ to expose them to the client-side (e.g., NEXT_PUBLIC_API_URL).

# Error Handling
Error Boundaries: Implement error boundaries to catch errors in React components.
Custom Error Pages: Customize error pages (e.g., 404.js, 500.js) inside the pages/ directory for a better user experience.
