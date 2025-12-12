# wk4-lvl3-supabase

This is the repo for the Week 4, Level 3 assignments with CodeX for learning about supabase.

## Day 1 — React + Supabase Project Setup (Read Functionality)

### Objective

Today I set up base for this week’s project up. Most of today was just wiring things up to match the repo Ulises walked us through in class, such as installing everything, setting up Supabase, organizing the project structure, getting the layout components in place, and making sure the environment was ready before we start actually querying anything.

### What I Did Today

1. **Set up my Supabase account and created the project for this app.**

   * Created a new Supabase project
   * Added a `tasks` table and set the initial schema:

| Column      | Type      | Default         |
|-------------|-----------|-----------------|
| id          | int8      | ---             |
| created_at  | timestamp | now()           |
| title       | text      | 'Example Title' |
| is_complete | bool      | false           |

* Enabled Row Level Security (RLS) on the table
* No policies added yet — this is just the initial setup

2. **Initialized npm and installed the main dependencies for the project.**

* Ran `npm init -y` to initialize npm for the project
* Then installed depdencies
* `npm install`
* `npm install @supabase/supabase-js` to install the js client library for supabase
* `npm install sass axios react-router-dom` to set up sass, axios and the react router dom for the project

3. Installed the linters.
   npm install --save-dev eslint stylelint stylelint-config-standard-scss htmlhint
4. Copied over the following folders and files from the last project:

* .htmlhintrc
* eslint.config.js
* .stylelint.config.cjs
* .github folder with linters.yml in the workflows
* assets folder with react.svg
* public folder with vite.svg

5. **Updated the Stylelint configuration.**

Added rules so SCSS wouldn’t complain about rgba() or numeric opacity values:

```
{
"color-function-notation": "legacy",
"alpha-value-notation": "number",
}
```

6. **Created the `.env.local` file for Supabase.**

Added the URL and anon key from my personal Supabase project (not the example values from class).

```
VITE_SUPABASE_URL=your-url-here
VITE_SUPABASE_ANON_KEY=your-key-here
```

Also set up gitignore so it won't ever commit this file. This keeps the Supsabase project URL and anon key out of the repo. This is a good practice for the future as it helps ensure security isn't compromised if someone were to look at the repo/code in github.

7. **Created the Supabase client file.**

Built `supabaseClient.js` following the repo structure.

It loads env variables, checks for missing values, and creates a single Supabase client instance that will be used later in the project.

8. **Set up the basic folder structure and layout components.**

* `main.jsx` wired up React and global styles
* `App.jsx` wraps everything in the main layout
* Added `Header`, `Footer`, and `MainLayout` to establish the structure

  This part was mostly just matching the repo so the children prop works correctly.

9. **Added initial SCSS structure.**

Created the base partials (`_layout.scss`, `_tasks.scss`, `_variables.scss`) and made sure everything compiled without issues.

### Files Created / Updated (Day 1)

### Files Created / Updated (Day 1)

**Project Setup Files**

* `.env.local`
* `.gitignore`
* `index.html`
* `package.json`
* `stylelint.config.cjs` (updated rules)

**Source Files (`/src`)**

* `main.jsx`
* `App.jsx`

**Supabase**

* `src/lib/supabaseClient.js`

**Layout Components (`/src/components/layout`)**

* `Header.jsx`
* `Footer.jsx`
* `MainLayout.jsx`

**Task Components**

* `src/components/tasks/TaskItem.jsx`
* `src/components/tasks/TaskList.jsx`

**Styles (`/src/styles`)**

* `main.scss`
* `_layout.scss`
* `_tasks.scss`
* `_variables.scss`

**Assets**

* `src/assets/react.svg`

## How to Run This Project

npm install
npm run dev

Make sure `.env.local` exists and contains your Supabase URL and anon key.

## Resources

* Supabase Documentation - [https://supabase.com/docs/guides](https://supabase.com/docs/guides)

