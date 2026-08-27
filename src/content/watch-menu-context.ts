export type PlayingVideoMenuClickFacts = {
  pathname: string;
  insideWatchMenu: boolean;
  dropdownTrigger: boolean;
};

export type PlayingVideoMetadataInput = {
  titleCandidates: string[];
  channelCandidates: string[];
  documentTitle: string;
};

export type PlayingVideoMetadata = {
  title: string;
  channel: string;
};

/** 再生ページの操作メニューを開くクリックだけを対象にする。 */
export function isPlayingVideoMenuClick(facts: PlayingVideoMenuClickFacts): boolean {
  return facts.pathname === '/watch' && facts.insideWatchMenu && facts.dropdownTrigger;
}

function firstNonEmpty(values: string[]): string {
  for (const value of values) {
    const trimmed = value.trim();
    if (trimmed) return trimmed;
  }
  return '';
}

/** DOMから収集した候補文字列を、再生中動画の登録情報へ正規化する。 */
export function resolvePlayingVideoMetadata(input: PlayingVideoMetadataInput): PlayingVideoMetadata | null {
  const fallbackTitle = input.documentTitle.replace(/ - YouTube$/, '').trim();
  const title = firstNonEmpty(input.titleCandidates) || (fallbackTitle === 'YouTube' ? '' : fallbackTitle);
  const channel = firstNonEmpty(input.channelCandidates);
  return title || channel ? { title, channel } : null;
}
