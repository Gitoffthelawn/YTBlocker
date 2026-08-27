import test from 'node:test';
import assert from 'node:assert/strict';
import {
  isPlayingVideoMenuClick,
  resolvePlayingVideoMetadata,
} from '../src/content/watch-menu-context';

test('watch URL and a legacy playback action dropdown are both required', () => {
  assert.equal(isPlayingVideoMenuClick({
    pathname: '/watch',
    insideWatchMenu: true,
    dropdownTrigger: true,
    directMenuButton: false,
  }), true);

  assert.equal(isPlayingVideoMenuClick({
    pathname: '/',
    insideWatchMenu: true,
    dropdownTrigger: true,
    directMenuButton: false,
  }), false);
  assert.equal(isPlayingVideoMenuClick({
    pathname: '/results',
    insideWatchMenu: true,
    dropdownTrigger: true,
    directMenuButton: false,
  }), false);
  assert.equal(isPlayingVideoMenuClick({
    pathname: '/shorts/example',
    insideWatchMenu: true,
    dropdownTrigger: true,
    directMenuButton: false,
  }), false);
  assert.equal(isPlayingVideoMenuClick({
    pathname: '/watch',
    insideWatchMenu: false,
    dropdownTrigger: true,
    directMenuButton: false,
  }), false);
  assert.equal(isPlayingVideoMenuClick({
    pathname: '/watch',
    insideWatchMenu: true,
    dropdownTrigger: false,
    directMenuButton: false,
  }), false);
});

test('watch page accepts the new direct yt-button-shape menu button without legacy markers', () => {
  assert.equal(isPlayingVideoMenuClick({
    pathname: '/watch',
    insideWatchMenu: true,
    dropdownTrigger: false,
    directMenuButton: true,
  }), true);
});

test('playing-video metadata uses the first non-empty DOM candidates', () => {
  assert.deepEqual(resolvePlayingVideoMetadata({
    titleCandidates: ['', '  Current video title  ', 'Old title'],
    channelCandidates: ['  Current channel  ', 'Old channel'],
    documentTitle: 'Fallback title - YouTube',
  }), {
    title: 'Current video title',
    channel: 'Current channel',
  });
});

test('document title is only a title fallback and empty metadata is rejected', () => {
  assert.deepEqual(resolvePlayingVideoMetadata({
    titleCandidates: [],
    channelCandidates: ['Channel only'],
    documentTitle: 'Fallback title - YouTube',
  }), {
    title: 'Fallback title',
    channel: 'Channel only',
  });

  assert.equal(resolvePlayingVideoMetadata({
    titleCandidates: [],
    channelCandidates: [],
    documentTitle: 'YouTube',
  }), null);
});
