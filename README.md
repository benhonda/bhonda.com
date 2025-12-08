## About

...

## TODOs

**Dec 8 2025**:

- [ ] How to handle staging + prod data in dev? I want to read prod data, but I probably don't want to overwrite prod data... but if I do write data, then I will need to read it... so maybe in dev we:
  - write to staging
  - read from production, then staging (so any updated staging stuff gets read)

**Dec 7 2025**:

- [x] Test the API and be able to backfill.
- [ ] Once the API is working, we need to hook up the frontend to read from S3. or from the CDN. Not sure what the point of the CDN is if we're not using it for this, but also not sure if we should be using it for this.

## Nice-to-haves

- **Dec 7 2025**:

## Other notables

- **Dec 7 2025**: GitHub removed commit data from the events api at some point in 2025.
- **Dec 7 2025**: We're using classic github PATs instead of fine-grained because we want info from repos owned by org and by personal, which we can do with 1 classic token or 2 fine-grained tokens.
