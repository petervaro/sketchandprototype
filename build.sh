#!/bin/bash
## INFO ##
## INFO ##

#------------------------------------------------------------------------------#
# Default values for variables
USE_JS=false;
USE_CSS=false;
USE_HTML=false;
DEBUG_JADE='';
DEBUG_SCSS='-e production';



#------------------------------------------------------------------------------#
# Go through all passed arguments
for arg in "$@";
do
    case "$arg" in
        '-D' | '--debug')
            DEBUG_JADE="--pretty --obj debug.json";
            DEBUG_SCSS="-e development";;
        '-H' | '--html')
            USE_HTML=true;;
        '-C' | '--css')
            USE_CSS=true;;
        '-J' | '--js')
            USE_JS=true;;
        *)
            printf "Invalid argument: \`$arg'\n";
            exit 1;
    esac;
done;

# If no 'use' argument defined, use all
if [ "$USE_HTML" != true ] &&
   [ "$USE_CSS"  != true ] &&
   [ "$USE_JS"   != true ];
then
    USE_HTML=true;
    USE_CSS=true;
    USE_JS=true;
fi;


#------------------------------------------------------------------------------#
# Convert JADE files to HTML
if [ "$USE_HTML" == true ];
then
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
fi;



#------------------------------------------------------------------------------#
# Convert SCSS files to CSS
if [ "$USE_CSS" == true ];
then
    printf "SCSS: converting files...     ";
    OUT=$(compass compile $DEBUG_SCSS --force);
    if [ "$?" -ne "0" ];
    then
        printf "$OUT\n";
    fi;
    printf "DONE\n";
fi;



#------------------------------------------------------------------------------#
# Check JS files and minify them
if [ "$USE_JS" == true ];
then
    printf "JS: check and minify files... ";
    for src in $(find js -iname *.js ! -iname *.min.js);
    do
        jshint "$src";
        uglifyjs "$src" -o "${src%.*}.min.js";
    done;
    printf "DONE\n";
fi;
