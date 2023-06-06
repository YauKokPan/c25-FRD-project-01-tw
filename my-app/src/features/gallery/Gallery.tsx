import React from "react";
import Title from "../title/Title";
import {UseGalleryInfo} from "../gallery/galleryAPI"

export default function Gallery() {
  const galleryInfo = UseGalleryInfo();

  return (
    <div>
      <Title mainTitle="相簿" />
      <div>
        
      </div>
    </div>
  );
}
