;(function(seajs) {
    if (seajs) {
        seajs.config({
            base: seajs.resolve('../', seajs.data.base) //让seajs的base路径为上一层
        });
    }
})(window.seajs);