# <img src="https://avatars.githubusercontent.com/u/89033420?s=200&v=4" height="26" /> darklord

> darklord ist a script for Adobe Illustrator that generates darkmode versions of your graphics based on a color mapping.

## Installation
1. Move the darklord.js file into the Illustrator folder where scripts are located. For example, on Mac OS X running Adobe Illustrator CC 2022, the path would be: // Adobe Illustrator CC 2022/Presets/en_US/Scripts/darklord-spiegel.js
2. Move the colormap file to the same directory.

## Caveats
- Appearences (like multi-strokes and effects) are ignored by the script since Illustrator's scripting API gives no access to these styles. If a path has multiple strokes or fills, only the bottom-most stroke/fill is recolored.
- Graphs are not recolored since a graph's color cannot be accessed via Illustrator's scripting API.
- Layer masks need to be applied manualy to the darkmode artwork. This will be fixed in a future version that will also mirror the document layer tree to a dark tree.
- Gradients are currently not retouched by the script.