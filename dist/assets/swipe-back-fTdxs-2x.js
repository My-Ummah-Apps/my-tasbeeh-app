import{c as D,a as M}from"./index-BYN_qF5m.js";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const h=e=>e&&e.dir!==""?e.dir.toLowerCase()==="rtl":(document==null?void 0:document.dir.toLowerCase())==="rtl";/*!
 * (C) Ionic http://ionicframework.com - MIT License
 */const b=(e,m,g,p,w)=>{const c=e.ownerDocument.defaultView;let o=h(e);const v=t=>{const{startX:n}=t;return o?n>=c.innerWidth-50:n<=50},a=t=>o?-t.deltaX:t.deltaX,X=t=>o?-t.velocityX:t.velocityX;return D({el:e,gestureName:"goback-swipe",gesturePriority:101,threshold:10,canStart:t=>(o=h(e),v(t)&&m()),onStart:g,onMove:t=>{const n=a(t)/c.innerWidth;p(n)},onEnd:t=>{const r=a(t),n=c.innerWidth,s=r/n,i=X(t),f=n/2,d=i>=0&&(i>.2||r>f),u=(d?1-s:s)*n;let l=0;if(u>5){const y=u/Math.abs(i);l=Math.min(y,540)}w(d,s<=0?.01:M(0,s,.9999),l)}})};export{b as createSwipeBackGesture};
