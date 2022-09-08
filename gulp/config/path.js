import  src from "gulp";
import * as nodePath from "path";
const rootFolder = nodePath.basename(nodePath.resolve());


const buildFolder = "./dist";
const srcFolder = "./src";

export const path = {
    build : {
        js :`${buildFolder}/js/`,
        css : `${buildFolder}/css/`,
        html: `${buildFolder}/`,
        images:`${buildFolder}/img`,
        files :`${buildFolder}/files/`,
        fonts :`${buildFolder}/fonts`
    },
    src : {
        js    :`${srcFolder}/js/app.js`,
        images:`${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp}`,
        svg   :`${srcFolder}/img/**/*.svg`,
        scss  :`${srcFolder}/scss/style.scss`,
        html  :`${srcFolder}/*.html`,
        files :`${srcFolder}/files/**/*.*`,
		fonts :`${srcFolder}/fonts`
    },
    watch : {
        js :`${srcFolder}/js/**/*.js`,
        images:`${srcFolder}/img/**/*.{jpg,jpeg,png,gif,webp,svg,ico}`,
        html:`${srcFolder}/**/*.html`,
        files:`${srcFolder}/files/**/*.*`,
        scss:`${srcFolder}/scss/**/*.scss`
    },
    clean : buildFolder,
    buildFolder : buildFolder,
    srcFolder : srcFolder,
    rootFolder : rootFolder,
    ftp:""
}
