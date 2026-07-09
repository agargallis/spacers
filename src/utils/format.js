const dateFmt = new Intl.DateTimeFormat('el-GR', {
  weekday: 'short',
  day: '2-digit',
  month: 'short',
});

const timeFmt = new Intl.DateTimeFormat('el-GR', {
  hour: '2-digit',
  minute: '2-digit',
});

const fullFmt = new Intl.DateTimeFormat('el-GR', {
  weekday: 'long',
  day: 'numeric',
  month: 'long',
});

export const formatDate = (iso) => dateFmt.format(new Date(iso));

/** Short numeric date, e.g. 1/7/26. */
export const formatShortDate = (iso) => {
  const d = new Date(iso);
  return `${d.getDate()}/${d.getMonth() + 1}/${String(d.getFullYear()).slice(2)}`;
};
export const formatTime = (iso) => timeFmt.format(new Date(iso));
export const formatFullDate = (iso) => fullFmt.format(new Date(iso));

/** Countdown parts from now to a target ISO datetime. */
export function getCountdown(targetIso, from = Date.now()) {
  const diff = Math.max(0, new Date(targetIso).getTime() - from);
  const totalSeconds = Math.floor(diff / 1000);
  return {
    done: diff === 0,
    days: Math.floor(totalSeconds / 86400),
    hours: Math.floor((totalSeconds % 86400) / 3600),
    minutes: Math.floor((totalSeconds % 3600) / 60),
    seconds: totalSeconds % 60,
  };
}

/** Initials for a fallback avatar/crest. */
export const initials = (name = '') =>
  name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0])
    .join('')
    .toUpperCase();
