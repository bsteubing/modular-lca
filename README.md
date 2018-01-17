# A framework for Modular LCA. #

Copyright (c) 2015 Bernhard Steubing

Licensed under the GNU General Public License.

# General information #

Unit processes constitute the basis for modeling in Life Cycle Assessment (LCA). LCA product systems often consist of
thousands of unit processes that together describe the life cycle of a product. Modular LCA introduces an additional layer in between
unit processes and complete product systems. Unit processes can be associated with so-called "modules" describing parts of a life cycle,
similar to life cycle stages.

There are several use cases where "modules" can come in handy:
- very simply for doing impact assessment of life cycle stages
- for modeling alternative scenarios for certain life cycle stages (e.g. manufacture, transportation, product use, and disposal)
- for developing an LCA-based optimization model (e.g. linear programming)

<img src="docs/modules_and_modular_system.png"/>



Often a situation arises where there are several alternatives for successive processing steps. In such cases, many
alternatives can arise quickly. Imagine a wood home heating, where you can choose from 3 different suppliers and two
different wood sources each as well as four different stoves. There will be 3x2x4=24 different possible scenarios.

One of the more powerful aspects of this Modular LCA framework is that modules

The analogy of LCA modules are puzzle pieces, which can be arranged in different ways to reflect different variations
of the life cycle of products, or parts of supply or value chains.



# Installation #

# Example Notebook #

# Use within the Activity Browser #

    old version
    new version