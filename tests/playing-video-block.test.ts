import test from 'node:test';
import assert from 'node:assert/strict';
import {
  createPlayingVideoBlockSaver,
} from '../src/content/playing-video-block';

test('playing-video save stores and logs without accepting a card or hide dependency', async () => {
  const calls: unknown[] = [];
  const save = createPlayingVideoBlockSaver({
    generateId: () => 'entry-1',
    addEntry: async (entry) => { calls.push(['entry', entry]); },
    addLogs: async (logs) => { calls.push(['logs', logs]); },
    showToast: (label, entryId, lang, secondLine) => {
      calls.push(['toast', label, entryId, lang, secondLine]);
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
    lang: 'ja',
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
    ['toast', 'Current video title', 'entry-1', 'ja', 'このブロックでは再生中の動画を停止しません'],
  ]);
  assert.equal(refreshCount, 1);
});
