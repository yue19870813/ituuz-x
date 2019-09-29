/** 打开view选项枚举 */
export enum OPEN_VIEW_OPTION {
    /** 固定UI层，与其它ui分开管理，需要设置zOrder */
    LAYER,
    /** 叠加在其他view上 */
    OVERLAY,
    /** 独立打开，关闭其他view */
    SINGLE
}