module.exports = {
  apps: [
    {
      name: 'psa-staging-frontend',
      exec_mode: 'cluster',
      instances: 1,
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      watch: false,
      env: {
        PORT: 6011,
        name: 'psa-staging-frontend',
      },
    },
    {
      name: 'psa-production-frontend',
      exec_mode: 'cluster',
      instances: 1,
      script: 'node_modules/next/dist/bin/next',
      args: 'start',
      watch: false,
      env: {
        PORT: 6012,
        name: 'psa-production-frontend',
      },
    },
  ],
}
