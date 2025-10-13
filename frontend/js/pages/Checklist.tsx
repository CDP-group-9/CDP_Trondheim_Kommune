import {
  Context,
  Data,
  Legal,
  // ProgressBar,
  ReceiveOrShareData,
} from "js/components/ui/checklist-sections";

const Checklist = () => {
  return (
    <div>
      <div className="flex justify-start mb-4 border-b border-black shadow">
        <div className="flex-1 space-y-6 max-w-4xl px-6 py-4">
          <div className="text-left space-y-4">
            <h1 className="text-3xl font-medium mb-1">Personvernsjekkliste</h1>
            <p className="text-muted-foreground text-left max-w-2xl">
              Systematisk gjennomgang av alle personvernkrav for ditt prosjekt
            </p>
          </div>
        </div>
      </div>
      <div className="space-y-6 p-4">
        <ReceiveOrShareData />
        {/* <ProgressBar /> */}
        <div className="flex justify-center">
          <p className="text-center text-muted-foreground max-w-2xl">
            Fyll ut informasjonen nedenfor for å gi AI-assistenten best mulig
            grunnlag for å hjelpe deg med personvernvurdering, DPIA og juridisk
            veiledning.
          </p>
        </div>
        <Context />
        <Data />
        <Legal />
      </div>
    </div>
  );
};

export default Checklist;
