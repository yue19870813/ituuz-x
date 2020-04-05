/**
 * 音频工具类
 * @author ituuz
 * @description 主要负责音乐、音效的播放、暂停和停止逻辑，包括缓存。
 */

/** 音频类型枚举 */
export enum MusicType {
    SOUND,  // 音效
    MUSIC,  // 音乐
    LOOP_SOUND     // 循环音效
}

/** 音频工具类 */
export default class AudioUtil {
    /** 背景音乐缓存池 */
    private static _musicPool: Map<string, __AudioSource> = new Map<string, __AudioSource>();
    /** 音效缓存池 */
    private static _soundPool: Map<string, __AudioSource[]> = new Map<string, __AudioSource[]>();
    /** 循环音效 */
    private static _loopSoundPool: Map<string, __AudioSource> = new Map<string, __AudioSource>();
    /** 当前背景音乐 */
    private static _curMusic: __AudioSource;
    /** 当前音效 */
    private static _curSound: string = "";
    /** 上次播放音效时间 */
    private static _lastSoundTime: number = 0;
    /** 是否暂停所有音效 */
    private static _pauseFlag: boolean = false;
    /** 当前音频状态级别，数字越大越高 配合_pauseFlag判断 */
    private static _level: number = 0;

    /**
     * 播放音效
     * @param {string} path 音效资源
     */
    public static playEffect(path: string): void {
        if (AudioUtil._pauseFlag) { return; }
        let curTime = new Date().getTime();
        if (path === AudioUtil._curSound) {
            let tempTime = curTime - AudioUtil._lastSoundTime;
            if (tempTime < 50) {
                return;
            }
        }
        AudioUtil._curSound = path;
        AudioUtil._lastSoundTime = curTime;
        let source = AudioUtil.getEffectFromPool(path);
        if (source) {
            source.play(false);
        } else {
            source = new __AudioSource(path, MusicType.SOUND);
            AudioUtil.addEffectToPool(path, source);
            source.play(false);
        }
    }

    /** 暂停音效 */
    public static stopEffect(): void {
        AudioUtil._soundPool.forEach((value: __AudioSource[], key: string, map) => {
            if (value) {
                for (let source of value) {
                    source.stop();
                }
            }
        });
    }

    /** 播放循环音效 */
    public static playLoopEffect(path: string): void {
        if (AudioUtil._pauseFlag) { return; }
        let source = AudioUtil._loopSoundPool.get(path);
        if (!source) {
            source = new __AudioSource(path, MusicType.LOOP_SOUND);
            AudioUtil._loopSoundPool.set(path, source);
            source.play(true);
        }
    }

    /** 暂停循环音效 */
    public static stopLoopEffect(path: string): void {
        let source = AudioUtil._loopSoundPool.get(path);
        if (source) {
            source.destroy();
            AudioUtil._loopSoundPool.delete(path);
        }
    }

    /**
     * 播放音效
     * @param {string} path 播放背景音乐
     */
    public static playMusic(path: string): void {
        if (AudioUtil._pauseFlag) { return; }
        if (AudioUtil._curMusic) {
            AudioUtil._curMusic.stop();
        }
        let source = AudioUtil._musicPool.get(path);
        if (source) {
            source.play(true);
        } else {
            source = new __AudioSource(path, MusicType.MUSIC);
            AudioUtil._musicPool.set(path, source);
            source.play(true);
        }
        AudioUtil._curMusic = source;
    }

    /** 暂停音效 */
    public static stopMusic(): void {
        if (AudioUtil._curMusic) {
            AudioUtil._curMusic.stop();
        }
    }

    /** 从音效对象池获取对象 */
    public static getEffectFromPool(path: string): __AudioSource {
        let list = AudioUtil._soundPool.get(path);
        if (list) {
            for (let source of list) {
                if (!source.isPlaying()) {
                    return source;
                }
            }
        }
        return null;
    }

    /** 像音效对象池添加对象 */
    public static addEffectToPool(path: string, source: __AudioSource): void {
        let list = AudioUtil._soundPool.get(path);
        if (list) {
            list.push(source);
        } else {
            list = [];
            list.push(source);
            AudioUtil._soundPool.set(path, list);
        }
    }

    /**
     * 设置暂停所有音效标志
     * @param {boolean} flag 标志 true-暂停  false-恢复
     * @param {number} level 设置状态级别，数字越大级别越高，高级别逻辑覆盖低级别，低级别不能覆盖高级别。
     */
    public static setPauseFlag(flag: boolean, level: number = 0): void {
        AudioUtil._level = level;
        AudioUtil._pauseFlag = flag;
        if (flag) {
            if (AudioUtil._curMusic) { AudioUtil._curMusic.pause(); }
            AudioUtil.pauseLoopEffects();
        } else {
            if (AudioUtil._curMusic) { AudioUtil._curMusic.resume(); }
            AudioUtil.resumeLoopEffects();
        }
    }

    /** 暂停所有循环音效 */
    public static pauseLoopEffects(): void {
        AudioUtil._loopSoundPool.forEach((v: __AudioSource, key: string) => {
            v.pause();
        });
    }

    /** 恢复所有循环音效 */
    public static resumeLoopEffects(): void {
        AudioUtil._loopSoundPool.forEach((v: __AudioSource, key: string) => {
            v.resume();
        });
    }
}

// tslint:disable-next-line: class-name
class __AudioSource {
    // 是否加载完成
    private _loaded: boolean = false;
    // 音频资源
    private _audioSource: cc.AudioSource = new cc.AudioSource();
    // 音频路径
    private _path: string = "";
    // 音频类型
    private _musicType: MusicType;
    // 是否已被暂停
    private _isStop: boolean;

    public constructor(path: string, type: MusicType) {
        this._path = path;
        this._musicType = type;
    }

    /**
     * 音频加载接口
     * @param {() => void} cb 加载完成回调
     */
    private loadRes(cb: () => void): void {
        if (!this._loaded) {
            it.loader.loadRes(this._path, cc.AudioClip, (err: any, res: cc.AudioClip) => {
                if (err) {
                    it.warn("音频资源加载出错:", this._path);
                } else {
                    this._audioSource.clip = res;
                    this._loaded = true;
                    if (cb) { cb(); }
                }
            });
        }
    }

    public play(isLoop?: boolean): void {
        this._isStop = false;
        if (this._loaded) {
            this._audioSource.loop = isLoop;
            this._audioSource.play();
        } else {
            this.loadRes(() => {
                if (!this._isStop) {
                    this.play(isLoop);
                }
            });
        }
    }

    public isPlaying(): boolean {
        return this._audioSource.isPlaying;
    }

    public stop(): void {
        this._isStop = true;
        if (this._loaded) {
            this._audioSource.stop();
        }
    }

    public pause(): void {
        if (this._loaded) {
            this._audioSource.pause();
        }
    }

    public resume(): void {
        if (this._loaded) {
            this._audioSource.resume();
        }
    }

    public destroy(): void {
        this._audioSource.stop();
        this._audioSource = null;
    }
}


// 将接口导出
// tslint:disable-next-line: no-unused-expression
(window as any).it || ((window as any).it = {});
(window as any).it.AudioUtil = AudioUtil;
