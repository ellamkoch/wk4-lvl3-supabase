# wk4-lvl3-supabase

This is the repo for the Week 4, Level 3 assignments with CodeX for learning about supabase.

## Day 1 — React + Supabase Project Setup (Read Functionality)

### Objective

Today I set up base for this week’s project up. Most of today was just wiring things up to match the repo Ulises walked us through in class, such as installing everything, setting up Supabase, organizing the project structure, getting the layout components in place, and making sure the environment was ready before we start actually querying anything.

### What I Did Today

1. **Set up my Supabase account and created the project for this app.**

   * Created a new Supabase project
   * Added a `tasks` table and set the initial schema:

| Column      | Type       | Default         |
| id          | int8       |   ---           |
| created_at  | timepstamp | now()           |
| title       | text       | 'Example Title' |
| is_complete | bool       | false           |

* Enabled Row Level Security (RLS) on the table
* No policies added yet — this is just the initial setup

2. **Installed the main dependencies for the project.**
   npm install
   npm install @supabase/supabase-js
   npm install sass axios react-router-dom
3. Installed the linters.
   npm install --save-dev eslint stylelint stylelint-config-standard-scss htmlhint
4. **Updated the Stylelint configuration.**

Added rules so SCSS wouldn’t complain about rgba() or numeric opacity values:

```
{
"color-function-notation": "legacy",
"alpha-value-notation": "number",
}
```

5. **Created the `.env.local` file for Supabase.**
   Added the url and the anon key from my supabase project, not Ulises.

```
VITE_SUPABASE_URL=your-url-here
VITE_SUPABASE_ANON_KEY=your-key-here
```

And set up gitignore so it won't ever commit this file so the ways to access it are not publicly listed, and thereby compromising security to the database.

6. **Created the Supabase client file.**

Built `supabaseClient.js` following the repo structure.

It loads env variables, checks for missing values, and creates a single Supabase client instance that will be used later in the project.

7. **Set up the basic folder structure and layout components.**

* `main.jsx` wired up React and global styles
* `App.jsx` wraps everything in the main layout
* Added `Header`, `Footer`, and `MainLayout` to establish the structure

  This part was mostly just matching the repo so the children prop works correctly.

8. **Added initial SCSS structure.**

Created the base partials (`_layout.scss`, `_tasks.scss`, `_variables.scss`) and made sure everything compiled without issues.

### Files Created / Updated (Day 1)

**Project Setup Files**

* `.env.local`
* `.gitignore` (already present)
* `package.json` / `package-lock.json`
* `vite.config.js`
* `index.html`

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

* `assets/react.svg`

## How to Run This Project

npm install
npm run dev

Make sure `.env.local` exists and contains your Supabase URL and anon key.

