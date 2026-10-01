"""Exercise each lesson experiment in both themes at desktop and phone widths."""
import sys
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4186'
with sync_playwright() as p:
    browser=p.chromium.launch(channel='chrome',headless=True)
    for width in ([int(sys.argv[2])] if len(sys.argv)>2 else [1400,390]):
        for theme in ([sys.argv[3]] if len(sys.argv)>3 else ['dark','light']):
            page=browser.new_page(viewport={'width':width,'height':1000},reduced_motion='reduce')
            errors=[]
            page.on('pageerror',lambda e:errors.append(str(e)))
            page.goto(base+'/information-theory/')
            page.evaluate('(theme)=>document.documentElement.dataset.theme=theme',theme)
            lessons=page.locator('.it-lesson')
            assert lessons.count()==16
            for i in range(16):
                root=lessons.nth(i)
                root.scroll_into_view_if_needed()
                initial=root.locator('[data-equation]').inner_text()
                root.locator('summary').click()
                assert root.locator('[data-worked] p').count()>=2
                for slider in root.locator('[data-control]').all():
                    for edge in ['min','max']:
                        slider.evaluate('(el,edge)=>{el.value=el[edge];el.dispatchEvent(new Event("input",{bubbles:true}));}',edge)
                        assert 'NaN' not in root.inner_text()
                root.locator('[data-reset]').click()
                assert root.locator('[data-equation]').inner_text()==initial
                before=[s.input_value() for s in root.locator('[data-control]').all()]
                root.locator('[data-guide="2"]').click()
                assert [s.input_value() for s in root.locator('[data-control]').all()]==before
                root.locator('[data-progress]').evaluate('(el)=>{el.value=1;el.dispatchEvent(new Event("input",{bubbles:true}));}')
                end=root.locator('[data-equation]').inner_text()
                assert end!=initial
                root.locator('[data-progress]').evaluate('(el)=>{el.value=0;el.dispatchEvent(new Event("input",{bubbles:true}));}')
                assert root.locator('[data-equation]').inner_text()==initial
                root.locator('[data-step]').click()
                assert float(root.locator('[data-progress]').input_value())==.05
                root.locator('[data-reset]').click()
                root.locator('[data-play]').click()
                page.wait_for_timeout(450)
                assert float(root.locator('[data-progress]').input_value())>0
                assert root.locator('[data-equation]').inner_text()!=initial
                root.locator('[data-play]').click()
                assert root.locator('[data-play]').get_attribute('aria-pressed')=='false'
                root.locator('[data-reset]').click()
                handle=root.locator('[data-handle]')
                if handle.count():
                    handle.focus()
                    start=float(handle.get_attribute('aria-valuenow'))
                    page.keyboard.press('ArrowRight')
                    assert float(handle.get_attribute('aria-valuenow'))>start
                    assert handle.evaluate('(el)=>el===document.activeElement')
                    page.keyboard.press('Home')
                    assert float(handle.get_attribute('aria-valuenow'))==float(handle.get_attribute('aria-valuemin'))
                    page.keyboard.press('End')
                    assert float(handle.get_attribute('aria-valuenow'))==float(handle.get_attribute('aria-valuemax'))
                    root.locator('[data-reset]').click()
                    box=handle.bounding_box()
                    page.mouse.move(box['x']+box['width']/2,box['y']+box['height']/2)
                    page.mouse.down()
                    page.mouse.move(box['x']+box['width']/2+20,box['y']+box['height']/2,steps=4)
                    page.mouse.up()
                    if root.locator('[data-equation]').inner_text()==initial:
                        page.screenshot(path='/private/tmp/information-drag-failure.png')
                        print('Drag failure',width,theme,i,box,handle.evaluate('(el)=>({scroll:el.closest(".it-stage").scrollLeft,stage:el.closest(".it-stage").getBoundingClientRect().toJSON()})'),flush=True)
                    assert root.locator('[data-equation]').inner_text()!=initial, f'Drag failed for lesson {i} at {width}px in {theme}'
                    root.locator('[data-reset]').click()
                assert page.evaluate('document.documentElement.scrollWidth<=window.innerWidth+2')
                assert root.evaluate('''(root)=>{
                    const svg=root.querySelector('svg'),v=svg.viewBox.baseVal;
                    return [...svg.querySelectorAll('rect,circle,path,line')].every(el=>{
                        const b=el.getBBox();return b.x>=-2&&b.y>=-2&&b.x+b.width<=v.width+2&&b.y+b.height<=v.height+2;
                    });
                }'''),f'Lesson {i} SVG overflow'
            assert errors==[],errors
            for i in [3,9,10,15]:
                lessons.nth(i).scroll_into_view_if_needed()
                page.screenshot(path=f'/private/tmp/information-lesson-{i}-{width}-{theme}.png')
            print(f'Passed all 16 lessons at {width}px in {theme}, including controls, playback, rewind, guides, drag and keyboard.',flush=True)
            page.close()
    browser.close()
