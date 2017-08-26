# -*- coding: utf-8 -*- 
import os
import sys
import string 

for i in range(1, len(sys.argv)):
	print "param:", i, sys.argv[i]
	
os.system("tsc -p ../ituuzx/tsconfig.json")

# OVER
os.system('pause')