import { dest, series, src } from "gulp";
import clean from "gulp-clean";

function cleanDist() {
  return src("./build").pipe(clean());
}

function building() {
  return src(
    [
      "./src/assets/img/dist/**/*.*",
      "./src/assets/pdf/*.*",
      // "./src/assets/fonts/*.*",
      // "./src/assets/json/*.json",
      "./src/css/*.css",
      "./src/js/*.js",
      "./src/json/*.json",
      "./src/*.html",
      "!./src/pages/**/*.html",
      "!./src/components/**/*.html",
    ],
    { base: "./src", encoding: false }
  ).pipe(dest("./build"));
}

export const build = series(cleanDist, building);
