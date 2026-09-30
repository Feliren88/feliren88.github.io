import sys
from playwright.sync_api import sync_playwright
base = sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4000'
problems=[]
with sync_playwright() as p:
 b=p.chromium.launch(channel='chrome')
 for width in (1400,390):
  pg=b.new_page(viewport={'width':width,'height':900}, reduced_motion='reduce')
  pg.goto(base+'/linear-algebra/')
  lab=pg.locator('[data-lab="linear-algebra/matrices-as-transformations"] .lab')
  lab.scroll_into_view_if_needed()
  lab.locator('[data-zoom="av"]').click()
  values=pg.locator('dialog[open] tbody td').all_text_contents()
  if values[-1].split(' = ')[-1]!='2.00': problems.append(f'{width}: Av dialog disagrees with visible identity matrix')
  pg.keyboard.press('Escape')
  lab=pg.locator('[data-lab="linear-algebra/determinant-rank-inverse"] .lab')
  lab.scroll_into_view_if_needed()
  lab.locator('[data-zoom="det"]').click()
  values=pg.locator('dialog[open] tbody td').all_text_contents()
  if values[-1]!='1.00': problems.append(f'{width}: determinant dialog disagrees with visible identity matrix')
  pg.keyboard.press('Escape')
  lab.locator('[data-k="preset"]').select_option(label='Squash it')
  lab.locator('[data-k="t"]').evaluate("e=>{e.value=0;e.dispatchEvent(new Event('input',{bubbles:true}))}")
  lab.locator('[data-zoom="rank"]').click()
  values=pg.locator('dialog[open] tbody td').all_text_contents()
  if values[0]!='2': problems.append(f'{width}: rank dialog disagrees with visible identity matrix')
  pg.close()
 b.close()
assert not problems, '\n'.join(problems)
print('Worked dialogs match the visible matrix at both widths.')
