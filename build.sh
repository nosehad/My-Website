# /usr/bin/bash 
if [ "$1" = "-c" ] # compile webserver
then
    echo "Building Webserver..."
    # libmicrohttpd-devel.x86_64 package required
    gcc ./html/index.c -lmicrohttpd -O3 -o portfolio_webserver
    exit
elif [ "$1" = "-d" ] # compile webserver with debug mode 
then
    echo "Building Webserver (Debug mode)..."
    # libmicrohttpd-devel.x86_64 package required
    gcc ./html/index.c -lmicrohttpd -g -o portfolio_webserver
    exit
elif [ "$1" = "-b" ] # compile index.html
then
    # -E: generate preproccessor output
    # -x: ignore file extension css and mark file as c code
    # -P: prevent generation of line markers
    # -w: ignore warnings
    gcc -w -E -x c -P ./html/index.html -o out/index.html
    exit
fi

sudo ./portfolio_webserver --port=80