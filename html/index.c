#ifdef __cplusplus
extern "C"
{
#endif
#include <signal.h>
#include <microhttpd.h>
#include <stdlib.h>
#include <errno.h>
#include <unistd.h>
#include <string.h>
#include <stdio.h>
#include <time.h>
#include <malloc.h>
#include <pthread.h>
#include <fcntl.h>
#include <sys/stat.h>

#define null 0
    typedef struct _qFile FileData;

/*
    Files Cache (SQTree Algorithm)
*/
#include "sqtree.h"

/*
    String Utils
*/
#include "String.h"

/*
    Webserver
*/

/* static file properties */
#define DOC_DIR "./"
#define INDEX_HTML DOC_DIR"out/index.html"
#define STATIC_DIR DOC_DIR"out/"
    static char *STATIC_DIR_R; /* = STATIC_DIR; */ /* gets initialized in loadFiles() */
#define BUILD_SCRIPT DOC_DIR"build.sh"

    /* file structure */
    struct _qFile
    {
        char *data;
        unsigned int size;
    };

    /* thread id of waiter thread */
    pthread_t thread_id;

    /* server */
    struct MHD_Daemon *microhttp_server;

    /* index html directly stored for better performance */
    FileData indexHTML;

    /* static files */
    SQTree *staticFiles;

    /* logger function */
    static void log_time(void)
    {
        time_t current_time = time(NULL);
        char time_str[23];
        strftime((char *)&time_str, sizeof(time_str), "\e[255D[%I:%M:%S INFO] ", localtime(&current_time));
        printf((char *)&time_str);
    }

        void loadFiles() /* currently only loads index html */
    {
        /* initialize STATIC_DIR_R, because it is needed in responseFromStaticFile method */
        STATIC_DIR_R = STATIC_DIR;

        /* create qtree */
        staticFiles = sqtr_create();

        /* load index.html */
        int fd;
        if ((fd = open(INDEX_HTML, O_RDONLY)) < 0)
        {
            log_time();
            perror("Failed to open file");
            exit(0);
        }
        struct stat stat;
        fstat(fd, &stat);
        indexHTML.data = (char *)malloc(stat.st_size + 1);
        indexHTML.size = stat.st_size;
        *(indexHTML.data + stat.st_size) = '\00';
        if (read(fd, indexHTML.data, stat.st_size) == -1)
        {
            log_time();
            perror("Failed to read file");
            exit(1);
        }
    }

    void unloadFiles()
    {
        free(indexHTML.data);
        // sqtr_free(staticFiles);

        /* custom free paradigma for SQTree, since FileData also has to be freed */
        for (; !sqtr_empty(staticFiles); free(sqtr_popl(staticFiles)))
        {
            SQNode* freen = sqtr_popl(staticFiles);
            /* free key*/
            free(freen->key);

            /* free filedata */
            FileData*data = (FileData*)freen->value;
            free(data->data);
            free(data);
            
            /* free entire node */
            free(freen);
        }
        free(staticFiles);
    }


    /* if server recieves Ctrl + C call exit function */
    static void serv_sigint()
    {
        exit(0);
    }

    /* atexit function that automatically gets invoked on exit */
    static void serv_atexit()
    {
        MHD_stop_daemon(microhttp_server);  /* stop server daemon */
        unloadFiles();                      /* free file data */
        if (pthread_detach(thread_id) != 0) /* detach pthread */
        {
            log_time();
            perror("Failed to detach PThread:");
        }
    }

    static struct MHD_Response *response404()
    {
        return MHD_create_response_from_buffer(61, (void *)"<script>window.location.replace('/404');</script>", MHD_RESPMEM_PERSISTENT);
    }

    static struct MHD_Response *responseFromStaticFile(char *file)
    {
        FileData *dat = sqtr_get(staticFiles, file);
        if (dat != null)
            return MHD_create_response_from_buffer(dat->size, (void *)dat->data, MHD_RESPMEM_PERSISTENT);
        XString filePath = sstrcreate();
        sstrappends(&filePath, STATIC_DIR_R);
        sstrappends(&filePath, file);
        sstrappend(filePath, '\00');

        int fd;

        /* file doesn't exist or is inaccessible */
        if ((fd = open(filePath._str, O_RDONLY)) < 0)
            return response404(); /* return error 404 */
        struct stat stat;
        fstat(fd, &stat);

        /* print info message */
        log_time();
        printf("File '%s' accessed for the first time, attempting to load it into the cache.\n", filePath._str);

        /* create file data */
        dat = (FileData *)malloc(sizeof(FileData));
        dat->data = (char *)malloc(stat.st_size);
        dat->size = stat.st_size;

        if (read(fd, dat->data, stat.st_size) == -1)
        {
            log_time();
            printf("failed to read '%s' (%s)\n", filePath._str, strerror(errno));
            /* free filepath */
            free(filePath._str);
            return response404();
        }

        /* write FileData into cache */
        sqtr_set(staticFiles, strcopyusingmalloc(file)/* copy is required since the <file>
                                                         buffer is automatically freed by MHD */, (char *)dat);

        /* close file */
        close(fd);

        /* free filepath */
        free(filePath._str);

        /* return response */
        return MHD_create_response_from_buffer(dat->size, (void *)dat->data, MHD_RESPMEM_PERSISTENT);
    }

#pragma GCC diagnostic push
#pragma GCC diagnostic ignored "-Wdiscarded-qualifiers" /* ignore warning, because strremoveAdStart doesn't \
                                                           modify the string, it just moves the pointer*/
    static enum MHD_Result serv_handleonreq(void *cls,
                                            struct MHD_Connection *connection,
                                            const char *url,
                                            const char *method,
                                            const char *version,
                                            const char *upload_data,
                                            size_t *upload_data_size,
                                            void **con_cls)
    {
        log_time();
        printf("%s request on %s.\n", method, url);

        char *staticfile;
        struct MHD_Response *response;
        if ((staticfile = strremoveAdStart(url, "/static/")) == null)
            response = MHD_create_response_from_buffer(indexHTML.size, (void *)indexHTML.data, MHD_RESPMEM_PERSISTENT);
        else
            response = responseFromStaticFile(staticfile);

        int ret = MHD_queue_response(connection, MHD_HTTP_OK, response);
        MHD_destroy_response(response);

        return ret;
    }
#pragma GCC diagnostic pop

    /* async file change listener */
    void filelistener()
    {
        for (;;)
        {
            /* use inotifywait to wait for directory changes */
            system("inotifywait -qq -e modify -r \""DOC_DIR"\"");

            /* on change -> rebuild and reload files*/
            log_time();
            printf("rebuilding index.html\n");
            system(BUILD_SCRIPT " -b"); /* -b option to only build index.html file */
            log_time();
            printf("reloading files\n");
            unloadFiles();
            loadFiles();
        }
    }

    void main(int argc, char **argv)
    {
        /* startup server */
        int port = 80;
        /* try to read port */
        if (argc == 2)
            sscanf(*(argv + 1), "--port=%d", &port);

        log_time();
        printf("Starting Daemon on http://localhost:%d\n", port);
        microhttp_server = MHD_start_daemon(MHD_USE_SELECT_INTERNALLY, port, NULL, NULL,
                                            &serv_handleonreq, NULL, MHD_OPTION_END);
        if (microhttp_server == null)
        {
            log_time();
            printf("\e[31mMHD_start_daemon failed: %s\e[0m\n", strerror(errno));
            _Exit(-1);
        }

        /* register handlers */
        signal(SIGINT, serv_sigint);
        atexit(serv_atexit);

        log_time();
        printf("loading files to cache\n");
        loadFiles();

        log_time();
        printf("Listening for file changes, press \e[37m\e[1m'q'\e[0m to exit.\n");
        if (pthread_create(&thread_id, null, (void *(*)(void *))filelistener, null) != 0)
        {
            log_time();
            perror("Failed to create waiter thread:");
            exit(1);
        }

        /* listen for keyboard input */
        for (;;)
            if (getchar() == 'q')
                exit(0);
    }

#ifdef __cplusplus
}
#endif