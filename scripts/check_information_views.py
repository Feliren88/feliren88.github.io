"""Check the information explorer in both themes at desktop and phone widths."""
import sys
from pathlib import Path
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4186'
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    for width in [1400,390]:
        for theme in ['dark','light']:
            page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce')
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.route('**/*', lambda route: route.continue_() if route.request.url.startswith(base) else route.abort())
            response=page.goto(base+'/information-theory/')
            assert response.status==200
            page.evaluate('(theme)=>document.documentElement.dataset.theme=theme',theme)
            root=page.locator('[data-information-explorer]')
            assert page.locator('.syl-module').count()==16
            assert page.locator('.ivm-render math').count()>=30
            assert page.locator('.an-svg').count()==1
            assert '1.75' in page.locator('.an-stage').inner_text()
            for module in page.locator('.syl-module').all():
                steps=module.locator('.ivp-step')
                assert steps.count()==3
                steps.nth(2).click()
                assert steps.nth(2).get_attribute('aria-current')=='step'
                steps.nth(0).click()
                assert steps.nth(0).get_attribute('aria-current')=='step'
            page.locator('.an-stepbtn').nth(0).click()
            assert 'Their sum equals 1.' in page.locator('.an-say').inner_text()
            page.locator('.an-stepbtn').nth(3).click()
            assert '1.75 bits' in page.locator('.an-say').inner_text()
            for mode in ['entropy','fitting','channel','bayes','coding','distortion']:
                root.locator('[data-mode="'+mode+'"]').click()
                assert 'NaN' not in root.inner_text()
                assert root.locator('[data-it-readouts] strong').count()>=2
                if mode=='entropy': assert '1.000 bits' in root.locator('[data-it-readouts]').inner_text()
                if mode=='bayes': assert '0.628' in root.locator('[data-it-readouts]').inner_text()
                if mode=='coding': assert '1.750 bits' in root.locator('[data-it-readouts]').inner_text()
                before=root.locator('[data-it-controls] input').first.input_value()
                root.locator('[data-it-step]').click()
                root.locator('[data-it-reset]').click()
                assert root.locator('[data-it-controls] input').first.input_value()==before
                root.locator('details summary').click()
                for field in root.locator('[data-it-controls] input').all():
                    for edge in ['min','max']:
                        field.evaluate('(el,edge)=>{el.value=el[edge];el.dispatchEvent(new Event("input",{bubbles:true}));}',edge)
                        assert 'NaN' not in root.inner_text()
                        assert root.locator('[data-it-formula]').inner_text()
                root.locator('[data-it-reset]').click()
                animated={'entropy':'p','fitting':'q','channel':'e','bayes':'heads','coding':'mix','distortion':'d'}[mode]
                start_value=root.locator('#it-'+animated).input_value()
                root.locator('[data-it-play]').click()
                page.wait_for_timeout(300)
                assert root.locator('#it-'+animated).input_value()!=start_value
                assert root.locator('[data-it-play]').inner_text()=='Pause'
                root.locator('[data-it-play]').click()
                assert root.locator('[data-it-play]').inner_text()=='Play'
                root.locator('[data-it-reset]').click()
                assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+2'), 'Page overflow'
                bad=page.evaluate('''()=>{
                  const svg=document.querySelector('[data-it-svg]'), vb=svg.viewBox.baseVal;
                  return [...svg.querySelectorAll('rect,circle,line,path')].filter(el=>{
                    const b=el.getBBox(); return b.x< -2 || b.y< -2 || b.x+b.width>vb.width+2 || b.y+b.height>vb.height+2;
                  }).length;
                }''')
                assert bad==0, mode+' draws outside its SVG'
            root.locator('[data-mode="entropy"]').click()
            root.scroll_into_view_if_needed()
            page.screenshot(path='/private/tmp/information-'+str(width)+'-'+theme+'.png')
            assert errors==[],errors
            print('Passed',width,theme,'with 6 experiments, boundaries, playback, reset and equations.')
            page.close()
    page=browser.new_page()
    page.goto(base+'/interview/')
    assert page.locator('a[href="/information-theory/"]').count()>0
    print('The interview hub links to the new track.')
    browser.close()
