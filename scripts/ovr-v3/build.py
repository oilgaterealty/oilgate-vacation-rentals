"""Generate the complete preview; never writes an existing live HTML page."""
from html import escape as E
from pathlib import Path
import json, re, sys
ROOT = Path(__file__).resolve().parents[2]
sys.path.insert(0, str(ROOT / 'previews/tools'))
from content import AKRON, RULES
D = json.loads((ROOT/'data/properties.json').read_text())
P = D['properties']
IDS = ['603326','603323','728474']
ART = {
 '603326': ('oakdale-unit-1.webp','Front of the Oakdale duplex with its enclosed porch','cascade',('Private kitchen','Shared laundry','Street parking')),
 '603323': ('oakdale-unit-2.webp','Oakdale duplex and front walk','skyline',('Private kitchen','Shared laundry','Driveway parking')),
 '728474': ('parkgate-living.webp','Parkgate living room with a cream sofa','lock3',('Private kitchen','Dishwasher','Driveway parking')),
}
LABELS = {'603326':'Oakdale Unit 1','603323':'Oakdale Unit 2','728474':'Parkgate'}
OT = D['ownerTerms']
PRE = ROOT/'v3-preview'

def el(t, v): return f'<{t}>{E(str(v))}</{t}>'
def ref(path, up=''): return up+'../'+path.removeprefix('../')
def short(i): return LABELS[i]
def facts(i):
    x=P[i]
    return f"{x['bedrooms']} bedrooms · {x['beds']} beds · {x['bathrooms']} bath · up to {x['maxGuests']} guests"
def highlights(i): return ' · '.join(ART[i][3])
def photo(url,alt,up='',attr=''):
    src=ref(url,up) if not url.startswith('https://') else url
    return f'<img src="{E(src,quote=True)}" alt="{E(alt,quote=True)}" {attr}>'
def city(key,up='',attr=''):
    path,w,h,alt,_,_=AKRON[key]
    return photo(path,alt,up,f'width="{w}" height="{h}" {attr}')
def credit(keys):
    return ' · '.join(f'<a href="{E(AKRON[k][5],quote=True)}">{E(AKRON[k][4])}</a>' for k in dict.fromkeys(keys))
def head(title,desc,up):
    return f'''<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<meta name="robots" content="noindex"><title>{E(title)} | Oilgate Vacation Rentals</title><meta name="description" content="{E(desc,quote=True)}">
<link rel="icon" href="{up}../assets/favicon-48.png"><link rel="stylesheet" href="{up}assets/signature.css">
<script type="module" src="{up}assets/preview.js"></script></head>'''
def header(up):
    return f'''<a class="skip" href="#main">Skip to content</a><header class="top"><nav class="wrap" aria-label="Main">
<a class="plate" href="{up}index.html">{photo('previews/img/ovr-primary.webp','Oilgate Vacation Rentals',up,'width="720" height="181"')}</a>
<span class="location">Akron, Ohio</span><div class="navlinks"><a href="{up}index.html#rentals">Rentals</a><a href="{up}index.html#experience">The experience</a><a href="{up}index.html#compare">Real prices</a><a href="{up}index.html#faq">FAQ</a></div>
</nav></header>'''
def footer(up,keys):
    soc=' · '.join(f'<a href="{E(x["url"],quote=True)}">{E(x["name"])}</a>' for x in D['contact']['social'])
    return f'''<footer><div class="wrap footer">
<div><strong>Oilgate Vacation Rentals</strong><p>Akron, Ohio · Guests 18+ to book</p></div>
<div><a href="{up}index.html#rentals">Rentals</a> · <a href="{up}direct/">Book direct</a><br><a href="https://oilgaterealty.com/en/privacy-policy">Privacy</a></div>
<div><a href="mailto:{E(D["contact"]["email"],quote=True)}">Email Oilgate Realty</a><br>{soc}</div>
<p class="credits">{'Akron images: '+credit(keys)+'. ' if keys else ''}Rental photos: Oilgate Realty.</p></div></footer>'''
def book(up, selected=IDS[0],fixed=False):
    s=P[selected]
    options=''.join(f'<option value="{i}" label="{short(i)}" data-image="{up}../assets/{ART[i][0]}" data-alt="{E(ART[i][1],quote=True)}" data-max="{P[i]["maxGuests"]}">{short(i)}</option>' for i in IDS)
    choices = (f'<p class="book-stay">{short(selected)} · {facts(selected)}</p><input type="hidden" name="stay" value="{selected}" data-max="{s["maxGuests"]}">' if fixed else f'''<div class="picker"><label for="stay">Choose your stay</label><div class="picker-controls"><select name="stay" id="stay" data-default="{selected}">{options}</select><div class="custom-picker" hidden><button type="button" aria-label="Choose your stay" aria-haspopup="listbox" aria-expanded="false" aria-controls="stay-options"></button><ul role="listbox" tabindex="-1" id="stay-options" aria-label="Choose your stay" hidden></ul></div></div></div>''')
    thumb='' if fixed else f'<img class="selection-photo" data-selected-photo src="{up}../assets/{ART[selected][0]}" alt="{E(ART[selected][1],quote=True)}" width="160" height="106">'
    return f'''<section class="booking" id="booking" aria-labelledby="booking-title"><h2 id="booking-title">Plan your stay</h2><form data-book>
{choices}{thumb}<div class="fields"><label>Check-in<input name="arrival" type="date" required></label><label>Check-out<input name="departure" type="date" required></label><label>Guests<select name="guests">{''.join(f'<option value="{n}">{n}</option>' for n in range(1,s['maxGuests']+1))}</select></label><button class="btn" type="submit">Proceed</button></div><p class="book-status" role="status"></p></form><noscript><p>Enable JavaScript to choose dates and continue to secure checkout.</p></noscript></section>'''
def concierge():
    return '''<div class="concierge"><button class="concierge-toggle" type="button" aria-expanded="false" aria-controls="concierge-panel">Ask our concierge</button><section class="chat" id="concierge-panel" hidden aria-labelledby="concierge-title"><div class="chat-head"><h2 id="concierge-title">Ask our concierge</h2><button type="button" data-chat-close aria-label="Close chat">×</button></div><p class="chat-fine">Your chat stays in this browser tab until it closes. Please don’t share personal or payment information.</p><div class="chat-log" role="log" aria-label="Conversation"></div><form data-chat><label for="concierge-msg">Your question</label><div><input id="concierge-msg" name="message" maxlength="400" required><button class="btn">Send</button></div></form></section></div>'''
def wrap_rules(custom=None):
    if custom is not None:
        rules=[]
        for line in re.split(r'\n\s*\n',custom.strip()):
            line=re.sub(r'^\d+\.\s*','',line).replace('please call 911','contact emergency services')
            if line: rules.append(el('li',line))
        return '<ul class="rules">'+''.join(rules)+'</ul>'
    return '<dl class="rules">'+''.join(f'<div><dt>{E(a)}</dt><dd>{E(b)}</dd></div>' for a,b in RULES)+'</dl>'
def facts_strip():
    return ''.join(f'<li><strong>{short(i)}</strong><span>{facts(i)}</span><span>{highlights(i)}</span></li>' for i in IDS)
def cards():
    return ''.join(f'''<article class="rental">{photo("assets/"+ART[i][0],ART[i][1],attr='loading="lazy" width="600" height="400"')}
<div><p class="eyebrow">{'Oakdale' if i!='728474' else 'Parkgate'}</p><h3><a href="{P[i]['page']}">{short(i)}</a></h3><p>{facts(i)}</p><p>{highlights(i)}</p><a class="btn" href="direct/?stay={i}#booking">Proceed<span class="sr"> with {short(i)}</span></a></div></article>''' for i in IDS)
def prices(up='', ids=IDS):
    rows=[('direct',f'<a href="{up}direct/">Direct<span>vacationrentals.oilgaterealty.com/direct</span></a>'),('airbnb','Airbnb'),('vrbo','Vrbo'),('booking','Booking.com')]
    return '''<section id="compare" class="wrap section"><p class="eyebrow">Real prices</p><h2>Compare the next seven nights</h2><p>Average nightly price in USD by rental and booking site.</p>
<div class="table-wrap" tabindex="0" role="region" aria-label="Nightly price table"><table><caption>7-night average nightly price <small id="price-check"></small></caption><thead><tr><th scope="col">Booking site</th>'''+''.join(f'<th scope="col">{short(i)}</th>' for i in ids)+'''</tr></thead><tbody>'''+''.join('<tr><th scope="row">'+name+'</th>'+''.join(f'<td data-price="{i}:{channel}">—</td>' for i in ids)+'</tr>' for channel,name in rows)+'''</tbody></table></div><p class="small">Two guests. Direct shows base calendar rates, before taxes, adjustments or promotions. Channel prices are the available public offers for those dates. Check the final total and terms before confirming.</p></section>'''
def home():
    faq=[
      ('Am I booking a room or an entire rental?', 'An entire rental. At Oakdale, the basement laundry is shared.'),
      ('How old do I need to be to book?', 'The person booking must be 18 or older.'),
      ('What time is check-in and check-out?', 'Check in from 3:00 PM and check out by 11:00 AM.'),
      ('Can I bring a pet?', 'All three rentals are pet-free.'),
      ('Where can I see the full price and cancellation terms?', 'Select your rental, dates and guest count. Secure checkout shows the total and terms before you confirm.'),
    ]
    return f'''<section class="hero">{city('main',attr='fetchpriority="high"')}<div class="wrap hero-inner"><span class="badge"><span aria-hidden="true">★</span> No cleaning fees</span><h1>Make yourself at home in Akron.</h1><p class="lead">Three distinct rentals, each with three bedrooms and a private kitchen.</p>
<ul class="hero-facts">{facts_strip()}</ul>{book('')}</div></section>
<div class="gold-strip"><div class="wrap"><span>Private kitchens</span><span>Wi-Fi</span><span>Cable TV</span><span>Up to 6 guests</span></div></div>
<section class="wrap section" id="rentals"><p class="eyebrow">Rentals</p><h2>Find your Akron home base</h2><div class="rental-grid">{cards()}</div></section>
<section class="stone" id="experience"><div class="wrap section feature"><div><p class="eyebrow">The experience</p><h2>An easy Akron day</h2><p>Make coffee in your kitchen, head downtown, and come back to a living room of your own. Explore Highland Square or take a walk at Sand Run Metro Park.</p></div><div class="photo-window">{city('cascade',attr='loading="lazy"')}</div></div></section>
<section class="wrap section"><div class="promise"><span class="promise-star" aria-hidden="true">★</span><strong>{E(OT['cleaning'])}</strong><small>{E(OT['cleaningException'])}</small></div></section>
{prices()}<section class="stone" id="rules"><div class="wrap section feature"><div><p class="eyebrow">Rules and terms</p><h2>Before you book</h2>{wrap_rules()}</div>{city('airdock',attr='loading="lazy"')}</div></section>
<section class="wrap section faq" id="faq"><p class="eyebrow">FAQ</p><h2>Good to know</h2>{''.join('<details>'+el('summary',q)+el('p',a)+'</details>' for q,a in faq)}</section>'''
def detail(i):
    p=P[i]
    gallery=p.get('retainedPhotos') or p['photos']
    photos=''.join(photo(x['url'],x['alt'],attr='loading="lazy" decoding="async" width="480" height="360"') for x in gallery)
    amen=''.join(f'<div><h3>{E(k.replace("-"," ").title())}</h3><ul>'+''.join(el('li','Bathtub' if x=='Hot Tub' else x) for x in a)+'</ul></div>' for k,a in p['amenities'].items() if any(x!='Hot Tub' for x in a))
    policies={k:v for k,v in p['policies'].items() if 'deposit' not in k.lower()}
    policies['Security deposit']='Review the current hold and payment terms at secure checkout.'
    desc=p['description']
    if not isinstance(desc,str): desc=''
    if i=='728474': desc=re.sub(r'\btwo[- ]bedroom\b|\b2[- ]bedroom\b','three-bedroom',desc,flags=re.I)
    articles=''.join(el('p',x.strip()) for x in desc.split('\n') if x.strip() and not re.search(r'lodgify|\bcall\b|[\d]{3}[-.]\d{3}[-.]\d{4}',x,re.I))
    return f'''<section class="hero unit">{city(ART[i][2],attr='fetchpriority="high"')}<div class="wrap hero-inner"><p class="eyebrow">Oilgate Signature</p><h1>{short(i)}</h1><p class="lead">{facts(i)}</p><p>{highlights(i)}</p>{book('',i,True)}</div></section>
<section class="wrap section"><p class="eyebrow">The rental</p><h2>Inside {short(i)}</h2>{articles}<p><strong>Sleeping:</strong> {E(' · '.join(p['bedTypes']))}</p><p><strong>Check-in:</strong> {E(p['checkin'])} · <strong>Check-out:</strong> {E(p['checkout'])}</p><div class="gallery">{photos}</div></section>
<section class="stone"><div class="wrap section"><h2>Amenities</h2><div class="amenities">{amen}</div></div></section>
<section class="wrap section feature"><div><h2>Before you book</h2><p>Guests 18+ to book.</p>{wrap_rules(p['houseRules'])}<p>{E(OT['liability'])}</p></div><div><h2>Booking policies</h2><dl class="rules">{''.join(f'<div><dt>{E(k)}</dt><dd>{E(v)}</dd></div>' for k,v in policies.items())}</dl><a class="btn" href="#booking">Proceed</a></div></section>{prices(ids=[i])}'''
def direct():
    return f'''<section class="hero unit">{city('lock3','../','fetchpriority="high"')}<div class="wrap hero-inner"><h1>Book direct</h1><p class="lead">Pick your Akron rental, dates and guest count. Guests 18+ to book.</p>{book('../')}</div></section>'''
def lost():
    return '''<section class="wrap section lost"><p class="eyebrow">404</p><h1>That page took a detour.</h1><p>Guests 18+ to book.</p><a class="btn" href="index.html#rentals">Find a rental</a> <a href="direct/">Book direct</a></section>'''
def emit(path,title,desc,body,keys,up='',pid=''):
    f=PRE/path
    f.parent.mkdir(parents=True,exist_ok=True)
    public=f'{head(title,desc,up)}<body data-asset-base="{up}assets/" data-property="{pid}">{header(up)}{concierge()}<main id="main">{body}</main>{footer(up,keys)}</body></html>\n'
    if re.search(r'lodgify|tel:|call your host|suspended|not entered|prices not|\bwhole\b',public,re.I): raise ValueError('Forbidden preview wording: '+path)
    f.write_text(public,encoding='utf-8')
emit('index.html','Akron vacation rentals','Explore three distinctive Akron rentals and compare nightly prices.',home(),['main','cascade','airdock'])
for i in IDS: emit(P[i]['page'],short(i),facts(i),detail(i),[ART[i][2]],pid=i)
emit('direct/index.html','Book direct','Choose an Akron rental, dates and guests.',direct(),['lock3'],up='../')
emit('404.html','Page not found','Find your way back to Oilgate Vacation Rentals.',lost(),[])
# Public information for the deterministic concierge. Keep source data, private endpoints, and deposit amounts out.
keep={i:{'name':short(i),'guests':P[i]['maxGuests'],'facts':facts(i),'bedTypes':P[i]['bedTypes'], 'highlights':highlights(i),'checkin':P[i]['checkin'],'checkout':P[i]['checkout'],'pets':P[i]['petsAllowed'],'cancellation':P[i]['policies'].get('Cancellation Policy','Check current checkout terms.')} for i in IDS}
(PRE/'assets/catalog.json').write_text(json.dumps(keep,ensure_ascii=False,indent=2)+'\n',encoding='utf-8')
