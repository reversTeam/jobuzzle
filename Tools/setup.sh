#!/bin/sh
###############################################################
#     ####         #                               #          # Jobuzzle - Copyright All rights reserved
#     ####         #                               #          #
#       ##  #####  ######  #     # ####### ####### #  #####   # @Author: revers
#       ## #     # #     # #     #      #       #  # #     #  #
#       ## #     # #     # #     #     #       #   # #     #  # @Date:   2015-05-22 17:00:05
#       ## #     # #     # #     #    #       #    # #     #  #
#       ## #     # #     # #     #   #       #     # ######   # @Last Modified by:   revers
#  ####### #     # #     # #     #  #       #      # #        #
#  ######   #####   ######  #####  ####### ####### # #######  # @Last Modified time: 2015-08-08 14:36:44
###############################################################


git submodule init
git submodule update
git submodule foreach --recursive git checkout master
git submodule foreach --recursive git pull origin master