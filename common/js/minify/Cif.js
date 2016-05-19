function encode64(a){for(var b,c,d,e,f,g,h,i="",j=0,k=a.length,l="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";k>j;)b=a.charCodeAt(j++),c=a.charCodeAt(j++),d=a.charCodeAt(j++),e=b>>2,f=(3&b)<<4|c>>4,g=(15&c)<<2|d>>6,h=63&d,isNaN(c)?g=h=64:isNaN(d)&&(h=64),i=i+l.charAt(e)+l.charAt(f)+l.charAt(g)+l.charAt(h);return i}GIFEncoder=function(){function a(){this.bin=[]}for(var b=0,c={};256>b;b++)c[b]=String.fromCharCode(b);a.prototype.getData=function(){for(var a="",b=this.bin.length,d=0;b>d;d++)a+=c[this.bin[d]];return a},a.prototype.writeByte=function(a){this.bin.push(a)},a.prototype.writeUTFBytes=function(a){for(var b=a.length,c=0;b>c;c++)this.writeByte(a.charCodeAt(c))},a.prototype.writeBytes=function(a,b,c){for(var d=c||a.length,e=b||0;d>e;e++)this.writeByte(a[e])};var d,e,f,g,h,i,j,k,l,m={},n=null,o=-1,p=0,q=!1,r=[],s=7,t=-1,u=!1,v=!0,w=!1,x=10,y="Generated by jsgif (https://github.com/antimatter15/jsgif/)",z=(m.setDelay=function(a){p=Math.round(a/10)},m.setDispose=function(a){a>=0&&(t=a)},m.setRepeat=function(a){a>=0&&(o=a)},m.setTransparent=function(a){n=a},m.setComment=function(a){y=a},m.addFrame=function(a,b){var c=!0;try{b?h=a:(h=a.getImageData(0,0,a.canvas.width,a.canvas.height).data,w||A(a.canvas.width,a.canvas.height)),D(),B(),v&&(H(),J(),o>=0&&I()),E(),""!==y&&F(),G(),v||J(),L(),v=!1}catch(d){c=!1}return c},m.finish=function(){if(!q)return!1;var a=!0;q=!1;try{g.writeByte(59)}catch(b){a=!1}return a},function(){f=0,h=null,i=null,j=null,l=null,u=!1,v=!0}),A=(m.setFrameRate=function(a){15!=a&&(p=Math.round(100/a))},m.setQuality=function(a){1>a&&(a=1),x=a},m.setSize=function(a,b){q&&!v||(d=a,e=b,1>d&&(d=320),1>e&&(e=240),w=!0)}),B=(m.start=function(){z();var b=!0;u=!1,g=new a;try{g.writeUTFBytes("GIF89a")}catch(c){b=!1}return q=b},m.cont=function(){z();var b=!0;return u=!1,g=new a,q=b},function(){var a=i.length,b=a/3;j=[];var c=new NeuQuant(i,a,x);l=c.process();for(var d=0,e=0;b>e;e++){var g=c.map(255&i[d++],255&i[d++],255&i[d++]);r[g]=!0,j[e]=g}i=null,k=8,s=7,null!==n&&(f=C(n))}),C=function(a){if(null===l)return-1;for(var b=(16711680&a)>>16,c=(65280&a)>>8,d=255&a,e=0,f=16777216,g=l.length,h=0;g>h;){var i=b-(255&l[h++]),j=c-(255&l[h++]),k=d-(255&l[h]),m=i*i+j*j+k*k,n=h/3;r[n]&&f>m&&(f=m,e=n),h++}return e},D=function(){var a=d,b=e;i=[];for(var c=h,f=0,g=0;b>g;g++)for(var j=0;a>j;j++){var k=g*a*4+4*j;i[f++]=c[k],i[f++]=c[k+1],i[f++]=c[k+2]}},E=function(){g.writeByte(33),g.writeByte(249),g.writeByte(4);var a,b;null===n?(a=0,b=0):(a=1,b=2),t>=0&&(b=7&t),b<<=2,g.writeByte(0|b|0|a),K(p),g.writeByte(f),g.writeByte(0)},F=function(){g.writeByte(33),g.writeByte(254),g.writeByte(y.length),g.writeUTFBytes(y),g.writeByte(0)},G=function(){g.writeByte(44),K(0),K(0),K(d),K(e),v?g.writeByte(0):g.writeByte(128|s)},H=function(){K(d),K(e),g.writeByte(240|s),g.writeByte(0),g.writeByte(0)},I=function(){g.writeByte(33),g.writeByte(255),g.writeByte(11),g.writeUTFBytes("NETSCAPE2.0"),g.writeByte(3),g.writeByte(1),K(o),g.writeByte(0)},J=function(){g.writeBytes(l);for(var a=768-l.length,b=0;a>b;b++)g.writeByte(0)},K=function(a){g.writeByte(255&a),g.writeByte(a>>8&255)},L=function(){var a=new LZWEncoder(d,e,j,k);a.encode(g)};m.stream=function(){return g},m.setProperties=function(a,b){q=a,v=b};return m},LZWEncoder=function(){var a,b,c,d,e,f,g,h,i,j,k,l,m={},n=-1,o=12,p=5003,q=o,r=1<<o,s=[],t=[],u=p,v=0,w=!1,x=0,y=0,z=[0,1,3,7,15,31,63,127,255,511,1023,2047,4095,8191,16383,32767,65535],A=[],B=m.LZWEncoder=function(e,f,g,h){a=e,b=f,c=g,d=Math.max(2,h)},C=function(a,b){A[l++]=a,l>=254&&G(b)},D=function(a){E(u),v=j+2,w=!0,J(j,a)},E=function(a){for(var b=0;a>b;++b)s[b]=-1},F=m.compress=function(a,b){var c,d,e,f,m,o,p;for(i=a,w=!1,g=i,h=H(g),j=1<<a-1,k=j+1,v=j+2,l=0,f=I(),p=0,c=u;65536>c;c*=2)++p;p=8-p,o=u,E(o),J(j,b);a:for(;(e=I())!=n;)if(c=(e<<q)+f,d=e<<p^f,s[d]!=c){if(s[d]>=0){m=o-d,0===d&&(m=1);do if((d-=m)<0&&(d+=o),s[d]==c){f=t[d];continue a}while(s[d]>=0)}J(f,b),f=e,r>v?(t[d]=v++,s[d]=c):D(b)}else f=t[d];J(f,b),J(k,b)},G=(m.encode=function(c){c.writeByte(d),e=a*b,f=0,F(d+1,c),c.writeByte(0)},function(a){l>0&&(a.writeByte(l),a.writeBytes(A,0,l),l=0)}),H=function(a){return(1<<a)-1},I=function(){if(0===e)return n;--e;var a=c[f++];return 255&a},J=function(a,b){for(x&=z[y],y>0?x|=a<<y:x=a,y+=g;y>=8;)C(255&x,b),x>>=8,y-=8;if((v>h||w)&&(w?(h=H(g=i),w=!1):(++g,h=g==q?r:H(g))),a==k){for(;y>0;)C(255&x,b),x>>=8,y-=8;G(b)}};return B.apply(this,arguments),m},NeuQuant=function(){var a,b,c,d,e,f={},g=256,h=499,i=491,j=487,k=503,l=3*k,m=g-1,n=4,o=100,p=16,q=1<<p,r=10,s=10,t=q>>s,u=q<<r-s,v=g>>3,w=6,x=1<<w,y=v*x,z=30,A=10,B=1<<A,C=8,D=1<<C,E=A+C,F=1<<E,G=[],H=[],I=[],J=[],K=f.NeuQuant=function(a,f,h){var i,j;for(b=a,c=f,d=h,e=new Array(g),i=0;g>i;i++)e[i]=new Array(4),j=e[i],j[0]=j[1]=j[2]=(i<<n+8)/g,I[i]=q/g,H[i]=0},L=function(){for(var a=[],b=new Array(g),c=0;g>c;c++)b[e[c][3]]=c;for(var d=0,f=0;g>f;f++){var h=b[f];a[d++]=e[h][0],a[d++]=e[h][1],a[d++]=e[h][2]}return a},M=function(){var a,b,c,d,f,h,i,j;for(i=0,j=0,a=0;g>a;a++){for(f=e[a],c=a,d=f[1],b=a+1;g>b;b++)h=e[b],h[1]<d&&(c=b,d=h[1]);if(h=e[c],a!=c&&(b=h[0],h[0]=f[0],f[0]=b,b=h[1],h[1]=f[1],f[1]=b,b=h[2],h[2]=f[2],f[2]=b,b=h[3],h[3]=f[3],f[3]=b),d!=i){for(G[i]=j+a>>1,b=i+1;d>b;b++)G[b]=a;i=d,j=a}}for(G[i]=j+m>>1,b=i+1;256>b;b++)G[b]=m},N=function(){var e,f,g,m,p,q,r,s,t,u,v,x,A,C;for(l>c&&(d=1),a=30+(d-1)/3,x=b,A=0,C=c,v=c/(3*d),u=v/o|0,s=B,q=y,r=q>>w,1>=r&&(r=0),e=0;r>e;e++)J[e]=s*((r*r-e*e)*D/(r*r));for(t=l>c?3:c%h!==0?3*h:c%i!==0?3*i:c%j!==0?3*j:3*k,e=0;v>e;)if(g=(255&x[A+0])<<n,m=(255&x[A+1])<<n,p=(255&x[A+2])<<n,f=R(g,m,p),Q(s,f,g,m,p),0!==r&&P(r,f,g,m,p),A+=t,A>=C&&(A-=c),e++,0===u&&(u=1),e%u===0)for(s-=s/a,q-=q/z,r=q>>w,1>=r&&(r=0),f=0;r>f;f++)J[f]=s*((r*r-f*f)*D/(r*r))},O=(f.map=function(a,b,c){var d,f,h,i,j,k,l;for(j=1e3,l=-1,d=G[b],f=d-1;g>d||f>=0;)g>d&&(k=e[d],h=k[1]-b,h>=j?d=g:(d++,0>h&&(h=-h),i=k[0]-a,0>i&&(i=-i),h+=i,j>h&&(i=k[2]-c,0>i&&(i=-i),h+=i,j>h&&(j=h,l=k[3])))),f>=0&&(k=e[f],h=b-k[1],h>=j?f=-1:(f--,0>h&&(h=-h),i=k[0]-a,0>i&&(i=-i),h+=i,j>h&&(i=k[2]-c,0>i&&(i=-i),h+=i,j>h&&(j=h,l=k[3]))));return l},f.process=function(){return N(),O(),M(),L()},function(){var a;for(a=0;g>a;a++)e[a][0]>>=n,e[a][1]>>=n,e[a][2]>>=n,e[a][3]=a}),P=function(a,b,c,d,f){var h,i,j,k,l,m,n;for(j=b-a,-1>j&&(j=-1),k=b+a,k>g&&(k=g),h=b+1,i=b-1,m=1;k>h||i>j;){if(l=J[m++],k>h){n=e[h++];try{n[0]-=l*(n[0]-c)/F,n[1]-=l*(n[1]-d)/F,n[2]-=l*(n[2]-f)/F}catch(o){}}if(i>j){n=e[i--];try{n[0]-=l*(n[0]-c)/F,n[1]-=l*(n[1]-d)/F,n[2]-=l*(n[2]-f)/F}catch(o){}}}},Q=function(a,b,c,d,f){var g=e[b];g[0]-=a*(g[0]-c)/B,g[1]-=a*(g[1]-d)/B,g[2]-=a*(g[2]-f)/B},R=function(a,b,c){var d,f,h,i,j,k,l,m,o,q;for(m=~(1<<31),o=m,k=-1,l=k,d=0;g>d;d++)q=e[d],f=q[0]-a,0>f&&(f=-f),h=q[1]-b,0>h&&(h=-h),f+=h,h=q[2]-c,0>h&&(h=-h),f+=h,m>f&&(m=f,k=d),i=f-(H[d]>>p-n),o>i&&(o=i,l=d),j=I[d]>>s,I[d]-=j,H[d]+=j<<r;return I[k]+=t,H[k]-=u,l};return K.apply(this,arguments),f},function(a,b){"use strict";var c=function(a){this.encoder=new GIFEncoder,this.worker=null,this.canvas=b.getElementById(a.id),this.ctx=this.canvas.getContext("2d"),this.playBtn=null,this.stopBtn=null,this.dlBtn=null,this.imgElm=null,this.frameIndex=0,this.frameLen=0,this.loopCount=a.loopCount||0,this.fps=a.fps||100,this.delay=a.delay||100,this.doRecLoop=!1,this.init()},d=c.prototype;d.domElm=b.createElement("div"),d.doWorker=!0,d.init=function(){this.doWorker?this.worker=new Worker("common/js/develop/animWorker.js"):(this.encoder.setSize(this.canvas.width,this.canvas.height),this.encoder.setRepeat(this.loopCount),this.encoder.setDelay(this.delay)),this.createDomElements()},d.createDomElements=function(){var a=this,c=this.domElm,d=b.getElementsByTagName("body")[0],e=b.createElement("div"),f=b.createElement("div"),g=b.createElement("div"),h=b.createElement("a"),i=b.createElement("img");e.id="cif-base",f.id="cif-nav__play-btn",g.id="cif-nav__stop-btn",h.id="cif-nav__dl-btn",c.id="cif-nav",i.id="cif-result",f.setAttribute("class","is-played"),c.appendChild(f),c.appendChild(g),c.appendChild(h),d.appendChild(c),d.appendChild(i),f.addEventListener("click",function(){a.doWorker?a.recStartWorker():a.recStart()}),g.addEventListener("click",function(){a.doWorker?a.recFinishWorker():a.recFinish()}),this.playBtn=f,this.stopBtn=g,this.dlBtn=h,this.imgElm=i},d.recStart=function(){this.imgElm.className="",this.imgElm.src="",this.playBtn.className="",this.stopBtn.className+="is-played",this.dlBtn.className="",this.encoder.start(),this.doRecLoop=!0,this.recFrame()},d.recStartWorker=function(){this.imgElm.className="",this.imgElm.src="",this.playBtn.className="",this.stopBtn.className+="is-played",this.dlBtn.className="",console.log("start");var a=this,b={delay:this.delay,repeat:0,width:a.canvas.width,height:a.canvas.height};this.worker.postMessage({cmd:"start",data:b}),this.doRecLoop=!0,this.doWorker?this.recFrameWorker():this.recFrame()},d.recFrame=function(){return this.doRecLoop?(this.encoder.addFrame(this.ctx,!0),void setTimeout(this.recFrame.bind(this),this.fps)):!1},d.recFrameWorker=function(){if(!this.doRecLoop)return!1;var a=this;this.worker.postMessage({cmd:"frame",data:a.ctx.getImageData(0,0,a.canvas.width,a.canvas.height).data}),setTimeout(this.recFrameWorker.bind(this),this.fps)},d.recFinish=function(){var a=this;"data:image/gif;base64,"+encode64(a.encoder.stream().getData());this.doRecLoop=!1,this.encoder.finish(),this.recFinishCallback(),console.log("finish")},d.recFinishWorker=function(){var a=this,b=function(c){var d="data:image/gif;base64,"+encode64(c.data);a.recFinishCallback(d),a.worker.removeEventListener("message",b,!1)};this.doRecLoop=!1,this.worker.addEventListener("message",b,!1),this.worker.postMessage({cmd:"finish"}),console.log("finish")},d.recFinishCallback=function(a){console.log("finish callBack"),this.imgElm.src=a,this.imgElm.className+="is-displayed",this.dlBtn.href=a,this.dlBtn.setAttribute("download","cif-generate.gif"),this.playBtn.className+="is-played",this.stopBtn.className="",this.dlBtn.className+="is-played",this.doRecLoop=!1},a.Cif=c}(window,document);