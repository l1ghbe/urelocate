import browserSyncModule from "browser-sync";
import { dest, src } from "gulp";
import concat from "gulp-concat";
import terser from "gulp-terser";
const browserSync = browserSyncModule.create();

export function scripts() {
  return src(["./src/js/index.js", "./src/js/telegram.js", "./src/js/popup.js"])
    .pipe(concat("index.min.js"))
    .pipe(terser())
    .pipe(dest("./src/js"))
    .pipe(browserSync.stream());
}
