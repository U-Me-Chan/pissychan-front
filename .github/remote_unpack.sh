#!/bin/sh

set -ex

if [ -e ${BUNDLE_NAME} ]; then
  pm2 del pissychan || true
  rm -rf ${BUNDLE_NAME}
fi
mkdir -p ${BUNDLE_NAME}
tar xf ${BUNDLE_NAME}.tar.gz -C ${BUNDLE_NAME}
ln -sfrvT ${BUNDLE_NAME} pissychan
cd pissychan
ls -la
pm2 del pissychan || true
pm2 start --env production --time
pm2 save
