# Napkin

## Corrections
| Date | Source | What Went Wrong | What To Do Instead |
|------|--------|----------------|-------------------|
| 2026-07-12 | self | Used `linear issue create --start` from an unrelated repository, which automatically created and switched to a ticket branch there. | Create the Linear issue without `--start` unless already inside the target repository; start it only after cloning and creating the intended branch. |
| 2026-07-12 | self | Asked `gh repo fork` to create `goldsky-io/v3-subgraph` without checking whether that fork already existed; GitHub created an unwanted `v3-subgraph-1`. | Run `gh repo view <org>/<name>` before forking; clone and reuse an existing upstream fork. |
| 2026-07-12 | user | Built the deploy artifact with the guessed network slug `robinhood-chain`; Goldsky rejected it as unsupported. | The registered chain/network slug is `robinhood-mainnet`; build and deploy manifests with that exact value. |

## User Preferences
- Keep responses extremely concise.
- Use ticketed feature branches for Goldsky work.

## Patterns That Work
- Preserve exact pricing semantics while reducing AssemblyScript `load()` calls by passing already-loaded entities through helpers.

## Patterns That Don't Work
- Do not break early in `findEthPerToken`; whitelist pools are not proven to be ordered by current native liquidity.

## Domain Notes
- Linear ticket: INFRA-5115.
- Upstream: `Uniswap/v3-subgraph`; Goldsky fork: `goldsky-io/v3-subgraph`.
