#!/usr/bin/python3

# Import python modules
import os
import subprocess

# MOdule levele constants
CL_SPACE = ' ', '\\ '


#------------------------------------------------------------------------------#
def get_path(*paths):
    return os.path.join(os.path.dirname(os.path.abspath(__file__)), *paths)


#------------------------------------------------------------------------------#
def combine_imgs(path, relative=""):
    name = 'sketch_and_prototype_peter_varo_pages_'
    filenames = filter(lambda fn: fn.endswith('.png'), os.listdir(path))
    for i, (fn1, fn2) in enumerate(zip(filenames, filenames)):
        # Create command-line ready paths
        paths = (get_path(path, fn1).replace(*CL_SPACE),
                 get_path(path, fn2).replace(*CL_SPACE),
                 path.replace(*CL_SPACE),
                 name, i)
        # Join images together
        cmd = 'convert +append {} {} {}/{}{}.png'.format(*paths)
        subprocess.call(cmd, shell=True)
        # Remove original files
        os.remove(get_path(path, fn1))
        os.remove(get_path(path, fn2))
        # Print out new <DIV> structure
        print("""\t\t\t<a href="{1}/{0}{4}"
               data-lightbox="book"
               class="zoomable">
                <img src="{1}/{2}" />
            </a>
            <a href="{1}/{0}{4}"
               data-lightbox="book"
               class="zoomable">
                <img src="{1}/{3}" />
            </a>""".format(name, relative, fn1, fn2, i))


#------------------------------------------------------------------------------#
def resize_imgs(path):
    for filename in os.listdir(path):
        if filename.endswith('.png'):
            cmd = 'convert {0} -resize 480x480 {0}'.format(os.path.join(path, filename).replace(*CL_SPACE))
            subprocess.call(cmd, shell=True)


#------------------------------------------------------------------------------#
if __name__ == '__main__':
    # 58 DPI
    # resize_imgs(get_path('pages'))
    # 150 DPI
    combine_imgs(get_path('pages_big'), 'pages_big')
