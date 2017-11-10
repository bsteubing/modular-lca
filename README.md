# Activity Browser - A free and extendable LCA software. #

Copyright (c) 2015, Bernhard Steubing and ETH Zurich

Licensed under the GNU General Public License.

# General information #

The Activity Browser is a graphical user interface to the LCA software brightway2 (https://bitbucket.org/cmutel/brightway2). 

This version of the activity browser only works with Python 2.7 and older versions of brightway2 and several other packages. 

# This version of the Activity Browser includes an extension to perform modular LCA, as described here: #

http://activity-browser.readthedocs.org/en/latest/index.html

https://link.springer.com/article/10.1007/s11367-015-1015-3

# Installation #

It is recommended that you create a dedicated virtual environment and install the following dependencies (from a miniconda environment.yml file): 

- cycler=0.10.0=py27_0
- decorator=4.0.9=py27_0
- ipython=4.1.2=py27_1
- ipython_genutils=0.1.0=py27_0
- jpeg=8d=vc9_0
- libpng=1.6.17=vc9_1
- libtiff=4.0.6=vc9_1
- matplotlib=1.5.1=np111py27_0
- mkl=11.3.1=0
- networkx=1.11=py27_0
- numpy=1.11.0=py27_0
- openssl=1.0.2g=vc9_0
- pandas=0.18.0=np111py27_0
- path.py=8.1.2=py27_1
- pickleshare=0.5=py27_0
- pip=8.1.1=py27_1
- pyparsing=2.0.3=py27_0
- pyqt=4.11.4=py27_5
- pyreadline=2.1=py27_0
- python=2.7.11=4
- python-dateutil=2.5.2=py27_0
- pytz=2016.3=py27_0
- qt=4.8.7=vc9_7
- scipy=0.17.0=np111py27_0
- seaborn=0.7.0=py27_0
- setuptools=20.3=py27_0
- simplegeneric=0.8.1=py27_0
- sip=4.16.9=py27_2
- six=1.10.0=py27_0
- tk=8.5.18=vc9_0
- traitlets=4.2.1=py27_0
- vs2008_runtime=9.00.30729.1=0
- wheel=0.29.0=py27_0
- xlrd=0.9.4=py27_0
- xlsxwriter=0.8.4=py27_0
- zlib=1.2.8=vc9_2


Then use pip install to additionall install the following dependencies:

pip install backports-abc==0.4 brightway2==0.14  bw2analyzer==0.7 bw2calc==0.17.1 bw2data==1.4 bw2ui==0.18.1 certifi==2016.8.31 colorama==0.3.7 configparser==3.5.0 docopt==0.6.2 entrypoints==0.2.2 Flask==0.10.1 functools32==3.2.3.post2 future==0.15.2 fuzzywuzzy==0.10.0 ipykernel==4.5.0 ipywidgets==5.2.2 itsdangerous==0.24 Jinja2==2.8 jsonschema==2.5.1 jupyter==1.0.0 jupyter-client==4.4.0 jupyter-console==5.0.0  jupyter-core==4.1.1 lxml==3.6.0  MarkupSafe==0.23 mistune==0.7.3 nbconvert==4.2.0 nbformat==4.1.0 nose==1.3.7 notebook==4.2.2 pefile==2016.3.28 progressbar-ipython==2.3.1 prompt-toolkit==1.0.7 Pygments==2.1.3 pypiwin32==219 pyzmq==15.4.0 qtconsole==4.2.1 requests==2.9.1 singledispatch==3.4.0.3 stats-arrays==0.4.1 tornado==4.4.1 unicodecsv==0.14.1 Unidecode==0.4.19 voluptuous==0.8.10 wcwidth==0.1.7 Werkzeug==0.11.5 widgetsnbextension==1.2.6  