#!/bin/sh

ls -la .env
cat .env
source .env
echo "\
module.exports = {
  apps : [{
    name: \"pissychan\",
    script: \"index.js\",
    env_production: {
      NODE_ENV: \"development\",
      npm_package_name: \"$npm_package_name\",
      npm_package_version: \"$npm_package_version\",
      sha_short: \"$sha_short\",
      branch_name: \"$branch_name\",
      bundle_name: \"$bundle_name\",
    },
  }]
}"
