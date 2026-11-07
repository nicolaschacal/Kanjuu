# Simulación de economía v2: árbol real, regiones, repetición espaciada y compuertas de aprendizaje.
import random, json, sys
D=json.load(open('tools/kanji.json')); K=D['K']; R=D['R']
P=json.loads(sys.argv[2]) if len(sys.argv)>2 else {}
g=lambda k,d: P.get(k,d)
BASE,LVK,MK,CAPH=g('base',1),g('lvk',.2),g('mk',.6),g('cap',4)
PULL,NEWP,GATE=g('pull',100),g('newp',.25),g('gate',1)
GPLUS,EXPNEW,DOJO,TRAIN=g('gplus',0),g('expnew',.45),g('dojo',2),g('train',1)
SRS=[0,8,24,72,168,384,840]
need=lambda lv: 12+lv*8; evoLv=lambda d: 5+(d-1)*3
rankNeed=lambda r: 60+r*r*25
ROWS=[60,130,220,340,500,720,1000]; ROWR=[2,3,5,7,9,11,13]
def run(seed, kind='normal'):
    random.seed(seed)
    sess={'casual':[(20,8)],'normal':[(8,5),(13,5),(21,15)],'intenso':[(8,10),(13,10),(18,10),(22,30)]}[kind]
    st=dict(ink=20,rank=1,xp=0,tk=1,rows=3,objs=0,pity=0); cs=[]; srs={}; owned=set(); earn={}
    def E(k,v): st['ink']+=v; earn[k]=earn.get(k,0)+v
    def addxp(n):
        st['xp']+=n
        while st['xp']>=rankNeed(st['rank']): st['xp']-=rankNeed(st['rank']); st['rank']+=1; E('rango',20+st['rank']*10); st['tk']+=1
    size=lambda k:{0:1,1:2}.get(K[k]['dep'],4)
    tiles=lambda: sum(size(c['k']) for c in cs if c['on'])+st['objs']
    def add(k):
        c=dict(k=k,lv=1,exp=0,on=tiles()+size(k)<=st['rows']*6,insp=0); cs.append(c)
        if k not in owned: owned.add(k); srs[k]=[0,0]
        return c
    def give(c,x):
        c['exp']+=x; u=0
        while c['lv']<15 and c['exp']>=need(c['lv']): c['exp']-=need(c['lv']); c['lv']+=1; u+=1
        return u
    m=lambda k: srs[k][0] if k in srs else 0
    def grade(k,t,ok=True):
        b,due=srs[k]
        if due>t: return
        b=min(6,b+1) if ok else max(0,b-2); srs[k]=[b,t+SRS[b]]
    rate=lambda c,t: 0 if not c['on'] else (BASE+c['lv']*LVK+m(c['k'])*MK)*(1+.5*(size(c['k'])>1)+(size(c['k'])>2)*.5)*.85*(2 if c['insp']>t else 1)
    add(random.choice('木日火')); last=None; firsts=set(); hist=[]
    for day in range(1,31):
        for hour,mins in sess:
            t=day*24+hour; dt=0 if last is None else min(CAPH,t-last); last=t
            E('producción',sum(rate(c,t-dt) for c in cs)*dt+st['objs']*min(st['objs'],3)*2*dt/st['objs'] if st['objs'] else sum(rate(c,t-dt) for c in cs)*dt)
            nT=max(1,mins//2.5)
            for _ in range(int(nT)):
                on=[c for c in cs if c['on']]; c=max(on,key=lambda c:(c['lv']<15,-abs(c['lv']-8))) if random.random()<.6 else random.choice(on)
                s=random.choice([1,2,2,3,3,3]); u=give(c,[3,10,16,24][s]*1.2); E('entrenar',(s+u*3)*TRAIN); addxp(6+s*4)
                if s>=2: grade(c['k'],t); c['insp']=t+1
            due=[k for k in srs if srs[k][1]<=t]
            for k in due: grade(k,t,random.random()<.82)
            E('dojo',int(len(due)*.82)*DOJO); addxp(len(due)*2)
            for _ in range(1 if mins<=10 else 2): E('academia',30); addxp(13)
            reg=max(i for i,r in enumerate(R) if len(owned)>=r['need'])
            r=R[reg]; E('viajes',4+r['secs']/15)
            if reg not in firsts or random.random()<EXPNEW:
                firsts.add(reg); fresh=[k for k in r['drops'] if k not in owned]
                add(fresh[0] if fresh and random.random()<.8 else random.choice(r['drops']))
            if hour==sess[-1][0]: E('misiones',58); E('login',60 if day%7 else 0); st['tk']+=(1 if day%7 in (2,5) else 0)+(3 if day%7==0 else 0)
            if hour==sess[-1][0] and day%7==0: E('semanales',200)
            # fusión / evolución con compuerta de aprendizaje
            for k,info in K.items():
                if k in owned or not info['r']: continue
                for rec in info['r']:
                    gate=info['dep']*GATE+GPLUS
                    pool=[c for c in cs]; used=[]; ok=True
                    for p in rec:
                        cand=[c for c in pool if c['k']==p and c not in used]
                        if not cand or m(p)<gate: ok=False; break
                        used.append(cand[0])
                    evo=[c for c in cs if c['k'] in rec and c['lv']>=evoLv(info['dep']) and m(c['k'])>=gate and all(x in owned for x in rec)]
                    if ok and len(used)==len(rec):
                        for c in used: cs.remove(c)
                        add(k); addxp(40); break
                    if evo:
                        cs.remove(evo[0]); add(k); addxp(40); break
            # compras
            if st['objs']<6 and st['ink']>=40*(1.5**st['objs'])+PULL: E('gasto objetos',-40*(1.5**st['objs'])); st['objs']+=1
            i=st['rows']-3
            if tiles()>=st['rows']*6-1 and i<len(ROWS) and st['rank']>=ROWR[i] and st['ink']>=ROWS[i]: E('gasto terreno',-ROWS[i]); st['rows']+=1
            pool=[k for r in R if len(owned)>=r['need'] for k in r['drops']]
            while st['tk']>0 or st['ink']>=PULL*1.5:
                if st['tk']>0: st['tk']-=1
                else: E('gasto invocar',-PULL)
                st['pity']+=1; un=[k for k in pool if k not in owned]
                k=random.choice(un) if un and (random.random()<NEWP or st['pity']>=10) else random.choice(pool)
                if k not in owned: st['pity']=0
                add(k)
                if len([c for c in cs if not c['on']])>10: cs.remove([c for c in cs if not c['on']][0]); E('liberar',10)
        if day in (1,2,3,5,7,10,14,21,30):
            inc=sum(v for k,v in earn.items() if not k.startswith('gasto'))
            hist.append((day,len(owned),sum(1 for k in owned if K[k]['r']),st['rank'],int(st['ink']),int(inc/day)))
    return hist,earn
kind=sys.argv[1] if len(sys.argv)>1 else 'normal'
H=[run(s,kind)[0] for s in range(20)]
print(f'== {kind} {P}')
for i,row in enumerate(H[0]):
    avg=[sum(h[i][j] for h in H)/len(H) for j in range(6)]
    print(f"día {row[0]:2}: kanji {avg[1]:4.1f}/40 (compuestos {avg[2]:4.1f}) · rango {avg[3]:4.1f} · tinta guardada {avg[4]:6.0f} · ingreso/día {avg[5]:5.0f}")
_,e=run(1,kind); tot=sum(v for k,v in e.items() if v>0)
print('origen tinta:', {k:f"{v/tot*100:.0f}%" for k,v in sorted(e.items(),key=lambda x:-x[1]) if v>0})
