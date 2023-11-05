#ifndef null
#define null 0
#include <malloc.h>
#endif

typedef struct _sstr XString;

struct _sstr
{
    char *_str;
    int _size;
};

#define sstrcreate()                   \
    {                                  \
        ._str = malloc(24), ._size = 0 \
    }

#define sstrappend(str, ch)                                                 \
    {                                                                       \
        if ((str._size) == malloc_usable_size(str._str))                    \
            str._str = realloc(str._str, malloc_usable_size(str._str) * 2); \
        *(str._str + (str._size++)) = ch;                                   \
    }

void sstrappends(XString*str,char *stra)
{
    for (; *stra != '\00'; ++stra)
    {
        if ((str->_size) == malloc_usable_size(str->_str))
            str->_str = realloc(str->_str, malloc_usable_size(str->_str) * 2);
        *(str->_str + (str->_size++)) = *stra;
    }
}

#define sstrgrow(str)                                \
    if ((str._size) == malloc_usable_size(str._str)) \
        str._str = realloc(str._str, malloc_usable_size(str._str) * 2);

int strend(char *str)
{
    for (; *str != null; ++str)
        ;
    return *(str - 1);
}

int strendswith(char *str, char *end)
{
    for (char *bound = end; *str != null; ++str)
        if (*end == *str)
            ++end;
        else
            end = bound;
    return (*end == null);
}

int strstartswith(char *str, char *start)
{
    for (; *str == *start; ++str, ++start)
        if (*str == null)
            return 0;
    return (*start == '\00') ? 1 : 0;
}

int strequals(char *str1, char *str2)
{
    for (; *str1 == *str2; ++str1, ++str2)
        if (*str1 * *str2 == null)
            return *str2 == 0;
    return 0;
}

signed int strequalsmo(char *str, char opts, ...)
{
    __builtin_va_list arguments;
    __builtin_va_start(arguments, opts);
    for (unsigned int i = 0; i < opts; ++i)
    {
        char *str1 = __builtin_va_arg(arguments, char *);
        char *str2 = str;
        for (; *str1 == *str2; ++str1, ++str2)
            if (*str1 == null)
                if (*str2 == 0)
                    return i;
                else
                    break;
            else if (*str2 == null)
                return i;
        continue;
    }
    __builtin_va_end(arguments);
    return 0;
}

char *strremoveAdStart(char *str, char *start)
{
    // (~*start | ~*str) != -1 /* check if one of the strings is value 0 */
    for (; *str == *start; ++str, ++start)
        if (*str == null)
            return null;
    return (*start == '\00') ? str : null;
}

char* strcopyusingmalloc(char* str)
{
    XString copy = sstrcreate();
    for(;*str != null;++str)
        sstrappend(copy, *str);    
    /* append null terminator */
    sstrappend(copy, '\00');
    return copy._str;
}