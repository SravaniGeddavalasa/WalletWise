const fs = require('fs');
const path = require('path');

const directoryPath = path.join(__dirname, 'src');

function findAndReplace(dir) {
    const files = fs.readdirSync(dir);

    files.forEach((file) => {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            findAndReplace(fullPath);
        } else if (fullPath.endsWith('.ts') || fullPath.endsWith('.tsx')) {
            let content = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            const regex = /₹\$\{([^}]+)\.toFixed\(\d+\)\}/g;
            if (content.match(regex)) {
                content = content.replace(regex, "₹${$1.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}");
                modified = true;
            }

            const regex2 = /\`₹\$\{([^}]+)\.toFixed\(\d+\)\}\`/g;
            if (content.match(regex2)) {
                content = content.replace(regex2, "\`₹${$1.toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}\`");
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath} with toLocaleString`);
            }
        }
    });
}

findAndReplace(directoryPath);
