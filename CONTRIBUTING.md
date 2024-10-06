# Contributing

Contributions are welcome.

To report bugs, request new features, or share your ideas, feel free to open [issues](https://github.com/ricktu288/ray-optics/issues) or [discussion](https://github.com/ricktu288/ray-optics/discussions).  You can also send an email to ray-optics@phydemo.app if you are not familiar with GitHub.

For direct contributions, see the following guidelines.

## Contributing items to the Gallery

**Method 1: By e-mail**

1. Save you work as a `.json` file using the "Save" button. If your work contains a background image (which can be loaded with "Open"), it should be in a separate file.
2. Send the files to ray-optics@phydemo.app. Include the title of your work, a description of your work (to show on the webpage), and your name to appear on the [list of contributors](https://phydemo.app/ray-optics/about).

**Method 2: Via GitHub** (preferred if you use GitHub)

1. Fork this repo and clone locally. If you have forked previously, sync to get the latest changes.

2. Add the JSON file in `src/webpages/gallery/` (follow the naming convention there).

3. If the work contains a background image, put it also in `gallery/`, and edit the `.json` file to include <code>backgroundImage": "<var>IMAGE_FILENAME</var>"</code>.

4. _(optional)_ Take a PNG screenshot with width 1140 (with the built-in File -> Export where you can set the width). It should contain all the tools, texts, and the relavent part of the simulation. Save it in `src/webpages/gallery/`, with the file name being the JSON file name with `.json` replaced by `.png`.

5. _(optional)_ Take a 250x250 PNG screenshot for the thumbnail. It does not need to contains everything in the simulation, but should contain at least some essential part. Save it in `src/webpages/gallery/`, with the file name being the JSON file name with `.json` replaced by `-thumbnail.png`.

5. _(optional)_ Edit `src/webpages/gallery/data.json` with a text editor. This file contains the structure of the gallery and the metadata for the items. The ID of an item is the JSON file name without the `.json`. If you replace an existing items, you can change the title but not the ID, and you should append you name in the list of contributors.

6. Commit your changes, push to your fork, and create a pull request.

## Contributing translations

You can submit a complete or partial translation for a new language, make progress to an incomplete language, or improve translation for an existing language. You don't need to understand the code to do the translation. Currently, the translation of the Gallery can only be done manually.
1. Download the target locale file:
   - German: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/de.json
   - Spanish: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/es.json
   - French: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/fr.json
   - Japanese: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/ja.json
   - Korean: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/ko.json
   - Dutch: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/nl.json
   - Polish: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/pl.json
   - Brazilian Portuguese: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/pt_BR.json
   - Russian: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/ru.json
   - Sinhala: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/si.json
   - Traditional Chinese: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/zh_TW.json
   - Simplified Chinese: https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/zh_CN.json
   - Template for a new language:  https://raw.githubusercontent.com/ricktu288/ray-optics/master/locales/template.json
   
   _NOTE: If it is indicated above (or in some PR) that some update for a language has been submitted but not yet merged, please wait until it is merged to avoid repeated translation._
2. Translate the phrase/sentence in the quotation after `"message":` to the target language. If you encounter `<` and `>`, leave the text between them untouched; `&amp;` means the "&" symbol; `\"` means a quote, and `&nbsp;` means an extra space.  If the translation of an item is completed, remove the line `"incomplete": true,`. For example,
```javascript
  "welcome": {
    "incomplete": true,
    "message": "<span style=\"font-size:22pt\">Welcome to Ray Optics Simulation</span><br>To add an optical component, select a tool and click the blank space.<br>To load an example, please <a href=\"https://phydemo.app/ray-optics/gallery/\">go to the Gallery page</a>."
  },
```
becomes (for Traditional Chinese)
```javascript
  "welcome": {
    "message": "<span style=\"font-size:22pt\">歡迎使用「線光學模擬」</span><br>若要加入光學元件，請選擇工具並點擊空白處。<br>若要載入範例，<a href=\"https://phydemo.app/ray-optics/gallery/\">請前往「作品集」頁面</a>。"
  },

```
After that, you can submit the translated file with either method below:

**Method 1: By e-mail**

3. Send the resulting file to ray-optics@phydemo.app. Include the name of the language and your name to appear on the [list of contributors](https://phydemo.app/ray-optics/about).

**Method 2: Via GitHub** (preferred if you use GitHub)

3. Fork this repo and clone locally. If you have forked previously, sync to get the latest changes.

4. Save/replace the file as <code><var>LOCALE_ID</var>.json</code> in `locales/`.
5. _(optional)_ If it is a new language, modify the locale list in `locales/sync.js`.
6. _(optional)_ Add/modify the translation of the welcome messages in `src/simulator/index.html`.
7. _(optional)_ Add/modify <code>src/webpages/<var>LOCALE_ID</var>/index.html</code>.
8. _(optional)_ Add/modify the language-related metadata and the language dropdowns of the homepages in all locales and the simulator for the new locale.
9. Commit your changes, push to your fork, and create a pull request.

## Contributing modules

See Tools -> Others -> Import Modules for more information about modules. See [this tutorial](https://phydemo.app/ray-optics/modules/tutorial) for how to create a new module.

**Method 1: By e-mail**

1. Save you scene with the new module as a `.json` file using the "Save" button.
2. Send the files to ray-optics@phydemo.app. Include the title of your module, a description of your module, and your name to appear on the [list of contributors](https://phydemo.app/ray-optics/about).

**Method 2: Via GitHub** (preferred if you use GitHub)

1. Fork this repo and clone locally. If you have forked previously, sync to get the latest changes.

2. Add the JSON file in `src/webpages/modules/` (follow the naming convention there).

3. _(optional)_ Take a PNG screenshot for the thumbnail.

4. _(optional)_ Edit `src/webpages/modules/data.json` with a text editor. This file contains the metadata for all the modules. The ID of an item is the JSON file name without the `.json`. If you replace an existing items, you can change the title but not the ID, and you should append you name in the list of contributors.

5. Commit your changes, push to your fork, and create a pull request.

## More contributions

Such as creating a new tool, adding a new parameter to a tool, adding a new mode of viewing light, etc. For significant changes such as a new framework or a new toolbar design, please open a new discussion first.

See the [installation instructions](https://github.com/ricktu288/ray-optics/blob/master/README.md#installation) for how to set up the project locally.

### Requirements on compatibility

If you modified some existing tools/components, make sure that the following are satisfied:

1. If a file is saved before the modification, it should be readable by the app after the modification, with the logic unmodified.
2. After opening such a file, the appearance within the canvas when none of the objects are selected and the mouse is not over any object should be essentially the same as before the modification (except for quality improvement and bug fixing.)
3. If the default appearance of a tool (the appearance of an object newly created with the tool, without selection or mouse hovering) is modified, there should be a way to recover the original appearance, such as with a checkbox in the object bar.

For a feature marked as "beta" and for parameters outside the range of the sliders, 2. and 3. do not apply.
