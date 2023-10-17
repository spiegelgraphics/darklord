# <img src="https://avatars.githubusercontent.com/u/89033420?s=200&v=4" height="26" /> darklord

> darklord ist a script for Adobe Illustrator that generates darkmode versions of your graphics based on a color mapping.

## Installation
1. Move the darklord.js file into the Illustrator scripts directory. For example, on Mac OS X running Adobe Illustrator CC 2022, the path would be: // Adobe Illustrator CC 2022/Presets/en_US/Scripts/darklord.js
2. Create a custom color mapping by copying and adapting the darklord-colormap.json file from this repository.
3. Save the darklord-colormap.json file to the Illustrator scripts directory.
4. Restart Illustrator

## Settings
There are several options to customize the script's behavior. darklord will read these settings from the [ai2html settings text block](http://ai2html.org/#special-text-blocks).
* **background_layer_name**
    * The name of the layer containing the rectangle for the dark background
    * *Possible values:* *`any string`*
    * *Default:* `darklord_bg`
* **darkmode_ab_prefix**
    * A string that the generated darkmode artboards will be prefixed with
    * *Possible values:* *`any string`*
    * *Default:* `dark-`
* **darkmode_background**
    * A hex color code to set the color of the generated darkmode artwork's background
    * *Possible values:* `#RRGGBB | #RGB`
    * *Default:* `#1F1E1C`
* **dynamic_colors**
    * A boolean value specifying whether a color should be changed by a 180-degree hue rotation when no matching color is found in the mapping
    * *Possible values:* `true | false`
    * *Default:* `false`
* **show_completion_dialog_box**
    * A boolean value specifying whether a completion message will be displayed after script execution
    * *Possible values:* `true | false`
    * *Default:* `true`
* **tolerance**
    * A number indicating up to which degree of perceived visual deviation a color should be matched with a color from the mapping.
    * *Possible values:* *`any floating point number between 0 and 100`*
    * *Default:* `3`

The tolerance value refers to the CIE Delta E 101 algorithm ([learn more](http://zschuessler.github.io/DeltaE/learn/)), which calculates a value between 0 and 100 indicating the perceived difference between two colors.
| Delta E     | Color difference                      |
|-------------|---------------------------------------|
| <= 1.0      | Not perceptible by human eyes         |
| >1.0 - 2.0  | Perceptible through close observation |
| >2.0 - 10.0 | Perceptible at a glance               |
| >10         | Perceived differently                 |

## Caveats
* Appearences (like multi-strokes and effects) are ignored by the script since Illustrator's scripting API gives no access to these styles. If a path has multiple strokes or fills, only the bottom-most stroke/fill is recolored.
* Graphs are not recolored since a graph's color cannot be accessed via Illustrator's scripting API.
* Gradients are currently not retouched by the script.
* Clipping masks must be re-applied manually in the darkmode artwork.

## Thanks
Special thanks to Jakob Bauer / ZEIT ONLINE, Markus Ekholm, Sergey Osokin. Also thanks to Archie Tse and the other ai2html contributors at The New York Times Graphics Desk.

---

Created by [Ferdinand Kuchlmayr](https://www.linkedin.com/in/kuchlmayr/) / [DER SPIEGEL](https://github.com/spiegelgraphics)

Copyright &copy; 2022-2023 SPIEGEL Verlag Rudolf Augstein GmbH & Co. KG