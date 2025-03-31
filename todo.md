# JavaScript to TypeScript Migration Checklist

## Milestone 1: TypeScript Environment Setup

- [x] ~~Verify existing TypeScript configuration (tsconfig.json)~~
- [x] Install TypeScript-related dependencies:
  ```bash
  npm install --save-dev typescript @types/react @types/react-dom
  ```
- [x] Review and update tsconfig.json if needed:
  - [x] Ensure jsx options are configured correctly
  - [x] Check that path mappings are set up properly
  - [x] Verify that module resolution is configured appropriately
- [x] Create or update .gitignore to exclude TypeScript build artifacts
- [x] Add TypeScript linting with ESLint:
  ```bash
  npm install --save-dev eslint @typescript-eslint/parser @typescript-eslint/eslint-plugin
  ```
- [x] Create or update .eslintrc.js for TypeScript support
- [x] Configure Astro for TypeScript:
  - [x] Ensure React components in TypeScript are properly integrated
  - [x] Update any Astro-specific TypeScript configurations

## Milestone 2: Create Type Definitions

- [x] Create a types directory structure:
  ```
  src/
  └── types/
      ├── common.ts     # Shared types across the application
      ├── workmap.ts    # WorkMap-specific types
      ├── button.ts     # Button-specific types
      └── ...           # Other domain-specific type files
  ```
- [x] Define common types used throughout the application:
  - [x] Create GoalStatus enum/type with all status values:
    ```typescript
    export type GoalStatus = 
      | "on_track" 
      | "completed" 
      | "achieved" 
      | "partial" 
      | "paused" 
      | "dropped" 
      | "caution" 
      | "issue" 
      | "missed" 
      | "pending";
    ```
  - [x] Define component prop interfaces for each component
  - [x] Create types for common data structures and state
- [x] If using external APIs, define interfaces for API responses
- [x] Define utility types for common patterns (e.g., Partial, Pick, etc.)
- [x] Create theme types to enforce consistent styling
- [x] Define event handler types for consistent event handling

## Milestone 3: Incremental Implementation

### Phase 1: Convert Utilities and Simple Components

- [x] Convert utility functions:
  - [ ] Create a spreadsheet to track conversion status
  - [x] Convert src/components/Button/calcClassNames.jsx → calcClassNames.ts:
    - [x] Add proper type definitions for parameters and return values
    - [x] Ensure type safety for all function calls
  - [x] Convert other utility functions (helpers, formatters, etc.)
- [x] Convert small, self-contained components:
  - [x] Convert src/components/WorkMap/Icons.jsx → Icons.tsx
  - [x] Convert src/components/WorkMap/StatusBadge.jsx → StatusBadge.tsx
  - [x] Convert src/components/WorkMap/ProgressBar.jsx → ProgressBar.tsx
  - [ ] Convert other simple components with minimal dependencies
- [x] Update imports and cleanup:
  - [x] Update imports in all pages to use TypeScript versions
  - [x] Verify component functionality in the browser
  - [x] Delete original JavaScript files once verified

### Phase 2: Convert Medium-Complexity Components

- [ ] Identify components with moderate complexity:
  - [ ] Convert src/components/WorkMap/QuickAddRow.jsx → QuickAddRow.tsx
  - [ ] Convert src/components/WorkMap/SelectableTableRow.jsx → SelectableTableRow.tsx
  - [ ] Convert src/components/WorkMap/HoverQuickEntryWidget.jsx → HoverQuickEntryWidget.tsx
- [ ] Test each component after conversion:
  - [ ] Ensure all props are properly typed
  - [ ] Verify event handlers have proper type signatures
  - [ ] Check that component renders correctly
- [ ] Update imports and cleanup:
  - [ ] Update imports in all pages to use TypeScript versions
  - [ ] Verify component functionality in the browser
  - [ ] Delete original JavaScript files once verified

### Phase 3: Convert Complex Components

- [ ] Convert complex components with many dependencies:
  - [ ] Convert src/components/WorkMap/TableRow.jsx → TableRow.tsx
  - [ ] Convert src/components/WorkMap/WorkMapTable.jsx → WorkMapTable.tsx
  - [ ] Convert src/components/WorkMap/WorkMapTabs.jsx → WorkMapTabs.tsx
- [ ] Address circular dependencies if they arise:
  - [ ] Use interface merging or module augmentation if needed
  - [ ] Consider refactoring to improve code organization
- [ ] Test thoroughly after each component conversion
- [ ] Update imports and cleanup:
  - [ ] Update imports in all pages to use TypeScript versions
  - [ ] Verify component functionality in the browser
  - [ ] Delete original JavaScript files once verified

### Phase 4: Astro Pages and Layouts

- [ ] Convert Astro-specific files:
  - [ ] Update any .astro files to properly type-check imported components
  - [ ] Ensure all component props are properly typed in Astro templates
  - [ ] Update any Astro API integrations to use TypeScript
- [ ] Final cleanup:
  - [ ] Ensure all imports use TypeScript versions
  - [ ] Verify application functionality in the browser
  - [ ] Remove any remaining JavaScript files that have TypeScript equivalents

## Testing and Quality Assurance

- [ ] Implement comprehensive testing strategy:
  - [ ] Run TypeScript compiler after each file conversion
  - [ ] Fix any type errors before moving to the next file
  - [ ] Ensure no runtime errors are introduced
- [ ] Update build process if needed
- [ ] Create or update CI/CD pipeline to include TypeScript checking
- [ ] Document any patterns or workarounds used during migration
- [ ] Create type-checking scripts for pre-commit hooks

## Final Verification

- [ ] Run the complete application to verify all features work:
  - [ ] Test all routes and pages
  - [ ] Verify all interactive elements function correctly
  - [ ] Check dark mode and responsive design
- [ ] Run the TypeScript compiler with strict mode enabled:
  ```bash
  npx tsc --noEmit
  ```
- [ ] Resolve any remaining type errors or warnings
- [ ] Ensure CI/CD pipeline passes with TypeScript checks
- [ ] Update documentation to reflect TypeScript conventions
- [ ] Create a style guide for TypeScript best practices in the project

## Post-Migration Improvements

- [ ] Refine types to be more specific (replacing any with concrete types)
- [ ] Add stronger type guards where appropriate
- [ ] Consider implementing branded types for more type safety
- [ ] Explore advanced TypeScript features where beneficial:
  - [ ] Discriminated unions
  - [ ] Utility types
  - [ ] Conditional types
- [ ] Optimize build performance for TypeScript compilation
- [ ] Remove any redundant type assertions or workarounds

## Notes on Goal Completion States

As per existing implementation, ensure that the goal completion states follow the three-state model:

1. **Achieved** (green) - Goal was fully accomplished (status: "achieved")
2. **Partial** (amber/yellow) - Goal was partially accomplished (status: "partial")
3. **Missed** (red) - Goal was not accomplished (status: "missed")

These states are already implemented in the StatusBadge component and should be properly typed in the TypeScript conversion.
