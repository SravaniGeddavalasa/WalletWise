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

            // 1. Literal '$' before template interpolation: `$${` -> `₹${`
            if (content.includes('$${')) {
                content = content.replace(/\$\$\{/g, '₹${');
                modified = true;
            }

            // 2. String "$": prefix: "$" -> prefix: "₹"
            if (content.includes('prefix: "$"')) {
                content = content.replace(/prefix: "\$"/g, 'prefix: "₹"');
                modified = true;
            }

            // 3. String '$' in JSX: >$ -> >₹
            if (content.match(/>\s*\$/)) {
                content = content.replace(/>\s*\$/g, '>₹');
                modified = true;
            }

            // 4. Literal '$' followed by digits: $9.99 -> ₹9.99
            if (content.match(/\$(\d+)/)) {
                content = content.replace(/\$(\d+)/g, '₹$1');
                modified = true;
            }

            // 5. Replace "USD" with "INR"
            if (content.includes('USD')) {
                content = content.replace(/\bUSD\b/g, 'INR');
                modified = true;
            }

            // 6. Fix toLocaleString if used
            if (content.includes('.toLocaleString(undefined')) {
                content = content.replace(/\.toLocaleString\(undefined/g, ".toLocaleString('en-IN'");
                modified = true;
            }

            // 7. Fix strings like "Total Expenses ($)" -> "Total Expenses (₹)"
            if (content.includes('($)')) {
                content = content.replace(/\(\$\)/g, '(₹)');
                modified = true;
            }
            
            // 8. Fix "$ "
            if (content.includes('"$ "')) {
                content = content.replace(/"\$ "/g, '"₹ "');
                modified = true;
            }

            if (modified) {
                fs.writeFileSync(fullPath, content, 'utf8');
                console.log(`Updated ${fullPath}`);
            }
        }
    });
}

findAndReplace(directoryPath);
console.log('Currency replacement complete.');
