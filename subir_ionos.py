"""
Sube la web a IONOS via SFTP
============================
Uso: python subir_ionos.py
"""

import os
import paramiko
from pathlib import Path

# ── Configuración ─────────────────────────────────────────────
SFTP_HOST = os.environ.get("FTP_HOST", "home743959418.1and1-data.host")
SFTP_USER = os.environ.get("FTP_USER", "TU_USUARIO_FTP")
SFTP_PASS = os.environ.get("FTP_PASS", "TU_CONTRASEÑA_FTP")
SFTP_PORT = 22
REMOTE_DIR = ""

LOCAL_DIR = Path(__file__).parent

ALLOWED_EXTENSIONS = {
    ".html", ".css", ".js", ".jpg", ".jpeg", ".png",
    ".gif", ".svg", ".ico", ".webp", ".mp4", ".pdf",
    ".woff", ".woff2", ".ttf", ".otf"
}

EXCLUDE = {"subir_ionos.py", "__pycache__", ".git", ".DS_Store", "INSTRUCCIONES.md"}
SKIP_EXTENSIONS = {".mp4", ".mov", ".avi"}  # subir vídeos manualmente por FileZilla

failed_files = []


def mkdir_p(sftp, remote_dir):
    if not remote_dir:
        return
    parts = [p for p in remote_dir.split("/") if p]
    current = ""
    for part in parts:
        current = f"{current}/{part}" if current else part
        try:
            sftp.stat(current)
        except FileNotFoundError:
            try:
                sftp.mkdir(current)
            except Exception:
                pass


def subir_directorio(sftp, local_dir: Path, remote_dir: str):
    mkdir_p(sftp, remote_dir)
    for item in sorted(local_dir.iterdir()):
        if item.name in EXCLUDE or item.name.startswith("."):
            continue
        remote_path = f"{remote_dir}/{item.name}" if remote_dir else item.name
        if item.is_dir():
            print(f"\n📁 {remote_path}/")
            subir_directorio(sftp, item, remote_path)
        elif item.is_file() and item.suffix.lower() in ALLOWED_EXTENSIONS:
            if item.suffix.lower() in SKIP_EXTENSIONS:
                print(f"  ⚠ SALTADO (vídeo) → subir con FileZilla: {item.name}")
                failed_files.append(str(item))
                continue
            try:
                sftp.put(str(item), remote_path)
                size_kb = item.stat().st_size // 1024
                print(f"  ✓ {remote_path} ({size_kb} KB)")
            except Exception as e:
                print(f"  ✗ ERROR {remote_path}: {e}")
                failed_files.append(str(item))


def main():
    print("=" * 55)
    print("  SUBIENDO EL GUARDIÁN DE CHAMBERÍ → IONOS")
    print("=" * 55)
    print(f"  Host:    {SFTP_HOST}")
    print(f"  Usuario: {SFTP_USER}")
    print(f"  Destino: {REMOTE_DIR}")
    print("=" * 55)

    if "TU_USUARIO_FTP" in SFTP_USER or "TU_CONTRASEÑA_FTP" in SFTP_PASS:
        print("\n  ERROR: Configura las credenciales primero.")
        print("    set FTP_USER=tu_usuario")
        print("    set FTP_PASS=tu_contraseña")
        return

    try:
        print("\nConectando via SFTP...")
        transport = paramiko.Transport((SFTP_HOST, SFTP_PORT))
        transport.connect(username=SFTP_USER, password=SFTP_PASS)
        sftp = paramiko.SFTPClient.from_transport(transport)
        print("Conectado.\n")

        subir_directorio(sftp, LOCAL_DIR, REMOTE_DIR)

        sftp.close()
        transport.close()

        print("\n" + "=" * 55)
        print("  COMPLETADO ✓")
        print("  Tu web está en: https://elguardiandechamberi.com")
        print("=" * 55)

    except Exception as e:
        print(f"\n  Error: {e}")


if __name__ == "__main__":
    main()
