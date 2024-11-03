import { parallel, watch } from "gulp";

import browserSyncModule from "browser-sync";
import { build } from "./gulp/build.js";
import { fonts } from "./gulp/fonts.js";
import { images } from "./gulp/images.js";
import { pages } from "./gulp/pages.js";
import { scripts } from "./gulp/scripts.js";
import { styles } from "./gulp/styles.js";

export const browserSync = browserSyncModule.create();

function watching() {
  browserSync.init({
    server: {
      baseDir: "./src",
    },
  });
  watch(["./src/assets/img/src"], images);
  watch(["./src/components/**/*.html", "./src/pages/**/*.html"], pages);
  watch(["./src/scss/**/*.scss"], styles);
  watch(["./src/js/index.js"], scripts);
  watch(["./src/js/telegram.js"], scripts);
  watch(["./src/**/*.html"]).on("change", browserSync.reload);
}

export { build, fonts, images, pages, scripts, styles, watching };

export default parallel(styles, scripts, watching);
