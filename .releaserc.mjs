import semanticRelease from "semantic-release";

semanticRelease({
  branches: [
    { name: "main" }, // Main branch for production releases
    { name: "develop", prerelease: true }, // Develop branch for prereleases
    { name: "release/*", prerelease: true } // Wildcard for release branches
  ],
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    ["@semantic-release/git"],
    ["@semantic-release/github"]
  ]
}).then(({ lastRelease, nextRelease }) => {
  console.log(`Last release: ${lastRelease?.version}`);
  console.log(`Next release: ${nextRelease?.version}`);
}).catch(err => {
  console.error("The automated release failed with %O", err);
});

