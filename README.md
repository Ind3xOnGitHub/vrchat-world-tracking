# Population tracking for VRChat worlds

[![Donate on patreon](https://badgen.net/badge/donate%20on/patreon/orange)](https://patreon.com/simonknittel)
[![CircleCI branch](https://img.shields.io/circleci/project/github/Ind3xOnGitHub/vrchat-world-tracking/master.svg)](https://circleci.com/gh/Ind3xOnGitHub/vrchat-world-tracking/tree/master)

Example: https://analytics.vrchat.ind3x.site

## Setup

```shell
$ scp consolidated_occupants.txt cronjob.js index.html worlds.json user@host:/path/to/your/webroot
```

```shell
$ chmod 0644 .htaccess consolidated_occupants.txt index.html
$ chmod 0600 worlds.json
$ chmod 0700 cronjob.js
```

```
$ crontab -e

VRC_USERNAME=""
VRC_PASSWORD=""
VRC_API_KEY="" # Currently optional since it's the same for everyone
ROOT_PATH="/path/to/your/webroot"
*/5 * * * * /path/to/your/node /path/to/your/webroot/crontob.js
```

## Support

_"Donations are not required but always appreciated."_

Like this quote implies, I won't stop make things open source, if there are no donations. But they would always be appreciated by me ❤

[![Become a patreon](https://c5.patreon.com/external/logo/become_a_patron_button.png)](https://patreon.com/simonknittel)
