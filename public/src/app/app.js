import PhotoSwipe from "photoswipe";
import gallery from "./components/gallery";
import header from "./components/header";

export default {
  init: function(){
    document.addEventListener("DOMContentLoaded", this.DOMReady.bind(this));
  },
  DOMReady: () => {
    gallery(".photo-gallery");
    header();
  }
};
