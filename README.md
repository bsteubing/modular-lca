# A framework for Modular LCA. #

## What is it? ##

In Life Cycle Assessment (LCA), unit processes describe the individual processes over a product's life cycle. Our complex economies 
are reflected in today's LCA databases by thousands of interconnected unit processes, which together describe the life cycle of a product. 

The Modular LCA framework is essentially **a systematic way of structuring parts of a product's life cycle into so-called _modules_**. 
Modules can, e.g., be used to represent life cycle stages and alternatives for a given life cycle stage. 
Modules can automatically be linked to a modular system (e.g. representing the full life cycle of a product broken down into life cycle stages)
and the environmental performance of the system including all provided alternatives can be calculated.

**Key applications** of the Modular LCA framework: 
- associating unit processes and impact assessment results with life cycle stages 
- streamlining LCA based scenario comparisons (e.g. alternative manufacture, transportation, use phase or disposal processes)
- identifying and optimizing key choices in value chains 
- linking LCA with other models (e.g. linear programming, material flow analysis)

> In a way you can think of Modular LCA as breaking down a puzzle into pieces of your choice, adding alternative pieces, and recombining all of these to analyze the differences - in a much easier way than possible with traditional LCA software. 

#### Literature ####

The Modular LCA approach and some applications are described in this paper:
https://link.springer.com/article/10.1007/s11367-015-1015-3

#### Example ####

The following illustration shows 5 modules related to passenger car transportation. Each module relates to a set of unit processes describing part of the life cycle (1). Upstream processes are included by default, but cut-offs can be used to delimit the scope of a module. Each module has a user defined output and, if a cut-off has been defined, also an input. Based on the naming of inputs and outputs (products), the modules are automatically combined to a modular system, which can contain alternatives (2). Impact Assessment results for all resulting scenarios can be calculated automatically (here a contribution analysis by product/module)(3).    

<img src="docs/images/modules_and_modular_system.png"/>
<img src="docs/images/impact_assessment.png"/>

## Installation ##

## Practical use ##

#### Use within the Activity Browser ####

The most comfortable way of using the Modular LCA framework is via the graphical user interface of the Activity Browser software.
https://bitbucket.org/bsteubing/activity-browser  

#### Example Notebook ####

Of course, the framework does not strictly require a graphical user interface. An example notebook is provided here.

## License ##

Copyright (c) 2015 Bernhard Steubing.