#!/bin/sh

set -ex

[ -e ${BUNDLE_NAME} ] && rm -rf ${BUNDLE_NAME}
mkdir -p ${BUNDLE_NAME}
tar xf ${BUNDLE_NAME}.tar.gz -C ${BUNDLE_NAME}
ln -sfrvT ${BUNDLE_NAME} pissychan
cd pissychan
pm2 del pissychan || true
pm2 start
pm2 save
