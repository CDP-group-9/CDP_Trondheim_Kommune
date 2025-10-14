import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@radix-ui/react-select";
import { useState } from "react";

import { Input } from "../input";
import { Textarea } from "../textarea";

export const Context = () => {
  const [status, setStatus] = useState("");

  return (
    <section className="bg-card border border-border rounded-lg p-6 max-w-4xl mx-auto">
      <h2 className="text-xl font-medium mb-1 flex items-center gap-2">
        <span aria-label="target icon" role="img">
          🎯
        </span>
        Prosjekt/Initiativ Kontekst
      </h2>

      <p className="text-sm text-muted-foreground mb-4">
        Grunnleggende informasjon om ditt prosjekt
      </p>

      <div className="space-y-6">
        <div>
          <label className="block text-sm font-medium mb-2">
            Prosjektnavn og kort beskrivelse:
          </label>
          <Input placeholder="F.eks. 'Digital Skoleportal - ny løsning for elevdata'" />
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Ansvarlig avdeling/enhet:
          </label>
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Velg et alternativ..." />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="tk">Trondheim Kommune</SelectItem>
              <SelectItem value="ntnuidi">NTNU IDI</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div>
          <label className="block text-sm font-medium mb-2">
            Prosjektstatus:
          </label>
          <div className="space-y-2">
            <label className="flex items-center gap-2">
              <input
                checked={status === "planning"}
                name="status"
                type="radio"
                value="planning"
                onChange={(e) => setStatus(e.target.value)}
              />
              Planlegging
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={status === "development"}
                name="status"
                type="radio"
                value="development"
                onChange={(e) => setStatus(e.target.value)}
              />
              Utvikling
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={status === "testing"}
                name="status"
                type="radio"
                value="testing"
                onChange={(e) => setStatus(e.target.value)}
              />
              Testing
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={status === "implementation"}
                name="status"
                type="radio"
                value="implementation"
                onChange={(e) => setStatus(e.target.value)}
              />
              Implementering
            </label>
            <label className="flex items-center gap-2">
              <input
                checked={status === "production"}
                name="status"
                type="radio"
                value="production"
                onChange={(e) => setStatus(e.target.value)}
              />
              Produksjon
            </label>
          </div>
        </div>
        <div>
          <label className="block text-sm font-medium mb-2">
            Formål og mål med prosjektet:
          </label>
          <Textarea placeholder="Beskriv hva dere ønsker å oppnå og hvorfor..." />
        </div>
      </div>
    </section>
  );
};
