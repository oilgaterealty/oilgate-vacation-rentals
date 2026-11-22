#!/usr/bin/env python3
"""Collect verified public USD nightly prices, and never guess missing values."""
from argparse import ArgumentParser
from datetime import datetime, timedelta, timezone
from decimal import Decimal, InvalidOperation, ROUND_HALF_UP
from html.parser import HTMLParser
import json, os, re, sys
from pathlib import Path
from urllib.error import HTTPError, URLError
from urllib.parse import urlencode, urlsplit, urlunsplit
from urllib.request import HTTPRedirectHandler, Request, build_opener
from urllib.robotparser import RobotFileParser
from zoneinfo import ZoneInfo

ROOT = Path(__file__).resolve().parents[2]
PROPERTIES = {'603326':670117,'603323':670114,'728474':795590}
HOSTS = {'airbnb':'www.airbnb.com','vrbo':'www.vrbo.com','booking':'www.booking.com'}
PARAMS = {'airbnb':('check_in','check_out','adults','currency'),'vrbo':('startDate','endDate','adults','currency'),'booking':('checkin','checkout','group_adults','selected_currency')}
AGENT='OilgateRateComparison/1.0'
class NoRedirect(HTTPRedirectHandler):
    def redirect_request(self, req, fp, code, msg, headers, newurl): return None
OPEN=build_opener(NoRedirect)
def read(url,headers=None):
    request=Request(url,headers={'User-Agent':AGENT,**(headers or {})})
    with OPEN.open(request,timeout=9) as response:
        raw=response.read(5_000_001)
        if len(raw)>5_000_000: raise ValueError('document size')
        return raw.decode('utf-8','replace')
def calendar_days(now):
    start=now.astimezone(ZoneInfo('America/New_York')).date()+timedelta(days=1)
    return [start+timedelta(days=n) for n in range(7)]
def decimal(value):
    if isinstance(value,bool) or not isinstance(value,(int,float,str,Decimal)): raise ValueError('invalid price')
    try: result=Decimal(str(value))
    except InvalidOperation: raise ValueError('invalid price')
    if not result.is_finite() or result<=0 or result>=100000: raise ValueError('invalid price')
    return result
def average(rows):
    return float((sum((decimal(x['price']) for x in rows),Decimal(0))/7).quantize(Decimal('0.01'),rounding=ROUND_HALF_UP))
def direct_url(pid,dates):
    return 'https://api.lodgify.com/v2/rates/calendar?'+urlencode({'houseId':pid,'roomTypeId':PROPERTIES[pid],'startDate':dates[0].isoformat(),'endDate':dates[-1].isoformat()})
def direct_rows(pid, dates, data):
    values=data if isinstance(data,list) else data.get('results',[])
    matches=[x for x in values if str(x.get('houseId'))==pid and x.get('roomTypeId')==PROPERTIES[pid] and x.get('derivedRateId')==0 and x.get('currencyCode')=='USD']
    if len(matches)!=1: raise ValueError('missing or ambiguous base USD rate')
    result={}
    for row in matches[0].get('dates',[]):
        d=row.get('date')
        if isinstance(d,dict): d=f"{d.get('year',0):04d}-{d.get('month',0):02d}-{d.get('day',0):02d}"
        w=row.get('weeklyPrice')
        if not isinstance(w,dict) or w.get('isByDefault') or not w.get('minStay',8)<=7<=w.get('maxStay',0): continue
        if w.get('pricePerAdditionalGuest') not in (None,0): continue
        if d in result: raise ValueError('duplicate rate day')
        result[d]=float(decimal(w.get('pricePerDay')))
    keys=[d.isoformat() for d in dates]
    if not all(k in result for k in keys): raise ValueError('incomplete seven-night rate series')
    return [{'date':k,'price':result[k]} for k in keys]
class JsonLd(HTMLParser):
    def __init__(self): super().__init__(); self.parts=[]; self.active=False
    def handle_starttag(self,tag,attrs):
        if tag=='script' and dict(attrs).get('type')=='application/ld+json':
            self.parts.append(''); self.active=True
    def handle_endtag(self,tag):
        if tag=='script': self.active=False
    def handle_data(self,data):
        if self.active:self.parts[-1]+=data
def objects(value):
    if isinstance(value,list):
        for x in value: yield from objects(x)
    if isinstance(value,dict):
        yield value
        for x in value.values(): yield from objects(x)
def public_price(body, start, end):
    parser=JsonLd();parser.feed(body);found=set()
    for payload in parser.parts:
        try: data=json.loads(payload)
        except ValueError: continue
        for o in objects(data):
            if o.get('@type')!='Offer' or o.get('priceCurrency')!='USD': continue
            if o.get('checkinTime')!=start or o.get('checkoutTime')!=end or o.get('numberOfGuests')!=2: continue
            if str(o.get('availability','')).rsplit('/',1)[-1]!='InStock': continue
            try: found.add(decimal(o.get('price')))
            except ValueError: pass
    if len(found)!=1: raise ValueError('no explicit dated USD offer')
    return float(found.pop())
ROBOTS={}
def public_rows(channel,base,dates):
    u=urlsplit(base)
    if u.scheme!='https' or u.netloc!=HOSTS[channel] or u.query or u.fragment or not u.path.startswith('/'):
        raise ValueError('unapproved source URL')
    if u.netloc not in ROBOTS:
        p=RobotFileParser(); p.parse(read('https://'+u.netloc+'/robots.txt').splitlines());ROBOTS[u.netloc]=p
    p=ROBOTS[u.netloc];keys=PARAMS[channel]; nights=[];sources=[]
    for d in dates:
        a=d.isoformat();b=(d+timedelta(days=1)).isoformat()
        query=dict(zip(keys,[a,b,'2','USD']))
        if channel=='booking': query.update(group_children='0',no_rooms='1')
        target=urlunsplit((u.scheme,u.netloc,u.path,urlencode(query),''))
        if not p.can_fetch(AGENT,target): raise ValueError('robots disallows price request')
        nights.append({'date':a,'price':public_price(read(target),a,b)});sources.append(target)
    return nights,sources
def main():
    p=ArgumentParser();p.add_argument('--direct-snapshot',type=Path,help='Private one-time verified raw calendar response, never commit it');p.add_argument('--output',type=Path,default=ROOT/'data/prices.json');p.add_argument('--as-of',help='Explicit timestamp allowed only for a local authenticated snapshot');a=p.parse_args()
    if a.as_of and not a.direct_snapshot:p.error('--as-of requires --direct-snapshot')
    now=datetime.fromisoformat(a.as_of) if a.as_of else datetime.now(timezone.utc)
    checked=now.astimezone(timezone.utc).isoformat(timespec='seconds')
    dates=calendar_days(now)
    channels=json.loads((ROOT/'scripts/prices/channels.json').read_text())
    snapshot=json.loads(a.direct_snapshot.read_text()) if a.direct_snapshot else None
    key=os.environ.get('LODGIFY_API_KEY')
    out={'checkedAt':checked,'dates':[d.isoformat() for d in dates],'rentals':{}}
    successes=0
    for pid in PROPERTIES:
        dest=out['rentals'][pid]={}
        for c in ('direct',*HOSTS):
            try:
                if c=='direct':
                    source=direct_url(pid,dates)
                    if snapshot is None and not key: raise ValueError('LODGIFY_API_KEY not configured')
                    body=snapshot[pid] if snapshot is not None else json.loads(read(source,{'X-ApiKey':key,'Accept':'application/json'}))
                    nights=direct_rows(pid,dates,body)
                    method='direct-weekly-calendar-base';sources=[source]
                else:
                    source=channels.get(pid,{}).get(c)
                    if not source: raise ValueError('public listing URL not verified')
                    nights,sources=public_rows(c,source,dates);method='public-dated-one-night-offer'
                dest[c]={'checkedAt':checked,'currency':'USD','sourceUrl':source,'sourceUrls':sources,'method':method,'nightly':nights,'average':average(nights)}
                print(pid,c,'seven nightly values; average',dest[c]['average'])
                successes+=1
            except HTTPError as e: print(pid,c,'HTTP',e.code,'(no alternate route attempted)')
            except (URLError,TimeoutError): print(pid,c,'source unavailable')
            except (KeyError,TypeError,ValueError) as e:
                # Avoid echoing remote response bodies, raw numbers, payloads, or credentials.
                msg=e.args[0] if type(e) is ValueError and isinstance(e.args[0],str) and e.args[0] in {
                    'LODGIFY_API_KEY not configured','public listing URL not verified','no explicit dated USD offer','robots disallows price request','missing or ambiguous base USD rate','incomplete seven-night rate series','unapproved source URL'} else 'source format not accepted'
                print(pid,c,msg)
    if successes==0: return 1 # preserve the last snapshot; frontend blanks it at 48 hours
    tmp=a.output.with_suffix('.tmp');tmp.write_text(json.dumps(out,indent=2)+'\n');tmp.replace(a.output)
    return 0
if __name__=='__main__': sys.exit(main())
