import { dest, src } from "gulp";
import fonter from "gulp-fonter";
import ttf2woff2 from "gulp-ttf2woff2";

export function fonts() {
  return src("./src/assets/fonts/src/*.*")
    .pipe(
      fonter({
        formats: ["woff", "ttf"],
      })
    )
    .pipe(dest("./src/assets/fonts"))
    .pipe(ttf2woff2())
    .pipe(dest("./src/assets/fonts"));
}
