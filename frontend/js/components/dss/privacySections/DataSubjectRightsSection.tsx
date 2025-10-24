export const DataSubjectRightsSection = () => (
  <section className="bg-card border border-border rounded-lg p-6">
    <h2 className="text-xl font-medium mb-4 flex items-center gap-2">
      <span aria-label="Shield" role="img">
        🛡️
      </span>{" "}
      De registrertes rettigheter
    </h2>
    <div className="space-y-4">
      <p>
        Personer har flere rettigheter når deres personopplysninger behandles:
      </p>

      <div className="grid md:grid-cols-2 gap-4">
        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span aria-label="Clipboard" className="text-primary" role="img">
              📋
            </span>
            <div>
              <h3 className="font-medium">Rett til informasjon</h3>
              <p className="text-sm text-muted-foreground">
                Å få vite hvordan personopplysningene behandles
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span aria-label="Eye" className="text-primary" role="img">
              👁️
            </span>
            <div>
              <h3 className="font-medium">Rett til innsyn</h3>
              <p className="text-sm text-muted-foreground">
                Å få kopi av egne personopplysninger
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span aria-label="Pencil" className="text-primary" role="img">
              ✏️
            </span>
            <div>
              <h3 className="font-medium">Rett til retting</h3>
              <p className="text-sm text-muted-foreground">
                Å få rettet feil i personopplysningene
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span aria-label="Trash bin" className="text-primary" role="img">
              🗑️
            </span>
            <div>
              <h3 className="font-medium">Rett til sletting</h3>
              <p className="text-sm text-muted-foreground">
                Å få slettet personopplysninger under visse vilkår
              </p>
            </div>
          </div>
        </div>

        <div className="space-y-3">
          <div className="flex items-start gap-3">
            <span aria-label="Pause symbol" className="text-primary" role="img">
              ⏸️
            </span>
            <div>
              <h3 className="font-medium">Rett til begrensning</h3>
              <p className="text-sm text-muted-foreground">
                Å begrense behandlingen i visse situasjoner
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span
              aria-label="Upload symbol"
              className="text-primary"
              role="img"
            >
              📤
            </span>
            <div>
              <h3 className="font-medium">Rett til dataportabilitet</h3>
              <p className="text-sm text-muted-foreground">
                Å få utlevert data i strukturert format
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span
              aria-label="Prohibited symbol"
              className="text-primary"
              role="img"
            >
              🚫
            </span>
            <div>
              <h3 className="font-medium">Rett til motsette seg</h3>
              <p className="text-sm text-muted-foreground">
                Å motsette seg behandling basert på berettiget interesse
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <span aria-label="Robot" className="text-primary" role="img">
              🤖
            </span>
            <div>
              <h3 className="font-medium">
                Rettigheter ved automatiserte avgjørelser
              </h3>
              <p className="text-sm text-muted-foreground">
                Beskyttelse mot automatiske beslutninger
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);
