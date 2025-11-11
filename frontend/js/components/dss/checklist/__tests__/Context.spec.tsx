import { render, screen, fireEvent } from "@testing-library/react";
import type {
  Dispatch,
  SetStateAction,
  InputHTMLAttributes,
  TextareaHTMLAttributes,
} from "react";
import { useState } from "react";

import type { ContextData } from "js/hooks/useChecklist";

import { Context } from "..";

jest.mock("js/components/ui/select", () => ({
  Select: ({
    children,
    value,
    onValueChange,
  }: {
    children: React.ReactNode;
    value?: string;
    onValueChange?: (value: string) => void;
  }) => (
    <select
      data-testid="select"
      value={value}
      onChange={(event) => onValueChange?.(event.target.value)}
    >
      {children}
    </select>
  ),
  SelectTrigger: ({ children }: { children: React.ReactNode }) => children,
  SelectValue: ({ placeholder }: { placeholder?: string }) => placeholder,
  SelectContent: ({ children }: { children: React.ReactNode }) => children,
  SelectItem: ({
    children,
    value,
  }: {
    children: React.ReactNode;
    value: string;
  }) => <option value={value}>{children}</option>,
}));

jest.mock("js/components/ui/input", () => ({
  Input: ({
    placeholder,
    ...props
  }: {
    placeholder?: string;
  } & InputHTMLAttributes<HTMLInputElement>) => (
    <input placeholder={placeholder} {...props} />
  ),
}));

jest.mock("js/components/ui/textarea", () => ({
  Textarea: ({
    placeholder,
    ...props
  }: {
    placeholder?: string;
  } & TextareaHTMLAttributes<HTMLTextAreaElement>) => (
    <textarea placeholder={placeholder} {...props} />
  ),
}));

describe("Context", () => {
  const baseContextData: ContextData = {
    projectSummary: "",
    department: "",
    status: "",
    purpose: "",
  };

  const renderContext = (override?: Partial<Parameters<typeof Context>[0]>) => {
    const {
      contextData: overrideContextData,
      onChange: overrideOnChange,
      ...restProps
    } = override ?? {};

    const Wrapper = () => {
      const [contextData, setContextData] = useState<ContextData>({
        ...baseContextData,
        ...overrideContextData,
      });

      const handleChange =
        overrideOnChange ??
        (setContextData as Dispatch<SetStateAction<ContextData>>);

      return (
        <Context
          contextData={contextData}
          onChange={handleChange}
          {...restProps}
        />
      );
    };

    return render(<Wrapper />);
  };

  test("renders all form elements", () => {
    renderContext();

    expect(screen.getByText("Prosjekt/Initiativ Kontekst")).toBeInTheDocument();
    expect(
      screen.getByPlaceholderText(
        "F.eks. 'Digital Skoleportal - ny løsning for elevdata'",
      ),
    ).toBeInTheDocument();
    expect(screen.getByText("Ansvarlig avdeling/enhet:")).toBeInTheDocument();
    expect(screen.getByText("Velg et alternativ...")).toBeInTheDocument();
  });

  test("renders all project status radio buttons", () => {
    renderContext();

    const statuses = [
      "Planlegging",
      "Utvikling",
      "Testing",
      "Implementering",
      "Produksjon",
    ];

    statuses.forEach((status) => {
      expect(screen.getByText(status)).toBeInTheDocument();
    });
  });

  test("allows selecting a project status", () => {
    renderContext();

    const statuses = [
      "Planlegging",
      "Utvikling",
      "Testing",
      "Implementering",
      "Produksjon",
    ];

    statuses.forEach((status) => {
      const radio = screen
        .getByText(status)
        .closest("label")
        ?.querySelector('input[type="radio"]') as HTMLInputElement;
      fireEvent.click(radio);
      expect(radio.checked).toBe(true);
    });
  });

  test("only allows one status to be selected at a time", () => {
    renderContext();

    const planningRadio = screen
      .getByText("Planlegging")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;
    const testingRadio = screen
      .getByText("Testing")
      .closest("label")
      ?.querySelector('input[type="radio"]') as HTMLInputElement;

    fireEvent.click(planningRadio);
    expect(planningRadio.checked).toBe(true);

    fireEvent.click(testingRadio);
    expect(testingRadio.checked).toBe(true);
    expect(planningRadio.checked).toBe(false);
  });
});
