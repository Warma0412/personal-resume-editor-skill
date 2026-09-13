#!/usr/bin/env bash
set -euo pipefail

input="${1:-}"
output="${2:--}"

if [[ -z "$input" || ! -f "$input" ]]; then
  echo "Usage: extract-resume.sh <resume.pdf|docx|html|md|txt> [output.txt|-]" >&2
  exit 2
fi

extension="${input##*.}"
extension="$(printf '%s' "$extension" | tr '[:upper:]' '[:lower:]')"

extract() {
  case "$extension" in
    txt|md)
      cat "$input"
      ;;
    pdf)
      if ! command -v pdftotext >/dev/null 2>&1; then
        echo "pdftotext is required to extract PDF resumes." >&2
        exit 3
      fi
      pdftotext -layout "$input" -
      ;;
    doc|docx|rtf|html|htm)
      if command -v textutil >/dev/null 2>&1; then
        textutil -convert txt -stdout "$input"
      elif command -v pandoc >/dev/null 2>&1; then
        pandoc "$input" -t plain
      else
        echo "Install pandoc, or run this extractor on macOS with textutil." >&2
        exit 3
      fi
      ;;
    *)
      echo "Unsupported resume format: .$extension" >&2
      exit 2
      ;;
  esac
}

if [[ "$output" == "-" ]]; then
  extract
else
  mkdir -p "$(dirname "$output")"
  extract > "$output"
  echo "Extracted resume text: $output" >&2
fi
