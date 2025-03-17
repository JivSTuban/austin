import { updateProfilePolicies } from './src/lib/helpers/updateProfilePolicies.js';

console.log('Starting profile policies update...');
updateProfilePolicies()
  .then(() => {
    console.log('Profile policies update completed successfully');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Failed to update profile policies:', error);
    process.exit(1);
  });
