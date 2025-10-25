export const KeyPrinciplesSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      <span aria-label="Bar chart" role="img">
        📊
      </span>{" "}
      Grunnprinsipper for personvernbehandling
    </h2>
    <div className="space-y-4">
      <p>GDPR bygger på syv grunnprinsipper som alltid må følges:</p>

      <div className="grid gap-3">
        {[
          "Lovlighet, rettferdighet og gjennomsiktig",
          "Formålsbegrensning",
          "Dataminimering",
          "Riktighet",
          "Lagringsbegrensning",
          "Integritet og konfidensialitet",
          "Ansvarlighet",
        ].map((title, index) => (
          <div
            key={title}
            className="flex items-start gap-3 p-3 bg-muted/50 rounded-lg"
          >
            <span
              aria-label={`Principle ${index + 1}`}
              className="text-lg"
              role="img"
            >
              {`${index + 1}️⃣`}
            </span>
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-muted-foreground">
                {/* Add real descriptions if needed here */}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  </section>
);
