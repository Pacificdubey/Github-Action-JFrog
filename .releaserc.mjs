import semanticRelease from "semantic-release";
import { execSync } from "child_process";

// Extract the branch name
const branchName = process.env.BRANCH_NAME || process.env.GITHUB_REF?.split('/').pop() || "default";
console.log(`Branch name detected: ${branchName}`);

semanticRelease({
  branches: [
    "main",
    { name: "develop", prerelease: true },
    { name: "release/*", prerelease: true },
  ],
  plugins: [
    ["@semantic-release/commit-analyzer", { preset: "conventionalcommits" }],
    ["@semantic-release/release-notes-generator", { preset: "conventionalcommits" }],
    ["@semantic-release/changelog", { changelogFile: "CHANGELOG.md" }],
    ["@semantic-release/git"],
    ...(branchName === "main" ? ["@semantic-release/github"] : [])
  ],
}, {
  stdout: process.stdout,
  stderr: process.stderr,
})
  .then(({ lastRelease, nextRelease }) => {
    const prevTag = lastRelease?.version || "0.0.0";
    const nextTag = nextRelease?.version || prevTag; // Use lastRelease if nextRelease is undefined
    const releaseType = nextRelease?.type || "patch";

    // Write outputs to $GITHUB_OUTPUT
    const outputFile = process.env.GITHUB_OUTPUT;
    execSync(`echo "PREV_TAG=v${prevTag}" >> ${outputFile}`);
    execSync(`echo "NEXT_TAG=v${nextTag}" >> ${outputFile}`);
    execSync(`echo "RELEASE_TYPE=${releaseType}" >> ${outputFile}`);

    // Log the outputs for visibility
    console.log(`Last release: v${prevTag}`);
    console.log(`Next release: v${nextTag}`);
    console.log(`Release type: ${releaseType}`);
  })
  .catch(err => {
    console.error("The automated release failed with %O", err);
    process.exit(1);
  });
