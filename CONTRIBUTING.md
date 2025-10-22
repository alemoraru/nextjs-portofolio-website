# Contributing to Next.js Portofolio Website

Thank you for your interest in contributing to this custom Next.js Developer Portofolio Website!
We welcome contributions from the community to help improve and enhance this template.
This document outlines the guidelines and steps for contributing.

---

## Getting Started

To get started, you can will need to follow the steps below.

### Prerequisites

- Ensure you have [Node.js](https://nodejs.org/) and [npm](https://www.npmjs.com/) installed on your machine.
- Familiarity with Git and GitHub is recommended, as well as [Git](https://git-scm.com/) installed locally.
- Knowledge of React, Next.js, and TypeScript will be helpful, since this project is built using these technologies.

### Fork and Clone the Repository

1. Fork the repository on GitHub by clicking the "Fork" button at the top right of the repository page.
2. Clone your forked repository to your local machine using the following command:
   ```bash
   git clone https://github.com/YOUR-USERNAME/nextjs-portfolio-website.git
   cd nextjs-portfolio-website
   ```
3. Add the original repository as a remote to keep your fork up to date:
   ```bash
   git remote add upstream https://github.com/alemoraru/nextjs-portfolio-website.git
   ```
4. Create a new branch for your feature, bug fix, or whatever you want to work on:
   ```bash
   git checkout -b feature/your-feature-name
   ```
5. Make your changes in your local repository, commit them, and then push to your forked repository, e.g.:
   ```bash
   git add .
   git commit -m "Add your commit message here"
   git push origin feature/your-feature-name
   ```
6. Make sure your changes can be built and tested locally before submitting a pull request.
   To prepare a production build, and see whether there are any build errors, run:
   ```bash
   npm run build
   ```
7. Open a pull request from your forked repository to the original repository.
8. Describe your changes in detail in the pull request description (fill in the PR template).
9. Wait for feedback and make any requested changes.

### Development Environment Setup

To set up your development environment after cloning the repository, follow these steps:

1. Install the necessary dependencies by running:
   ```bash
   npm install
   # or
   yarn install
   # or
   pnpm install
   ```
2. Start the development server with:
   ```bash
   npm run dev
   ```
3. Open your browser and navigate to `http://localhost:3000` to view the website, and start making changes. The server
   will automatically reload when you make changes to the code, so you can see your updates in real-time.

## Code Style and Guidelines

- Follow the existing code style and conventions used in the project.
- Write clear, concise, and descriptive commit messages.
- Ensure your code is well-documented and includes comments where necessary (do not over-do it, though).

## Need Help?

If you have any questions or need assistance, feel free to open an issue on the GitHub repository using
the issue template provided.
