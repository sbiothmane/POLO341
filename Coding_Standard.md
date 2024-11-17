# Coding Standard
# 1. Universal coding standards
# Naming 
Use Meaningful Names: Variables, functions, classes, and methods should have descriptive names that clearly indicate their purpose (e.g., calculateTotalPrice, userProfile).
Follow Naming Conventions: Stick to common naming conventions:
CamelCase for variables and functions (myVariable, handleClick).
PascalCase for classes and components (MyComponent, UserProfile).
UPPERCASE for constants (MAX_LENGTH).
Avoid Abbreviations: Use full words in names unless the abbreviation is well-known and commonly accepted (e.g., user vs usr).

# Code Formatting
Consistent Indentation: Use consistent indentation.
Line Length: Keep lines of code under 80 or 100 characters to improve readability. Break long lines into multiple shorter ones.
Blank Lines: Use blank lines to separate logical blocks of code (e.g., between function definitions, imports, or major logic sections).
Curly Braces

# Code Structure
Avoid Duplicate Code
Organize Code Logically

# Documentation
Comment Purpose, Not Implementation
Update Documentation

# Error Handling
Use Proper Error Messages
Handle Errors Gracefully

# Testing
Write Tests: Ensure that your code is covered by unit tests, integration tests, and end-to-end tests where appropriate.
Test Edge Cases
Testable Code

# Security
Avoid Hardcoding Sensitive Data
Validate Input

# 2. React.js best coding pratices
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

# 3. Next.js best coding pratices

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
