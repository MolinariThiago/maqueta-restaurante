const KEY='lumbre-demo-v2';
const MEDIOS=['Efectivo','Débito','Crédito','Mercado Pago','Transferencia'];
const DIAS=['Dom','Lun','Mar','Mié','Jue','Vie','Sáb'];
const CATS=['Promos online','Prime','Clásicos','Combos','Pides turcas','Tostados','Deli','Bebidas'];
const CANALES={whatsapp:{n:'WhatsApp',b:'b-wa'},web:{n:'Web',b:'b-blue'},tel:{n:'Teléfono',b:'b-amber'}};
/* ============ utilidades ============ */
const money=n=>'$ '+Math.round(n).toLocaleString('es-AR');
const fq=n=>(+n.toFixed(2)).toLocaleString('es-AR');
const uid=()=>Math.random().toString(36).slice(2,9);
const minsAgo=m=>Date.now()-m*60000;
const hhmm=ts=>new Date(ts).toLocaleTimeString('es-AR',{hour:'2-digit',minute:'2-digit'});
const fecha=ts=>new Date(ts).toLocaleDateString('es-AR',{day:'2-digit',month:'2-digit'});
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const P=id=>S.productos.find(p=>p.id===id);
const INS=id=>S.insumos.find(i=>i.id===id);
const PROV=id=>S.proveedores.find(p=>p.id===id);
const ago=ts=>{const m=Math.round((Date.now()-ts)/60000);return m<1?'recién':m<60?`hace ${m} min`:`hace ${Math.floor(m/60)} h ${m%60} min`};
const itemsTxt=items=>items.map(i=>`${i.qty}× ${P(i.pid).nombre}${i.nota?` (${i.nota})`:''}`).join(', ');
const val=id=>document.getElementById(id)?.value;

/* ============ datos de ejemplo ============ */
function seed(){
 const insumos=[
  ['kebab','Carne de kebab marinada','kg',18,12,'p1',9500],['picada','Carne picada especiada','kg',3.5,4,'p1',7500],
  ['panceta','Panceta ahumada','kg',1.8,1.5,'p1',12000],
  ['vegetales','Mix de vegetales (lechuga, repollo, tomate, cebolla, pepino)','kg',9,6,'p2',2200],
  ['papa','Papa bastón congelada','kg',22,15,'p2',2600],
  ['pucha','Pan pucha casero','u',60,80,'p5',350],['tortilla','Tortilla de trigo','u',45,40,'p5',280],
  ['masa','Bollo de masa para pide','u',18,25,'p5',300],['tapas','Tapas de empanada','u',70,48,'p5',90],
  ['muzza','Muzzarella','kg',7,5,'p3',8500],['cheddar','Cheddar','kg',2.2,3,'p3',9800],['roque','Roquefort','kg',1.5,1,'p3',14000],
  ['huevo','Huevos','u',120,90,'p6',220],['jamon','Jamón cocido','kg',2,1.5,'p6',11000],['salame','Salame crespón','kg',1.2,1,'p6',13000],
  ['salsas','Salsas caseras (base)','l',6,5,'p6',3500],['aceite','Aceite de girasol','l',14,10,'p6',2400],
  ['gas500','Gaseosa 500 ml','u',40,36,'p4',1300],['lata','Gaseosa lata 354 ml','u',30,24,'p4',1000],
  ['agua','Agua 500 ml','u',18,24,'p4',700],['birra','Cerveza lata 473 ml','u',48,36,'p4',2000],
  ['laton','Latón Heineken 710 ml','u',14,12,'p4',3600],['sinalc','Cerveza sin alcohol','u',10,8,'p4',1600],
  ['alfajor','Alfajores caseros','u',14,10,'p5',1600],['cookie','Cookies','u',12,10,'p5',1300],
  ['canela','Canela rolls','u',4,6,'p5',1700],['budin','Budín de pan','u',8,6,'p5',1500]
 ].map(([id,nombre,unidad,stock,min,prov,costo])=>({id,nombre,unidad,stock,min,prov,costo}));
 // recetas base (por unidad vendida)
 const R={
  kebab:[['kebab',.15],['pucha',1],['vegetales',.08],['salsas',.03]],
  kebabv:[['pucha',1],['muzza',.06],['huevo',1],['vegetales',.1],['salsas',.03]],
  durum:[['kebab',.18],['tortilla',1],['vegetales',.08],['salsas',.03]],
  durumv:[['tortilla',1],['muzza',.08],['huevo',2],['vegetales',.1],['salsas',.03]],
  papas:[['papa',.25],['aceite',.05]],emp:[['picada',.04],['tapas',1]],
  stick:[['picada',.06],['masa',.3]],stickr:[['picada',.06],['masa',.3],['roque',.02]],
  club:[['tortilla',1],['kebab',.18],['vegetales',.05],['huevo',2],['salsas',.03]],
  dcheese:[['pucha',1],['kebab',.25],['cheddar',.05],['muzza',.05],['salsas',.03]],
  quesa:[['tortilla',2],['cheddar',.05],['muzza',.06],['kebab',.18],['salsas',.02]],
  quesav:[['tortilla',2],['huevo',2],['cheddar',.05],['muzza',.06]],
  pide_trad:[['masa',1],['picada',.12]],pide_huevo:[['masa',1],['picada',.12],['huevo',1]],
  pide_muzza:[['masa',1],['muzza',.12]],pide_3q:[['masa',1],['muzza',.08],['cheddar',.04],['roque',.03]],
  pide_chp:[['masa',1],['muzza',.08],['cheddar',.05],['panceta',.05]],pide_napo:[['masa',1],['muzza',.1],['vegetales',.05]],
  t_jyq:[['pucha',1],['muzza',.06],['jamon',.04]],t_3q:[['pucha',1],['muzza',.05],['cheddar',.03],['roque',.02]],
  t_sal:[['pucha',1],['muzza',.06],['salame',.04]],t_veg:[['pucha',1],['muzza',.06],['huevo',1]],
  alf_m:[['alfajor',1]],alf_c:[['alfajor',1]],canela:[['canela',1]],cookie:[['cookie',1]],budin:[['budin',1]],
  agua:[['agua',1]],coca:[['gas500',1]],lata:[['lata',1]],birra:[['birra',1]],laton:[['laton',1]],sinalc:[['sinalc',1]]
 };
 // combos y promos: la receta es la suma de sus componentes
 const C=(...comp)=>({comp});
 const mix=comp=>{const m={};comp.forEach(([id,q])=>R[id].forEach(([i,c])=>m[i]=+((m[i]||0)+c*q).toFixed(3)));return Object.entries(m)};
 const productos=[
  ['p_kemp','Kebab + 2 empanadas','Promos online',10250,C(['kebab',1],['emp',2]),'Kebab sandwich + 2 empanadas de carne (dulces o saladas). Exclusivo tienda online.',11400],
  ['p_comp','Para compartir: 2 kebab + 2 papas','Promos online',25650,C(['kebab',2],['papas',2]),'Dos kebab sandwich y dos porciones de papas fritas.',27000],
  ['p_duo','Durum dúo','Promos online',18500,C(['durum',2]),'Dos durum completos con salsa a elección. Sin papas.',19000],
  ['p_x4','Combo amiguero kebab x4','Promos online',30000,C(['kebab',4]),'Cuatro kebab para compartir. Aclará salsas y vegetales de cada uno en comentarios.',32000],
  ['p_6emp','6 empanadas de carne','Promos online',9200,C(['emp',6]),'Media docena, dulces o saladas según disponibilidad.',10200],
  ['club','Club sandwich','Prime',15900,R.club,'Tortilla crocante, kebab de carne, lechuga, tomate, huevo y salsa in&out. Cortado a la mitad.'],
  ['dcheese','Doble cheese kebab burger','Prime',15900,R.dcheese,'Más de 550 g: carne de kebab, salsa in&out, cheddar y muzzarella.'],
  ['quesa','Quesadilla super explo','Prime',15900,R.quesa,'Tortilla, cheddar, muzza, carne de kebab y mayo. Con criolla o chimi.'],
  ['quesav','Quesadilla veggie','Prime',10500,R.quesav,'Tortilla, mayo, 2 huevos, cheddar y muzza. Con criolla o chimi.'],
  ['kebab','Kebab sandwich','Clásicos',8000,R.kebab,'Pan pucha casero, carne marinada con especias, vegetales frescos y salsa a elección adentro.'],
  ['kebabv','Kebab veggie','Clásicos',8000,R.kebabv,'Pan pucha, muzzarella, huevo duro, todos nuestros vegetales y salsa a elección.'],
  ['durum','Durum','Clásicos',9500,R.durum,'Tortilla casera enrollada con carne, vegetales y salsa a elección. No incluye papas.'],
  ['durumv','Durum veggie','Clásicos',9500,R.durumv,'Tortilla casera, vegetales, extra muzzarella y 2 huevos duros.'],
  ['papas','Papas fritas','Clásicos',5500,R.papas,'Porción individual, bien crocantes.'],
  ['emp','Empanada de carne','Clásicos',1700,R.emp,'Dulce o salada, al horno.'],
  ['stick','Stick de carne','Clásicos',2900,R.stick,'Snack de pide turca: carne picada especiada envuelta en masa fina, al horno.'],
  ['stickr','Stick roquefort','Clásicos',3500,R.stickr,'Nuestro stick de carne con un toque de roquefort.'],
  ['c1','Combo 1: kebab + papas','Combos',13500,C(['kebab',1],['papas',1]),'Kebab sandwich + porción de papas fritas.'],
  ['c2','Combo 2: kebab + papas + bebida','Combos',16500,C(['kebab',1],['papas',1],['coca',1]),'Kebab sandwich, papas y bebida sin alcohol de 500 ml.'],
  ['c3','Combo 3: durum + papas','Combos',15000,C(['durum',1],['papas',1]),'Durum + porción de papas fritas.'],
  ['c4','Combo 4: durum + papas + bebida','Combos',18000,C(['durum',1],['papas',1],['coca',1]),'Durum, papas y bebida sin alcohol de 500 ml.'],
  ['c9','Combo 9: kebab + stick','Combos',10900,C(['kebab',1],['stick',1]),'Kebab sandwich + stick de carne.'],
  ['c11','Combo 11: quesadilla + papas + bebida','Combos',24400,C(['quesa',1],['papas',1],['coca',1]),'Quesadilla super explosiva, papas y bebida de 500 ml.'],
  ['pide_trad','Pide tradicional','Pides turcas',7500,R.pide_trad,'Pizza turca individual: masa liviana y crocante rellena con nuestra carne especiada.'],
  ['pide_huevo','Pide tradicional con huevo','Pides turcas',8500,R.pide_huevo,'La tradicional con un huevo arriba.'],
  ['pide_muzza','Pide muzzarella','Pides turcas',6000,R.pide_muzza,'Masa crocante con muzzarella gratinada.'],
  ['pide_3q','Pide 3 quesos','Pides turcas',7000,R.pide_3q,'Muzza, cheddar y roquefort.'],
  ['pide_chp','Pide cheddar y panceta','Pides turcas',9000,R.pide_chp,'Muzza, cheddar y panceta crocante.'],
  ['pide_napo','Pide napolitana','Pides turcas',7000,R.pide_napo,'Muzza, rúcula y cherrys.'],
  ['t_jyq','Tostado de jamón y queso','Tostados',4700,R.t_jyq,'Pan pucha con manteca, jamón, muzzarella y un toque de mayo.'],
  ['t_3q','Tostado 3 quesos','Tostados',5500,R.t_3q,'Cheddar, roquefort y muzzarella gratinada.'],
  ['t_sal','Tostado de salame y queso','Tostados',5500,R.t_sal,'Muzzarella gratinada con salame crespón.'],
  ['t_veg','Tostado veggie','Tostados',4000,R.t_veg,'Muzzarella y huevo duro.'],
  ['alf_m','Alfajor de maicena','Deli',4000,R.alf_m,'Casero, con un toque de limón y mucho dulce de leche. 150 g.'],
  ['alf_c','Alfajor de chocolate','Deli',4500,R.alf_c,'Tapas con sabor a naranja, dulce de leche y baño de chocolate.'],
  ['canela','Canela roll','Deli',4600,R.canela,'Brioche relleno de canela, tibio y con crema fría.'],
  ['cookie','Cookie red velvet','Deli',3800,R.cookie,'Rellena de queso crema, sin colorantes artificiales.'],
  ['budin','Budín de pan','Deli',4000,R.budin,'Porción individual con caramelo.'],
  ['coca','Gaseosa 500 ml','Bebidas',3000,R.coca,'Línea Coca-Cola. Elegí el sabor.'],
  ['lata','Gaseosa lata','Bebidas',2500,R.lata,'354 ml. Elegí el sabor.'],
  ['agua','Agua 500 ml','Bebidas',2500,R.agua,'Con o sin gas.'],
  ['birra','Cerveza lata 473 ml','Bebidas',4200,R.birra,'Imperial: Golden, IPA, Roja o Cream Stout.'],
  ['laton','Latón Heineken 710 ml','Bebidas',6850,R.laton,'Bien fría.'],
  ['sinalc','Cerveza sin alcohol','Bebidas',3500,R.sinalc,'Heineken 0.0, 355 ml.']
 ].map(([id,nombre,cat,precio,r,desc,antes])=>({id,nombre,cat,precio,receta:r.comp?mix(r.comp):r,desc,antes:antes||null}));
 const D=60*24;
 const proveedores=[
  {id:'p1',nombre:'Frigorífico Don Ramón',rubro:'Carnes',contacto:'Ramón',tel:'5491155550101',email:'pedidos@donramon.com.ar',cta:[
    {ts:minsAgo(D*12),tipo:'factura',detalle:'Fact. A 0003-00012845',monto:412000},{ts:minsAgo(D*6),tipo:'pago',detalle:'Transferencia',monto:250000},{ts:minsAgo(D*3),tipo:'factura',detalle:'Fact. A 0003-00012990',monto:318000}]},
  {id:'p2',nombre:'Verdulería El Huerto',rubro:'Verduras y papas',contacto:'Carla',tel:'5491155550202',email:'elhuerto.ventas@gmail.com',cta:[
    {ts:minsAgo(D*5),tipo:'factura',detalle:'Remito 4471',monto:84000},{ts:minsAgo(D*5),tipo:'pago',detalle:'Efectivo',monto:84000},{ts:minsAgo(D*1),tipo:'factura',detalle:'Remito 4502',monto:71500}]},
  {id:'p3',nombre:'Lácteos del Valle',rubro:'Quesos',contacto:'Hernán',tel:'5491155550303',email:'comercial@lacteosdelvalle.com.ar',cta:[
    {ts:minsAgo(D*9),tipo:'factura',detalle:'Fact. A 0001-00077120',monto:156000}]},
  {id:'p4',nombre:'Distribuidora Norte',rubro:'Bebidas',contacto:'Pablo',tel:'5491155550404',email:'pedidos@distnorte.com.ar',cta:[
    {ts:minsAgo(D*8),tipo:'factura',detalle:'Fact. A 0012-00034510',monto:340000},{ts:minsAgo(160),tipo:'pago',detalle:'Transferencia',monto:120000}]},
  {id:'p5',nombre:'Panadería Anatolia',rubro:'Pan pucha, tortillas, masas y pastelería',contacto:'Emre',tel:'5491155550505',email:'pedidos@anatolia.com.ar',cta:[
    {ts:minsAgo(D*4),tipo:'factura',detalle:'Fact. B 0004-00009981',monto:118500},{ts:minsAgo(D*2),tipo:'pago',detalle:'Mercado Pago',monto:60000}]},
  {id:'p6',nombre:'Mayorista Sur',rubro:'Almacén y fiambres',contacto:'Lorena',tel:'5491155550606',email:'ventas@mayoristasur.com.ar',cta:[
    {ts:minsAgo(D*7),tipo:'factura',detalle:'Fact. B 0007-00021450',monto:92300},{ts:minsAgo(D*3),tipo:'pago',detalle:'Transferencia',monto:92300}]}
 ];
 const it=a=>a.map(([pid,qty])=>({pid,qty}));
 const sub=items=>items.reduce((a,i)=>a+productos.find(p=>p.id===i.pid).precio*i.qty,0);
 const ventas=[
  [300,'Mesa 3',[['kebab',2],['papas',1],['birra',2]],'Crédito'],[280,'Mesa 6',[['durum',1],['quesa',1],['coca',2]],'Efectivo'],
  [265,'Pedido #098 · Web',[['c2',2]],'Mercado Pago'],[240,'Mesa 1',[['pide_trad',2],['stick',2],['birra',3]],'Débito'],
  [220,'Mostrador',[['kebab',1],['alf_c',1]],'Efectivo'],[190,'Mesa 5',[['dcheese',2],['laton',2]],'Mercado Pago'],
  [150,'Pedido #099 · WhatsApp',[['p_x4',1],['coca',2]],'Efectivo'],[120,'Mesa 4',[['club',1],['durum',2],['lata',3]],'Transferencia'],
  [80,'Pedido #100 · Teléfono',[['c1',2],['emp',3]],'Efectivo'],[45,'Mesa 2',[['kebab',3],['pide_chp',1],['canela',2]],'Débito'],
  [30,'Mostrador',[['c4',1]],'Mercado Pago']
 ].map(([m,concepto,a,medio])=>{const items=it(a);return{id:uid(),ts:minsAgo(m),tipo:'venta',concepto,medio,items,monto:sub(items),desc:0}});
 const movs=[...ventas,
  {id:uid(),ts:minsAgo(270),tipo:'gasto',concepto:'Hielo',cat:'Insumos',monto:6000,medio:'Efectivo'},
  {id:uid(),ts:minsAgo(200),tipo:'gasto',concepto:'Service del asador vertical',cat:'Mantenimiento',monto:45000,medio:'Transferencia'},
  {id:uid(),ts:minsAgo(100),tipo:'gasto',concepto:'Adelanto de sueldo (Lucas)',cat:'Sueldos',monto:30000,medio:'Efectivo'},
  {id:uid(),ts:minsAgo(160),tipo:'pago_prov',concepto:'Pago a Distribuidora Norte',monto:120000,medio:'Transferencia',provId:'p4'}
 ].sort((a,b)=>b.ts-a.ts);
 const mesas=[];
 for(let n=1;n<=10;n++)mesas.push({id:'m'+n,n,zona:n<=6?'Salón':'Barra',cap:[4,2,4,6,2,4,2,2,2,2][n-1],estado:'libre',items:[],abierta:null,mozo:null});
 const occ={2:[[['kebab',2],['papas',1],['birra',2]],25,'Lucas','ocupada'],4:[[['p_comp',1],['coca',2]],40,'Martina','cuenta'],
            7:[[['durum',1],['sinalc',1]],10,'Diego','ocupada'],9:[[['quesa',1],['laton',1]],18,'Sofía','ocupada']};
 Object.entries(occ).forEach(([n,[a,m,mozo,estado]])=>Object.assign(mesas[n-1],{items:it(a),abierta:minsAgo(m),mozo,estado}));
 const pedidos=[
  {num:101,canal:'whatsapp',cliente:'Julieta Ramos',tel:'11 6234-1188',tipo:'delivery',dir:'Av. Rivadavia 4520, 3° B',items:it([['c2',2],['emp',2]]),medio:'Efectivo',pagado:false,estado:'nuevo',ts:minsAgo(3)},
  {num:102,canal:'web',cliente:'Martín Ferreyra',tel:'11 5567-9021',tipo:'retiro',dir:'',items:it([['durum',1],['pide_3q',1],['agua',2]]),medio:'Mercado Pago',pagado:true,estado:'cocina',ts:minsAgo(14)},
  {num:103,canal:'tel',cliente:'Ana Beltrán',tel:'11 4433-2210',tipo:'delivery',dir:'Yerbal 1290',items:it([['p_x4',1],['coca',4]]),medio:'Efectivo',pagado:false,estado:'listo',ts:minsAgo(26)},
  {num:104,canal:'web',cliente:'Diego Sosa',tel:'11 3012-7745',tipo:'delivery',dir:'Acoyte 655, PB',items:it([['dcheese',1],['papas',1],['laton',1]]),medio:'Mercado Pago',pagado:true,estado:'enviado',ts:minsAgo(41)}
 ].map(p=>({...p,id:uid(),total:sub(p.items),desc:[]}));
 const todos=[0,1,2,3,4,5,6];
 const promos=[
  {id:uid(),nombre:'Happy hour: 2x1 en cervezas en lata',tipo:'2x1',pid:'birra',dias:todos,desde:'18:00',hasta:'21:00',activa:true},
  {id:uid(),nombre:'Martes de pides −20%',tipo:'pct',pct:20,alcance:'cat:Pides turcas',dias:[2],desde:'00:00',hasta:'24:00',activa:true},
  {id:uid(),nombre:'Durum + stick a $11.000',tipo:'combo',pids:['durum','stick'],precio:11000,dias:todos,desde:'00:00',hasta:'24:00',activa:true},
  {id:uid(),nombre:'10% pagando en efectivo',tipo:'medio',pct:10,medio:'Efectivo',dias:todos,desde:'00:00',hasta:'24:00',activa:true},
  {id:uid(),nombre:'Mediodía: −15% en clásicos',tipo:'pct',pct:15,alcance:'cat:Clásicos',dias:[1,2,3,4,5],desde:'12:00',hasta:'15:00',activa:false}
 ];
 return {insumos,productos,proveedores,movs,mesas,pedidos,promos,ordenes:[],stockLog:[],arqueos:[],
   caja:{abierta:true,inicial:40000,apertura:minsAgo(330)},seqPedido:105,sim:null,autoSim:false,view:'inicio'};
}

/* ============ estado ============ */
let S;
const LOCAL_DEF={horarios:[['11:00','23:00']],envio:1500,envioGratis:30000,minimo:8000,
 demoraDelivery:'30–45 min',demoraRetiro:'15–20 min',alias:'bodegon.lumbre',titular:'Bodegón Lumbre SRL',whatsapp:'5491155550000',direccion:'Av. Gaona 2840, Flores'};
const DESC_PROD={};
function load(){try{S=JSON.parse(localStorage.getItem(KEY))}catch(e){} if(!S||!S.insumos)S=seed();
 S.local={...LOCAL_DEF,...(S.local||{})};S.productos.forEach(p=>{if(p.desc==null)p.desc=DESC_PROD[p.id]||''});}
/* ============ horarios ============ */
const toMin=h=>+h.slice(0,2)*60+ +h.slice(3,5);
const fromMin=m=>String(Math.floor(m/60)%24).padStart(2,'0')+':'+String(m%60).padStart(2,'0');
const abiertoAhora=(dh=getDH())=>S.local.horarios.some(([a,b])=>dh.hora>=a&&dh.hora<b);
function horariosProgramables(dh=getDH()){const out=[],now=toMin(dh.hora);
 S.local.horarios.forEach(([a,b])=>{for(let t=Math.max(toMin(a)+30,Math.ceil((now+45)/30)*30);t<=toMin(b)-30;t+=30)out.push({v:fromMin(t),n:'Hoy '+fromMin(t)})});
 if(out.length<4){const [a,b]=S.local.horarios[0];for(let t=toMin(a)+30;t<=toMin(b)-30&&out.length<10;t+=30)out.push({v:'Mañana '+fromMin(t),n:'Mañana '+fromMin(t)})}
 return out}
const proximaApertura=(dh=getDH())=>{const r=S.local.horarios.find(([a])=>a>dh.hora);return r?'hoy a las '+r[0]:'mañana a las '+S.local.horarios[0][0]};
const costoEnvio=(sub,tipo)=>tipo!=='delivery'||sub>=S.local.envioGratis?0:S.local.envio;
function save(){try{localStorage.setItem(KEY,JSON.stringify(S))}catch(e){}}
/* ============ promociones / cálculo ============ */
function getDH(){if(S.sim)return S.sim;const d=new Date();return{dia:d.getDay(),hora:d.toTimeString().slice(0,5)}}
const promoVigente=(p,dh=getDH())=>p.activa&&p.dias.includes(dh.dia)&&dh.hora>=p.desde&&dh.hora<p.hasta;
function calc(items,medio){
 // i.extra: adicionales con precio elegidos en la tienda online (por unidad)
 let sub=0;items.forEach(i=>sub+=(P(i.pid).precio+(i.extra||0))*i.qty);
 const qty=id=>items.filter(i=>i.pid===id).reduce((a,i)=>a+i.qty,0);
 const act=S.promos.filter(p=>promoVigente(p));const desc=[];
 act.forEach(pr=>{let m=0;
  if(pr.tipo==='pct'){const [k,v]=pr.alcance.split(':');items.forEach(i=>{const p=P(i.pid);if((k==='cat'&&p.cat===v)||(k==='pid'&&p.id===v))m+=p.precio*i.qty*pr.pct/100})}
  if(pr.tipo==='2x1'&&P(pr.pid))m=Math.floor(qty(pr.pid)/2)*P(pr.pid).precio;
  if(pr.tipo==='combo'){const n=Math.min(...pr.pids.map(qty));if(n>0)m=Math.max(0,n*(pr.pids.reduce((a,id)=>a+P(id).precio,0)-pr.precio))}
  if(m>0)desc.push({n:pr.nombre,m})});
 let tot=sub-desc.reduce((a,d)=>a+d.m,0);
 act.filter(p=>p.tipo==='medio'&&p.medio===medio).forEach(pr=>{const m=tot*pr.pct/100;if(m>0){desc.push({n:pr.nombre,m});tot-=m}});
 return{sub,desc,tot:Math.round(tot)};
}

function registrarVenta(items,medio,concepto,c=calc(items,medio)){
 S.movs.unshift({id:uid(),ts:Date.now(),tipo:'venta',concepto,medio,items:items.map(i=>({...i})),monto:c.tot,desc:c.desc.reduce((a,d)=>a+d.m,0)});
 const antes=new Set(S.insumos.filter(i=>i.stock<i.min).map(i=>i.id));
 items.forEach(i=>P(i.pid).receta.forEach(([iid,q])=>{const x=INS(iid);if(x)x.stock=Math.max(0,+(x.stock-q*i.qty).toFixed(3))}));
 S.insumos.filter(i=>i.stock<i.min&&!antes.has(i.id)).forEach(i=>HOOKS.lowStock(i));
 save();
}
const HOOKS={lowStock:()=>{}};
// d.envio opcional (tienda online); el total del pedido lo incluye
function addPedido(d){const c=calc(d.items,d.medio),envio=d.envio||0;
 const p={...d,id:uid(),num:S.seqPedido++,estado:'nuevo',ts:Date.now(),hist:{nuevo:Date.now()},envio,total:c.tot+envio,desc:c.desc,items:d.items.map(i=>({...i}))};
 S.pedidos.push(p);if(p.pagado)registrarVenta(p.items,p.medio,`Pedido #${p.num} · ${CANALES[p.canal].n}`,{...c,tot:p.total});save();return p}
// un producto está disponible si hay stock de todos los insumos de su receta
const disponible=p=>p.receta.every(([iid,q])=>{const x=INS(iid);return !x||x.stock>=q});
