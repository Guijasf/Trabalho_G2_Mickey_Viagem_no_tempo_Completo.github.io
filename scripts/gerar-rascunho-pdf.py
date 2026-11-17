"""Preenche rascunho do formulário oficial, nunca afirma verificação do gabarito."""
import csv
from pathlib import Path
import fitz
BASE=Path(__file__).resolve().parent.parent
source=BASE/'entrega'/'ENUNCIADO_ORIGINAL.pdf'
out=BASE/'entrega'/'FORMULARIO_RASCUNHO_REVISAR.pdf'
rows=list(csv.DictReader((BASE/'entrega'/'GABARITO_PROVISORIO.csv').open(encoding='utf-8-sig'),delimiter=';'))
assert len(rows)==150
p=fitz.open(source)
name=p[0]
name.insert_text((70,144), 'Guilherme Familiar do Amaral',fontsize=8.5,fontname='helv',color=(0.11,0.29,0.25))
# Matrículas dos integrantes e link do Snack não foram fornecidos; não inventar.
third=p[2]
third.draw_rect(fitz.Rect(30,744,300,761),color=None,fill=(1,1,1),overlay=True)
third.insert_text((31,756),'Pense Bem - Disney: Viagem no Tempo',fontsize=10,fontname='hebo',color=(0.06,0.28,0.23))
third.insert_text((30,833),'RASCUNHO: 18 respostas inferidas, todas as letras requerem conferencia.',fontsize=7,color=(0.7,0.15,0.08))
for i,code in enumerate(['151','152','153','154','155']):
 page=p[3]
 y=[110,276,443,610,777][i]
 page.draw_rect(fitz.Rect(30,y-1,500,y+17),color=None,fill=(1,1,1),overlay=True)
 page.insert_text((31,y+11),f'Programa {code} - 30 perguntas',fontsize=9,fontname='hebo')
# x centres from the printed 30-column table; row centres top-to-bottom = A/B/C/D.
centers_x=[45.8+(n*17.9) for n in range(30)]
grid_centers={0:[175.4,187.3,199.3,211.5],1:[341.4,353.5,365.8,378],2:[509.2,521.3,533.6,545.9],3:[675.6,688,700.2,712.5],4:[104.8,116.9,128.9,141.0]}
for program_index,code in enumerate(['151','152','153','154','155']):
 page=p[3] if program_index<4 else p[4]
 ys=grid_centers[program_index]
 for j,entry in enumerate(x for x in rows if x['programa']==code):
  label=entry['alternativa'];status=entry['status']
  idx='ABCD'.index(label)
  cx=centers_x[j];cy=ys[idx]
  if status=='provisional':
   # Circulo vazado laranja: hipótese não verificada.
   page.draw_circle(fitz.Point(cx,cy),3.0,color=(0.82,0.34,0.10),width=1.3)
  else:
   page.draw_circle(fitz.Point(cx,cy),2.2,color=(0.12,0.22,0.24),fill=(0.12,0.22,0.24))
p[4].insert_text((31,175),'RASCUNHO - NAO ENTREGAR SEM VALIDACAO',fontsize=12,fontname='hebo',color=(0.72,0.20,0.06))
p[4].insert_text((31,197),'Bola vazada laranja: hipotese nao conferida (18 de 150).',fontsize=9)
p[4].insert_text((31,211),'Bola preenchida: resposta adaptada do livro, tambem sem gabarito oficial.',fontsize=9)
p[4].insert_text((31,237),'Faltam: matricula(s), eventual grupo, confirmacao do livro e link Snack publicado.',fontsize=9,color=(0.66,0.2,0.12))
p[4].insert_text((31,252),'A pagina 27 do livro nao mostra figuras A, B, C, E e F completas.',fontsize=9,color=(0.66,0.2,0.12))
p.set_metadata({'title':'Rascunho AV2 Mobile - Pense Bem Mickey - gabarito nao verificado'})
p.save(out,garbage=4,deflate=True)
print(out)
