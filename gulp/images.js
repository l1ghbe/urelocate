import { dest, series, src } from "gulp";
import avif from "gulp-avif";
import imagemin from "gulp-imagemin";
import newer from "gulp-newer";
import webp from "gulp-webp";

function avifConversion() {
  return src(
    ["./src/assets/img/src/**/*.*", "!./src/assets/img/src/**/*.{svg, webp}"],
    { encoding: false }
  )
    .pipe(newer("./src/assets/img/dist"))
    .pipe(avif({ quality: 50 }))
    .pipe(dest("./src/assets/img/dist"));
}

function webpConversion() {
  return src(
    ["./src/assets/img/src/**/*.*", "!./src/assets/img/src/**/*.{svg}"],
    { encoding: false }
  )
    .pipe(newer("./src/assets/img/dist"))
    .pipe(webp())
    .pipe(dest("./src/assets/img/dist"));
}

function optimizeImages() {
  return src(
    ["./src/assets/img/src/**/*.*", "!./src/assets/img/src/**/*.{svg}"],
    { encoding: false }
  )
    .pipe(newer("./src/assets/img/dist"))
    .pipe(imagemin())
    .pipe(dest("./src/assets/img/dist"));
}

// export const images = series(avifConversion, webpConversion, optimizeImages);
export const images = series(webpConversion, optimizeImages);
