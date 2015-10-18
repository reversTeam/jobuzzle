#!/bin/sh
###############################################################
#     ####         #                               #          # Jobuzzle - Copyright All rights reserved
#     ####         #                               #          #
#       ##  #####  ######  #     # ####### ####### #  #####   # @Author: revers
#       ## #     # #     # #     #      #       #  # #     #  #
#       ## #     # #     # #     #     #       #   # #     #  # @Date:   2015-06-19 03:54:14
#       ## #     # #     # #     #    #       #    # #     #  #
#       ## #     # #     # #     #   #       #     # ######   # @Last Modified by:   revers
#  ####### #     # #     # #     #  #       #      # #        #
#  ######   #####   ######  #####  ####### ####### # #######  # @Last Modified time: 2015-10-18 14:14:22
###############################################################

git submodule init
git submodule update
puzzle git current --recursive --skip-base branch move staging
git submodule foreach git pull origin staging
puzzle watcher --oneshot
cp Tools/staging/.htaccess Build/client/
