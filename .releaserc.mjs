import semanticRelease from "semantic-release";
import { writeFileSync } from "fs";
import { join } from "path";

// Extract the branch name
const branchName = process.env.BRANCH_NAME || process.env.GITHUB_REF?.split('/').pop() || "default";
console.log(`Branch name detected: ${branchName}`);

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
})
  .then(({ lastRelease, nextRelease }) => {
    // If no nextRelease, use the lastRelease
    const prevTag = lastRelease?.version || "0.0.0";
    const nextTag = nextRelease?.version || prevTag; // Use lastRelease if nextRelease is undefined
    const releaseType = nextRelease?.type || "patch";

    process.env.LAST_VERSION = prevTag;
    process.env.NEXT_VERSION = nextTag;
    process.env.RELEASE_TYPE = releaseType;

    // Write GitHub Actions outputs to $GITHUB_OUTPUT
    const githubOutputPath = process.env.GITHUB_OUTPUT || "/dev/null"; // default to /dev/null if GITHUB_OUTPUT is not set

    const outputContent = `
PREV_TAG=v${prevTag}
NEXT_TAG=v${nextTag}
RELEASE_TYPE=${releaseType}
`.trim();

    writeFileSync(githubOutputPath, outputContent, { flag: "a" });

    // Log the results for visibility
    console.log(`Last release: v${prevTag}`);
    console.log(`Next release: v${nextTag}`);
    console.log(`Release type: ${releaseType}`);
  })
  .catch(err => {
    console.error("The automated release failed with %O", err);
    process.exit(1);
  });
