// 社内ドキュメントサイトのテストランナー
// このファイルはNode.jsで実行してテストを実行できます

// テストファイルを読み込み
const fs = require('fs');
const path = require('path');

// テストファイルを読み込んで実行
const testFilePath = path.join(__dirname, 'test', 'test_functionality.js');
const testCode = fs.readFileSync(testFilePath, 'utf8');

// 出力をキャプチャするためのモックコンソール
let testOutput = [];
const originalConsoleLog = console.log;
console.log = function(...args) {
    testOutput.push(args.join(' '));
    originalConsoleLog.apply(console, args);
};

try {
    // テストコードを実行
    eval(testCode);
    
    console.log('\n' + '='.repeat(50));
    console.log('🎉 すべてのテストが正常に完了しました！');
    console.log('GitHub Pagesのセットアップはデプロイ準備完了です。');
    console.log('='.repeat(50));
    
} catch (error) {
    console.error('❌ テスト実行に失敗しました:', error.message);
    process.exit(1);
}

// コンソールを復元
console.log = originalConsoleLog;