const History = () => {
  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Tidligere samtaler</h1>
      <div className="space-y-3">
        <div className="border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <p className="font-medium">Samtale 1</p>
          <p className="text-sm text-gray-600">I dag 14:30</p>
        </div>
        <div className="border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <p className="font-medium">Samtale 2</p>
          <p className="text-sm text-gray-600">I går 16:45</p>
        </div>
        <div className="border p-3 rounded-lg hover:bg-gray-50 cursor-pointer">
          <p className="font-medium">Samtale 3</p>
          <p className="text-sm text-gray-600">2 dager siden</p>
        </div>
      </div>
    </div>
  );
};

export default History;
