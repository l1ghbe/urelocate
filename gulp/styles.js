import browserSyncModule from "browser-sync";
import { dest, src } from "gulp";
import autoprefixer from "gulp-autoprefixer";
import concat from "gulp-concat";
import notify from "gulp-notify";
import plumber from "gulp-plumber";
import gulpSass from "gulp-sass";
import * as sass from "sass";

import { browserSync } from "../gulpfile.js";

const scss = gulpSass(sass);

export function styles() {
  return src("./src/scss/**/*.scss")
    .pipe(
      plumber({
        errorHandler: function (err) {
          notify.onError({
            title: "SCSS Error",
            message: "Error: <%= error.message %>",
          })(err);
          this.emit("end");
        },
      })
    )
    .pipe(concat("style.min.css"))
    .pipe(scss({ outputStyle: "compressed" }))
    .pipe(autoprefixer({ overrideBrowserslist: ["last 10 versions"] }))
    .pipe(dest("./src/css"))
    .pipe(browserSync.stream());
}
