#!/bin/sh

. ./.env
echo "\
module.exports = {
  apps : [{
    name: \"pissychan\",
    script: \"index.js\",
    env_production: {
      NODE_ENV: \"production\",
      npm_package_name: \"$npm_package_name\",
      npm_package_version: \"$npm_package_version\",
      sha_short: \"$sha_short\",
      branch_name: \"$branch_name\",
      bundle_name: \"$bundle_name\",
    },
  }]
}"
