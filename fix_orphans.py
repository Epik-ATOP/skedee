import os, re

files_to_fix = ['markets/10000008.html', 'markets/10000014.html', 'markets/10000036.html']

for path in files_to_fix:
    with open(path, 'r', encoding='utf-8') as f:
        html = f.read()

    original = html

    # The orphaned content starts with: }22;color:${c.col}
    # For multi-line files (10000008, 10000036):
    #   }22;color:...  (line starts with `}` then orphan content follows)
    #   ...more lines...
    #   `).join('');   (end of the template literal array map)
    #   }              (closing brace of the remnant function)
    # For minified (10000014):
    #   }22;color:...`).join(''); }   (all on one line)

    # Strategy: find the orphan marker and remove to the end of the orphan block.
    # The orphan block always ends with `).join(''); }` (with optional whitespace/newlines)
    # preceded by `).join('');` then optionally newline then `}`

    # Pattern: from `22;color:${c.col}` up to and including the closing `}`
    # that terminates the orphaned renderComments function remnant.
    # The block ends with: `).join('');\n}` (multiline) or `).join(''); }` (minified)

    # Remove the orphaned tail: `22;color:...` through the closing `}`
    # Using a regex that matches lazily until the closing of the block
    pattern = r'22;color:\$\{c\.col\}.*?`\)\.join\(\'\'\);\n\}'
    html2 = re.sub(pattern, '', html, flags=re.DOTALL)

    if html2 == html:
        # Try minified (single-line) version
        pattern2 = r'22;color:\$\{c\.col\}.*?`\)\.join\(\'\'.*?\} '
        html2 = re.sub(pattern2, '', html, flags=re.DOTALL)

    if html2 != html:
        with open(path, 'w', encoding='utf-8') as f:
            f.write(html2)
        print(f'  Fixed: {path}')
    else:
        print(f'  No match found: {path}')
