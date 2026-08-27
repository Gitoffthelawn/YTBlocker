import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPlayingVideoBlockSaver,
  PLAYING_VIDEO_NOTICE,
} from '../src/content/playing-video-block';

test('playing-video save stores and logs without accepting a card or hide dependency', async () => {
  const calls: unknown[] = [];
  const save = createPlayingVideoBlockSaver({
    generateId: () => 'entry-1',
    addEntry: async (entry) => { calls.push(['entry', entry]); },
    addLogs: async (logs) => { calls.push(['logs', logs]); },
    showToast: (label, entryId, secondLine) => {
      calls.push(['toast', label, entryId, secondLine]);
    },
  });
  let refreshCount = 0;

  await save({
    target: 'video',
    value: 'Current video title',
    title: 'Current video title',
    channel: 'Current channel',
    createdAt: 1234,
    onAdded: () => { refreshCount++; },
  });

  assert.deepEqual(calls, [
    ['entry', {
      id: 'entry-1',
      target: 'video',
      matchType: 'exact',
      value: 'Current video title',
      createdAt: 1234,
    }],
    ['logs', [{
      videoTitle: 'Current video title',
      channelName: 'Current channel',
      matchedValue: 'Current video title',
      blockedAt: 1234,
    }]],
    ['toast', 'Current video title', 'entry-1', PLAYING_VIDEO_NOTICE],
  ]);
  assert.equal(refreshCount, 1);
  assert.equal(PLAYING_VIDEO_NOTICE, 'このブロックでは再生中の動画を停止しません');
});
