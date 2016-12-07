/**
 * 日期语义化
 * @param  {String || Number} time 合法的时间或时间戳
 * @return {String}      语义化时间
 */
export default function(time) {
    let stamp = new Date(time);
    let now = new Date();
    let timezoneOffset = now.getTimezoneOffset() * 60 * 1000;
    let stampTime = +stamp + timezoneOffset; // UTC -> 本地时间
    let disparity = Math.ceil((stampTime - now) / 1000); // 时间差，s

    const YEAR_SECONDS = 365 * 24 * 60 * 60;
    const MOUNTH_SECONDS = 30 * 24 * 60 * 60;
    const DAY_SECONDS = 24 * 60 * 60;
    const HOUR_SECONDS = 60 * 60;

    let timeObj = {
        years: parseInt(disparity / YEAR_SECONDS),
        mounths: parseInt(disparity % YEAR_SECONDS / MOUNTH_SECONDS),
        days: parseInt(disparity % YEAR_SECONDS % MOUNTH_SECONDS / DAY_SECONDS),
        hours: parseInt(disparity % YEAR_SECONDS % MOUNTH_SECONDS % DAY_SECONDS / HOUR_SECONDS),
        minutes: parseInt(disparity % YEAR_SECONDS % MOUNTH_SECONDS % DAY_SECONDS % HOUR_SECONDS / 60),
        seconds: parseInt(disparity % YEAR_SECONDS % MOUNTH_SECONDS % DAY_SECONDS % HOUR_SECONDS % 60)
    }

    let semantic = ''

    switch (true) {
        // 以前
        case timeObj.years < 0:
            semantic = Math.abs(timeObj.years) + '年前';
            break;
        case timeObj.mounths < 0:
            semantic = Math.abs(timeObj.mounths) + '月前';
            break;
        case timeObj.days < 0:
            semantic = Math.abs(timeObj.days) + '天前';
            break;
        case timeObj.hours < 0:
            semantic = Math.abs(timeObj.hours) + '小时前';
            break;
        case timeObj.minutes < 0:
            semantic = Math.abs(timeObj.minutes) + '分钟前';
            break;
        case timeObj.seconds < 0:
            semantic = Math.abs(timeObj.seconds) + '秒前';
            break;
            // 以后
        case timeObj.years > 0:
            semantic = Math.abs(timeObj.years) + '年后';
            break;
        case timeObj.mounths > 0:
            semantic = Math.abs(timeObj.mounths) + '月后';
            break;
        case timeObj.days > 0:
            semantic = Math.abs(timeObj.days) + '天后';
            break;
        case timeObj.hours > 0:
            semantic = Math.abs(timeObj.hours) + '小时后';
            break;
        case timeObj.minutes > 0:
            semantic = Math.abs(timeObj.minutes) + '分钟后';
            break;
        case timeObj.seconds > 0:
            semantic = Math.abs(timeObj.seconds) + '秒后';
            break;
        default:
            semantic = '';
            break;
    }
    return semantic;
}
