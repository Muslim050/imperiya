# Service tiles

Drop a JPG/PNG/WEBP per service here. The Services component reads the
path from `SERVICE_IMG` in `components/sections/Services.tsx`.

| Service                                   | File                |
|-------------------------------------------|---------------------|
| Фасадные системы                          | `facade.jpg`        |
| Ролл ставни                               | `shutters.jpg`      |
| Регулировка и замена стеклопакетов        | `adjustment.png`    |
| Душевые кабинки                           | `shower.jpg`        |
| Раздвижные двери                          | `sliding.jpeg`      |
| Пергола для террасы                       | `pergola.jpg`       |
| Автоматические ворота                     | `gates.jpg`         |
| ДПК террасная доска                       | `wpc.jpg`           |

Recommended size: ~800×760 px (the tile aspect ratio is 1 : 0.95).

While a file is missing the tile falls back to a deterministic Picsum
photo so the page never looks broken. Extension can be changed — just
edit `SERVICE_IMG`.
