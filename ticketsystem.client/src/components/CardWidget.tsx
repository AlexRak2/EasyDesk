
const CardWidget = (props: { message: string, value: number }) => {

  return (
    <div className="w-[250px] h-[125px] bg-gray-300 shadow rounded-lg p-3 border border-gray-400">
        <h1 className="text-gray-700 font-bold">{props.message}</h1> 
        <p className="text-brand-400 text-5xl font-bold">{props.value}</p>
    </div>
  );
};

export default CardWidget;
