const fs = require('fs');
const { execSync } = require('child_process');
const procFileStr = `web: npm start\nrelease: npx prisma migrate deploy`;

function deployCommitMessage() {
    const characters = "0123456789abcdefghijklmnopqrstuvwxyz";
    let result = "";
    for (let i = 32; i > 0; --i) 
        result += characters[Math.round(Math.random() * (characters.length - 1))];
    return result;
}
// First two elements in process.argv is always the directory to node.exe & this script's directory.
// We can skip those.
const args = Array.from(process.argv).splice(2, process.argv.length - 2);
// List of command line arguments and their accepted values.
const commandLineArguments = { deploy: false, skipbuild: false, testprocfile: false };
const argsCallbacks = { 
    deploy: () => {
        execSync(`cd release && git add --all && git commit -a -m "${deployCommitMessage()}" && git push`);
    },
    testprocfile: () => {
        fs.writeFileSync("release/Procfile", procFileStr);
        const procfileStr = fs.readFileSync("release/Procfile");
        console.log(procfileStr);
    }
}
// Sanitize args against known arguments.
for (const arg of args) {
    // Some arguments will be assignable.
    const sections = arg.split("=");
    if (commandLineArguments[sections[0]] == undefined) {
        return console.error("Unknown argument supplied: ", sections[0]);
    }
}
for (const key in commandLineArguments) {
    commandLineArguments[key] = args.includes(key);
}
if (!commandLineArguments.skipbuild) {
    //Build backend.
    execSync("cd backend && npm run build && cp -a dist/. ../release && cp -a keys/. ../release/keys && cp -a prisma/migrations/. ../release/prisma/migrations && cp prisma/schema.prisma ../release/prisma");
    // Create package.json based on backend's.
    const package = JSON.parse(fs.readFileSync("backend/package.json"));
    
    package.name = "ygsm-site";
    package.main = "index.js";
    package.scripts = { start: "node index.js" };
    package.author = "ygsm";
    package.license = "MIT";
    
    if (!fs.existsSync("release/temp")) {
        fs.mkdirSync("release/temp");
        fs.writeFileSync("release/temp/.dummy", "This is here so it gets copped over to Heroku");
    }
    fs.writeFileSync("release/package.json", JSON.stringify(package));
    // Build frontend.
    execSync(`cd frontend && npm run build && cp -a dist/. ../release/dist`);
    // Create Procfile if it has yet to exist.
    if (!fs.existsSync("release/Procfile")) {
        fs.writeFileSync("release/Procfile", procFileStr);
    }
}
// Process command line arguments.
for (const key in commandLineArguments) {
    if (commandLineArguments[key] && argsCallbacks[key] != undefined) {
        argsCallbacks[key]();
    }
}