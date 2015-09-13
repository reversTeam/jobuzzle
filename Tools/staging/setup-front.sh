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
#  ######   #####   ######  #####  ####### ####### # #######  # @Last Modified time: 2015-08-08 14:36:39
###############################################################


puzzle git current --recursive --skip-base branch move staging
(cd Watcher && node main 30)
cp Tools/staging/.htaccess Build/client/
