import semanticRelease from "semantic-release";

// Extract the branch name from GITHUB_REF (e.g., "refs/heads/main" -> "main")
const branchName = process.env.BRANCH_NAME || process.env.GITHUB_REF?.split('/').pop() || "default";

console.log(`Branch name detected: ${branchName}`);

// Determine the tag format based on the branch
let tagFormat = "v${version}";
let prereleaseIdentifier = false;  // No prerelease for main

// Apply unique prerelease identifiers based on branch type
if (branchName === "develop") {
  prereleaseIdentifier = "beta";  // Use beta for develop
  tagFormat = "v${version}-beta";
} else if (branchName.startsWith("feature/")) {
  // Dynamically generate a unique prerelease identifier for each feature branch
  prereleaseIdentifier = branchName.replace(/\//g, '-');  // Use branch name for prerelease
  tagFormat = "v${version}-" + prereleaseIdentifier;
} else if (branchName.startsWith("release/")) {
  prereleaseIdentifier = "rc";  // Use release candidate for release branches
  tagFormat = "v${version}-rc";
}

// Define the Semantic Release configuration
semanticRelease({
"branches": [
    "main",
    { "name": "develop", "prerelease": true },
    { "name": "release/*", "prerelease": true }
  ],
  tagFormat: tagFormat,  // Dynamically adjust tag format
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
