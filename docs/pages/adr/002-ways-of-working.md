# Ways of Working

| Status        | Implemented                                          |
:-------------- |:---------------------------------------------------- |
| **Author(s)** | Tomasz Marciniak (tomek@palladians.xyz)              |
| **Updated**   | 2024-01-26                                           |

## Context and Problem Statement

This ADR outlines the ways of working we've developed for Pallad. The goal is to have an optimal product delivery and release process that's lightweight yet powerful. This process should be revised as more people contribute to the repo and we have more pull requests and features waiting to be released.

## Considered Options

### Current Ways of Working

We agree to use these ways of working.

#### Merge commits

The merging process in all modern software projects can turn into a never-ending debate over whether to use merge commits, sqush, or rebase strategies. Our approach is to use the strategy that requires the least care before merging into main, which is the merge commit. Yes, the git blame and logs can get messy, but from our point of view it generates the least friction and potential rebasing problems.

#### Code delivery stages

We use these phases to deliver the code:
- `To Do`
- `In Progress`
- `Done`

In Progress can consist of many stages, such as `Development In Progress`, `Ready for QA`, `QA OK`, `On Hold`, `To Be Released`. We don't want to care much about the underlying state. If it's in progress, it's just `in progress'.

#### Code Standards

The code we deliver should be as close to 0 weak TypeScript types as possible. The code we deliver should have adequate test automation coverage (unit testing with Vitest and E2E testing with Playwright).

#### Commits and branches

We follow conventional commit naming for commits, take this example:
`feat(vault): add better types for restoreWallet`.
We take a similar approach with branch names:
`feat/extend-key-agent-with-hw`.

#### Around Product Discussion

If you have any questions or need clarification on features and coding, please use our community Discord, which has Pallad development-related channels.
https://discord.com/invite/ExzzfTGUnB

## Decision Outcome

This will be improved over time with the next RFCs and Discord discussions.

### Consequences

N/A

## Validation

We should validate these as we publish Pallad to the Chrome Web Store, prepare future releases, and get more people on board with this repo.
