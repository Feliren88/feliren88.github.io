"""Check the ten requested model and systems tracks with their authored diagrams."""
import sys
from playwright.sync_api import sync_playwright
base=sys.argv[1] if len(sys.argv)>1 else 'http://localhost:4186'
tracks={'llm-training':6,'nlp':7,'multimodality':7,'embedding':7,'edge-ai':7,'agentic-ai':7,'mlops':7,'data-engineering':7,'mechanistic-interpretability':6,'ai-safety':7}
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
                assert page.locator('.ivn-module-animation').count()==count
                assert page.locator('.ivn-track-player').count()==1
                result=page.evaluate('''()=>[...document.querySelectorAll('.ivn-module-animation')].map(root=>{
                  const diagram=root.querySelector('.ivz'),normalise=s=>s.replace(/ class=""/g,''),first=normalise(diagram.innerHTML);
                  const player=root.querySelector('.ivn-module-player'),buttons=[...player.querySelectorAll('.ivn-steps button')],errors=[];
                  for(let i=0;i<buttons.length;i++){
                    buttons[i].click();
                    if(!diagram.getAttribute('aria-label').endsWith(player.querySelector('.ivn-say').textContent))errors.push('Caption mismatch');
                    if(player.querySelectorAll('[aria-current="step"]').length!==1)errors.push('Current-step mismatch');
                    if(!diagram.querySelector('.is-at'))errors.push('Missing diagram highlight');
                  }
                  const scrub=player.querySelector('[data-scrub]');scrub.value=0;scrub.dispatchEvent(new Event('input'));
                  if(normalise(diagram.innerHTML)!==first)errors.push('Backward scrub failed');
                  return errors;
                })''')
                assert not any(result),(track,result)
                flagship=page.locator('.ivn-track-player')
                flagship.locator('[data-scrub]').focus()
                flagship.locator('[data-scrub]').press('ArrowRight')
                assert flagship.locator('[data-count]').inner_text().startswith('2 /')
                assert flagship.locator('.ivn-say').inner_text()==page.locator('.an-say').text_content()
                flagship.locator('[data-reset]').click()
                root=page.locator('.ivn-module-player').first
                root.scroll_into_view_if_needed()
                first=root.locator('[data-count]').inner_text()
                root.locator('[data-speed]').select_option('1200')
                root.locator('[data-play]').click();page.wait_for_timeout(1300)
                assert root.locator('[data-count]').inner_text()!=first
                # A two-step walkthrough stops itself at its final step.
                if root.locator('[data-play]').get_attribute('aria-pressed')=='true':root.locator('[data-play]').click()
                root.locator('[data-reset]').click()
                assert root.locator('[data-count]').inner_text()==first
                page.evaluate('document.querySelector(".syl-page").style.setProperty("--rd-scale","1.6")')
                assert page.evaluate('document.documentElement.scrollWidth<=innerWidth+1'),(track,width,'Page overflow')
                assert not errors,errors
                print(f'Passed {count} module animations on {track}, {width}px, {theme}.',flush=True)
                page.close()
    browser.close()
