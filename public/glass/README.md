# Glass-unit photos

Drop a JPG/PNG for each glass type here, named by its key. The component
swaps the SVG diagram for the real photo as soon as the file is present.

| Glass unit                             | File              |
|----------------------------------------|-------------------|
| Стеклопакет однокамерный 24 мм         | `single24.png`    |
| Стеклопакет двухкамерный 32 мм         | `double32.png`    |
| Стеклопакет энергосберегающий          | `energy.png`      |
| Стеклопакет с аргоном                  | `argon.png`       |
| Стеклопакет мультимикс                 | `multimix.png`    |
| Стекло от 4 до 20 мм                   | `single.png`      |

(Real photos shipped with the project — sourced from the client's
`сайт (1).docx` supplementary asset pack.)

Recommended size: ~200×320 px (or any aspect — `object-contain` keeps it
sane), transparent or white background. The rendered slot is 68×110.

While a file is missing the card falls back to a stylised SVG diagram with
the right number of panes plus argon dots / energy tint, so the section
stays informative until real assets arrive.
