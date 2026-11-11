# InfraCloud Tecnologia — site

Site estático (HTML + CSS + JS puro). Não precisa de build, banco nem PHP.

## Onde editar

| O que | Arquivo |
|---|---|
| WhatsApp, telefone, e-mail, endereço, horário, CNPJ | `js/config.js` |
| Textos das seções | `index.html` |
| Cores e fontes | `css/style.css` (topo do arquivo) |
| Logo e ícone | `assets/img/` |

## Publicar

Copie a pasta inteira (menos `.git`) para a raiz do site no servidor (ex.: `/var/www/infracloud`) e aponte o Nginx/Apache para ela. Ou use GitHub Pages: Settings → Pages → Branch `main` → `/root`.
