import puppeteer from 'puppeteer';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function generatePDF(htmlFile, pdfFile) {
    console.log(`Generating PDF for ${htmlFile}...`);
    const browser = await puppeteer.launch({
        executablePath: 'C:\\Program Files (x86)\\Microsoft\\Edge\\Application\\msedge.exe',
        args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    const page = await browser.newPage();
    const filePath = path.join(__dirname, htmlFile);
    await page.goto(`file://${filePath}`, { waitUntil: 'networkidle0' });
    
    // Wait for mermaid rendering
    await new Promise(r => setTimeout(r, 2000));

    await page.pdf({ path: path.join(__dirname, pdfFile), format: 'A4', printBackground: true });
    await browser.close();
    console.log(`Saved ${pdfFile}`);
}

async function main() {
    await generatePDF('system_architecture.html', 'system_architecture.pdf');
    await generatePDF('block_diagram.html', 'block_diagram.pdf');
}

main().catch(console.error);
