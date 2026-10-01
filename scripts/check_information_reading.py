"""Verify chart enlargement and keyboard controls under the reading scale."""
import sys
base=sys.argv[1] if len(sys.argv)>1 else "http://localhost:4186"
from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 b=p.chromium.launch(channel='chrome',headless=True)
 for width in [1400,390]:
  for theme in ['dark','light']:
   page=b.new_page(viewport={'width':width,'height':1000})
   errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
   page.goto(base+'/information-theory/')
   page.evaluate('(t)=>document.documentElement.dataset.theme=t',theme)
   for index in [3,9,11,15]:
    root=page.locator('.it-lesson').nth(index)
    root.scroll_into_view_if_needed()
    before=root.locator('svg text').first.bounding_box()['height']
    root.evaluate('(el)=>el.style.setProperty("--rd-scale","1.6")')
    after=root.locator('svg text').first.bounding_box()['height']
    assert after>=before*1.5,(before,after)
    assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+2')
    root.locator('[data-reset]').click()
    if root.locator('[data-handle]').count():
     root.locator('[data-handle]').focus();page.keyboard.press('ArrowRight')
     assert root.locator('[data-handle]').evaluate('(el)=>el===document.activeElement')
    assert 'NaN' not in root.inner_text()
   assert errors==[],errors
   print('Enlarged-text checks passed',width,theme,flush=True)
   page.close()
 b.close()
