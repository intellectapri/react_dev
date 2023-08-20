#!/bin/bash
set -eo pipefail

HOST=admin@bms.bonzabiketours.com

cd "$(dirname $0)/../dist"

rsync -avz --delete ./ "$HOST:/home/admin/frontend"