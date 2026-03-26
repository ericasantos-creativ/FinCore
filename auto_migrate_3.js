const fs = require('fs');
const jsdom = require('jsdom');
const { JSDOM } = jsdom;

const originalHtml = fs.readFileSync('index.html', 'utf8');
const loginHtml = fs.readFileSync('stitch_screens/FinCore_Premium_Login.html', 'utf8');

const docOrg = new JSDOM(originalHtml).window.document;
const docLogin = new JSDOM(loginHtml).window.document;

// 1. Merge Styles
const loginStyles = docLogin.querySelectorAll('style');
loginStyles.forEach(style => {
    // avoid duplicates if possible, just append
    docOrg.head.appendChild(style.cloneNode(true));
});

// Since the login uses specific tailwind config colors, we ideally should merge them string-wise or let it fall back.
// For now, we will add the custom colors via a small inline style so we don't need to parse the JSON inside <script>
const customColors = `
<style>
  .bg-background { background-color: #10131a; }
  .bg-surface-container-lowest { background-color: #0b0e14; }
  .bg-surface-dim { background-color: #10131a; }
  .text-on-background { color: #e1e2eb; }
  .text-primary-container { color: #2792ff; }
  .bg-primary-container { background-color: #2792ff; }
  .text-primary { color: #a5c8ff; }
  .bg-surface-container { background-color: #1d2026; }
  .text-on-surface { color: #e1e2eb; }
  .text-on-surface-variant { color: #c0c7d6; }
  .text-on-primary-fixed { color: #001c3a; }
</style>
`;
docOrg.head.insertAdjacentHTML('beforeend', customColors);


// 2. Locate the Login Section
const loginSection = docOrg.querySelector('#loginScreen');
const loginMain = docLogin.querySelector('main');

if (loginSection && loginMain) {
   // Copy the stitch structure
   loginSection.innerHTML = '';
   loginSection.className = 'login-screen active w-full min-h-screen z-50 absolute top-0 left-0 bg-[#10131a]';
   
   // Bring over the two sections inside main
   const stitchSections = loginMain.querySelectorAll('section');
   
   const wrapper = docOrg.createElement('div');
   wrapper.className = 'flex min-h-screen w-full';
   
   stitchSections.forEach(sec => wrapper.appendChild(sec.cloneNode(true)));
   loginSection.appendChild(wrapper);
   
   // 3. Hook up IDs and events
   const form = loginSection.querySelector('form');
   form.id = 'loginForm';
   
   const inputs = form.querySelectorAll('input');
   if(inputs.length >= 2) {
       inputs[0].id = 'loginEmail';
       inputs[0].type = 'email';
       
       inputs[1].id = 'loginPassword';
       inputs[1].type = 'password';
   }
   
   const buttons = form.querySelectorAll('button');
   if(buttons.length >= 2) {
       buttons[0].id = 'loginBtn';
       buttons[0].type = 'button'; // changed from submit to button for SPA
       buttons[0].innerHTML = 'ENTRAR <span class="material-symbols-outlined text-lg">login</span>';
       
       buttons[1].id = 'toggleToRegister';
       buttons[1].type = 'button';
       buttons[1].innerText = 'Criar Conta';
       buttons[1].setAttribute('onclick', 'toggleLoginRegister(event)');
   }
   
   // 4. Create the Register Form (cloned from login form, but modified)
   const registerForm = form.cloneNode(true);
   registerForm.id = 'registerForm';
   registerForm.className = 'space-y-6';
   registerForm.style.display = 'none';
   
   // Keep the first two inputs for Name and Email, add 2 more for passwords
   const regInputsContainer = registerForm.querySelectorAll('.space-y-2');
   // Let's duplicate the first constraint to make 4 inputs total: Name, Email, Password, Password2
   if(regInputsContainer.length >= 2) {
       const wrapperName = regInputsContainer[0].cloneNode(true);
       wrapperName.querySelector('label').innerText = 'Nome Completo';
       const inputName = wrapperName.querySelector('input');
       inputName.id = 'registerName';
       inputName.type = 'text';
       inputName.placeholder = 'Seu nome';
       registerForm.insertBefore(wrapperName, regInputsContainer[0]);
       
       const inputEmail = regInputsContainer[0].querySelector('input');
       inputEmail.id = 'registerEmail';
       
       const inputPass = regInputsContainer[1].querySelector('input');
       inputPass.id = 'registerPassword';
       
       const wrapperPass2 = regInputsContainer[1].cloneNode(true);
       wrapperPass2.querySelector('label').innerText = 'Confirmar Senha';
       const inputPass2 = wrapperPass2.querySelector('input');
       inputPass2.id = 'registerPassword2';
       registerForm.insertBefore(wrapperPass2, registerForm.querySelector('.flex.items-center')); // insert before options
   }
   
   const regButtons = registerForm.querySelectorAll('button');
   if(regButtons.length >= 2) {
       regButtons[0].id = 'registerBtn';
       regButtons[0].type = 'button';
       regButtons[0].innerHTML = 'CADASTRAR <span class="material-symbols-outlined text-lg">person_add</span>';
       
       regButtons[1].id = 'toggleToLogin';
       regButtons[1].type = 'button';
       regButtons[1].innerText = 'Já tenho conta';
       regButtons[1].setAttribute('onclick', 'toggleLoginRegister(event)');
   }
   
   // Append the register form directly after the login form inside the right panel
   form.parentNode.appendChild(registerForm);

   const finalHtml = '<!DOCTYPE html>\n' + docOrg.documentElement.outerHTML;
   fs.writeFileSync('index.html', finalHtml, 'utf8');
   console.log('=> Tela de login migrada com sucesso!');
} else {
   console.log('Erro ao achar dominios do login');
}
