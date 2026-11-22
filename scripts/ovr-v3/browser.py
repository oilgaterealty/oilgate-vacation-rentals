"""Live browser verification with Python Playwright and locally installed Chromium."""
from datetime import datetime, timedelta, timezone
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer
from pathlib import Path
from threading import Thread
from urllib.parse import urlparse, parse_qs
from hashlib import sha256
from playwright.sync_api import sync_playwright
import os
ROOT=Path(__file__).resolve().parents[2]
PAGES=['','unit-1-at-oilgate-at-oakdale.html','unit-2-at-oilgate-at-oakdale.html','oilgate-at-parkgate.html','direct/','404.html']
TEST={'unit-1-at-oilgate-at-oakdale.html':'603326','unit-2-at-oilgate-at-oakdale.html':'603323','oilgate-at-parkgate.html':'728474','direct/':'603323','':'728474'}
screens=ROOT/'jobs/ovr-full-site-v3/screens'
screens.mkdir(parents=True,exist_ok=True)
class Quiet(SimpleHTTPRequestHandler):
    def __init__(self,*a,**kw):super().__init__(*a,directory=str(ROOT),**kw)
    def log_message(self,*args):pass
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet)
Thread(target=server.serve_forever,daemon=True).start()
base=os.environ.get('OVR_PREVIEW_URL',f'http://127.0.0.1:{server.server_port}/v3-preview/').rstrip('/')+'/'
with sync_playwright() as pw:
    proxy=({'server':os.environ['OVR_BROWSER_PROXY'],'bypass':'localhost,127.0.0.1'} if os.getenv('OVR_BROWSER_PROXY') else None)
    browser=pw.chromium.launch(proxy=proxy, executable_path=os.environ.get('CHROMIUM_PATH','/usr/bin/chromium'),args=['--no-sandbox'],headless=True)
    for width in [1440,390]:
        for tail in PAGES:
            page=browser.new_page(viewport={'width':width,'height':900})
            errors=[];page.on('pageerror',lambda e:errors.append(str(e)))
            page.on('console',lambda msg:errors.append(msg.text) if msg.type=='error' and not msg.text.startswith("Failed to load resource") else None)
            if os.environ.get('OVR_VERIFIED_CDN_CACHE'):
                cache=Path(os.environ['OVR_VERIFIED_CDN_CACHE'])
                def serve_verified_cdn(route):
                    f=cache/sha256(route.request.url.encode()).hexdigest()
                    if not f.is_file(): return route.continue_()
                    route.fulfill(status=200,content_type='image/jpeg',path=str(f))
                page.route('https://l.icdbcdn.com/**',serve_verified_cdn)
            page.goto(base+tail,wait_until='domcontentloaded')
            # Check preview link namespace and assets before exercising the external checkout.
            images=page.evaluate("""() => Promise.all([...document.images].map(img => {img.loading='eager'; return img.decode().then(()=>null).catch(()=>img.getAttribute('src'));}))""")
            bad=[x for x in images if x]; assert not [x for x in bad if not x.startswith("https://")],(tail,bad); print("IMAGES",tail or "home",len(images),"external failed",len(bad),flush=True)
            assert page.evaluate('document.documentElement.scrollWidth === innerWidth'),tail
            assert page.locator('h1').count()==1
            for link in page.locator('a[href]').evaluate_all('(nodes)=>nodes.map(x=>x.href)'):
                if urlparse(link).netloc==urlparse(base).netloc:
                    assert urlparse(link).path.startswith(urlparse(base).path),(tail,link)
                    rel= urlparse(link).path.split('/v3-preview/',1)[-1]
                    assert (ROOT/'v3-preview'/rel).exists(),(tail,link)
            visible=page.locator('.concierge-toggle').bounding_box()
            for node in page.locator('.btn:visible').all():
                b=node.bounding_box()
                assert not (b and visible['x']<b['x']+b['width'] and b['x']<visible['x']+visible['width'] and visible['y']<b['y']+b['height'] and b['y']<visible['y']+visible['height']),tail
            if tail=='':
                page.locator('[data-price="603326:direct"]').wait_for()
                if not os.getenv('OVR_PREVIEW_URL'):
                    page.wait_for_function("""document.querySelector('[data-price="603326:direct"]').textContent.includes('$')""")
                assert page.locator('.rental a.btn').count()==3
                for idx,pid in enumerate(['603326','603323','728474']):
                    assert f'stay={pid}' in page.locator('.rental a.btn').nth(idx).get_attribute('href')
                page.get_by_role('button',name='Ask our concierge',exact=True).click()
                for prompt in ['Tell me about Parkgate','And what beds are there?']:
                    page.get_by_label('Your question').fill(prompt)
                    page.get_by_role('button',name='Send').click()
                    page.wait_for_function('!document.querySelector("[data-chat] button").disabled')
                assert '2 Queen beds' in page.get_by_role('log').inner_text()
                page.reload(wait_until='domcontentloaded')
                page.get_by_role('button',name='Ask our concierge',exact=True).click()
                assert '2 Queen beds' in page.get_by_role('log').inner_text()
                page.get_by_role('button',name='Close chat').click()
            page.screenshot(path=str(screens/f'{tail.rstrip("/").replace(".html","") or "home"}-{width}.jpg'),type='jpeg',quality=78)
            if tail in TEST:
                if tail in ('','direct/'):
                    pick=page.locator('.custom-picker > button')
                    pick.press('ArrowDown')
                    if tail=='': page.get_by_role('listbox').press('End')
                    else: page.get_by_role('listbox').press('ArrowDown')
                    page.get_by_role('listbox').press('Enter')
                actual=page.locator('[name=stay]').input_value()
                assert actual==TEST[tail], (tail,actual)
                arrival=(datetime.now(timezone.utc)+timedelta(days=105)).date()
                departure=arrival+timedelta(days=7)
                page.locator('[name=arrival]').fill(str(arrival))
                page.locator('[name=departure]').fill(str(departure))
                page.locator('[name=guests]').select_option('2')
                with page.expect_request(lambda req:'checkout.lodgify.com' in req.url) as outbound:
                    page.get_by_role('button',name='Proceed',exact=True).click(no_wait_after=True)
                url=urlparse(outbound.value.url)
                assert url.path==f'/en/ogr/{actual}/reservation'
                assert parse_qs(url.query)=={'currency':['USD'],'adults':['2'],'arrival':[str(arrival)],'departure':[str(departure)]}
                # Only test the initial checkout page; do not advance the reservation.
                response=outbound.value.response()
                print("CHECKOUT", actual, response.status if response else outbound.value.failure, flush=True)
            assert not errors,(tail,errors)
            print(f'PASS {width} {tail or "home"}',flush=True)
            page.close()
    browser.close()
server.shutdown()
