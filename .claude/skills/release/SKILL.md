---
name: release
description: >
  Release a new version of p5.capture to npm. Use this skill whenever the user
  mentions releasing, publishing, bumping version, cutting a release, or
  shipping a new version of p5.capture. Guides through: version bump type
  selection, CHANGELOG.md update, pnpm version, and tag push that triggers
  the automated GitHub Actions release workflow.
---

# p5.capture Release

This skill walks through releasing a new version of p5.capture. The automated
part (npm publish + GitHub Release creation) is handled by GitHub Actions once
you push the tag — your job is to decide the version, update the CHANGELOG, and
push.

## Step 1: Confirm the current state

Run these checks before starting:

```bash
# Confirm you're on main and it's clean
git status
git log --oneline -5

# Show current version
node -p "require('./package.json').version"
```

If there are uncommitted changes or you're not on main, resolve that first.

## Step 2: Decide the version bump type

Pick based on what changed since the last release:

| Type    | When to use                                    | Example       |
| ------- | ---------------------------------------------- | ------------- |
| `patch` | Bug fixes, dependency updates, no new features | 1.6.0 → 1.6.1 |
| `minor` | New features, backwards-compatible changes     | 1.6.0 → 1.7.0 |
| `major` | Breaking API changes                           | 1.6.0 → 2.0.0 |

Look at the git log since the last tag to help decide:

```bash
git log $(git describe --tags --abbrev=0)..HEAD --oneline
```

Ask the user which type if it's not obvious from the context.

## Step 3: Bump the version (package.json only)

Use `--no-git-tag-version` so that package.json is updated but no commit or tag
is created yet. This lets you update CHANGELOG.md and README.md in the same
commit.

```bash
pnpm version patch --no-git-tag-version   # or minor / major
```

## Step 4: Update CHANGELOG.md

Add a new entry at the top of `CHANGELOG.md` in this format:

```markdown
## {new version} ({Month} {D}, {YYYY})

- Description of change 1
- Description of change 2
```

Use the same date format as existing entries (e.g., `April 15, 2026`).

## Step 5: Update README.md

README.md is auto-generated from `scripts/README.template.md` using the version
in `package.json`. Run:

```bash
pnpm update:readme
```

## Step 6: Commit, tag, and push — this triggers the release

Stage all three files together, create the release commit, tag it, then push:

```bash
NEW_VERSION=$(node -p "require('./package.json').version")
git add package.json CHANGELOG.md README.md
git commit -m "chore: release v${NEW_VERSION}"
git tag "v${NEW_VERSION}"
git push origin main --tags
```

This push triggers `.github/workflows/release.yml`, which:

1. Runs build + unit tests + E2E tests (Chromium)
2. Publishes to npm
3. Creates a GitHub Release with notes extracted from CHANGELOG.md

## Step 7: Confirm success

After a few minutes, verify:

```bash
# Check the GitHub Actions run
gh run list --repo tapioca24/p5.capture --limit 3

# Check npm (may take a minute to propagate)
npm view p5.capture version
```

Also check the GitHub Releases page to confirm the release notes look correct.

## Notes

- The `prepublishOnly` script in package.json is **not** used by the workflow — tests run as explicit steps. The workflow handles everything.
- If the Actions run fails, the npm package is not published. Fix the issue, push a new patch, and release again.
- The npm token (`NPM_TOKEN`) expires every 90 days. If publish fails with an auth error, regenerate the token on npmjs.com and update the GitHub Secret.
