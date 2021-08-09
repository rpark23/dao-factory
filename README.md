# Compound's Governor Bravo

In GovernorBravoDelegate.sol, delete param GovernorAlpha and intiate initialProposalId to 1.
Delete lines 321 and 326.
Change line 327 to

```
initialProposalId = 1;
```

In GovernorBravoInterfaces.sol, delete lines 179-182.

Temporary changes: reduce Timelock MINIMUM_DELAY to 0.
