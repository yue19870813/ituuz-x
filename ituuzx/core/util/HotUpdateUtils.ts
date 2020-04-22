/** 热更新状态 */
export enum HotUpdateEnum {
    UP_TO_DATE,
    NEW_VERSION
}

/**
 * HotUpdateUtils:热更新工具类
 * @author ituuz
 */
export default class HotUpdateUtils {
    /** 版本号 */
    private static _versionCode: number = 0;
    /** 自定义版本文件内容 */
    private static _customManifestStr: string = "";
    /** 存储目录 */
    private static _storagePath: string = "";
    /** 搜素目录 */
    private static _searchPath: string = "";
    /** 热更资源管理类实例 jsb.AssetsManager */
    private static _am: any;
    /** 正在检查或者更新中 */
    private static _updating: boolean = false;

    /** 检查更新成功 */
    private static _checkSuccessCB: (status: HotUpdateEnum) => void;
    /** 检查更新失败 */
    private static _checkFailCB: () => void;
    /** 更新完成回调 */
    private static _finishedCB: (flag: boolean) => void;
    /** 更新进度 */
    private static _progressCB: (progress: number, total: number) => void;
    /** 更新失败次数 */
    private static _failCount: number = 0;
    /** 能否重试 */
    private static _canRetry: boolean = false;
    public static init(appName: string, versionCode: number, searchPath: string, customManifestStr: string): void {
        if (!cc.sys.isNative) {
            return;
        }
        HotUpdateUtils._customManifestStr = customManifestStr;
        HotUpdateUtils._versionCode = versionCode;
        HotUpdateUtils._searchPath = searchPath;
        // 设置存储目录
        HotUpdateUtils._storagePath = ((jsb.fileUtils ? jsb.fileUtils.getWritablePath() + searchPath + "/" : searchPath + "/it"));

        /** 版本对比接口 */
        let versionCompareHandle = (versionA, versionB) => {
            it.log("[hot_update] ===== ", HotUpdateUtils._versionCode, versionA, versionB);
            let va = HotUpdateUtils._versionCode;
            let vb = Number(versionB);
            if (vb > va) {
                return -1;
            }
            return 1;
        };

        // Init with empty manifest url for testing custom manifest
        // @ts-ignore
        HotUpdateUtils._am = new jsb.AssetsManager("", HotUpdateUtils._storagePath, versionCompareHandle);

        // Return true if the verification passed, otherwise return false
        HotUpdateUtils._am.setVerifyCallback((path, asset) => {
            // When asset is compressed, we don't need to check its md5, because zip file have been deleted.
            let compressed = asset.compressed;
            // Retrieve the correct md5 value.
            let expectedMD5 = asset.md5;
            // asset.path is relative path and path is absolute.
            let relativePath = asset.path;
            // The size of asset file, but this value could be absent.
            let size = asset.size;
            if (compressed) {
                it.log("[hot_update]Verification passed : ", relativePath);
                return true;
            } else {
                it.log("[hot_update]Verification passed :", relativePath, "(", expectedMD5, ")");
                return true;
            }
        });

        if (cc.sys.os === cc.sys.OS_ANDROID) {
            // Some Android device may slow down the download process when concurrent tasks is too much.
            this._am.setMaxConcurrentTask(2);
            it.log("[hot_update]Max concurrent tasks count have been limited to 2");
        }
        // 加载自定义的manifest文件
        // @ts-ignore
        if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
            // @ts-ignore
            let manifest = new jsb.Manifest(customManifestStr, this._storagePath);
            this._am.loadLocalManifest(manifest, this._storagePath);
            it.log("[hot_update]Using custom manifest");
        }
    }

    /** 检查更新 */
    public static checkUpdate(checkSuccessCB: (status: HotUpdateEnum) => void, checkFailCB: () => void,
                              progressCB: (progress: number, total: number) => void, finishedCB: (flag: boolean) => void): void {
        if (HotUpdateUtils._updating) {
            it.log("[hot_update]Checking or updating ...");
            return;
        }
        HotUpdateUtils._checkSuccessCB = checkSuccessCB;
        HotUpdateUtils._checkFailCB = checkFailCB;
        HotUpdateUtils._progressCB = progressCB;
        HotUpdateUtils._finishedCB = finishedCB;

        if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
            it.log("[hot_update]Failed to load local manifest ...");
            return;
        }
        HotUpdateUtils._am.setEventCallback(HotUpdateUtils.checkCb.bind(this));

        HotUpdateUtils._am.checkUpdate();
        HotUpdateUtils._updating = true;
    }

    /** 检查更新状态回调 */
    private static checkCb(event: any): void {
        it.log("[hot_update]Code: " + event.getEventCode());
        switch (event.getEventCode()) {
            // @ts-ignore
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                it.log("[hot_update]No local manifest file found, hot update skipped.");
                if (HotUpdateUtils._checkFailCB) { HotUpdateUtils._checkFailCB(); }
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            // @ts-ignore
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                it.log("[hot_update]Fail to download manifest file, hot update skipped2.");
                if (HotUpdateUtils._checkFailCB) { HotUpdateUtils._checkFailCB(); }
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                it.log("[hot_update]4:Already up to date with the latest remote version.");
                if (HotUpdateUtils._checkSuccessCB) { HotUpdateUtils._checkSuccessCB(HotUpdateEnum.UP_TO_DATE); }
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.NEW_VERSION_FOUND:
                it.log("[hot_update]New version found, please try to update.");
                if (HotUpdateUtils._checkSuccessCB) { HotUpdateUtils._checkSuccessCB(HotUpdateEnum.NEW_VERSION); }
                break;
            default:
                it.log("[hot_update] checkCb default");
                return;
        }
        // HotUpdateUtils._am.setEventCallback(null);
        HotUpdateUtils._updating = false;
    }

    /** 开始更新 */
    public static startHotUpdate(): void {
        it.log("[hot_update]start to hot update.");
        HotUpdateUtils._updating = false;
        it.log(HotUpdateUtils._am, HotUpdateUtils._updating);
        if (HotUpdateUtils._am && !HotUpdateUtils._updating) {
            HotUpdateUtils._am.setEventCallback(HotUpdateUtils.updateCb.bind(this));
            if (!this._am.getLocalManifest() || !this._am.getLocalManifest().isLoaded()) {
                // this.panel.info.string = 'Failed to load local manifest ...';
                it.log("[hot_update]===>>> Failed to load local manifest ...");
                return;
            }
            // @ts-ignore
            it.log("[hot_update]this._am.getState() = ", this._am.getState(), jsb.AssetsManager.State.UNINITED);
            // @ts-ignore
            if (this._am.getState() === jsb.AssetsManager.State.UNINITED) {
                // @ts-ignore
                let manifest = new jsb.Manifest(HotUpdateUtils._customManifestStr, this._storagePath);
                this._am.loadLocalManifest(manifest, this._storagePath);
                it.log("[hot_update]Using custom manifest");
            }

            it.log("[hot_update]start to hot update.....");
            HotUpdateUtils._failCount = 0;
            HotUpdateUtils._am.update();
            HotUpdateUtils._updating = true;
        }
    }

    /** 更新cb */
    private static updateCb(event): void {
        it.log("[hot_update]updateCb code === ", event.getEventCode());
        let needRestart = false;
        let failed = false;
        switch (event.getEventCode()) {
            // @ts-ignore
            case jsb.EventAssetsManager.ERROR_NO_LOCAL_MANIFEST:
                it.log("[hot_update]No local manifest file found, hot update skipped.");
                failed = true;
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.UPDATE_PROGRESSION:
                let loadFiles = event.getDownloadedFiles();
                let totalFiles = event.getTotalFiles();
                it.log("[hot_update]loadFiles = ", loadFiles, "totalFiles = ", totalFiles);
                if (HotUpdateUtils._progressCB) {
                    HotUpdateUtils._progressCB(loadFiles, totalFiles);
                }
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.ERROR_DOWNLOAD_MANIFEST:
            // @ts-ignore
            case jsb.EventAssetsManager.ERROR_PARSE_MANIFEST:
                it.log("[hot_update]Fail to download manifest file, hot update skipped1.");
                failed = true;
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.ALREADY_UP_TO_DATE:
                it.log("[hot_update]Already up to date with the latest remote version.");
                failed = true;
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.UPDATE_FINISHED:
                it.log("[hot_update]Update finished. " + event.getMessage());
                needRestart = true;
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.UPDATE_FAILED:
                it.log("[hot_update]Update failed. " + event.getMessage());
                HotUpdateUtils._updating = false;
                HotUpdateUtils._canRetry = true;
                failed = true;
                break;
            case jsb.EventAssetsManager.ERROR_UPDATING:
                it.log("[hot_update]Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.ERROR_UPDATING:
                it.log("[hot_update]Asset update error: " + event.getAssetId() + ", " + event.getMessage());
                break;
            // @ts-ignore
            case jsb.EventAssetsManager.ERROR_DECOMPRESS:
                it.log("[hot_update]" + event.getMessage());
                break;
            default:
                break;
        }
        // 更新失败
        if (failed) {
            HotUpdateUtils._am.setEventCallback(null);
            HotUpdateUtils._updating = false;
            if (HotUpdateUtils._finishedCB) {
                HotUpdateUtils._finishedCB(false);
            }
            return;
        }
        // 更新成功
        if (needRestart) {
            // @ts-ignore
            let searchPaths = jsb.fileUtils.getSearchPaths();
            let newPaths = this._am.getLocalManifest().getSearchPaths();
            it.log("[hot_update]updateCb newPaths =", JSON.stringify(newPaths));
            Array.prototype.unshift.apply(searchPaths, newPaths);
            it.log("[hot_update]updateCb newPaths2 =", JSON.stringify(searchPaths));
            cc.sys.localStorage.setItem(HotUpdateUtils._searchPath, JSON.stringify(searchPaths));
            jsb.fileUtils.setSearchPaths(searchPaths);
            if (HotUpdateUtils._finishedCB) {
                HotUpdateUtils._finishedCB(true);
            }
        }
        it.log("[hot_update]updateCb =", failed, needRestart);
    }
}
