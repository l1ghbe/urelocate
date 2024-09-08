import browserSyncModule from "browser-sync";
import { dest, src } from "gulp";
import include from "gulp-include";

const browserSync = browserSyncModule.create();

export function pages() {
  return src("./src/pages/**/*.html")
    .pipe(
      include({
        includePaths: "./src/components",
      })
    )
    .pipe(dest("./src"))
    .pipe(browserSync.stream());
}
