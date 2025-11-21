const fs = require('fs');
const path = require('path');

class ScssToCssImporter {
    constructor() {
        // Path to SCSS entry file
        this.scssEntry = path.join(__dirname, '..', 'src', 'scss', '_simple-css.scss');

        // Output directory and file
        this.outputDir = path.join(__dirname, '..', 'dist', 'css');
        this.outputFile = path.join(this.outputDir, 'simple-css.import.css');
    }

    /* Create directory if missing */
    ensureOutputDirectory() {
        fs.mkdirSync(this.outputDir, { recursive: true });
    }

    /* Read the SCSS entry file */
    readScss() {
        return fs.readFileSync(this.scssEntry, 'utf8');
    }

    /* Extract all @use 'path' from SCSS */
    extractUsePaths(content) {
        const regex = /^\s*@use\s+['"](.+?)['"]\s*;/gm;
        const results = [];
        let match;

        while ((match = regex.exec(content)) !== null) {
            results.push(match[1]);
        }

        return results;
    }

    /* Convert paths → @import 'path.css' lines */
    buildImportLines(usePaths) {
        return usePaths.map(p => `@import '${p}.css';`).join('\n') + '\n';
    }

    /* Write final output file */
    writeOutputFile(content) {
        fs.writeFileSync(this.outputFile, content, 'utf8');
    }

    /* Main method */
    run() {
        this.ensureOutputDirectory();

        const scssContent = this.readScss();
        const usePaths = this.extractUsePaths(scssContent);
        const cssImports = this.buildImportLines(usePaths);

        this.writeOutputFile(cssImports);

        console.log('CSS import file generated:', path.relative(process.cwd(), this.outputFile));
    }
}

/* Execute */
new ScssToCssImporter().run();
