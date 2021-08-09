# Compound's Governor Bravo

Delete param GovernorAlpha and intiate initialProposalId to 1:\

In GovernorBravoDelegate.sol,\
Delete lines 321 and 326.\
Change line 327 to

```
initialProposalId = 1;
```

In GovernorBravoInterfaces.sol,\
Delete lines 179-182.

Temporary changes: reduce Timelock MINIMUM_DELAY to 0.
