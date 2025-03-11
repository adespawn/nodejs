#!/bin/bash

valgrind --vgdb=yes --vgdb-error=1 --track-fds=yes --track-origins=yes bash ./xd.sh

# --trace-children=yes 
# --vgdb=yes --vgdb-error=1 
