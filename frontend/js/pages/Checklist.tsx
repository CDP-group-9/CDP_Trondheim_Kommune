const Checklist = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Sjekkliste</h1>
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input type="checkbox" className="w-4 h-4" />
          <label>Fullført oppgave 1</label>
        </div>
        <div className="flex items-center space-x-3">
          <input type="checkbox" className="w-4 h-4" />
          <label>Fullført oppgave 2</label>
        </div>
        <div className="flex items-center space-x-3">
          <input type="checkbox" className="w-4 h-4" />
          <label>Fullført oppgave 3</label>
        </div>
      </div>
    </div>
  );
};

export default Checklist;
