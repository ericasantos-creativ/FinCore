const fs = require('fs');
let html = fs.readFileSync('index.html', 'utf8');
const newHead = \<!DOCTYPE html>
<html lang="pt-BR" data-theme="dark">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover">
    <meta name="description" content="FinCore - Sistema completo de gestão financeira com múltiplas empresas, análises e relatórios.">
    <meta name="theme-color" content="#0B0E14">
    <meta name="mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-capable" content="yes">
    <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">
    <meta name="apple-mobile-web-app-title" content="FinCore">
    <link rel="manifest" href="manifest.json">
    <link rel="icon" type="image/svg+xml" href="assets/icons/favicon.svg">
    <title>FinCore - Sistema de Gestão Financeira</title>
    <!-- Original CSS (Mantido por compatibilidade com rotas) -->
    <link rel="stylesheet" href="assets/css/style.css?v=2">
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css">
    
    <!-- Tailwind & Fonts do Stitch -->
    <script src="https://cdn.tailwindcss.com?plugins=forms,container-queries"></script>
    <link href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@300;400;500;600;700&family=Sora:wght@300;400;600&display=swap" rel="stylesheet">
    <link href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:wght,FILL@100..700,0..1&display=swap" rel="stylesheet">
    <script id="tailwind-config">
        tailwind.config = {
            darkMode: 'class',
            theme: {
                extend: {
                    colors: {
                        slate: { 950: '#020617' },
                        blue: { 400: '#60a5fa', 500: '#3b82f6' }
                    },
                    fontFamily: {
                        'headline': ['Space Grotesk'],
                        'body': ['Space Grotesk'],
                        'label': ['Sora']
                    },
                    borderRadius: { 'DEFAULT': '0.25rem', 'lg': '0.5rem', 'xl': '0.75rem', 'full': '9999px' }
                }
            }
        }
    </script>
</head>\;

html = html.replace(/<!DOCTYPE html>[\s\S]*?<\/head>/, newHead);
fs.writeFileSync('index.html', html);
console.log('Head fixed and Tailwind appended!');
