import os
import re
import subprocess
import sys
import time
import urllib.error
import urllib.request

ROOT = os.path.dirname(os.path.abspath(__file__))
os.chdir(ROOT)

BASE = "http://127.0.0.1:8765"
PAGES = ["index.html", "diagnosis.html", "w.html", "wing-learn.html", "type-learn.html"]
ENTRY = "src/main.js"


def fetch(path: str):
    url = f"{BASE}/{path.replace(os.sep, '/')}"
    try:
        with urllib.request.urlopen(url, timeout=5) as response:
            return response.status, response.read().decode("utf-8", errors="replace")
    except Exception as error:
        return None, str(error)


def resolve_import(importer: str, spec: str) -> str:
    base_dir = os.path.dirname(importer).replace("\\", "/")
    resolved = os.path.normpath(os.path.join(base_dir, spec)).replace("\\", "/")
    if not resolved.endswith(".js"):
        resolved += ".js"
    return resolved


def collect_import_graph(entry: str):
    loaded = {}
    queue = [entry]

    while queue:
        path = queue.pop(0)
        if path in loaded:
            continue

        status, body = fetch(path)
        if status != 200:
            return loaded, [(path, body)]

        loaded[path] = body
        for spec in re.findall(r"from ['\"]([^'\"]+)['\"]", body):
            if spec.startswith("."):
                queue.append(resolve_import(path, spec))

    return loaded, []


def check_html_scripts():
    results = []
    for page in PAGES:
        status, body = fetch(page)
        has_module = 'type="module"' in body and "src/main.js" in body
        results.append((page, status, has_module))
    return results


def main():
    proc = subprocess.Popen(
        [sys.executable, "-m", "http.server", "8765"],
        stdout=subprocess.DEVNULL,
        stderr=subprocess.DEVNULL,
    )
    time.sleep(1.5)

    try:
        print("=== Page load check ===")
        for page, status, has_module in check_html_scripts():
            print(f"{page}: status={status}, module_script={has_module}")

        print("\n=== Module import graph ===")
        loaded, errors = collect_import_graph(ENTRY)
        if errors:
            for path, message in errors:
                print(f"FAIL {path}: {message}")
            return 1

        for path in sorted(loaded):
            print(f"OK {path} ({len(loaded[path])} bytes)")

        print(f"\nResolved modules: {len(loaded)}")
        return 0
    finally:
        proc.terminate()
        proc.wait(timeout=3)


if __name__ == "__main__":
    raise SystemExit(main())
