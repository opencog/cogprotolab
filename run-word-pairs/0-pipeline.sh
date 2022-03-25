#! /bin/bash
#
# 0-pipeline.sh
#
# Master file for configuration parameters for langugage learning.
# This particular file is aimed at (English) word-pair visualization.
# ----------

# Location where processing scripts are installed.
# export COMMON_DIR=/usr/local/share/opencog/learn/run-common
export COMMON_DIR=/home/ubuntu/src/learn/run-common

# Location where the RocksDB databases are kept. This allows different
# experiments to re-use the same filenames, changing only the directory.
# It is recommended that this be located on an SSD disk, for
# performance.
# If you are using Postgres, just delete `ROCKS_DATA_DIR`.
export ROCKS_DATA_DIR=/home/atomspace/data/

# Directory in which configuration parameters (including this file)
# are located. Obtained automatically; don't change.
export CONFIG_DIR=$( cd "$( dirname "${BASH_SOURCE[0]}" )" && pwd )

# The master config file, which is this file.  Don't change.
export MASTER_CONFIG_FILE=${CONFIG_DIR}/$( basename "${BASH_SOURCE[0]}" )
