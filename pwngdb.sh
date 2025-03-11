#!/bin/bash

dir="$(cd -- "$(dirname "$(dirname "$(realpath "$0")")")" >/dev/null 2>&1 ; pwd -P)"
export TERMINFO_DIRS=/etc/terminfo:/lib/terminfo:/usr/share/terminfo:/run/current-system/sw/share/terminfo:$dir/share/terminfo
export PYTHONNOUSERSITE=1
export PYTHONHOME="$dir"
# export PYTHONPATH=""
export PATH="$dir/bin/:$PATH"

exec "/usr/lib/ld-linux-x86-64.so.2" "$dir/exe/gdb" --quiet --early-init-eval-command="set auto-load safe-path /" --command=$dir/exe/gdbinit.py "$@"
