import semanticRelease from "semantic-release";

semanticRelease({
  branches: [
    "main",                // Main production branchs
    { name: "develop", prerelease: true },  // Develop branch for pre-releases
    { name: "release/*", prerelease: true } // Release branches for pre-releases
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
