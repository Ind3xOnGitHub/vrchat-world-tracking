Example: https://analytics.vrchat.ind3x.site (Build: [![CircleCI](https://circleci.com/gh/Ind3xOnGitHub/vrchat-world-tracking/tree/master.svg?style=svg)](https://circleci.com/gh/Ind3xOnGitHub/vrchat-world-tracking/tree/master))

```shell
$ scp consolidated_occupants.txt cronjob.js index.html worlds.json user@host:/path/to/your/webroot
```

```shell
$ chmod 0644 .htaccess index.html consolidated_occupants.txt
$ chmod 0700 cronjob.js
```

```
$ crontab -e

API_KEY="your api key"
ROOT_PATH="/path/to/your/webroot"
*/5 * * * * /path/to/your/node /path/to/your/webroot/crontob.js
```
