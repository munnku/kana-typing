// Plays a completion sound using the Windows beep API via PowerShell
import { execSync } from 'child_process';

const beepScript = `
[console]::beep(880, 200);
[console]::beep(1046, 200);
[console]::beep(1318, 400);
`;

try {
  execSync(`powershell -Command "${beepScript.replace(/\n/g, ' ')}"`, { stdio: 'ignore' });
  console.log('\n🎵 完了！開発サイクルが終了しました。');
} catch {
  console.log('\n✅ 完了！開発サイクルが終了しました。');
}
