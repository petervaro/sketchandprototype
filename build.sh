#!/bin/bash
## INFO ##
## INFO ##

#------------------------------------------------------------------------------#
# If debug run
if [ "$1" == "-D" ] ||
   [ "$1" == "--debug" ];
then
    DEBUG_JADE="--pretty --obj debug.json";
    DEBUG_SCSS="-e development";
# If release run
else
    DEBUG_JADE="";
    DEBUG_SCSS="-e production";
fi;



#------------------------------------------------------------------------------#
# Convert JADE files to HTML
printf "JADE: converting files...     ";
for src in jade/*.jade;
do
    if [ "$src" == "jade/index.jade" ];
    then
        OUT=$(jade $DEBUG_JADE --out . "$src");
    elif [ "$src" != "jade/_project.jade" ];
    then
        OUT=$(jade $DEBUG_JADE --out html "$src");
    fi;

    if [ "$?" -ne "0" ];
    then
        printf "$OUT\n";
    fi;
done;
printf "DONE\n";



#------------------------------------------------------------------------------#
# Convert SCSS files to CSS
printf "SCSS: converting files...     ";
OUT=$(compass compile $DEBUG_SCSS --force);
if [ "$?" -ne "0" ];
then
    printf "$OUT\n";
fi;
printf "DONE\n";



#------------------------------------------------------------------------------#
# Check JS files and minify them
printf "JS: check and minify files... ";
for src in $(find js -iname *.js ! -iname *.min.js);
do
    jshint "$src";
    uglifyjs "$src" -o "${src%.*}.min.js";
done;
printf "DONE\n";
