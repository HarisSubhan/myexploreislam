import{k as N,r as d,j as e,a2 as k,F as i,D as y,E as f,aa as h,Q as P,ab as r,a4 as E,ac as S,ad as D,ae as A}from"./index-DpRLOV1C.js";const T=()=>{const n=[{name:"Sunshine",value:"#FFD166",textColor:"#000000"},{name:"Raspberry",value:"#F10666",textColor:"#FFFFFF"},{name:"Mint",value:"#06D6A0",textColor:"#000000"},{name:"Azure",value:"#3A86FF",textColor:"#FFFFFF"},{name:"Pumpkin",value:"#FB5607",textColor:"#FFFFFF"}],{themeColor:o,themeName:m,updateTheme:x}=N(),l=(a,s,c)=>{x(a,s,c),document.documentElement.style.setProperty("--primary-color",a),document.documentElement.style.setProperty("--text-on-primary",c)};return d.useEffect(()=>{document.title=`${m} Theme - Child Portal`;const a=n.find(s=>s.value===o)||n[0];l(a.value,a.name,a.textColor)},[]),e.jsx(k,{className:"my-5",children:e.jsxs(i,{className:"shadow-lg rounded-4 border-0",children:[e.jsxs(i.Header,{className:"text-center py-4 bg-light border-bottom",children:[e.jsx("h4",{className:"mb-0",children:"🎨 Customize Your Portal Theme"}),e.jsx("p",{className:"text-muted mb-0 mt-2",children:"Pick a theme to personalize your portal experience"})]}),e.jsxs(i.Body,{children:[e.jsx(y,{className:"g-4 justify-content-center",children:n.map(a=>e.jsxs(f,{xs:6,sm:4,md:3,lg:2,className:"d-flex flex-column align-items-center",children:[e.jsx("div",{role:"button",tabIndex:0,"aria-label":`Select ${a.name} theme`,onClick:()=>l(a.value,a.name,a.textColor),onKeyDown:s=>s.key==="Enter"&&l(a.value,a.name,a.textColor),style:{width:"70px",height:"70px",borderRadius:"50%",backgroundColor:a.value,color:a.textColor,display:"flex",justifyContent:"center",alignItems:"center",fontWeight:"bold",cursor:"pointer",border:o===a.value?"4px solid var(--text-on-primary)":"2px solid #ddd",boxShadow:o===a.value?"0 0 10px rgba(0,0,0,0.2)":"0 2px 6px rgba(0,0,0,0.1)",transition:"all 0.3s ease"},children:a.name[0]}),e.jsx("span",{className:"mt-2 text-center small",children:a.name})]},a.value))}),e.jsx("div",{className:"text-center mt-5",children:e.jsx(h,{variant:"outline-primary",size:"lg",className:"rounded-pill px-4",onClick:()=>{const a=n[0];l(a.value,a.name,a.textColor)},children:"Reset to Default"})})]}),e.jsx(i.Footer,{className:"text-muted text-center py-3",children:"Your selected theme applies across the entire portal."})]})})},L=()=>{const[n,o]=d.useState(null),[m,x]=d.useState(!1),[l,a]=d.useState({type:"",text:""}),[s,c]=d.useState({password:""}),{user:p}=P(),b=(p==null?void 0:p.email)||"",v=t=>{const{name:g,value:w}=t.target;c(F=>({...F,[g]:w}))},C=async t=>{if(t.preventDefault(),s.password.length<6){a({type:"danger",text:"Password must be at least 6 characters long"});return}x(!0),a({type:"",text:""});try{await A(b,s.password),a({type:"success",text:"Password updated successfully!"}),c({password:""})}catch(g){a({type:"danger",text:g.message})}finally{x(!1)}},j=[{key:"profile",title:"Profile",icon:e.jsx(S,{size:28}),desc:"Manage your personal details",form:e.jsxs(r,{onSubmit:C,children:[l.text&&e.jsx(E,{variant:l.type,className:"mb-3",children:l.text}),e.jsxs(r.Group,{className:"mb-3",children:[e.jsx(r.Label,{children:"Email"}),e.jsx(r.Control,{type:"email",value:b,readOnly:!0,disabled:!0,className:"bg-light"}),e.jsx(r.Text,{className:"text-muted",children:"Your registered email address"})]}),e.jsxs(r.Group,{className:"mb-3",children:[e.jsx(r.Label,{children:"New Password"}),e.jsx(r.Control,{type:"password",name:"password",placeholder:"Enter new password",value:s.password,onChange:v,required:!0,minLength:6}),e.jsx(r.Text,{className:"text-muted",children:"Password must be at least 6 characters long"})]}),e.jsx(h,{variant:"success",type:"submit",disabled:m||!s.password,children:m?"Updating...":"Save Changes"})]})}],u=j.find(t=>t.key===n);return e.jsxs(e.Fragment,{children:[e.jsx("style",{children:`
        .account-container { min-height: 10vh; }
        .account-card {
          border: none;
          border-radius: 18px;
          padding: 30px 20px;
          background: var(--bs-light);
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .account-card:hover {
          transform: translateY(-6px);
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.12);
        }
        .icon-circle {
          width: 60px;
          height: 60px;
          background: linear-gradient(135deg, #0d6efd, #20c997);
          color: white;
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          margin: auto;
        }
        .back-btn {
          font-weight: 500;
          text-decoration: none !important;
          color: var(--bs-primary);
          transition: all 0.2s ease;
        }
        .back-btn:hover {
          color: #0a58ca;
          transform: translateX(-4px);
        }
        .account-form {
          border-radius: 18px;
        }
      `}),e.jsxs("div",{className:"p-4 account-container",children:[e.jsx("h3",{className:"fw-bold mb-4",children:"⚙️ Account Settings"}),n&&e.jsxs(h,{variant:"link",className:"mb-3 back-btn d-flex align-items-center gap-2",onClick:()=>{o(null),a({type:"",text:""}),c({password:""})},children:[e.jsx(D,{})," Back"]}),!n&&e.jsx(y,{className:"g-4",children:j.map(t=>e.jsx(f,{md:6,lg:4,children:e.jsxs(i,{className:"account-card text-center h-100",onClick:()=>o(t.key),children:[e.jsx("div",{className:"icon-circle",children:t.icon}),e.jsx("h5",{className:"fw-semibold mt-2",children:t.title}),e.jsx("p",{className:"text-muted small",children:t.desc}),e.jsx(h,{variant:"outline-primary",size:"sm",children:"Manage"})]})},t.key))}),u&&e.jsxs(i,{className:"p-4 shadow-sm border-0 rounded-4 account-form animate__animated animate__fadeIn",children:[e.jsxs("h4",{className:"fw-bold mb-4",children:[u.icon," ",u.title]}),u.form]})]}),e.jsx(T,{})]})};export{L as default};
