# Contributing to Kaspa Wallet Tracker

Thank you for your interest in contributing to the Kaspa Wallet Tracker! This document provides guidelines for contributing to this open source project.

## Getting Started

1. Fork the repository on GitHub
2. Clone your fork locally:
   ```bash
   git clone https://github.com/yourusername/kaspa-wallet-tracker.git
   cd kaspa-wallet-tracker
   ```
3. Create a new branch for your feature:
   ```bash
   git checkout -b feature/your-feature-name
   ```

## Development Setup

The project uses vanilla HTML, CSS, and JavaScript with no build process required.

### Running Locally
```bash
python3 -m http.server 5000
```
Then open `http://localhost:5000` in your browser.

### Testing
- Test all wallet connections with real Kaspa addresses
- Verify USD tooltips display correctly
- Test Pushcut notifications with valid API credentials
- Check responsive design on different screen sizes

## Code Style Guidelines

### JavaScript
- Use ES6+ features consistently
- Keep functions focused and single-purpose
- Add comments for complex logic
- Use descriptive variable names
- Handle errors gracefully with user-friendly messages

### CSS
- Maintain the clean HTML aesthetic (white background, black text)
- Use consistent spacing and typography
- Avoid complex animations or effects
- Ensure responsive design works on mobile

### HTML
- Use semantic HTML elements
- Keep structure clean and accessible
- Maintain consistent indentation
- Include proper ARIA labels where needed

## Submission Guidelines

### Before Submitting
- [ ] Test your changes thoroughly
- [ ] Ensure no console errors
- [ ] Verify all existing functionality still works
- [ ] Update documentation if needed

### Pull Request Process
1. Update the README.md with details of changes if applicable
2. Ensure your code follows the style guidelines
3. Create a clear, descriptive pull request title
4. Include a detailed description of your changes
5. Link any related issues

### Commit Messages
Use clear, descriptive commit messages:
- `feat: add balance change notification sounds`
- `fix: resolve USD tooltip positioning issue`
- `docs: update installation instructions`
- `style: improve mobile responsive design`

## Types of Contributions

### Bug Fixes
- Fix display issues
- Resolve API connection problems
- Address cross-browser compatibility

### Features
- Add new wallet integrations
- Improve notification systems
- Enhance user interface
- Add accessibility features

### Documentation
- Improve README clarity
- Add code comments
- Create usage examples
- Update API documentation

## Feature Requests

When suggesting new features:
1. Check existing issues first
2. Describe the problem you're solving
3. Explain your proposed solution
4. Consider backwards compatibility
5. Think about security implications

## Reporting Issues

### Bug Reports
Include:
- Browser version and OS
- Steps to reproduce
- Expected vs actual behavior
- Console error messages
- Screenshots if applicable

### Security Issues
For security vulnerabilities, please email directly rather than creating public issues.

## Code Review Process

All contributions go through code review:
- Maintainers will review within 48 hours
- Address feedback promptly
- Be open to suggestions and changes
- Focus on code quality and user experience

## Community Guidelines

- Be respectful and constructive
- Help newcomers get started
- Share knowledge and best practices
- Keep discussions focused and professional

## Questions?

- Open an issue for general questions
- Check existing documentation first
- Be specific about what you need help with

Thank you for contributing to the Kaspa community!