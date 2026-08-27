import type { BlockEntry, BlockLog } from '../shared/types';

export const PLAYING_VIDEO_NOTICE = 'このブロックでは再生中の動画を停止しません';

type PlayingVideoBlockInput = {
  target: 'video' | 'channel';
  value: string;
  title: string;
  channel: string;
  createdAt?: number;
  onAdded: () => void;
};

type PlayingVideoBlockDependencies = {
  generateId: () => string;
  addEntry: (entry: BlockEntry) => Promise<void>;
  addLogs: (logs: BlockLog[]) => Promise<void>;
  showToast: (label: string, entryId: string, secondLine?: string) => void;
};

/**
 * 再生中動画用の保存処理を生成する。カード要素や非表示関数は依存関係として受け取らない。
 */
export function createPlayingVideoBlockSaver(deps: PlayingVideoBlockDependencies) {
  return async (input: PlayingVideoBlockInput): Promise<void> => {
    const id = deps.generateId();
    const createdAt = input.createdAt ?? Date.now();
    await deps.addEntry({
      id,
      target: input.target,
      matchType: 'exact',
      value: input.value,
      createdAt,
    });
    await deps.addLogs([{
      videoTitle: input.title,
      channelName: input.channel,
      matchedValue: input.value,
      blockedAt: createdAt,
    }]);
    input.onAdded();
    deps.showToast(input.value, id, PLAYING_VIDEO_NOTICE);
  };
}
