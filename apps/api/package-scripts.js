// Additional npm scripts for development workflow

const scripts = {
  // Development scripts
  "dev:seed": "tsx src/seeders/realistic-data-seeder.ts",
  "dev:reset": "npm run db:reset && npm run dev:seed",
  "dev:fresh": "npm run clean && npm run build && npm run dev:reset && npm run dev",

  // Database scripts
  "db:create": "createdb artisthub_dev || echo 'Database already exists'",
  "db:drop": "dropdb artisthub_dev || echo 'Database does not exist'",
  "db:recreate": "npm run db:drop && npm run db:create",

  // Testing scripts
  "test:api": "curl http://localhost:3001/health",
  "test:metrics": "curl http://localhost:3001/api/v1/dashboard/metrics",
  "test:activities": "curl http://localhost:3001/api/v1/dashboard/activities",

  // Production readiness
  "validate:env": "node -e \"console.log('Environment validation would go here')\"",
  "check:deps": "npm audit && npm outdated",
};

console.log('Available additional scripts:');
Object.entries(scripts).forEach(([name, command]) => {
  console.log(`  npm run ${name}: ${command}`);
});

module.exports = scripts;