// Interpreter self-tests. Expected outputs follow the C standard (checked by hand).
const H = '#include <stdio.h>\n#include <string.h>\n#include <ctype.h>\n#include <math.h>\n#include <stdlib.h>\n';
const M = b => H + 'int main(){\n' + b + '\nreturn 0;}';
const R = String.raw;
const CASES = [
['hello', M(R`printf("Hello, world!\n");`), '', 'Hello, world!\n'],
['sizeof', M(R`int a; double d; char c; float f; long l; printf("%d %d %d %d %d\n",(int)sizeof(a),(int)sizeof(d),(int)sizeof(c),(int)sizeof(f),(int)sizeof(int*)); int arr[10]; printf("%d %d\n",(int)sizeof(arr),(int)(sizeof(arr)/sizeof(arr[0])));`), '', '4 8 1 4 8\n40 10\n'],
['intdiv', M(R`int a=7,b=2; printf("%d %d %.2f %.2f %d\n",a/b,a%b,(float)a/b,a/2.0,-7/2); float y=7/2; printf("%.1f %d\n",y,(int)3.99);`), '', '3 1 3.50 3.50 -3\n3.0 3\n'],
['incdec', M(R`int i=5; int j=i++; int k=++i; printf("%d %d %d\n",i,j,k); int x=3; x+=4; x*=2; x-=1; x/=3; x%=3; printf("%d\n",x); int a=10; printf("%d ",a--); printf("%d ",--a); printf("%d\n",a);`), '', '7 5 7\n1\n10 8 8\n'],
['logic', M(R`int a=5,b=0; printf("%d %d %d %d %d\n",a&&b,a||b,!a,!b,a>3&&a<10); int c=0; if(b&&(c=1)){} printf("%d\n",c); printf("%d %d\n",3>2>1,5==5);`), '', '0 1 0 1 1\n0\n0 1\n'],
['prec', M(R`printf("%d %d %d %d\n",2+3*4,(2+3)*4,10-4-3,2*3%4); printf("%d %d\n",1+2<4,7&3|8);`), '', '14 20 3 2\n1 11\n'],
['printf-fmt', M(R`printf("[%5d][%-5d][%05d][%+d]\n",42,42,42,42); printf("[%8.2f][%-8.2f][%.0f][%f]\n",3.14159,3.14159,2.5,1.5); printf("[%-10s][%10s][%.3s][%c][%5c]\n","hi","hi","abcdef",'A','B'); printf("%x %X %o %u %e %%\n",255,255,8,7u,12345.678); long l=1234567890123L; printf("%ld %lld %lf\n",l,l,2.5); printf("%g %g %g\n",0.0001,100000.0,1234567.0);`), '', '[   42][42   ][00042][+42]\n[    3.14][3.14    ][2][1.500000]\n[hi        ][        hi][abc][A][    B]\nff FF 10 7 1.234568e+04 %\n1234567890123 1234567890123 2.500000\n0.0001 100000 1.23457e+06\n'],
['printf-ret', M(R`int n=printf("abc\n"); printf("%d\n",n);`), '', 'abc\n4\n'],
['printf-err', M(R`printf("%d\n",3.5);`), '', /expects an integer/],
['printf-err2', M(R`int x=3; printf("%f\n",x);`), '', /expects a float or double/],
['scanf-basic', M(R`int a; float f; char c; char s[20]; scanf("%d %f %c %s",&a,&f,&c,s); printf("%d %.2f %c %s\n",a,f,c,s);`), '7 2.5 z word', '7 2.50 z word\n'],
['scanf-lf', M(R`double d; scanf("%lf",&d); printf("%.2f\n",d*2);`), '1.25', '2.50\n'],
['scanf-lf-err', M(R`double d; scanf("%f",&d);`), '1.25', /%lf/],
['scanf-noamp', M(R`int a; scanf("%d",a);`), '5', /forget the &/],
['scanf-char', M(R`int n; char c; scanf("%d",&n); scanf(" %c",&c); printf("[%d %c]\n",n,c); char d; scanf("%c",&d); printf("[%d]\n",d);`), '4\nq\n', '[4 q]\n[10]\n'],
['scanf-ret', M(R`int a,b; int r=scanf("%d %d",&a,&b); printf("%d\n",r); int x,s=0; while(scanf("%d",&x)==1) s+=x; printf("%d\n",s);`), '3 4 10 20 30', '2\n60\n'],
['if-else', M(R`int s; scanf("%d",&s); if(s>=90) printf("A\n"); else if(s>=80) printf("B\n"); else if(s>=70) printf("C\n"); else printf("F\n"); printf("%s\n", s%2==0?"even":"odd");`), '85', 'B\nodd\n'],
['assign-in-if', M(R`int x=0; if(x=5) printf("yes %d\n",x); else printf("no\n");`), '', 'yes 5\n'],
['switch', M(R`int x=2; switch(x){case 1: printf("one\n"); break; case 2: printf("two\n"); case 3: printf("three\n"); break; default: printf("other\n");} char g='z'; switch(g){case 'a': puts("a"); break; default: puts("dflt"); break; case 'b': puts("b");}`), '', 'two\nthree\ndflt\n'],
['loops', M(R`int i=0; do{ i++; if(i==2) continue; if(i>4) break; printf("%d ",i);}while(1); printf("\n"); for(int k=1;k<=3;k++){ for(int m=0;m<k;m++) printf("*"); printf("\n"); } int n=5,f=1; while(n>1){ f*=n; n--; } printf("%d\n",f); for(int a=0,b=10;a<b;a+=3,b-=3) printf("%d-%d ",a,b); printf("\n");`), '', '1 3 4 \n*\n**\n***\n120\n0-10 3-7 \n'],
['infinite', M(R`int i=0; while(i<10){ }`), '', /infinite loop/],
['functions', H + R`int fact(int n); void hi(void){ printf("hi\n"); }
int g=5;
int add(int a,int b){ return a+b; }
void change(int x){ x=99; }
int main(void){ hi(); int v=1; change(v); printf("%d %d %d %d\n",fact(5),g,add(2,3),v); return 0; }
int fact(int n){ if(n<=1) return 1; return n*fact(n-1); }`, '', 'hi\n120 5 5 1\n'],
['recursion', H + R`int fib(int n){ return n<2?n:fib(n-1)+fib(n-2); }
int gcd(int a,int b){ return b==0?a:gcd(b,a%b); }
int main(){ printf("%d %d\n",fib(15),gcd(48,18)); return 0; }`, '', '610 6\n'],
['static', H + R`int counter(){ static int c=0; c++; return c; }
int main(){ counter(); counter(); printf("%d\n",counter()); return 0; }`, '', '3\n'],
['arrays', H + R`#define N 5
int sum(int a[],int n){ int s=0; for(int i=0;i<n;i++) s+=a[i]; return s; }
void twice(int a[],int n){ for(int i=0;i<n;i++) a[i]*=2; }
int main(){ int a[N]={5,3,8,1,9}; int m[2][3]={{1,2,3},{4,5,6}}; printf("%d %d\n",sum(a,N),m[1][2]);
for(int i=0;i<N-1;i++) for(int j=0;j<N-1-i;j++) if(a[j]>a[j+1]){ int t=a[j]; a[j]=a[j+1]; a[j+1]=t; }
for(int i=0;i<N;i++) printf("%d ",a[i]); printf("\n"); twice(a,N); printf("%d\n",a[4]); int z[4]={1}; printf("%d %d\n",z[0],z[3]); int q[]={4,5,6}; printf("%d\n",(int)(sizeof(q)/sizeof(q[0]))); return 0; }`, '', '26 6\n1 3 5 8 9 \n18\n1 0\n3\n'],
['array-2d-fn', H + R`void pr(int m[][3],int r){ for(int i=0;i<r;i++){ for(int j=0;j<3;j++) printf("%d ",m[i][j]); printf("\n"); } }
int main(){ int m[2][3]={1,2,3,4,5,6}; pr(m,2); int n; scanf("%d",&n); int v[n]; for(int i=0;i<n;i++) v[i]=i*i; printf("%d\n",v[n-1]); return 0; }`, '4', '1 2 3 \n4 5 6 \n9\n'],
['oob', M(R`int a[3]={1,2,3}; printf("%d\n",a[3]);`), '', /out of range/],
['oob-write', M(R`int a[3]; for(int i=0;i<=3;i++) a[i]=i;`), '', /out of range/],
['uninit', M(R`int s; s+=1; printf("%d\n",s);`), '', /uninitialized/],
['pointers', H + R`void swap(int *a,int *b){ int t=*a; *a=*b; *b=t; }
int main(){ int x=3,y=4; int *p=&x; *p=10; swap(&x,&y); int a[3]={1,2,3}; int *q=a; printf("%d %d %d %d\n",x,y,*(q+1),q[2]); q++; printf("%d\n",*q);
int *n=NULL; if(n==NULL) printf("null\n"); int **pp=&p; **pp=7; printf("%d %d\n",y,p==&x);
int *e=&a[2]; printf("%d %d\n",(int)(e-a),*e-*a); (*q)++; printf("%d %d\n",a[1],*q++); printf("%d\n",*q); return 0; }`, '', '4 10 2 3\n2\nnull\n10 1\n2 2\n3 3\n3\n'],
['ptr-x', M(R`int x=3,y=4; int *p=&x; *p=10; printf("%d\n",x); int **pp=&p; **pp=7; printf("%d\n",x);`), '', '10\n7\n'],
['null-deref', M(R`int *p=NULL; *p=5;`), '', /NULL pointer/],
['ptr-print', M(R`int x=1; int *p=&x; printf("%p %d\n",p,p==&x); char *s="abc"; printf("%s %c %c\n",s,*(s+1),s[2]);`), '', /^0x[0-9a-f]+ 1\nabc b c\n$/],
['strings', M(R`char s[20]="hello"; char t[20]; strcpy(t,s); strcat(t," yo"); printf("%s %d %d %d\n",t,(int)strlen(t),strcmp("a","b")<0,strcmp("abc","abc")); printf("%c %d %d\n",toupper('a'),isdigit('5')!=0,isalpha('1')!=0); for(int i=0;s[i]!='\0';i++) s[i]=toupper(s[i]); printf("%s %d %c\n",s,'A','A'+2); char w[]="abc"; printf("%d %d\n",(int)sizeof(w),(int)strlen(w)); int d='7'-'0'; printf("%d\n",d);`), '', 'hello yo 8 1 0\nA 1 0\nHELLO 65 C\n4 3\n7\n'],
['fgets', M(R`char s[50]; fgets(s,50,stdin); printf("[%s]",s); s[strcspn(s,"\n")]='\0'; printf("[%s] %d\n",s,(int)strlen(s)); char t[50]; gets(t); printf("<%s>\n",t); int c=getchar(); putchar(c); putchar('\n');`), 'hello world\nsecond line\nZ', '[hello world\n][hello world] 11\n<second line>\nZ\n'],
['str-overflow', M(R`char s[4]; strcpy(s,"toolong");`), '', /buffer too small|out of range/],
['str-rev', M(R`char s[]="hi there"; int n=strlen(s); for(int i=n-1;i>=0;i--) putchar(s[i]); puts(""); puts("x");`), '', 'ereht ih\nx\n'],
['math', M(R`printf("%.2f %.0f %d %.1f %.1f\n",sqrt(2.0),pow(2,10),abs(-3),floor(2.7),ceil(2.1)); float f=3.14f; double d=1.0/3; printf("%f %.3f\n",f,d); printf("%.1f %.2f %.0f %.0f\n",0.25,2.675,0.5,1.5);`), '', '1.41 1024 3 2.0 3.0\n3.140000 0.333\n0.2 2.67 0 2\n'],
['char-loop', M(R`for(char c='a';c<='e';c++) printf("%c",c); printf("\n"); char ch='A'; ch=ch+1; printf("%c %d\n",ch,ch); int cnt=0; char t[]="a1b22c"; for(int i=0;t[i];i++) if(isdigit(t[i])) cnt++; printf("%d\n",cnt);`), '', 'abcde\nB 66\n3\n'],
['struct', H + R`struct Student { int id; char name[20]; float gpa; };
typedef struct { int x, y; } Point;
void show(struct Student s){ printf("%d %s %.1f\n",s.id,s.name,s.gpa); }
void bump(struct Student *s){ s->gpa += 0.5; }
int main(){ struct Student a={1,"Ada",3.5}; struct Student b; b=a; b.id=2; strcpy(b.name,"Bo"); bump(&b); show(a); show(b);
struct Student cls[2]={{10,"X",1.0},{11,"Y",2.0}}; printf("%s %d\n",cls[1].name,cls[0].id); Point p={3,4}; Point *pp=&p; printf("%d %d\n",p.x+pp->y,(int)sizeof(Point)); return 0; }`, '', '1 Ada 3.5\n2 Bo 4.0\nY 10\n7 8\n'],
['files', M(R`FILE *f=fopen("data.txt","w"); if(f==NULL){ printf("fail\n"); return 1; } fprintf(f,"%d %s\n",1,"Ada"); fprintf(f,"%d %s\n",2,"Bo"); fclose(f); f=fopen("data.txt","r"); int id; char nm[20]; while(fscanf(f,"%d %s",&id,nm)==2) printf("%d:%s\n",id,nm); fclose(f); FILE *g=fopen("nope.txt","r"); if(g==NULL) printf("no file\n"); f=fopen("data.txt","a"); fputs("3 Cy\n",f); fclose(f); f=fopen("data.txt","r"); char line[40]; int n=0; while(fgets(line,40,f)!=NULL) n++; fclose(f); printf("%d\n",n);`), '', '1:Ada\n2:Bo\nno file\n3\n'],
['errors-semi', M(R`int x=5
printf("%d",x);`), '', /missing ';'/],
['errors-undeclared', M(R`x=5;`), '', /not declared/],
['errors-nofunc', M(R`foo(3);`), '', /not defined/],
['errors-div0', M(R`int a=5,b=0; printf("%d",a/b);`), '', /division by zero/],
['errors-brace', H + 'int main(){ if(1){ printf("a"); return 0; }', '', /missing '}'|never closed/],
['overflow', M(R`int x=2147483647; x=x+1; printf("%d\n",x); unsigned int u=0; u=u-1; printf("%u\n",u); char c=127; c++; printf("%d\n",c); int big=100000*100000; printf("%d\n",big);`), '', '-2147483648\n4294967295\n-128\n1410065408\n'],
['ternary-comma', M(R`int a=3,b=8; int mx=a>b?a:b; printf("%d\n",mx); int i,j; for(i=0,j=5;i<j;i++,j--); printf("%d %d\n",i,j);`), '', '8\n3 2\n'],
['bitwise', M(R`printf("%d %d %d %d %d %d\n",5&3,5|3,5^3,~5,1<<4,32>>2);`), '', '1 7 6 -6 16 8\n'],
['scope', H + R`int x=1;
int main(){ int x=2; { int x=3; printf("%d ",x); } printf("%d\n",x); for(int i=0;i<2;i++){ int t=i*10; printf("%d ",t);} printf("\n"); return 0; }`, '', '3 2\n0 10 \n'],
['utf8', M(R`printf("Merhaba dünya ş\n"); char s[40]="İyi"; printf("%s %d\n",s,(int)strlen(s));`), '', 'Merhaba dünya ş\nİyi 4\n'],
['menu', M(R`int ch; do{ scanf("%d",&ch); switch(ch){ case 1: printf("add\n"); break; case 2: printf("list\n"); break; case 0: printf("bye\n"); break; default: printf("bad\n"); } }while(ch!=0);`), '1 2 9 0', 'add\nlist\nbad\nbye\n'],
['void-main-exit', H + R`void main(){ printf("a\n"); exit(0); printf("b\n"); }`, '', 'a\n'],
['missing-return', H + R`int f(int x){ if(x>0) return 1; }
int main(){ printf("%d\n",f(-1)); return 0; }`, '', /without a return/],
['const-long', M(R`const int K=3; long l=5; unsigned int u=3; short s=1; float f=1.5f; double d=2.5; char c='x'; printf("%d %ld %u %d %.1f %.1f %c\n",K,l,u,s,f,d,c); long long big=1; for(int i=1;i<=15;i++) big*=i; printf("%lld\n",big);`), '', '3 5 3 1 1.5 2.5 x\n1307674368000\n'],
['strfuncs', M(R`char a[20]="abc"; char b[20]; strncpy(b,a,2); b[2]='\0'; printf("%s %d\n",b,strcmp("b","a")>0); char *p=strchr(a,'b'); printf("%s %d\n",p,(int)(p-a)); printf("%d %.1f\n",atoi("42")+1,atof("2.5")); char buf[30]; sprintf(buf,"%d-%s",7,"x"); puts(buf);`), '', 'ab 1\nbc 1\n43 2.5\n7-x\n'],
];
(function () {
  const out = []; let pass = 0;
  for (const [name, code, stdin, exp] of CASES) {
    const r = MiniC.run(code, { stdin });
    const got = r.ok ? r.output : 'ERROR(line ' + r.error.line + '): ' + r.error.message + ' | out=' + r.output;
    const ok = exp instanceof RegExp ? exp.test(got) : (r.ok && got === exp);
    if (ok) pass++; else out.push('FAIL ' + name + '\n  expected: ' + JSON.stringify(String(exp)) + '\n  got:      ' + JSON.stringify(got));
  }
  // tracing
  const tr = MiniC.run(H + 'int main(){\nint x=3;\nint *p=&x;\n*p=9;\nint a[3]={1,2,3};\nreturn 0;}', { trace: true });
  const last = tr.steps[tr.steps.length - 2];
  const vx = last && last.frames[last.frames.length - 1].vars;
  if (!(tr.ok && vx && vx.length === 3 && vx[0].s === '9' && vx[1].p === vx[0].addr && vx[2].el.length === 3)) out.push('FAIL trace ' + JSON.stringify(last)); else pass++;
  window.MINIC_RESULT = pass + '/' + (CASES.length + 1) + ' passed\n' + out.join('\n');
  document.getElementById('o').textContent = window.MINIC_RESULT;
})();
