import replace from "gulp-replace"; //поиск и замена
import plumber from "gulp-plumber"; //обработка ошибок
import notify from "gulp-notify"; //сообщения (подсказки)
import browsersync from "browser-sync"; //локальный сервер
import newer from "gulp-newer";
import ifPlugin from "gulp-if";

export const plugins = {
    replace : replace,
    plumber : plumber,
    notify : notify,
    browsersync: browsersync,
    newer:newer,
    if: ifPlugin
}