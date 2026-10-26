"""Aggregate official public SIM CSV without publishing individual records."""
import csv, io, json, zipfile, hashlib
from pathlib import Path
from collections import Counter
root = Path(__file__).resolve().parents[1]
states = json.loads((root/'public/data/states.json').read_text(encoding='utf-8'))
ids = {s['id']:s['uf'] for s in states}
counts = Counter({s['uf']:0 for s in states})
audit = Counter()
archive = root/'data/raw/DO24OPEN_csv.zip'
with zipfile.ZipFile(archive) as z:
    names = [n for n in z.namelist() if n.lower().endswith('.csv')]
    if len(names) != 1: raise ValueError('CSV inesperado')
    with io.TextIOWrapper(z.open(names[0]), encoding='utf-8-sig') as f:
        for r in csv.DictReader(f, delimiter=';'):
            audit['records'] += 1
            if r['TIPOBITO'] == '1': audit['fetal'] += 1; continue
            if r['TIPOBITO'] != '2': raise ValueError('TIPOBITO desconhecido')
            if not r['DTOBITO'].endswith('2024'): audit['otherYear'] += 1; continue
            code = r['CODMUNRES'].strip()
            if code[:2] in ids:
                counts[ids[code[:2]]] += 1
            elif code.startswith('99'): audit['foreignOrUnknown99'] += 1
            else: audit['unknownResidence'] += 1
assert all(v>0 for v in counts.values()) and len(counts)==27
assert sum(counts.values()) + sum(v for k,v in audit.items() if k!='records') == audit['records']
result={'year':'2024','residence':'CODMUNRES','deathType':'TIPOBITO=2 (não fetal)','deaths':dict(counts),'totalResidentDeaths':sum(counts.values()),'audit':dict(audit),'sourceUrl':'https://dadosabertos.saude.gov.br/dataset/sim/resource/f0bdf83f-708e-4de9-9582-959055844ae9','downloadUrl':'https://s3.sa-east-1.amazonaws.com/ckan.saude.gov.br/SIM/csv/DO24OPEN_csv.zip','sha256':hashlib.file_digest(archive.open('rb'),'sha256').hexdigest()}
(root/'data/raw/mortality-2024-aggregated.json').write_text(json.dumps(result,ensure_ascii=False,indent=2),encoding='utf-8')
print(json.dumps({'UFs':len(counts),'totalResidentDeaths':sum(counts.values()),'audit':dict(audit)},ensure_ascii=False))
