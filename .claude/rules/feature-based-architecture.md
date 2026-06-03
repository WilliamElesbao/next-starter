---
paths:
  - "src/features/**/*"
---

# Feature-Based Architecture

## Project Structure
<code tree>

### prisma
models and migrations must stay here
prisma.config.ts - configs do orm

### react-email
it is used to build email templates and it is import inside the action that use this template of email

### public
app assets must be here organized by feature folder like this
home/
    file-name.png
    ...
favicon must be in the public folder root
public/
    ...
    favicon.ico

### src/
- actions/ - acoes pelo lado do servidor, usam 'use server' e comunicam com servicos externos (e.g. stripe, resend)
- app/ - app router, importa as pages das features e exporta como default para o app router
- app/[locale] - todas rotas que passam por traducoes\i18n
- app/api - api da aplicacao (e.g. better auth)
- components/ - componentes construido a partir de outros componentes primitimos (e.g. dialogs, toast, dashboard)
    - ui/ componente primitivos (e.g. Button, Text, Avatar)
- constants/ - constantes que sao compartilhadas
- contexts/ - contextos globais (e.g. context api, analytics, feature flags)
- database/ - config de connection com o db
- features/ - features ficam aqui encapsulando toda regra de negocio, contexto da feature, componente, custom hooks, schema, pages
    - dashboard/
        - constants/ #constantes da feature
        - components/ # os componentes da feature devem seguir compound pattern
        - hooks/ # shared hooks da feature
        - context.tsx # contexto utilizado somente pela feature
        - page.tsx # page seguindo o compound pattern
    - auth/
        - components/ # componentes da feature devem seguir compound 
        - hooks/ shared hooks da feature
        - sign-in/ # modulo
            - hooks/ # hooks do modulo
            - sign-in-form.tsx # componente formulario seguindo o compound pattern
            - page.tsx # pagina que utiliza o formulario
        - sign-up/ # modulo
            - hooks/ # hooks do modulo
            - sign-up-form.tsx # componente formulario seguindo o compound pattern
            - page.tsx # pagina que utiliza o formulario
- hooks/ - shared hooks que podem ser usados em outras features (e.g email, locale, stripe)
    - email/ - sempre organizar o hook de acordo com sua funcionalidade
    - locale/
    - stripe/ 
- lib/ - configuracao de bibliotecas
    - better-auth/ - config do better-auth
    - dayjs/ - ...
    - i18n/ - ...
    - react-query/ -...
    - resend/ - ...
    - shadcn/ - ...
    - stripe/ - ...
- middleware/ - organiza em modulos/funcoes por responsabilidade, que sao usadas pelo proxy.ts
- providers/ - providers global (e.g NextThemesProvider, QueryClientProvider)
- scripts/ - scripts de manutencao, checkagem, axuliares, etc
- styles/ - estilos globais/theme usado no app
- utils/ - funcoes utilitarias, e.g format-price.ts, get-initials.ts
- proxy/ - protecao/gerenciamento de acesso as rotas
- env/ - valida as variaveis de ambiente obrigatorias
- dev/ - ferramentas que podem ser desenvolvida/usadas por devs para ajudar no desenvolvimento
- storage/ - global storage como state management (e.g. jotai, zustand)

## patterns
kebab-case (funcoes, componentes, hooks etc...)
never usar barrel files
sempre export function - componentes e pages
os demais export const - hooks, utils, etc...

## hooks
sempre devem retornar return { xxx }, nunca return xxx

## types vs interface
types devem ser usados onde uma deterimnada prop pode receber multiplos tipos
interface para objetos que possuem props e cada prop tem um type

## contexts example
encapsulam types, interface, context, provider, funcoes e constants do contexto e hook do contexto, tudo relacionado ao contexto fica encapsulado aqui
**Rule**: Always choose the smallest possible scope. Do not promote to global unless multiple features require it.

```
// dialog-context.tsx
"use client";

import {
  createContext,
  type FC,
  type ReactNode,
  useContext,
  useMemo,
  useState,
} from "react";

interface DialogContextType {
  dialogIsOpen: boolean;
  setDialogIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const DialogContext = createContext<DialogContextType | undefined>(undefined);

interface DialogProviderProps {
  children: ReactNode;
}

export const DialogProvider: FC<DialogProviderProps> = ({ children }) => {
  const [dialogIsOpen, setDialogIsOpen] = useState(false);

  const contextValue = useMemo(
    () => ({
      dialogIsOpen,
      setDialogIsOpen,
    }),
    [dialogIsOpen],
  );
  return (
    <DialogContext.Provider value={contextValue}>
      {children}
    </DialogContext.Provider>
  );
};

export const useDialog = (): DialogContextType => {
  const context = useContext(DialogContext);

  if (!context) {
    throw new Error("useDialog must be used within a DialogProvider");
  }
  return context;
};
```

## Scope Hierarchy

```
Global Scope
    ↓
Feature Scope
    ↓
Page Scope
    ↓
Component Scope
```

Provider scope:

```tsx
<Dashboard.Provider>
  <Dashboard>
    <Dashboard.Header/>
    <Dashboard.Cards/>
    <Dashboard.Table/>
  </Dashboard>
</Dashboard.Provider>
```

Only dashboard screens can access:

```tsx
const { incomes, expenses, investments } = useDashboardContext();
```

The Feed feature must NOT access Dashboard state.

## Isolation Rules

- ✅ Feature A can use global contexts (Auth, Theme)
- ✅ Feature A can use shared components (`src/components/`)
- ✅ Feature A can use shared hooks (`src/hooks/`)
- ❌ Feature A cannot access Feature B's context
- ❌ Feature A cannot import from Feature B's components
- ❌ Feature A cannot import from Feature B's hooks

If two features need to share logic, move it to `src/hooks/` or `src/utils/`.

## Test-Driven Development
sempre criar testes com as funcionalidade minimas e entao desenvolver a feature logo em seguida

## Dto's
nunca confiar no frontend, sempre criat DTO's e utilizar quando fazer comunicacao entre backend-frontend e vice-versa

## strong type safety
tipagem forte

## bad practices
forcar assertion 
nunca usar any
evitar aninhar funcoes com muitos niveis, prefira quebrar em funcoes menores para melhorar a legibilidade, responsabilidade unica é essencial

## optimistic
sempre adote uma abordagem otimista

## hooks
useActionState quando trabalhar com server actions para capturar loading state, erros
em src/hooks organize queries e mutations por feature
por exemplo
  hooks/
    events/
      events.queries.ts # todas queries relacionadas a eventos (react query(useQuery))
      events.mutations.ts # todas mutations relacionada a eventos (react query(useMutation))

## react query
prefira react query via custom hooks para trabalhar com client componentes para capturar loading state e errors

## loading
use skeletons para representar loading state, isso melhora o feedback visual do usuario

1. useActionStatePermite gerenciar estados com base no resultado de uma Action (função assíncrona ou formulário). Ele substitui e simplifica a combinação de useState e useReducer para lidar com submissões e respostas de API.Como funciona: Retorna o estado atual, a função para disparar a ação e o estado de carregamento pendente.2. useFormStatusEssencial para formulários modernos. Ele permite que componentes filhos de um <form> acessem os detalhes do status de submissão do formulário pai de forma muito mais simples.Como funciona: Retorna um objeto contendo a propriedade booleana pending, o data, method e a action.3. useOptimisticProjetado especificamente para criar interfaces otimistas (Optimistic UI). Ele permite que você exiba um estado temporário na tela enquanto a mutação ou requisição assíncrona está rodando em segundo plano.Como funciona: Retorna o valor atual e uma função para agendar a atualização otimista que será revertida automaticamente se a ação falhar.4. useUm novo hook revolucionário que permite ler o valor de recursos como Promises ou Contexts fora ou dentro de estruturas condicionais. Ao ler uma Promise com o use, ele suspende o componente automaticamente quando usado em conjunto com <Suspense>.

FeatureReact <Suspense>React <Activity>Primary PurposeHandles asynchronous operations and missing code.Controls component visibility while preserving state.Trigger MechanismActed upon when a child component throws a Promise.Toggled explicitly using a mode="visible | hidden" prop.UI PresentationSwaps children out for a fallback UI (like a loading skeleton).Visually hides the component without completely unmounting it.State PreservationDiscards local UI state if an outer boundary is re-triggered.Preserves checkboxes, input text, and scroll placements.Background PriorityPauses rendering until async tasks resolve.Keeps hidden UI "warm" and prefetches data at low priority.

<Suspense>

O objetivo do Suspense é lidar com operações assíncronas (carregamento de dados, code splitting com lazy(), Server Components, etc.). Quando algo “suspende” durante a renderização, o React mostra um fallback temporário.  
<Suspense fallback={<Spinner />}>
  <UserProfile />
</Suspense>
Enquanto UserProfile estiver carregando:
<Spinner />
é exibido.

Casos de uso

* React.lazy()
* Data fetching com Suspense
* Server Components
* Streaming SSR

<Activity>

O objetivo do Activity é esconder ou mostrar uma árvore de componentes sem perder seu estado. Ele foi introduzido no React 19.2.  
<Activity mode={isVisible ? "visible" : "hidden"}>
  <Chat />
</Activity>

Quando fica "hidden":

* o componente continua existindo;
* o estado (useState) é preservado;
* os efeitos (useEffect) são desmontados;
* atualizações são priorizadas em segundo plano;
* ao voltar para "visible", tudo é restaurado rapidamente.  

⸻

Comparação rápida
Característica

Suspense

Activity

Loading assíncrono

✅

❌

Fallback (Loading...)

✅

❌

Esconder UI

❌

✅

Preservar estado ao esconder

❌

✅

Pré-renderizar conteúdo oculto

Parcialmente

✅

Ideal para tabs/páginas ocultas

❌

✅

Exemplo prático: Tabs

Sem Activity
{activeTab === "profile" && <Profile />}
Quando troca de aba:

* Profile desmonta
* perde estado
* perde scroll
* perde inputs

⸻

Com Activity
<Activity
  mode={activeTab === "profile" ? "visible" : "hidden"}
>
  <Profile />
</Activity>

Quando troca de aba:

* Profile fica oculto
* estado continua preservado
* scroll continua preservado
* formulário continua preenchido

Isso é ótimo para:

* dashboards
* abas
* sidebars
* chats
* navegação entre páginas internas do app  

⸻

Usando os dois juntos

Eles são complementares:
<Activity mode={activeTab === "posts" ? "visible" : "hidden"}>
  <Suspense fallback={<Spinner />}>
    <Posts />
  </Suspense>
</Activity>

Nesse cenário:

1. Activity mantém a aba viva mesmo quando escondida.
2. Suspense mostra loading enquanto os dados carregam.
3. Quando o usuário volta para a aba, ela já pode estar pré-carregada e aparecer instantaneamente.  

Regra simples

* “Estou esperando algo carregar?” → use Suspense
* “Quero esconder algo sem perder o estado?” → use Activity
* “Quero os dois comportamentos?” → use Activity + Suspense juntos.

## TypeScript
Path alias: @/* → src/*.
No enums — use as const objects with ObjectValues<typeof X>.
No barrel files.
No return-type annotations on functions.
Avoid type assertions.
Use React 19's ref-as-prop. Don't use forwardRef (deprecated). Type as { ref?: Ref<T> }.
Components/hooks: PascalCase. Functions/vars: camelCase.
Handlers: handleX. Booleans: isX, hasX, canX.
Constants: UPPER_SNAKE_CASE for object constants, camelCase for primitives.

## Localization
Developers commit keys and values in English to both en.ts and ru.ts files. A professional translator handles the translation into Russian later — no AI-generated translations.
Keys mirror the English sentence in kebab-case, punctuation dropped, proper-noun casing preserved (e.g. enter-the-4-digit-code-to-continue). Rename a key when the English copy changes meaningfully.

## Commits
Conventional commits: feat(LKD-123): subject, fix: subject, chore: subject.
Header under 88 characters.

## LLM behavioral guidelines

Behavioral guidelines to reduce common LLM coding mistakes. Apply alongside the project-specific instructions above.

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them - don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it - don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

---

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

## i18n

qualquer novo componente que renderiza texto obrigatoriamente esse texto deve estar nos arquivos de traducoes, em src/lib/i18n/locales en.json e pt-BR
novas keys adicionados devem ser sempre primeiro definidas em en.json e depois em pt-BR.json

sempre rodar scripts para checar se existe alguma key nao utilizada