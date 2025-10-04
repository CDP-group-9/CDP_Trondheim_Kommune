const Privacy = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Om personvern</h1>
      <div className="prose max-w-none">
        <p>
          Her finner du informasjon om hvordan vi behandler personopplysninger.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">Databehandling</h2>
        <p>
          Vi behandler personopplysninger i henhold til gjeldende
          personvernlovgivning.
        </p>
        <h2 className="text-xl font-semibold mt-6 mb-3">Dine rettigheter</h2>
        <p>
          Du har rett til å få innsyn i, rette, slette og begrense behandlingen
          av dine personopplysninger.
        </p>
      </div>
    </div>
  );
};

export default Privacy;
