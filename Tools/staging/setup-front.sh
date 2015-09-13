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
#  ######   #####   ######  #####  ####### ####### # #######  # @Last Modified time: 2015-09-13 13:56:40
###############################################################


puzzle git current --recursive --skip-base branch move staging
puzzle watcher --oneshot
cp Tools/staging/.htaccess Build/client/
