import semanticRelease from "semantic-release";

// Extract the branch name from GITHUB_REF (e.g., "refs/heads/main" -> "main")
const branchName = process.env.BRANCH_NAME || process.env.GITHUB_REF?.split('/').pop() || "default";

console.log(`Branch name detected: ${branchName}`);

// Define the Semantic Release configuration
semanticRelease({
"branches": [
    "main",
    { "name": "develop", "prerelease": true },
    { "name": "release/*", "prerelease": true }
  ],
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    ["@semantic-release/exec", {
      prepareCmd: `echo "PREV_TAG=v${process.env.LAST_VERSION}" >> $GITHUB_ENV; echo "NEXT_TAG=v${process.env.NEXT_VERSION}" >> $GITHUB_ENV; echo "RELEASE_TYPE=${process.env.RELEASE_TYPE}" >> $GITHUB_ENV`
    }],
    "@semantic-release/git",
    ...(branchName === "main" ? ["@semantic-release/github", {
      successComment: false,
      failTitle: false
    }] : [])
  ]
}, {
  stdout: process.stdout,
  stderr: process.stderr,
}).then(({ lastRelease, nextRelease }) => {
  console.log(`Last release: ${lastRelease?.version}`);
  console.log(`Next release: ${nextRelease?.version}`);

  // Set environment variables for GitHub Actions
  process.env.LAST_VERSION = lastRelease?.version || "0.0.0";
  process.env.NEXT_VERSION = nextRelease?.version || "1.0.0";
  process.env.RELEASE_TYPE = nextRelease?.type || "patch";
}).catch(err => {
  console.error("The automated release failed with %O", err);
  process.exit(1);
});
