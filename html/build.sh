# /usr/bin/bash 

# gcc arguments:
# -E: generate preproccessor output
# -x: ignore file extension css and mark file as c code
# -P: prevent generation of line markers
# -w: ignore warnings

mkdir -p assets
mkdir -p assets/scripts

# landing page
gcc  -w -E -x c -P html/pages/landing/index.html -o assets/landing.nosehad

# 404 page 
gcc  -w -E -x c -P html/404.html -o assets/404.nosehad

# content managment
gcc  -w -E -x c -P html/generic/Content/cms.html -o assets/cms.nosehad
