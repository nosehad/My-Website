typedef struct _qNode SQNode;
typedef struct _qNode SQTree; /* Root node */
typedef struct _qIterator SQIterator;

#ifndef null
    #define null 0
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
#endif

struct _qNode
{
    char *key;
    char *value;
    struct _qNode *ln; /* left node */
    struct _qNode *rn; /* right node */
};

SQTree *sqtr_create()
{
    SQTree *res = (SQTree *)malloc(sizeof(SQTree));
    res->key = null, res->rn = null, res->ln = null;
    return res;
}

void _sqtr_clonen(SQNode *node1, SQNode *node2)
{
    node2->key = node1->key;
    node2->value = node1->value;

    /* dont just copy pointers, allocate new node */
    if (node1->ln != null)
    {
        node2->ln = (SQNode *)malloc(sizeof(SQNode)); /* also clonen for childs*/
        _sqtr_clonen(node1->ln, node2->ln);
    }
    if (node1->rn != null) /* do same for right child */
    {
        node2->rn = (SQNode *)malloc(sizeof(SQNode));
        _sqtr_clonen(node1->rn, node2->rn);
    }
}

SQTree *sqtr_clone(SQTree *tree)
{
    SQTree *res = (SQTree *)malloc(sizeof(SQTree));
    _sqtr_clonen(tree, res);
    return res;
}

static int sqtr_keyeqval(char *key1, char *key2)
{
    for (; *key1 != null; key1++, key2++)
        if (*key2 == null)
            return 0;
        else if (*key1 != *key2)
            return 0;
    if (*key2 != null)
        return 0;
    return 1;
}

int sqtr_empty(SQTree *tree)
{
    if (tree->ln == null && tree->rn == null)
        return 1;
    return 0;
}

void sqtr_set(SQTree *tree, char *key, char *value)
{
    if (tree == null || key == null)
        return;
    // printf("set\n");
    // printf("%lld -> %s\n", key, key);
    char *_key = key;
    /* right shift bits */
    unsigned char shifting_bits = 0;
    for (; *key != 0; shifting_bits++)
    {
        // printf("tree: %lld\n", tree);
        // printf("key: %lld\n", tree->key);
        // printf("key: %s\n", tree->key);
        if (tree->key != null && sqtr_keyeqval(tree->key, _key) == 1)
        {
            tree->value = value;
            return;
        }
        if (shifting_bits == 8)
        {
            shifting_bits = 0;
            key++; /* increase byte right shift*/
        }
        if (((*key) >> shifting_bits) & 1)
        {
            if (tree->rn == null) /* if right node is null -> set right node to insert node */
            {
                SQNode *insert = (SQNode *)malloc(sizeof(SQNode));
                // printf("New Tree: %lld\n", insert);
                insert->rn = null;
                insert->ln = null;
                insert->key = key;
                insert->value = value;
                tree->rn = insert;
                return;
            }
            /* not directly set tree node, to reinsert leafs of node that is beeing removed */
            tree = tree->rn;
            continue;
        }
        if (tree->ln == null) /* if left node is null -> set left node to insert node */
        {
            SQNode *insert = (SQNode *)malloc(sizeof(SQNode));
            // printf("New Tree: %lld\n", insert);
            insert->rn = null;
            insert->ln = null;
            insert->key = key;
            insert->value = value;
            tree->ln = insert;
            return;
        }
        tree = tree->ln;
        continue;
    }
}

void *sqtr_get(SQTree *tree, char *key)
{
    char *_key = key;
    /* right shift bits */
    unsigned char shifting_bits = 0;
    for (; *key != 0; shifting_bits++)
    {
        if (tree->key != null && strcmp(tree->key, _key) == 0)
        {
            return tree->value;
        }
        if (shifting_bits == 8)
        {
            shifting_bits = 0;
            key++; /* increase byte right shift*/
        }
        if (((*key) >> shifting_bits) & 1)
        {
            if (tree->rn == null)
            {
                /* return if branch ends */
                return null;
            }
            /* not directly set tree node, to reinsert leafs of node that is beeing removed */
            tree = tree->rn;
            continue;
        }
        if (tree->ln == null)
        {
            return null;
        }
        tree = tree->ln;
        continue;
    }
}

static inline void _sqtr_insertn(SQNode *start, unsigned int startb, SQNode *insert)
{
    /* recursively insert subnodes */
    if (insert->rn != null)
    {
        _sqtr_insertn(start, startb, insert->rn); /* reinsert right branch of removed node */
        insert->rn = null;
    }
    if (insert->ln != null)
    {
        _sqtr_insertn(start, startb, insert->ln);
        insert->ln = null;
    }

    /* right shift bits */
    unsigned char shifting_bits = startb & 8;
    char *key = insert->key + (startb - shifting_bits);
    for (; *key != null; shifting_bits++)
    {
        if (shifting_bits == 8)
        {
            shifting_bits = 0;
            key++; /* increase byte right shift*/
        }
        if (((*key) >> shifting_bits) & 1)
        {
            if (start->rn == null)
            {
                start->rn = insert; /* change right node  */
                return;
            }
            start = start->rn;
            continue;
        }
        if (start->ln == null)
        {
            start->ln = insert; /* change left node  */
            return;
        }
        start = start->ln;
        continue;
    }
}

void sqtr_delete(SQTree *tree, char *key)
{
    SQNode *next;
    char *_key = key;
    unsigned char shifting_bits = 0;
    for (; *key != null; shifting_bits++)
    {
        if (shifting_bits == 8)
        {
            shifting_bits = 0;
            key++; /* increase byte right shift*/
        }
        if (((*key) >> shifting_bits) & 1)
        {
            if (tree->rn == null)
            {
                return;
            }
            /* not directly set tree node, to reinsert leafs of node that is beeing removed */
            next = tree->rn;
            if (sqtr_keyeqval(next->key, _key) == 1)
            {
                /* set right node to null, to remove old node out of structure */
                tree->rn = null;
                /* reinsert nodes */
                int startb = (_key - key) + shifting_bits;
                if (next->rn != null)
                    _sqtr_insertn(tree, startb, next->rn); /* reinsert right branch of removed node */
                if (next->ln != null)
                    _sqtr_insertn(tree, startb, next->ln); /* reinsert left branch of removed node */
                return;
            }
            tree = next;
            continue;
        }
        if (tree->ln == null)
        {
            return;
        }
        /* not directly set tree node, to reinsert leafs of node that is beeing removed */
        next = tree->ln;
        if (sqtr_keyeqval(next->key, _key) == 1)
        {
            /* set right node to null, to remove old node out of structure */
            tree->ln = null;
            /* reinsert nodes */
            int startb = (_key - key) + shifting_bits;
            if (next->rn != null)
                _sqtr_insertn(tree, startb, next->rn); /* reinsert right branch of removed node */
            if (next->ln != null)
                _sqtr_insertn(tree, startb, next->ln); /* reinsert left branch of removed node */
            return;
        }
        tree = next;
        continue;
    }
}

char *sqtr_pop(SQTree *tree, char *key)
{
    SQNode *next;
    char *_key = key;
    unsigned char shifting_bits = 0;
    for (; *key != null; shifting_bits++)
    {
        if (shifting_bits == 8)
        {
            shifting_bits = 0;
            key++; /* increase byte right shift*/
        }
        if (((*key) >> shifting_bits) & 1)
        {
            if (tree->rn == null)
            {
                return null;
            }
            /* not directly set tree node, to reinsert leafs of node that is beeing removed */
            next = tree->rn;
            if (sqtr_keyeqval(next->key, _key) == 1)
            {
                /* set right node to null, to remove old node out of structure */
                tree->rn = null;
                /* reinsert nodes */
                int startb = (_key - key) + shifting_bits;
                if (next->rn != null)
                    _sqtr_insertn(tree, startb, next->rn); /* reinsert right branch of removed node */
                if (next->ln != null)
                    _sqtr_insertn(tree, startb, next->ln); /* reinsert left branch of removed node */
                void *ret = next->value;
                free(next);
                return ret;
            }
            tree = next;
            continue;
        }
        if (tree->ln == null)
        {
            return null;
        }
        /* not directly set tree node, to reinsert leafs of node that is beeing removed */
        next = tree->ln;
        if (sqtr_keyeqval(next->key, _key) == 1)
        {
            /* set right node to null, to remove old node out of structure */
            tree->ln = null;
            /* reinsert nodes */
            int startb = (_key - key) + shifting_bits;
            if (next->rn != null)
                _sqtr_insertn(tree, startb, next->rn); /* reinsert right branch of removed node */
            if (next->ln != null)
                _sqtr_insertn(tree, startb, next->ln); /* reinsert left branch of removed node */
            void *ret = next->value;
            free(next);
            return ret;
        }
        tree = next;
        continue;
    }
}

extern inline SQNode *sqtr_popl(SQTree *tree)
{
    SQNode *_tree = tree;
    SQNode *previous = tree;
    for (;;)
    {
        if (tree->ln != null)
        {
            previous = tree;
            tree = tree->ln;
        }
        else if (tree->rn != null)
        {
            previous = tree;
            tree = tree->rn;
        }
        else
        {
            if (previous == tree)
            {
                return null;
            }
            else
            {
                if (previous->rn == tree)
                    previous->rn = null;
                else
                    previous->ln = null;
                return tree;
            }
        }
    }
}

extern inline void sqtr_free(SQTree *tree)
{
    for (; !sqtr_empty(tree); free(sqtr_popl(tree)))
        ;
    free(tree);
}