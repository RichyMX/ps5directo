# PS5 Directo

Herramienta de transferencia de archivos para Windows: envía archivos a una PS5 con jailbreak por FTP mientras se descargan, sin pasar por el disco del PC. Después los descomprime (en la consola con BFpilot, o en el PC con 7-Zip) y coloca las aplicaciones en `/data/homebrew` para que ShadowMountPlus las muestre en el menú.

- Descarga en paralelo, con pausa, reanudación y límite de velocidad.
- Vigila el espacio libre de la PS5 para no llenarla.
- Corrige los permisos de lo descomprimido con BFpilot. Sin esa corrección no arranca (CE-107750-0).
- Extensión opcional para Chrome/Edge que manda los enlaces directamente al programa.
- Se actualiza desde las releases de este repositorio.

## Requisitos

- **PC:** Windows 10/11, [Python 3.9+](https://www.python.org/downloads/) y, para descomprimir en el PC, [7-Zip](https://www.7-zip.org/).
- **PS5 con jailbreak:**
  - Servidor FTP, por ejemplo [ftpsrv](https://github.com/ps5-payload-dev/ftpsrv) en el puerto 2121.
  - [BFpilot](https://github.com/ItsBlurf/BFpilot) en el puerto 5905.
  - [ShadowMountPlus](https://github.com/drakmor/ShadowMountPlus).

## Uso

1. Descarga el `.zip` de la última [release](../../releases) y descomprímelo.
2. Ejecuta `Crear accesos directos.bat` y abre **PS5 Directo** desde el escritorio.
3. Pon la IP de tu PS5 en Ajustes y pega los enlaces o arrastra los archivos.

La guía completa está en [LEEME.txt](LEEME.txt).

## Aviso

Proyecto independiente, sin relación con Sony ni con los autores de las herramientas citadas. No incluye contenido de terceros, claves ni archivos de Sony, ni enlaces a sitios de descargas. Úsalo solo con contenido que tengas derecho a usar (copias de seguridad propias y homebrew).
