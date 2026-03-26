const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Helper to run commands
function run(cmd) {
  try {
    execSync(cmd, { stdio: 'inherit', cwd: process.cwd() });
  } catch (err) {
    console.error(`Error running command: ${cmd}`);
    // Ignore errors to keep script going
  }
}

// Make sure we have a .gitignore that ignores node_modules and .next
if (!fs.existsSync('.gitignore')) {
  fs.writeFileSync('.gitignore', 'node_modules\n.next\n.env\n');
}

console.log("Initializing git repository...");
run('git init');

// Timeline of commits to build the history
const commits = [
  {
    date: '2026-02-10T10:00:00.000Z',
    message: 'init: Project setup with Next.js, Tailwind, and TypeScript',
    files: ['package.json', 'package-lock.json', 'tsconfig.json', 'next.config.ts', '.gitignore', 'eslint.config.mjs', 'postcss.config.mjs', 'tailwind.config.ts', 'README.md', 'next-env.d.ts']
  },
  {
    date: '2026-02-12T14:30:00.000Z',
    message: 'feature/frontend: Add basic app layout and global base styles',
    files: ['app/layout.tsx', 'app/globals.css', 'public/']
  },
  {
    date: '2026-02-15T11:15:00.000Z',
    message: 'feature/database: Setup Prisma ORM and define data schemas',
    files: ['prisma/', 'lib/prisma.ts']
  },
  {
    date: '2026-02-18T16:45:00.000Z',
    message: 'feature/frontend: Implement responsive Navbar and Footer components',
    files: ['components/Navbar.tsx', 'components/Footer.tsx']
  },
  {
    date: '2026-02-22T09:20:00.000Z',
    message: 'feature/auth: Build authentication modal for login and signup',
    files: ['components/AuthModal.tsx', 'app/api/users/register/']
  },
  {
    date: '2026-02-25T13:50:00.000Z',
    message: 'feature/backend: Implement Next.js authentication API routes and data utilities',
    files: ['app/api/users/', 'lib/data.ts']
  },
  {
    date: '2026-02-28T15:10:00.000Z',
    message: 'feature/frontend: Create main Landing Page and Hero Section layout',
    files: ['components/HeroSection.tsx', 'app/page.tsx']
  },
  {
    date: '2026-03-03T10:40:00.000Z',
    message: 'feature/products: Design Product Grid, Item Cards, and Category filtering',
    files: ['components/ProductGrid.tsx', 'components/ProductCard.tsx', 'components/CategoryChips.tsx']
  },
  {
    date: '2026-03-06T14:25:00.000Z',
    message: 'feature/backend: Develop API endpoints for structured item listings',
    files: ['app/api/items/']
  },
  {
    date: '2026-03-10T11:05:00.000Z',
    message: 'feature/frontend: Add dynamic item details page rendering',
    files: ['app/item/']
  },
  {
    date: '2026-03-14T16:30:00.000Z',
    message: 'feature/products: Build Sell Item workflow and create modal UI',
    files: ['components/SellItemModal.tsx']
  },
  {
    date: '2026-03-18T09:45:00.000Z',
    message: 'feature/realtime: Integrate Supabase and implement real-time Chat interface',
    files: ['lib/supabase.ts', 'components/ChatModal.tsx', 'app/api/messages/']
  },
  {
    date: '2026-03-20T14:15:00.000Z',
    message: 'feature/backend: Add Express server backend logic',
    files: ['backend/']
  },
  {
    date: '2026-03-24T10:50:00.000Z',
    message: 'feature/frontend: Final UI polish, responsive adjustments, and Contact Button',
    files: ['components/ContactButton.tsx']
  },
  {
    date: '2026-03-25T15:00:00.000Z',
    message: 'chore: Update environment variable definitions',
    files: ['.env', '.env.local', '.env.example']
  },
  {
    date: '2026-03-26T09:00:00.000Z',
    message: 'chore/cleanup: Finalize project structure and finalize remaining components',
    files: ['.']
  }
];

// Ensure we define the fake env so that Git commits with the specified date
for (const commit of commits) {
  console.log(`\n--- Processing Commit: ${commit.message} ---`);
  
  // Add specified files
  for (const file of commit.files) {
    // Only attempt adding if file exists or it's current directory '.'
    if (file === '.' || fs.existsSync(file)) {
      run(`git add "${file}"`);
    } else {
      console.log(`Warning: File or directory ${file} not found, skipping.`);
    }
  }

  // Commit with specific date
  // On windows, setting env vars for execSync can be tricky, so let's set it in process.env
  const envDate = commit.date;
  
  // Use powershell syntax for setting env vars inline? No, node lets us pass env.
  // Wait, I can just use GIT_AUTHOR_DATE and GIT_COMMITTER_DATE
  const env = { 
    ...process.env, 
    GIT_AUTHOR_DATE: envDate,
    GIT_COMMITTER_DATE: envDate
  };

  try {
    // Avoid empty commits if nothing was added
    const statusOut = execSync('git status --porcelain').toString();
    if (statusOut.trim().length > 0) {
      execSync(`git commit -m "${commit.message}"`, { stdio: 'inherit', env, cwd: process.cwd() });
      console.log(`Committed successfully for date: ${envDate}`);
    } else {
      console.log("Nothing to commit.");
      // If we still want a commit, we could do --allow-empty, but no need if there are no changes
    }
  } catch (err) {
    console.error("Commit failed. Continuing...");
  }
}

console.log("\nHistory generation complete! Run 'git log --stat' to review.");
