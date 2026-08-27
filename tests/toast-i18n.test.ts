import test from 'node:test';
import assert from 'node:assert/strict';
import { t, type Lang } from '../src/shared/i18n';

const expected: Record<Lang, { registered: string; undo: string; playing: string }> = {
  ja: {
    registered: '🚫 「サンプル」をNG登録しました',
    undo: '元に戻す',
    playing: 'このブロックでは再生中の動画を停止しません',
  },
  en: {
    registered: '🚫 Added “Sample” to the block list',
    undo: 'Undo',
    playing: 'This block does not stop the currently playing video.',
  },
  de: {
    registered: '🚫 „Beispiel“ wurde zur Sperrliste hinzugefügt',
    undo: 'Rückgängig',
    playing: 'Diese Blockierung stoppt das aktuell wiedergegebene Video nicht.',
  },
  it: {
    registered: '🚫 “Esempio” è stato aggiunto all’elenco di blocco',
    undo: 'Annulla',
    playing: 'Questo blocco non interrompe il video attualmente in riproduzione.',
  },
  fr: {
    registered: '🚫 « Exemple » a été ajouté à la liste de blocage',
    undo: 'Annuler',
    playing: 'Ce blocage n’arrête pas la vidéo en cours de lecture.',
  },
  ko: {
    registered: '🚫 “샘플”을(를) 차단 목록에 추가했습니다',
    undo: '실행 취소',
    playing: '이 차단은 현재 재생 중인 동영상을 중지하지 않습니다.',
  },
  'zh-CN': {
    registered: '🚫 已将“示例”添加到屏蔽列表',
    undo: '撤销',
    playing: '此屏蔽不会停止当前正在播放的视频。',
  },
  'zh-TW': {
    registered: '🚫 已將「範例」加入封鎖清單',
    undo: '復原',
    playing: '此封鎖不會停止目前正在播放的影片。',
  },
};

test('toast text is complete and interpolated for every supported language', () => {
  const labels: Record<Lang, string> = {
    ja: 'サンプル', en: 'Sample', de: 'Beispiel', it: 'Esempio', fr: 'Exemple', ko: '샘플',
    'zh-CN': '示例', 'zh-TW': '範例',
  };

  for (const lang of Object.keys(expected) as Lang[]) {
    assert.equal(t('toast.registered', lang, { label: labels[lang] }), expected[lang].registered);
    assert.equal(t('toast.undo', lang), expected[lang].undo);
    assert.equal(t('toast.playingVideoContinues', lang), expected[lang].playing);
  }
});
