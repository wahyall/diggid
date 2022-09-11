/**
 * @license Copyright (c) 2014-2022, CKSource Holding sp. z o.o. All rights reserved.
 * For licensing, see LICENSE.md or https://ckeditor.com/legal/ckeditor-oss-license
 */
import ClassicEditor from "@ckeditor/ckeditor5-editor-classic/src/classiceditor.js";
import Bold from "@ckeditor/ckeditor5-basic-styles/src/bold.js";
import CodeBlock from "@ckeditor/ckeditor5-code-block/src/codeblock.js";
import Essentials from "@ckeditor/ckeditor5-essentials/src/essentials.js";
import Heading from "@ckeditor/ckeditor5-heading/src/heading.js";
import Image from "@ckeditor/ckeditor5-image/src/image.js";
import ImageUpload from "@ckeditor/ckeditor5-image/src/imageupload.js";
import Indent from "@ckeditor/ckeditor5-indent/src/indent.js";
import Italic from "@ckeditor/ckeditor5-basic-styles/src/italic.js";
import Link from "@ckeditor/ckeditor5-link/src/link.js";
import List from "@ckeditor/ckeditor5-list/src/list.js";
import Paragraph from "@ckeditor/ckeditor5-paragraph/src/paragraph.js";
import SimpleUploadAdapter from "@ckeditor/ckeditor5-upload/src/adapters/simpleuploadadapter.js";
import Table from "@ckeditor/ckeditor5-table/src/table.js";
import ImageRemoveEventCallbackPlugin from "ckeditor5-image-remove-event-callback-plugin";

class Editor extends ClassicEditor {}

// Plugins to include in the build.
Editor.builtinPlugins = [
  Bold,
  CodeBlock,
  Essentials,
  Heading,
  Image,
  ImageUpload,
  Indent,
  Italic,
  Link,
  List,
  Paragraph,
  SimpleUploadAdapter,
  Table,
  ImageRemoveEventCallbackPlugin,
];

// Editor configuration.
Editor.defaultConfig = {
  toolbar: {
    items: [
      "heading",
      "|",
      "bold",
      "italic",
      "link",
      "bulletedList",
      "numberedList",
      "|",
      "outdent",
      "indent",
      "|",
      "imageUpload",
      "codeBlock",
      "insertTable",
      "undo",
      "redo",
    ],
  },
  language: "en",
};

export default Editor;
