# Naming conventions and folder structures

This document contains the rules we follow for naming conventions for React, Django + css. It also specifies how our folders are structured.

## General rule

For any file that is not generic, the origin (`trk` or `Dss`) should be prefixed.

- `trk` is for components or styles that stem from Trondheim Kommune
- `dss` _(Decision Support System)_ are non-generic files

## **1. React**

| Type                              | Convention                                | Example                               | Notes                                                                                                                |
| --------------------------------- | ----------------------------------------- | ------------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| **React components (custom)**     | **PascalCase**, prefixed with `Dss`       | `DssButton.tsx`, `DssModal.tsx`       | Custom components created by us use the `Dss` prefix to distinguish them from external UI components (e.g., shadcn). |
| **React components (external)**   | **PascalCase**                            | `Button.tsx`, `Card.tsx`              | Components from libraries like shadcn or other UI kits live in the `ui/` folder without the prefix.                  |
| **Hooks**                         | **camelCase** starting with `use`         | `useChatContext.ts`, `useAuth.ts`     | Never `.tsx` unless the hook actually returns JSX (rare).                                                            |
| **Context providers**             | **PascalCase**                            | `ChatContext.tsx`, `AuthProvider.tsx` | Treated like components.                                                                                             |
| **Utility / helper modules**      | **camelCase**                             | `formatDate.ts`, `fetchUser.ts`       | Non-component logic only.                                                                                            |
| **Type definitions / interfaces** | **kebab-case**              | `chat.types.ts`     |                                                                                    |
| **Tests**                         | Same as file + `.test.tsx` or `.spec.tsx` | `ChatPage.test.tsx`                   | Keep next to the component.                                                                                          |
| **Barrel files (re-exports)**     | Lowercase `index.ts`                      | `index.ts`                            | Used to re-export components or hooks in a folder.                                                                   |


---

## **2. Folder + Component Pairing Pattern**

A common convention is **one folder per logical component**:

```
src/
 └─ components/
     ├─ ChatPage/
     │   ├─ ChatPage.tsx
     │   ├─ ChatPage.test.tsx
     │   └─ index.ts # exports the functions
     └─ UserProfileCard/
         ├─ UserProfileCard.tsx
         └─ index.ts
```

This pattern keeps related files grouped and makes imports clean:

```tsx
import ChatPage from "@/components/ChatPage";
```

---

## **3. Why PascalCase for Components?**

Because React treats JSX tags as component names when they start with a capital letter:

```tsx
// this is good
function ChatPage() { ... }

// this is bad Bad
function chatPage() { ... } // would be treated as an HTML element
```

The file name should reflect the exported component name — 1:1 consistency helps navigation and tooling.

---

## **4. Practical Summary**

| Category            | Convention                              |
| ------------------- | --------------------------------------- |
| Component file      | `PascalCase.tsx`                        |
| Hook                | `useSomething.ts`                       |
| Context or Provider | `PascalCase.tsx`                        |
| Utility or service  | `camelCase.ts`                          |
| Types               | `PascalCase.ts` or `something.types.ts` |
| Barrel              | `index.ts`                              |
| Test                | `<SameName>.test.tsx`                   |


---

## Django
| Type                    | Convention                                              | Example                                         | Notes                                                                       |
| ----------------------- | ------------------------------------------------------- | ----------------------------------------------- | --------------------------------------------------------------------------- |
| **Apps**                | **snake_case**                                          | `chat_service`, `user_management`, `core_utils` | Each app is a self-contained module with its own models, views, and tests.  |
| **Models**              | **PascalCase**                                          | `UserProfile`, `ChatMessage`                    | Class names follow standard Python class conventions.                       |
| **Views**               | **snake_case.py** for files, **PascalCase** for classes | `views.py` / `ChatView`, `ChatListView`         | Use class-based views unless the logic is simple enough for function-based. |
| **Serializers**         | **snake_case.py** for files, **PascalCase** for classes | `serializers.py` / `UserSerializer`             | Place in the same app as the related model.                                 |
| **Forms**               | **snake_case.py** for files, **PascalCase** for classes | `forms.py` / `LoginForm`                        | Keep in app-level `forms.py`.                                               |
| **URLs**                | **snake_case.py**                                       | `urls.py`                                       | Each app defines its own `urlpatterns`, included in the main router.        |
| **Tests**               | **snake_case.py**, named after tested module            | `test_models.py`, `test_views.py`               | Organize tests by feature or layer.                                         |
| **Templates**           | **snake_case.html**                                     | `chat_list.html`, `user_detail.html`            | Match app and view naming for clarity.                                      |
| **Static files**        | **snake_case.css / .js / .png**                         | `chat_page.css`, `user_icon.png`                | Keep static assets inside each app’s `static/<app_name>/` directory.        |
| **Migrations**          | **auto-generated (snake_case)**                         | `0001_initial.py`                               | Handled automatically by Django.                                            |
| **Management commands** | **snake_case.py**                                       | `cleanup_old_messages.py`                       | Placed under `management/commands/`.                                        |

This structure ensures that each app is self-contained and independent—you can modify or add one without affecting others.

---

## Practical Summary


| Category         | Convention         | Example                     |
| ---------------- | ------------------ | --------------------------- |
| App name         | `snake_case`       | `chat_service`              |
| Model class      | `PascalCase`       | `ChatMessage`               |
| Serializer class | `PascalCase`       | `ChatMessageSerializer`     |
| View class       | `PascalCase`       | `ChatListView`              |
| URL file         | `urls.py`          | `apps/chat_service/urls.py` |
| Template file    | `snake_case.html`  | `chat_list.html`            |
| Test file        | `test_<module>.py` | `test_models.py`            |
| Static file      | `snake_case.css`   | `chat_page.css`             |

## Css / Tailwind

css files are written in `kebab-case`. Our css entry point is `trk-theme.css`. This should only contain Trondheim Kommunes styleguide. If any styling is needed that is not included in this css a new one should be created, i.e. `dss-style.css`.