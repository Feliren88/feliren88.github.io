"""Verify narrated examples across the five requested learning tracks."""
import sys
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4186'
tracks={'uncertainty-estimation':9,'bayesian-statistics':6,'frequentist-statistics':8,'math':10,'math-proof':7}
distributions={'uncertainty-estimation':6,'bayesian-statistics':5,'frequentist-statistics':5,'math':3,'math-proof':0}
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    for width in [1400,390]:
        for theme in ['dark','light']:
            for track,count in tracks.items():
                page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce')
                errors=[]
                page.on('pageerror',lambda e:errors.append(str(e)))
                assert page.goto(base+'/'+track+'/').status==200
                page.evaluate('(theme)=>document.documentElement.dataset.theme=theme',theme)
                assert page.locator('.ue-animation').count()==count
                assert page.locator('.syl-module > .syl-viz .ivp').count()==count
                assert page.locator('.ivd-narrative').count()==distributions[track]
                # Each caption, drawing and current-step indicator must agree after both forward and backward navigation.
                results=page.evaluate('''()=>[...document.querySelectorAll('.ue-animation')].map(root=>{
                  const svg=root.querySelector('svg'),first=svg.innerHTML,buttons=[...root.querySelectorAll('.ivn-steps button')];
                  const failures=[];
                  for(const i of [0,1,2,3,2,1,0]){
                    buttons[i].click();
                    if(!svg.getAttribute('aria-label').endsWith(root.querySelector('.ivn-say').textContent)) failures.push('Caption mismatch');
                    if(root.querySelector('[data-count]').textContent!==`${i+1} / 4`) failures.push('Step mismatch');
                    if(root.querySelectorAll('[aria-current="step"]').length!==1) failures.push('Current step mismatch');
                    for(const text of svg.querySelectorAll('text')){
                      const b=text.getBBox(),v=svg.viewBox.baseVal;
                      if(b.x < 0 || b.x+b.width > v.width+1 || b.y+b.height > v.height+1) failures.push('Clipped SVG text '+text.textContent);
                    }
                  }
                  if(svg.innerHTML!==first) failures.push('Backward scrub changed initial drawing');
                  return failures;
                })''')
                assert not any(results),(track,width,results)
                root=page.locator('.ue-animation').first
                root.scroll_into_view_if_needed()
                root.locator('[data-next]').click()
                assert root.locator('[data-count]').inner_text()=='2 / 4'
                root.locator('[data-prev]').click()
                root.locator('[data-speed]').select_option('1200')
                root.locator('[data-play]').click()
                page.wait_for_timeout(1300)
                assert root.locator('[data-count]').inner_text()!='1 / 4'
                root.locator('[data-play]').click()
                assert root.locator('[data-play]').get_attribute('aria-pressed')=='false'
                root.locator('[data-reset]').click()
                assert root.locator('[data-count]').inner_text()=='1 / 4'
                # Test speech dispatch without depending on a host voice or audio output.
                page.evaluate('''()=>{window.__said='';speechSynthesis.speak=(u)=>{window.__said=u.text;};speechSynthesis.cancel=()=>{};}''')
                root.locator('[data-listen]').click()
                assert page.evaluate('window.__said')==root.locator('.ivn-say').inner_text()
                root.locator('[data-reset]').click()
                page.evaluate('document.querySelector(".syl-page").style.setProperty("--rd-scale","1.6")')
                assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+1'),(track,width,'Page overflow')
                root.screenshot(path=f'/private/tmp/{track}-{width}-{theme}-narrative.png')
                assert not errors,errors
                print(f'Passed {count} worked narratives on {track}, {width}px, {theme}.',flush=True)
                page.close()
    # All 24 distribution families must retain narrative support after changing parameters.
    page=browser.new_page()
    page.goto(base+'/math/')
    root=page.locator('.ivd-panel').filter(has=page.locator('option[value="cauchy"]')).first
    select=root.locator('.ivd-select select')
    assert select.locator('option').count()==24
    for option in select.locator('option').all():
        select.select_option(option.get_attribute('value'))
        for step in range(4):
            root.locator('.ivn-steps button').nth(step).evaluate('(el)=>el.click()')
            assert root.get_attribute('data-narrative-step')==str(step)
        before=root.locator('.ivn-say').inner_text()
        root.locator('.ivd-cut-label input').evaluate('(el)=>{el.value=el.max;el.dispatchEvent(new Event("input"));}')
        assert root.locator('.ivn-say').inner_text()!=before
        for parameter in root.locator('.ivd-params input').all():
            for edge in ['min','max']:
                parameter.evaluate('(el,edge)=>{el.value=el[edge];el.dispatchEvent(new Event("input"));}',edge)
                assert 'NaN' not in root.inner_text()
        root.locator('[data-reset]').click()
        assert root.get_attribute('data-narrative-step')=='0'
    print('Passed dynamic narration and parameter boundaries for all 24 distribution families.',flush=True)
    browser.close()
