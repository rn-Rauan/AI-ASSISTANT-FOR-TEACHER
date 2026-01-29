import fs from 'fs';
import path from 'path';

// Criar pasta dist/04-data se não existir
const destDir = path.join(__dirname, '04-data');
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

// Copiar arquivos JSON
const srcDir = path.join(__dirname, '..', 'src', '04-data');
const files = fs.readdirSync(srcDir);

files.forEach(file => {
    if (file.endsWith('.json')) {
        const src = path.join(srcDir, file);
        const dest = path.join(destDir, file);
        fs.copyFileSync(src, dest);
        console.log(`✓ Copiado: ${file}`);
    }
});

console.log('✅ Arquivos JSON copiados com sucesso!');
