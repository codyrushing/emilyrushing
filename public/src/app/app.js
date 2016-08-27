import PhotoSwipe from "photoswipe";
import gallery from "./components/gallery";

export default {
  init: function(){
    document.addEventListener("DOMContentLoaded", this.DOMReady.bind(this));
  },
  DOMReady: () => {
    gallery(".photo-gallery");
  }

}
