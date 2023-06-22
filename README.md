# <img src="https://avatars.githubusercontent.com/u/89033420?s=200&v=4" height="26" /> darklord

> darklord ist a script for Adobe Illustrator that generates darkmode versions of your graphics based on a color mapping.

## Installation
1. Move the darklord.js file into the Illustrator scripts directory. For example, on Mac OS X running Adobe Illustrator CC 2022, the path would be: // Adobe Illustrator CC 2022/Presets/en_US/Scripts/darklord.js
2. Create a custom color mapping by copying or adapting the darklord-colormap.json file from this repository.
3. Save the darklord-colormap.json file to the Illustrator scripts directory.
4. Restart Illustrator

## Caveats
- Appearences (like multi-strokes and effects) are ignored by the script since Illustrator's scripting API gives no access to these styles. If a path has multiple strokes or fills, only the bottom-most stroke/fill is recolored.
- Graphs are not recolored since a graph's color cannot be accessed via Illustrator's scripting API.
- Gradients are currently not retouched by the script.
- Clipping masks must be re-applied manually in the darkmode artwork.