import browserSyncModule from "browser-sync";
import { dest, src } from "gulp";
import concat from "gulp-concat";
// import plumber from "gulp-plumber";
import terser from "gulp-terser";
const browserSync = browserSyncModule.create();

export function scripts() {
  return (
    src(["./src/js/index.js", "./src/js/telegram.js"])
      // .pipe(
      //   plumber({
      //     errorHandler: function (err) {
      //       notify.onError({
      //         title: "JS Error",
      //         message: "Error: <%= error.message %>",
      //       })(err);
      //       this.emit("end");
      //     },
      //   })
      // )
      .pipe(concat("index.min.js"))
      .pipe(terser())
      .pipe(dest("./src/js"))
      .pipe(browserSync.stream())
  );
}
