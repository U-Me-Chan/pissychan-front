#!/bin/sh

set -ex

[ -e ${BUNDLE_NAME} ] && rm rfv ${BUNDLE_NAME}
mkdir -p ${BUNDLE_NAME}
tar xf ${BUNDLE_NAME}.tar.gz -C ${BUNDLE_NAME}
ln -sfrv ${BUNDLE_NAME} pissychan
cd pissychan
pm2 del pissychan
pm2 start
