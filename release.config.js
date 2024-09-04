module.exports = {
  branches: [
    'main', 
    'develop',
    'feature/*'
  ],
plugins: [
    '@semantic-release/commit-analyzer',
    '@semantic-release/release-notes-generator'
  ]
};
