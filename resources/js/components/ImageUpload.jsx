import React, { memo } from "react";

import { FilePond, registerPlugin } from "react-filepond";
import "filepond/dist/filepond.min.css";

import FilePondPluginImageExifOrientation from "filepond-plugin-image-exif-orientation";
import FilePondPluginImagePreview from "filepond-plugin-image-preview";
import "filepond-plugin-image-preview/dist/filepond-plugin-image-preview.css";

registerPlugin(FilePondPluginImageExifOrientation, FilePondPluginImagePreview);

function ImageUpload({
  allowMultiple = false,
  onChange,
  files,
  required = false,
  labelIdle = 'Drag & Drop your files or <span class="filepond--label-action">Browse</span>',
}) {
  return (
    <FilePond
      files={files}
      onupdatefiles={onChange}
      allowMultiple={allowMultiple}
      labelIdle={labelIdle}
      required={required}
    />
  );
}

export default memo(ImageUpload);
