# coding-standards.md

Strictly follow the guidelines given below.

## Guidelines

- Use camelCase for variables and functions.

- Use PascalCase for class names and React components.

- Use ALL_CAPS_SNAKE_CASE for constants and enums.

- Always use const for variables that will not be reassigned. Use let only when reassignment is necessary.

- Avoid declaring magic numbers/strings. Instead, declare them as named constants with descriptive names.

- Avoid deeply nested if conditions. Prefer guard clauses or early return statements where applicable.

- Break down code into smaller, modular components to enhance maintainability.

- Follow the Single Responsibility Principle (SRP). Each function, class, or module should have one clear responsibility.

- File names should be descriptive and match the primary content of the file, especially for files with one exported component.

- Strictly implement the feature-based folder structure in the `client` folder

## Error Handling

- Always handle errors using try/catch blocks where appropriate.

- Throw early, catch late: handle errors as soon as they are detected, but catch them where actionable.

- Provide meaningful error messages that help with debugging.
