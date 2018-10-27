Example: https://analytics.vrchat.ind3x.site (Build: [![CircleCI](https://circleci.com/gh/Ind3xOnGitHub/vrchat-world-tracking/tree/master.svg?style=svg)](https://circleci.com/gh/Ind3xOnGitHub/vrchat-world-tracking/tree/master))

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
