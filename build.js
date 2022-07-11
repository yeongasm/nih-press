const { exec } = require('child_process');
exec("cd backend && tsc && cp -a dist/. ../release && cp -a keys/. ../release/keys && cp package.json ../release && cd ../frontend && npm run build && cp -a dist/. ../release/dist && cd ../release && touch access.log", (err, stdout, stderr) => {
    if (err) {
        console.error("Command error > ", err);
        return;
    }
    console.log(`stdout: ${stdout}`);
    console.error(`stderr: ${stderr}`);
});