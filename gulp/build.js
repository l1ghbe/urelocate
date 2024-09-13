import { dest, parallel, series, src, watch } from "gulp";
import clean from "gulp-clean";

function cleanDist() {
  return src("./build").pipe(clean());
}

function building() {
  return src(
    [
      "./src/assets/img/dist/**/*.*",
      "./src/assets/fonts/*.*",
      // "./src/assets/json/*.json",
      "./src/css/style.min.css",
      "./src/js/index.min.js",
      "./src/json/*.json",
      "./src/*.html",
      "!./src/pages/**/*.html",
      "!./src/components/**/*.html",
    ],
    { base: "./src", encoding: false }
  ).pipe(dest("./build"));
}

export const build = series(cleanDist, building);
